import {
  DeviceLastSeen,
  DeviceLinkquality,
  SwitchStateSink,
  SwitchStateSource,
} from "./common";

export type PowerSwitchSource = DeviceLastSeen &
  DeviceLinkquality &
  SwitchStateSource;

export type PowerSwitchSink = SwitchStateSink;
