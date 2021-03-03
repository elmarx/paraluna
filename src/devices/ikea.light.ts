// types for devices of vendor 'ikea'
// 'prefix' is the model (not model_id!)
// TODO: extract/refactor common types (like zigbee-herdsman-converter does), make the type a dependent type of the model_id (also see zigbee.source.ts)

import { DimmableLightSource, TunableWhiteLightSource } from "./light.source";
import { DimmableLightSink, TunableWhiteLightSink } from "./light.sink";
import { LightEffect } from "./light";

export type IkeaColorTemperatures =
  | "coolest"
  | "cool"
  | "neutral"
  | "warm"
  | "warmest";

export type IkeaTunableWhiteLightSource = TunableWhiteLightSource & {
  color_temp: number | IkeaColorTemperatures;
};

export type IkeaTunableWhiteLightSinks = TunableWhiteLightSink &
  Partial<LightEffect> &
  Partial<{
    color_temp: number | IkeaColorTemperatures;
  }>;

export type LED1836G9Source = IkeaTunableWhiteLightSource;
export type LED1836G9Sink = IkeaTunableWhiteLightSinks;

export type LED1903C5LED1835C6Source = DimmableLightSource;
export type LED1903C5LED1835C6Sink = DimmableLightSink & Partial<LightEffect>;
