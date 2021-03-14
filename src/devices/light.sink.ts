import { LightBrightness, LightColor, LightColorTemp } from "./light";
import { SwitchStateSink, Transistion } from "./common";

export type TunableWhiteLightSink = Partial<
  LightBrightness & LightColorTemp & SwitchStateSink & Transistion
>;

export type DimmableLightSink = Partial<
  LightBrightness & SwitchStateSink & Transistion
>;

export type ColorLightSink = Partial<
  LightBrightness & LightColor & SwitchStateSink & Transistion
>;
