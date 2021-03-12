export type ZigbeeDeviceSubscription = {
  friendlyName: string;
};

export type ZigbeeAttributeSubscription = {
  friendlyName: string;
  attribute: string;
};

export function isZigbeeAttributeSubscription(
  s: ZigbeeDeviceSubscription | ZigbeeAttributeSubscription,
): s is ZigbeeAttributeSubscription {
  return s.hasOwnProperty("attribute");
}

export type ZigbeeSubscription =
  | ZigbeeDeviceSubscription
  | ZigbeeAttributeSubscription
  | "devices"
  | "state"
  | string;
