import { filter, map } from "rxjs/operators";
import { MqttMessage } from "../mqttSource";
import { pipe } from "rxjs";

export const BRIDGE_STATE_TOPIC = "bridge/state";

export type BridgeState = "online" | "offline";

export const bridgeState = pipe(
  filter<MqttMessage>((v) => v.topic == BRIDGE_STATE_TOPIC),
  map<MqttMessage, BridgeState>(({ value }) => value.toString() as any),
);
