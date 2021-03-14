import { mqttDriver, MqttDriver } from "../mqtt";
import { AsyncMqttClient } from "async-mqtt";
import { ZigbeeDriver } from "./interface";
import { zigbeeSink } from "./sink";
import { zigbeeSource } from "./source";
import { Logger } from "winston";

/**
 * typeguard to distinguish MqttDriver and AsyncMqttClient for ergonomic initialization of the zigbeeDriver
 *
 * since async-mqtt can be located multiple times below top-level node_modules it's no guaranteed that the
 * AsyncMqttClient we like to check against via `instanceof` is the exact same object. So we rely on the naive
 * property testing here.
 */
function isMqttDriver(m: MqttDriver | AsyncMqttClient): m is MqttDriver {
  return m.hasOwnProperty("source") && m.hasOwnProperty("sink");
}

export function zigbeeDriver(
  logger: Logger,
  mqtt: MqttDriver | AsyncMqttClient,
): ZigbeeDriver {
  const mqttD = isMqttDriver(mqtt)
    ? mqtt
    : mqttDriver(logger.child({ driver: "mqtt" }), mqtt);

  return {
    close: mqttD.close,
    source: zigbeeSource(logger.child({ direction: "source" }), mqttD),
    sink: zigbeeSink(logger.child({ direction: "sink" }), mqttD.sink),
  };
}
