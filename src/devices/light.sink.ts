import { LightBrightness, LightColor, LightColorTemp } from "./light";
import { SwitchState, Transistion } from "./common";

export type TunableWhiteLightSink = Partial<
  LightBrightness & LightColorTemp & SwitchState & Transistion
>;

export type DimmableLightSink = Partial<
  LightBrightness & SwitchState & Transistion
>;

export type ColorLightSink = Partial<
  LightBrightness & LightColor & SwitchState & Transistion
>;
