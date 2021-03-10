import { ZigbeeSource } from "./interface.source";
import { ZigbeeDeviceSink } from "./interface.sink";

export * from "./interface.bridge";
export * from "./interface.sink";
export * from "./interface.source";

// https://www.zigbee2mqtt.io/information/configuration.html#configuration base topic, hard coded for now to the default value
export const ZIGBEE2MQTT_BASE_TOPIC = "zigbee2mqtt";

export type ZigbeeSink = (sink: ZigbeeDeviceSink) => void;
export type ZigbeeDriver = {
  source: ZigbeeSource;
  sink: ZigbeeSink;
  close: () => Promise<void>;
};
