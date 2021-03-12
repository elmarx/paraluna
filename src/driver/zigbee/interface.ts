import { ZigbeeSource } from "./interface.source";
import { ZigbeeResult } from "./interface.sink";

export * from "./interface.bridge";
export * from "./interface.message";
export * from "./interface.sink";
export * from "./interface.source";

// https://www.zigbee2mqtt.io/information/configuration.html#configuration base topic, hard coded for now to the default value
export const ZIGBEE2MQTT_BASE_TOPIC = "zigbee2mqtt";

export type ZigbeeDriver = {
  source: ZigbeeSource;
  sink: (sink: ZigbeeResult) => void;
  close: () => Promise<void>;
};
