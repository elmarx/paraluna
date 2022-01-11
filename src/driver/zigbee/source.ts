import { MqttMessage } from "../mqtt/interface.message";
import { concat, from, Observable } from "rxjs";
import { distinct, filter, map, share, skip } from "rxjs/operators";
import {
  BridgeState,
  DeviceInformation,
  DeviceMessage,
  ZIGBEE2MQTT_BASE_TOPIC,
  ZigbeeMessage,
  ZigbeeSource,
  ZigbeeSubscription,
} from "./interface";
import { buildParser } from "./source.parse";
import { Logger } from "winston";
import { JsonRecord } from "fp-ts/Json";
import { MqttDriver } from "../mqtt";

/**
 * reuse the mqtt source. parse mqtt messages and revive zigbee2mqtt's 'last_seen' date
 */
export function zigbeeSource(_logger: Logger, mqtt: MqttDriver): ZigbeeSource {
  return {
    subscribe(
      subscription: ZigbeeSubscription[] | ZigbeeSubscription,
    ): Observable<ZigbeeMessage> {
      const a = Array.isArray(subscription) ? subscription : [subscription];
      const parser = buildParser(a);
      const topics = [...parser.keys()].map(
        (t) => ZIGBEE2MQTT_BASE_TOPIC + "/" + t,
      );

      const subscriptionGrant$ = from(mqtt.subscribe(topics)).pipe(skip(1));
      const message$: Observable<ZigbeeMessage> = mqtt.source.messages$.pipe(
        filter((m) => parser.has(m.topic)),
        map((m) => parser.get(m.topic)!(m.value)),
      );

      return concat(subscriptionGrant$, message$) as Observable<ZigbeeMessage>;
    },

    device<T>(friendlyName: string): Observable<T> {
      return mqtt.source
        .topic(ZIGBEE2MQTT_BASE_TOPIC + "/" + friendlyName)
        .pipe(
          map<MqttMessage, T>(
            (v): T =>
              JSON.parse(v.value.toString(), (k, v) =>
                k === "last_seen" ? new Date(v) : v,
              ) as any,
          ),
          share(),
        );
    },

    deviceMessage(friendlyName: string): Observable<DeviceMessage> {
      return this.device<JsonRecord>(friendlyName).pipe(
        map<JsonRecord, DeviceMessage>((m) => ({
          type: "device",
          friendlyName,
          state: m,
        })),
      );
    },

    state(): Observable<BridgeState> {
      return mqtt.source.topic(ZIGBEE2MQTT_BASE_TOPIC + "/bridge/state").pipe(
        map<MqttMessage, BridgeState>(({ value }) => value.toString() as any),
        share(),
      );
    },

    deviceInfos(): Observable<DeviceInformation[]> {
      return mqtt.source.topic(ZIGBEE2MQTT_BASE_TOPIC + "/bridge/devices").pipe(
        map<MqttMessage, DeviceInformation[]>(({ value }) =>
          JSON.parse(value.toString()),
        ),
        share(),
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
