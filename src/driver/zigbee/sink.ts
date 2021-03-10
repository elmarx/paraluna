import { MqttMessage, MqttSink } from "../mqtt";
import { map } from "rxjs/operators";
import { ZIGBEE2MQTT_BASE_TOPIC, ZigbeeDeviceSink } from "./interface";
import { Observable } from "rxjs";

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

export function zigbeeDeviceSink<T>(
  friendlyName: string,
  sink: Observable<T>,
): ZigbeeDeviceSink {
  return {
    type: "zigbee2mqtt",
    friendlyName,
    sink,
  };
}
