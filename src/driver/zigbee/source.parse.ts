import {
  BridgeDevicesMessage,
  BridgeState,
  BridgeStateMessage,
  DeviceAttributeMessage,
  DeviceMessage,
  isZigbeeAttributeSubscription,
  ZigbeeMessage,
  ZigbeeSubscription,
} from "./interface";

/**
 * parse messages from devices
 * @see https://www.zigbee2mqtt.io/information/mqtt_topics_and_message_structure.html#zigbee2mqttfriendly_name
 */
function parseDeviceMessage(
  friendlyName: string,
): (value: Buffer) => DeviceMessage {
  return (value: Buffer): DeviceMessage => {
    const state = JSON.parse(value.toString(), (k, v) =>
      k === "last_seen" ? new Date(v) : v,
    ) as any;

    return { type: "device", state, friendlyName };
  };
}

/**
 * parse an attribute-only message
 *
 * Available if experimental.output has been set to "attribute" (or attribute_and_json)
 *
 * TODO: parse string/number/boolean/date, currently everything is just string
 *
 * @see https://www.zigbee2mqtt.io/information/configuration.html
 */
function parseAttributeMessage(
  friendlyName: string,
  attribute: string,
): (value: Buffer) => DeviceAttributeMessage {
  return (value: Buffer): DeviceAttributeMessage => {
    return {
      type: "deviceAttribute",
      friendlyName,
      attribute,
      value: value.toString(),
    };
  };
}

/**
 * parse the bridge/state topic, which is simply on or off
 * @see https://www.zigbee2mqtt.io/information/mqtt_topics_and_message_structure.html#zigbee2mqttbridgestate
 */
function parseBridgeState(value: Buffer): BridgeStateMessage {
  return { type: "bridge", state: value.toString() as BridgeState };
}

/**
 * parse the
 * @see https://www.zigbee2mqtt.io/information/mqtt_topics_and_message_structure.html#zigbee2mqttbridgedevices
 */
function parseBridgeDevices(value: Buffer): BridgeDevicesMessage {
  return { type: "devices", value: JSON.parse(value.toString()) };
}

/**
 * given a list of ZigbeeSubscriptions build the appropriate parsers for the expected topic names
 */
export function buildParser(
  subscriptions: ZigbeeSubscription[],
): Map<string, (value: Buffer) => ZigbeeMessage> {
  return new Map(
    subscriptions.map((s): [string, (value: Buffer) => ZigbeeMessage] => {
      if (s === "devices") {
        return ["bridge/devices", parseBridgeDevices];
      } else if (s === "state") {
        return ["bridge/state", parseBridgeState];
      } else if (typeof s === "string") {
        return [s, parseDeviceMessage(s)];
      } else if (isZigbeeAttributeSubscription(s)) {
        return [
          s.friendlyName + "/" + s.attribute,
          parseAttributeMessage(s.friendlyName, s.attribute),
        ];
      }

      return [s.friendlyName, parseDeviceMessage(s.friendlyName)];
    }),
  );
}
