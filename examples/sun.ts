import { hassDriver } from "../src";
import { map, skip, take } from "rxjs/operators";
import { concat, zip } from "rxjs";
import { diffString } from "json-diff";
import { debugObserver, LOGGER } from "./logging";
import { initHass, initMqttOptions } from "./index";
import { connectAsync } from "async-mqtt";

/**
 * show usage of the hass source. Extended to match the "sun" example of hasso,
 * which shows a colored diff
 */
async function sun() {
  const { token, url } = initHass();
  const mqttOptions = initMqttOptions();
  const mqttClient = await connectAsync(undefined, mqttOptions);

  const hass = await hassDriver(LOGGER, mqttClient, token, url);

  const sun$ = hass.source.sun();

  const sunPrevious$ = sun$.pipe(skip(1));

  // build a "sliding window" so we can always compare the current and the previous state
  const sunDiff$ = zip(sun$, sunPrevious$).pipe(
    map(([a, b]) => diffString(a, b)),
  );

  // prepend the initial state
  return concat(sun$.pipe(take(1)), sunDiff$).subscribe(debugObserver());
}

if (require.main === module) {
  sun().catch((err) => console.error(err));
}
