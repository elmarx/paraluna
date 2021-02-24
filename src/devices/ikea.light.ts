// types for devices of vendor 'ikea'
// 'prefix' is the model (not model_id!)
// TODO: extract/refactor common types (like zigbee-herdsman-converter does), make the type a dependent type of the model_id (also see zigbee.source.ts)

import {
  DeviceLastSeen,
  DeviceLinkquality,
} from "./index";

export type LED1836G9SourceProperties = DeviceLastSeen &
  DeviceLinkquality &
  LightBrightness &
  LightColorTemp &
  SwitchState;

export type LED1836G9SinkProperties = Partial<
  LightBrightness & LightColorTemp & SwitchState
>;

export type LED1903C5LED1835C6SourceProperties = DeviceLastSeen &
  DeviceLinkquality &
  LightBrightness &
  SwitchState;

export type LED1903C5LED1835C6SinkProperties = Partial<
  LightBrightness & SwitchState
>;
