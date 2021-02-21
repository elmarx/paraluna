import { MqttMessage } from "../mqttSource";
import { isZigbee2MqttMessage, stripTopicPrefix } from "./zigbee2mqtt";

test("detecting mqtt messages from zigbee2mqtt", () => {
  const sample: MqttMessage = {
    topic: "zigbee2mqtt/friendly-name",
    value: Buffer.alloc(0),
  };

  expect(isZigbee2MqttMessage(sample)).toBe(true);
});

test("detecting mqtt messages NOT from zigbee2mqtt", () => {
  const sample: MqttMessage = {
    topic: "homeassistant/some-topic",
    value: Buffer.alloc(0),
  };

  expect(isZigbee2MqttMessage(sample)).toBe(false);
});

test("stripping of the zigbee2mqtt topic prefix", () => {
  const sample: MqttMessage = {
    topic: "zigbee2mqtt/friendly-name",
    value: Buffer.alloc(0),
  };

  const actual = stripTopicPrefix(sample);
  expect(actual.topic).toBe("friendly-name");
});
