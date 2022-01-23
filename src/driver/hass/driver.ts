import { hassSource } from "./source";
import { HassDriver } from "./interface";
import { Logger } from "winston";
import { mqttDriver, MqttDriver, isMqttDriver } from "../mqtt";
import { AsyncMqttClient } from "async-mqtt";

export function hassDriver(
  logger: Logger,
  mqtt: MqttDriver | AsyncMqttClient,
  token: string,
  url: string = "http://localhost:8123",
): HassDriver {
  const mqttD = isMqttDriver(mqtt)
    ? mqtt
    : mqttDriver(logger.child({ driver: "mqtt" }), mqtt);

  return {
    close: mqttD.close,
    source: hassSource(
      logger.child({ direction: "source" }),
      mqttD.source,
      token,
      url,
    ),
  };
}
