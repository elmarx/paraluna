import { Observable } from "rxjs";
import { AsyncMqttClient } from "async-mqtt";
import { MqttMessage } from "../mqttSource";
import { BRIDGE_STATE_TOPIC, BridgeState, bridgeState } from "./bridgeState";
import { zigbee2mqtt } from "./zigbee2mqtt";

export type Zigbee2MqttSource = {
  state: Observable<BridgeState>;
};

export async function zigbee2mqttSource(
  client: AsyncMqttClient,
  messages: Observable<MqttMessage>,
): Promise<Zigbee2MqttSource> {
  const zigbee2mqttMessages = messages.pipe(zigbee2mqtt);

  await client.subscribe("zigbee2mqtt/" + BRIDGE_STATE_TOPIC);
  const state = zigbee2mqttMessages.pipe(bridgeState);

  return {
    state,
  };
}
