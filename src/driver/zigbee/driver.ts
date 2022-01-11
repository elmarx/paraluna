import { AsyncMqttClient } from "async-mqtt";
import { ZigbeeDriver } from "./interface";
import { zigbeeSink } from "./sink";
import { zigbeeSource } from "./source";
import { Logger } from "winston";
import { isMqttDriver, MqttDriver, mqttDriver } from "../mqtt";

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
