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

export type E1524E1810Source = DeviceLastSeen &
  DeviceLinkquality &
  DeviceBattery & {
    action?:
      | "brightness_down_release"
      | "toggle_hold"
      | "toggle"
      | "arrow_left_click"
      | "arrow_right_click"
      | "arrow_left_hold"
      | "arrow_right_hold"
      | "arrow_left_release"
      | "arrow_right_release"
      | "brightness_up_click"
      | "brightness_down_click"
      | "brightness_up_hold"
      | "brightness_up_release";
  };
