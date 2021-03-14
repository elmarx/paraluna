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

/**
 * predefined colors as provided by zigbee2mqtt (webinterface)
 */

export type KnownColors =
  | "RED"
  | "ORANGE"
  | "YELLOW"
  | "GREEN"
  | "BLUE"
  | "PURPLE";
export const ZIGBEE2MQTT_COLORS = {
  RED: { x: 0.6307692307692307, y: 0.3230769230769231 },
  ORANGE: { x: 0.49107142857142855, y: 0.42857142857142855 },
  YELLOW: { x: 0.4105263157894737, y: 0.48947368421052634 },
  GREEN: { x: 0.2962962962962963, y: 0.5925925925925926 },
  BLUE: { x: 0.14912280701754385, y: 0.06140350877192982 },
  PURPLE: { x: 0.34146341463414637, y: 0.17073170731707318 },
};
