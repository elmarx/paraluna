import { MqttMessage, MqttSink } from "../mqtt";
import { mergeMap } from "rxjs/operators";
import {
  ZIGBEE2MQTT_BASE_TOPIC,
  ZigbeeDevice,
  ZigbeePublish,
  ZigbeeSink,
} from "./interface";
import { isZigbeeSinglePublish } from "./guards";
import { JsonValue } from "../../json";
import { Logger } from "winston";

function into(
  state: JsonValue,
  friendlyName: string,
  attribute?: string,
): MqttMessage {
  if (attribute) {
    return {
      topic: `${ZIGBEE2MQTT_BASE_TOPIC}/${friendlyName}/set/${attribute}`,
      value: Buffer.from(JSON.stringify(state)),
    };
  } else {
    return {
      topic: `${ZIGBEE2MQTT_BASE_TOPIC}/${friendlyName}/set`,
      value: Buffer.from(JSON.stringify(state)),
    };
  }
}

/**
 * turn a zigbee publish command into a MqttMessage(s) so it can be published by the mqttSink directly
 * @param v
 */
function intoMqttMessage(v: ZigbeePublish): MqttMessage[] {
  if (isZigbeeSinglePublish(v)) {
    return [into(v.value, v.friendlyName, v.attribute)];
  }

  return v.topic.map((t: string | ZigbeeDevice) =>
    typeof t === "string"
      ? into(v.value, t)
      : into(v.value, t.friendlyName, t.attribute),
  );
}

export function zigbeeSink(_logger: Logger, mqtt: MqttSink): ZigbeeSink {
  return (sink) => {
    mqtt(sink.pipe(mergeMap(intoMqttMessage)));
  };
}
