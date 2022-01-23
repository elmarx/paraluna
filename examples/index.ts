import assert from "assert";
import { connectAsync, IClientOptions } from "async-mqtt";
import { zigbeeDriver } from "../src";
import { debugObserver, LOGGER } from "./logging";

export function initMqttOptions(): IClientOptions {
  const mqttHost = process.env.MQTT_HOST;
  const mqttUser = process.env.MQTT_USER;
  const mqttPassword = process.env.MQTT_PASSWORD;

  assert(mqttHost);
  assert(mqttUser);
  assert(mqttPassword);

  return {
    host: mqttHost,
    username: mqttUser,
    password: mqttPassword,
  };
}

export function initHass(): { token: string; url: string } {
  const url = process.env.HASS_URL;
  const token = process.env.HASS_TOKEN;

  assert(url);
  assert(token);

  return { token, url: url };
}

/**
 * initialize the zigbee2mqtt source/driver and subscribe to the bridge-state topic ("online" or "offline") printing to console
 */
async function main() {
  const client = await connectAsync(undefined, initMqttOptions());
  const zigbee = zigbeeDriver(LOGGER, client);

  zigbee.source.state().subscribe(debugObserver("zigbee2mqtt"));
}

if (require.main === module) {
  main().catch((err) => console.error(err));
}
