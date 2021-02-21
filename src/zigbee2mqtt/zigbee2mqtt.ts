import { pipe } from "rxjs";
import { MqttMessage } from "../mqttSource";
import { filter, map } from "rxjs/operators";

export function isZigbee2MqttMessage({ topic }: MqttMessage): boolean {
  return topic.startsWith("zigbee2mqtt/");
}

/**
 * strip off the zigbee2mqtt prefix, so later stages can ignore it
 */
export function stripTopicPrefix(v: MqttMessage): MqttMessage {
  return {
    topic: v.topic.substr("zigbee2mqtt/".length),
    value: v.value,
  };
}

export const zigbee2mqtt = pipe(
  filter(isZigbee2MqttMessage),
  map(stripTopicPrefix),
);
