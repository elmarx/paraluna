import { LightBrightness, LightColorTemp } from "./light";
import { DeviceLastSeen, DeviceLinkquality, SwitchState } from "./common";

export type DimmableLightSource = DeviceLastSeen &
  DeviceLinkquality &
  LightBrightness &
  SwitchState;

export type TunableWhiteLightSource = DeviceLastSeen &
  DeviceLinkquality &
  LightBrightness &
  LightColorTemp &
  SwitchState;
