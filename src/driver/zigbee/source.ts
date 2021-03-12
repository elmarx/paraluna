import { MqttMessage } from "../mqtt";
import { concat, from, fromEvent, Observable } from "rxjs";
import { distinct, filter, map, share, skip } from "rxjs/operators";
import { ZigbeeSource } from "./interface.source";
import {
  BridgeState,
  DeviceInformation,
  DeviceMessage,
  ZIGBEE2MQTT_BASE_TOPIC,
} from "./interface";
import { AsyncMqttClient } from "async-mqtt";
import {
  BridgeMessage,
  DevicesMessage,
  ZigbeeMessage,
} from "./interface.message";

function subscribeFn(
  client: AsyncMqttClient,
  message$: Observable<ZigbeeMessage>,
) {
  return <T, S extends ZigbeeMessage>(
    predicate: (m: ZigbeeMessage) => m is S,
    selector: (m: S) => T,
    topic: string,
  ) => {
    const subscriptionGrant$ = from(
      client.subscribe(ZIGBEE2MQTT_BASE_TOPIC + "/" + topic),
    );

    return concat(
      subscriptionGrant$.pipe(skip(1)),
      message$.pipe(
        filter<ZigbeeMessage, S>(predicate),
        map<S, T>(selector),
        share(),
      ),
    ) as Observable<T>;
  };
}

/**
 * reuse the mqtt source. parse mqtt messages and revive zigbee2mqtt's 'last_seen' date
 */
export function zigbeeSource(
  client: AsyncMqttClient,
  friendlyNames: Set<string>,
  attributes: Map<string, { friendlyName: string; attribute: string }>,
): ZigbeeSource {
  const rawMessage$ = fromEvent(
    client,
    "message",
    (topic: string, value: Buffer): MqttMessage => ({
      topic: topic.substring(ZIGBEE2MQTT_BASE_TOPIC.length + 1),
      value,
    }),
  );

  const message$ = rawMessage$.pipe(
    map<MqttMessage, ZigbeeMessage>(
      (v): ZigbeeMessage => {
        switch (v.topic) {
          case "bridge/state":
            return { type: "bridge", state: v.value.toString() as BridgeState };
          case "bridge/devices":
            return { type: "devices", value: JSON.parse(v.value.toString()) };
        }

        if (friendlyNames.has(v.topic)) {
          const state = JSON.parse(v.value.toString(), (k, v) =>
            k === "last_seen" ? new Date(v) : v,
          ) as any;

          return { type: "device", state, friendlyName: v.topic };
        }

        const a = attributes.get(v.topic);

        if (a) {
          return {
            type: "deviceAttribute",
            friendlyName: a.friendlyName,
            attribute: a.attribute,
            value: v.value.toString(),
          };
        }

        return { type: "unknown", value: v.value };
      },
    ),
    share(),
  );

  const subscribe = subscribeFn(client, message$);

  return {
    message$,

    device<T>(friendlyName: string): Observable<T> {
      friendlyNames.add(friendlyName);
      return subscribe(
        (m): m is DeviceMessage => m.type === "device",
        (m) => m.state as any,
        friendlyName,
      );
    },

    state(): Observable<BridgeState> {
      return subscribe(
        (m): m is BridgeMessage => m.type === "bridge",
        (m) => m.state,
        "bridge/state",
      );
    },

    deviceInfos(): Observable<DeviceInformation[]> {
      return subscribe(
        (m): m is DevicesMessage => m.type === "devices",
        (m) => m.value,
        "bridge/devices",
      );
    },

    deviceInfo(friendlyName: string): Observable<DeviceInformation | null> {
      return this.deviceInfos().pipe(
        map<DeviceInformation[], DeviceInformation | null>(
          (devices) =>
            devices.find((d) => d.friendly_name === friendlyName) || null,
        ),
        distinct(),
        share(),
      );
    },
  };
}
