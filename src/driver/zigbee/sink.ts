import { MqttMessage, mqttObserver } from "../mqtt";
import { map } from "rxjs/operators";
import {
  ZIGBEE2MQTT_BASE_TOPIC,
  ZigbeePublish,
  ZigbeeResult,
  ZigbeeSubscription,
} from "./interface";
import { AsyncMqttClient } from "async-mqtt";

function zigbeeSubscribe(
  mqtt: AsyncMqttClient,
  friendlyNames: Set<string>,
  attributes: Map<string, { friendlyName: string; attribute: string }>,
  subscriptions: ZigbeeSubscription[] = [],
) {
  subscriptions
    .map((s) => {
      if (s.attribute) {
        const topic = s.friendlyName + "/" + s.attribute;
        attributes.set(topic, {
          friendlyName: s.friendlyName,
          attribute: s.attribute,
        });
        return ZIGBEE2MQTT_BASE_TOPIC + "/" + topic;
      } else {
        friendlyNames.add(s.friendlyName);
        return ZIGBEE2MQTT_BASE_TOPIC + "/" + s.friendlyName;
      }
    })
    .forEach((topic) => mqtt.subscribe(topic));
}

function intoMqttMessage(v: ZigbeePublish): MqttMessage {
  if (v.attribute) {
    return {
      topic: `${ZIGBEE2MQTT_BASE_TOPIC}/${v.friendlyName}/set/${v.attribute}`,
      value: Buffer.from(JSON.stringify(v)),
    };
  } else {
    return {
      topic: `${ZIGBEE2MQTT_BASE_TOPIC}/${v.friendlyName}/set`,
      value: Buffer.from(JSON.stringify(v)),
    };
  }
}

export function zigbeeSink(
  mqtt: AsyncMqttClient,
  friendlyNames: Set<string>,
  attributes: Map<string, { friendlyName: string; attribute: string }>,
): (sink: ZigbeeResult) => void {
  return (sink: ZigbeeResult): void => {
    zigbeeSubscribe(mqtt, friendlyNames, attributes, sink.subscriptions);
    sink.publish$.pipe(map(intoMqttMessage)).subscribe(mqttObserver(mqtt));
  };
}
