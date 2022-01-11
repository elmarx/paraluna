import { Logger } from "winston";
import { AsyncMqttClient } from "async-mqtt";
import { concat, from, fromEvent, Observable } from "rxjs";
import { filter, share, skip } from "rxjs/operators";
import { MqttMessage } from "./interface.message";
import { dropRight, zip } from "fp-ts/Array";

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

export function matchesSubscription(topicSubscription: string) {
  // if the subscription includes wildcards, we need to match with the topic
  if (topicSubscription.includes("+") || topicSubscription.endsWith("#")) {
    const endsWithMultilevelWildcard = topicSubscription.endsWith("#");
    // remove the last element ("#") from the subscription to compare
    const s = dropRight(endsWithMultilevelWildcard ? 1 : 0)(
      topicSubscription.split("/"),
    );

    return ({ topic }: MqttMessage) => {
      const t = topic.split("/");
      if (!endsWithMultilevelWildcard && s.length < t.length) return false;
      return zip(s, t).every(
        ([pattern, actual]) => pattern === "+" || pattern === actual,
      );
    };
  }

  return ({ topic }: MqttMessage) => topicSubscription === topic;
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

    topic(topicSubscription: string): Observable<MqttMessage> {
      // turn the subscriptionGrant$ into an observable, so we can propagate the error through it as necessary
      const subscriptionGrant$ = from(client.subscribe(topicSubscription));

      return concat(
        subscriptionGrant$.pipe(skip(1)),
        messages$.pipe(filter(matchesSubscription(topicSubscription)), share()),
      ) as Observable<MqttMessage>;
    },
  };
}
