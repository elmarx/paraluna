import { ZigbeeSource } from "./interface.source";
import { ZigbeeSink } from "./interface.sink";

export * from "./interface.bridge";
export * from "./interface.message";
export * from "./interface.sink";
export * from "./interface.source";
export * from "./interface.subscription";

// https://www.zigbee2mqtt.io/information/configuration.html#configuration base topic, hard coded for now to the default value
export const ZIGBEE2MQTT_BASE_TOPIC = "zigbee2mqtt";

export type ZigbeeDriver = {
  source: ZigbeeSource;
  sink: ZigbeeSink;
  close: () => Promise<void>;
};
