import { Observable } from "rxjs";
import { MqttMessage } from "./interface.message";
import { Logger } from "winston";
import { AsyncMqttClient } from "async-mqtt";
import { Either, isLeft } from "fp-ts/Either";
import { tryCatch } from "fp-ts/TaskEither";

/**
 * publish MqttMessages to mqtt
 */
export type MqttSink = (s: Observable<MqttMessage>) => void;

/**
 * attach an observer that publishes to the mqtt clinet
 */
export function mqttSink(logger: Logger, client: AsyncMqttClient) {
  return (s: Observable<MqttMessage>): void => {
    s.subscribe({
      complete(): void {
        logger.info("MQTT Sink completed");
      },
      error(err: any): void {
        logger.error("MQTT Sink error: ", err);
      },
      async next(value: MqttMessage): Promise<Either<unknown, void>> {
        const result = await tryCatch(
          () => client.publish(value.topic, value.value),
          (e) => e,
        )();

        if (isLeft(result)) {
          logger.error("MQTT Sink publish error", result.left);
        }

        return result;
      },
    });
  };
}
