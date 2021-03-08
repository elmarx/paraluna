import { DeviceBattery, DeviceLastSeen, DeviceLinkquality } from "./common";

export type E1525E1745Source = DeviceLastSeen &
  DeviceLinkquality &
  DeviceBattery & { occupancy: boolean };
