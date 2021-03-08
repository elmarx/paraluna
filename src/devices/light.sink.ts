import { LightBrightness, LightColor, LightColorTemp } from "./light";
import { SwitchState } from "./common";

export type TunableWhiteLightSink = Partial<
  LightBrightness & LightColorTemp & SwitchState
>;

export type DimmableLightSink = Partial<LightBrightness & SwitchState>;

export type ColorLightSink = Partial<
  LightBrightness & LightColor & SwitchState
>;
