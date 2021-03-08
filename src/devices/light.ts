export type LightBrightness = {
  brightness: number;
};

export type LightColorTemp = {
  color_temp: number;
};

export type LightColor = {
  color:
    | { x: number; y: number }
    | { r: number; g: number; b: number }
    | { rgb: string }
    | { hex: string };
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
