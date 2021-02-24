import {
  MqttDriver,
  mqttDriver,
  MqttMessage,
  MqttSink,
  MqttSource,
} from "./mqtt";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ZigbeeSource } from "./zigbee.source";
import { ZigbeeDeviceSink } from "../model.zigbee";
import { AsyncClient, AsyncMqttClient } from "async-mqtt";

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
        }))
      )
    );
  };
}

/**
 * reuse the mqtt source. parse mqtt messages and revive zigbee2mqtt's 'last_seen' date
 */
function zigbeeSource(mqtt: MqttSource): ZigbeeSource {
  return {
    device<T>(friendlyName: string): Observable<T> {
      return mqtt
        .topic(ZIGBEE2MQTT_BASE_TOPIC + "/" + friendlyName)
        .pipe(
          map<MqttMessage, T>(
            (v): T =>
              JSON.parse(
                v.value.toString(),
                (k, v) => k === "last_seen" ? new Date(v) : v,
              ) as any,
          ),
        );
    },

    state(): Observable<"online" | "offline"> {
      return mqtt.topic(ZIGBEE2MQTT_BASE_TOPIC + "/bridge/state").pipe(
        map<MqttMessage, "online" | "offline">(({ value }) =>
          value.toString() as any
        ),
      );
    },
  };
}

export type ZigbeeSink = (sink: ZigbeeDeviceSink) => void;
export type ZigbeeDriver = { source: ZigbeeSource; sink: ZigbeeSink };

export function zigbeeDriver(mqtt: MqttDriver | AsyncMqttClient): ZigbeeDriver {
  const mqttD = mqtt instanceof AsyncClient ? mqttDriver(mqtt) : mqtt;

  return {
    source: zigbeeSource(mqttD.source),
    sink: zigbeeSink(mqttD.sink),
  };
}
