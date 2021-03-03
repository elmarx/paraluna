export type LightBrightness = {
  brightness: number;
};
export type LightColorTemp = {
  color_temp: number;
};
export type LightEffect = {
  effect:
    | "blink"
    | "breathe"
    | "okay"
    | "channel_change"
    | "finish_effect"
    | "stop_effect";
};
