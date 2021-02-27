import {
  MqttDriver,
  mqttDriver,
  MqttMessage,
  MqttSink,
  MqttSource,
} from "./mqtt";
import { Observable } from "rxjs";
import { distinct, map, share } from "rxjs/operators";
import { ZigbeeSource } from "./zigbee.source";
import { ZigbeeDeviceSink } from "../model.zigbee";
import { AsyncMqttClient } from "async-mqtt";
import { BridgeState, DeviceInformation } from "./zigbee.bride";

// https://www.zigbee2mqtt.io/information/configuration.html#configuration base topic, hard coded for now to the default value
const ZIGBEE2MQTT_BASE_TOPIC = "zigbee2mqtt";

/**
 * turn the "highlevel" zigbee-sink-properties into raw MqttMessages fed into the mqtt sink
 */
export function zigbeeSink(mqtt: MqttSink) {
  return (deviceSink: ZigbeeDeviceSink): void => {
    mqtt(
      deviceSink.sink.pipe(
        map<unknown, MqttMessage>((v) => ({
          topic: `${ZIGBEE2MQTT_BASE_TOPIC}/${deviceSink.friendlyName}/set`,
          value: Buffer.from(JSON.stringify(v)),
        })),
      ),
    );
  };
}

/**
 * reuse the mqtt source. parse mqtt messages and revive zigbee2mqtt's 'last_seen' date
 */
function zigbeeSource(mqtt: MqttSource): ZigbeeSource {
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

export type ZigbeeSink = (sink: ZigbeeDeviceSink) => void;
export type ZigbeeDriver = { source: ZigbeeSource; sink: ZigbeeSink };

/**
 * typeguard to distinguish MqttDriver and AsyncMqttClient for ergonomic initialization of the zigbeeDriver
 *
 * since async-mqtt can be located multiple times below top-level node_modules it's no guaranteed that the
 * AsyncMqttClient we like to check against via `instanceof` is the exact same object. So we rely on the naive
 * property testing here.
 */
function isMqttDriver(m: MqttDriver | AsyncMqttClient): m is MqttDriver {
  return m.hasOwnProperty("source") && m.hasOwnProperty("sink");
}

export function zigbeeDriver(mqtt: MqttDriver | AsyncMqttClient): ZigbeeDriver {
  const mqttD = isMqttDriver(mqtt) ? mqtt : mqttDriver(mqtt);

  return {
    source: zigbeeSource(mqttD.source),
    sink: zigbeeSink(mqttD.sink),
  };
}
