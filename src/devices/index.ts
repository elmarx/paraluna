export * from "./ikea.trigger";
export * from "./ikea.light";

export type DeviceLastSeen = { last_seen: Date };
export type DeviceLinkquality = { linkquality: number };
export type DeviceBattery = { battery: number };

export type LightBrightness = {
  brightness: number;
};
export type LightColorTemp = {
  color_temp: number;
};

export type SwitchState = { state: "ON" | "OFF" };
