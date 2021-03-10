import { MqttMessage, MqttSource } from "../mqtt";
import { Observable } from "rxjs";
import { distinct, map, share } from "rxjs/operators";
import { ZigbeeSource } from "./interface.source";
import { BridgeState, DeviceInformation } from "./interface.bridge";
import { ZIGBEE2MQTT_BASE_TOPIC } from "./interface";

/**
 * reuse the mqtt source. parse mqtt messages and revive zigbee2mqtt's 'last_seen' date
 */
export function zigbeeSource(mqtt: MqttSource): ZigbeeSource {
  return {
    device<T>(friendlyName: string): Observable<T> {
      return mqtt.topic(ZIGBEE2MQTT_BASE_TOPIC + "/" + friendlyName).pipe(
        map<MqttMessage, T>(
          (v): T =>
            JSON.parse(v.value.toString(), (k, v) =>
              k === "last_seen" ? new Date(v) : v,
            ) as any,
        ),
        share(),
      );
    },

    state(): Observable<BridgeState> {
      return mqtt.topic(ZIGBEE2MQTT_BASE_TOPIC + "/bridge/state").pipe(
        map<MqttMessage, BridgeState>(({ value }) => value.toString() as any),
        share(),
      );
    },

    deviceInfos(): Observable<DeviceInformation[]> {
      return mqtt.topic(ZIGBEE2MQTT_BASE_TOPIC + "/bridge/devices").pipe(
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
