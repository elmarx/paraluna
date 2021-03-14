import { LightBrightness, LightColor, LightColorTemp } from "./light";
import { DeviceLastSeen, DeviceLinkquality, SwitchStateSource } from "./common";

export type DimmableLightSource = DeviceLastSeen &
  DeviceLinkquality &
  LightBrightness &
  SwitchStateSource;

export type TunableWhiteLightSource = DeviceLastSeen &
  DeviceLinkquality &
  LightBrightness &
  LightColorTemp &
  SwitchStateSource;

export type ColorLightSource = DeviceLastSeen &
  DeviceLinkquality &
  LightBrightness &
  LightColor &
  SwitchStateSource;
