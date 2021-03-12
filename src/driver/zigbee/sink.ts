import { MqttMessage, MqttSink } from "../mqtt";
import { map } from "rxjs/operators";
import { ZIGBEE2MQTT_BASE_TOPIC, ZigbeePublish, ZigbeeSink } from "./interface";

/**
 * turn a zigbee publish command into an MqttMessage so it can be published by the mqttSink directly
 * @param v
 */
function intoMqttMessage(v: ZigbeePublish): MqttMessage {
  if (v.attribute) {
    return {
      topic: `${ZIGBEE2MQTT_BASE_TOPIC}/${v.friendlyName}/set/${v.attribute}`,
      value: Buffer.from(JSON.stringify(v.state)),
    };
  } else {
    return {
      topic: `${ZIGBEE2MQTT_BASE_TOPIC}/${v.friendlyName}/set`,
      value: Buffer.from(JSON.stringify(v.state)),
    };
  }
}

export function zigbeeSink(mqtt: MqttSink): ZigbeeSink {
  return (sink) => {
    mqtt(sink.pipe(map(intoMqttMessage)));
  };
}
