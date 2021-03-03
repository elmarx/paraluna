import { LightBrightness } from "./light";
import { DeviceBattery, DeviceLastSeen, DeviceLinkquality } from "./common";

export type E1743Source = DeviceLastSeen &
  DeviceLinkquality &
  LightBrightness &
  DeviceBattery & {
    action?:
      | "on"
      | "off"
      | "brightness_move_down"
      | "brightness_move_up"
      | "brightness_stop";
  };
