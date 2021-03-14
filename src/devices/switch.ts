import { DeviceLastSeen, DeviceLinkquality, SwitchState } from "./common";

export type PowerSwitchSource = DeviceLastSeen &
  DeviceLinkquality &
  SwitchState;

export type PowerSwitchSink = SwitchState;
