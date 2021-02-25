import {
  DeviceBattery,
  DeviceLastSeen,
  DeviceLinkquality,
  LightBrightness,
} from "./index";

export type E1743SourceProperties = DeviceLastSeen &
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
