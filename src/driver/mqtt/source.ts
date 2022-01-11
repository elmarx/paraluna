import { Logger } from "winston";
import { AsyncMqttClient } from "async-mqtt";
import { concat, from, fromEvent, Observable } from "rxjs";
import { filter, share, skip } from "rxjs/operators";
import { MqttMessage } from "./interface.message";

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

/**
 * generic mqtt source
 */
export function mqttSource(
  _logger: Logger,
  client: AsyncMqttClient,
): MqttSource {
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
