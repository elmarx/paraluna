import assert from "assert";
import { Observer } from "rxjs";
import { AsyncMqttClient, connectAsync } from "async-mqtt";
import { mqttSource, zigbee2mqttSource } from "../src";

export function debugObserver<T>(name?: string): Observer<T> {
  if (name) {
    return {
      error: (error) => console.error("⚠️", `[${name}]`, error),
      next: (value) => console.log("▶️", `[${name}]`, value),
      complete: () => console.log("⏹", `[${name}]`, "completed"),
    };
  }

  return {
    error: (error) => console.error("⚠️", error),
    next: (value) => console.log("▶️", value),
    complete: () => console.log("⏹", "completed️"),
  };
}

export function initClient(): Promise<AsyncMqttClient> {
  const mqttHost = process.env.MQTT_HOST;
  const mqttUser = process.env.MQTT_USER;
  const mqttPassword = process.env.MQTT_PASSWORD;

  assert(mqttHost);
  assert(mqttUser);
  assert(mqttPassword);

  return connectAsync(undefined, {
    host: mqttHost,
    username: mqttUser,
    password: mqttPassword,
  });
}

/**
 * initialize the zigbee2mqtt sources and subscribe to the bridge-state topic ("online" or "offline") printing to console
 */
async function main() {
  const client = await initClient();

  const messages$ = await mqttSource(client);
  const zigbee2mqtt = await zigbee2mqttSource(client, messages$);

  zigbee2mqtt.state.subscribe(debugObserver("zigbee2mqtt"));
}

if (require.main === module) {
  main().catch((err) => console.error(err));
}
