// types for devices of vendor 'ikea'
// 'prefix' is the model (not model_id!)
// TODO: extract/refactor common types (like zigbee-herdsman-converter does), make the type a dependent type of the model_id (also see zigbee.source.ts)

export type LED1836G9SourceProperties = {
  brightness: number;
  color: { x: number; y: number };
  color_temp: number;
  last_seen: Date;
  linkquality: number;
  state: "ON" | "OFF";
};

export type LED1836G9SinkProperties = Partial<{
  brightness: number;
  color_temp: number;
  state: "ON" | "OFF";
}>;

export type E1743SourceProperties = {
  action:
    | "on"
    | "off"
    | "brightness_move_down"
    | "brightness_move_up"
    | "brightness_stop";
};
