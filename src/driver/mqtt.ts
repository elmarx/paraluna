import { AsyncMqttClient } from "async-mqtt";
import { concat, from, fromEvent, Observable, Observer } from "rxjs";
import { filter, share, skip } from "rxjs/operators";
import { isError, tryF } from "ts-try";

export type MqttMessage = {
  topic: string;
  value: Buffer;
};

export function mqttObserver(client: AsyncMqttClient): Observer<MqttMessage> {
  return {
    complete(): void {
      console.log("MQTT Sink completed");
    },
    error(err: any): void {
      console.error("MQTT Sink error: ", err);
    },
    async next(value: MqttMessage): Promise<void> {
      const result = await tryF(client.publish(value.topic, value.value));
      if (isError(result)) {
        console.log("MQTT Sink publish error", result);
      }
    },
  };
}

/**
 * attach an observer that publishes to the mqtt clinet
 */
function mqttSink(client: AsyncMqttClient) {
  return (s: Observable<MqttMessage>): void => {
    s.subscribe(mqttObserver(client));
  };
}

/**
 * generic mqtt source
 */
function mqttSource(client: AsyncMqttClient) {
  const source = fromEvent(
    client,
    "message",
    (topic: string, value: Buffer): MqttMessage => ({
      topic,
      value,
    }),
  );

  return {
    topic(name: string): Observable<MqttMessage> {
      // turn the subscriptionGrant$ into an observable, so we can propagate the error through it as necessary
      const subscriptionGrant$ = from(client.subscribe(name));

      return concat(
        subscriptionGrant$.pipe(skip(1)),
        source.pipe(
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
   * subscribe to a given topic
   */
  topic(name: string): Observable<MqttMessage>;
}
export type MqttDriver = {
  source: MqttSource;
  sink: MqttSink;
  close: () => Promise<void>;
};

export function mqttDriver(client: AsyncMqttClient): MqttDriver {
  return {
    close: client.end.bind(client),
    source: mqttSource(client),
    sink: mqttSink(client),
  };
}
