import { mqttSource, MqttSource } from "./source";
import { mqttSink, MqttSink } from "./sink";
import { Logger } from "winston";
import { AsyncMqttClient, ISubscriptionGrant } from "async-mqtt";

export type MqttDriver = {
  source: MqttSource;
  sink: MqttSink;
  close: () => Promise<void>;
  subscribe: (topic: string | string[]) => Promise<ISubscriptionGrant[]>;
};

export function mqttDriver(
  logger: Logger,
  client: AsyncMqttClient,
): MqttDriver {
  return {
    close: client.end.bind(client),
    subscribe: client.subscribe.bind(client),
    source: mqttSource(logger.child({ direction: "source" }), client),
    sink: mqttSink(logger.child({ direction: "sink" }), client),
  };
}
