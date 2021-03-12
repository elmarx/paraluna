import { AsyncMqttClient } from "async-mqtt";
import { ZigbeeDriver } from "./interface";
import { zigbeeSink } from "./sink";
import { zigbeeSource } from "./source";

export function zigbeeDriver(mqtt: AsyncMqttClient): ZigbeeDriver {
  const attributes: Map<
    string,
    { friendlyName: string; attribute: string }
  > = new Map();
  const friendlyNames: Set<string> = new Set();

  return {
    close: mqtt.end.bind(mqtt),
    source: zigbeeSource(mqtt, friendlyNames, attributes),
    sink: zigbeeSink(mqtt, friendlyNames, attributes),
  };
}
