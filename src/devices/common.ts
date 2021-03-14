export type DeviceLastSeen = { last_seen: Date };
export type DeviceLinkquality = { linkquality: number };
export type DeviceBattery = { battery: number };

export type Transistion = { transition: number };

export type SwitchStateSink = { state: "ON" | "OFF" | "TOGGLE" };
export type SwitchStateSource = { state: "ON" | "OFF" };
