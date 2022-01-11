import { MqttDriver } from "./driver";
import { AsyncMqttClient } from "async-mqtt";

/**
 * typeguard to distinguish MqttDriver and AsyncMqttClient for ergonomic initialization of the zigbeeDriver
 *
 * since async-mqtt can be located multiple times below top-level node_modules it's no guaranteed that the
 * AsyncMqttClient we like to check against via `instanceof` is the exact same object. So we rely on the naive
 * property testing here.
 */
export function isMqttDriver(m: MqttDriver | AsyncMqttClient): m is MqttDriver {
  return m.hasOwnProperty("source") && m.hasOwnProperty("sink");
}
