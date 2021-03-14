import { AsyncMqttClient } from "async-mqtt";
import { concat, from, fromEvent, Observable } from "rxjs";
import { filter, share, skip } from "rxjs/operators";
import { isError, tryF } from "ts-try";
import { ISubscriptionGrant } from "mqtt";
import { Logger } from "winston";

export type MqttMessage = {
  topic: string;
  value: Buffer;
};

/**
 * attach an observer that publishes to the mqtt clinet
 */
function mqttSink(logger: Logger, client: AsyncMqttClient) {
  return (s: Observable<MqttMessage>): void => {
    s.subscribe({
      complete(): void {
        logger.info("MQTT Sink completed");
      },
      error(err: any): void {
        logger.error("MQTT Sink error: ", err);
      },
      async next(value: MqttMessage): Promise<void> {
        const result = await tryF(client.publish(value.topic, value.value));
        if (isError(result)) {
          logger.error("MQTT Sink publish error", result);
        }
      },
    });
  };
}

/**
 * generic mqtt source
 */
function mqttSource(_logger: Logger, client: AsyncMqttClient): MqttSource {
  const messages$ = fromEvent(
    client,
    "message",
    (topic: string, value: Buffer): MqttMessage => ({
      topic,
      value,
    }),
  );

  return {
    messages$,

    topic(name: string): Observable<MqttMessage> {
      // turn the subscriptionGrant$ into an observable, so we can propagate the error through it as necessary
      const subscriptionGrant$ = from(client.subscribe(name));

      return concat(
        subscriptionGrant$.pipe(skip(1)),
        messages$.pipe(
          filter(({ topic }) => topic === name),
          share(),
        ),
      ) as Observable<MqttMessage>;
    },
  };
}

/**
 * publish MqttMessages to mqtt
 */
export type MqttSink = (s: Observable<MqttMessage>) => void;
export interface MqttSource {
  /**
   * ALL messages the mqtt client has been subscribed to
   */
  messages$: Observable<MqttMessage>;

  /**
   * subscribe to a given topic
   */
  topic(name: string): Observable<MqttMessage>;
}
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
