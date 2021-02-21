import { AsyncMqttClient } from "async-mqtt";
import { fromEvent, Observable } from "rxjs";

export type MqttMessage = {
  topic: string;
  value: Buffer;
};

export async function mqttSource(
  client: AsyncMqttClient,
): Promise<Observable<MqttMessage>> {
  return fromEvent(
    client,
    "message",
    (topic: string, value: Buffer): MqttMessage => ({
      topic,
      value,
    }),
  );
}
