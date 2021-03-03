import assert from "assert";
import { Observer } from "rxjs";
import { AsyncMqttClient, connectAsync } from "async-mqtt";
import { zigbeeDriver } from "../src/driver";

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

export function initHass(): { hassToken: string; hassUrl: string } {
  const hassUrl = process.env.HASS_URL;
  const hassToken = process.env.HASS_TOKEN;

  assert(hassUrl);
  assert(hassToken);

  return { hassUrl, hassToken };
}

/**
 * initialize the zigbee2mqtt source/driver and subscribe to the bridge-state topic ("online" or "offline") printing to console
 */
async function main() {
  const client = await initClient();
  const zigbee = zigbeeDriver(client);

  zigbee.source.state().subscribe(debugObserver("zigbee2mqtt"));
}

if (require.main === module) {
  main().catch((err) => console.error(err));
}
