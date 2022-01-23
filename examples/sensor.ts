import { hassDriver } from "../src";
import { map, skip, take } from "rxjs/operators";
import { concat, zip } from "rxjs";
import { diffString } from "json-diff";
import { debugObserver, LOGGER } from "./logging";
import { initHass, initMqttOptions } from "./index";
import { connectAsync } from "async-mqtt";

/**
 * show usage of the hass source. Extended to match the "sensor" example of hasso,
 * which shows a colored diff
 */
async function sensor() {
  const { token, url } = initHass();
  const mqttOptions = initMqttOptions();
  const mqttClient = await connectAsync(undefined, mqttOptions);

  const hass = await hassDriver(LOGGER, mqttClient, token, url);

  const sensor$ = hass.source.sensor(
    "fritz_box_7520_ui_link_download_throughput",
  );

  const sensorPrevious$ = sensor$.pipe(skip(1));

  // build a "sliding window" so we can always compare the current and the previous state
  const sensorDiff$ = zip(sensor$, sensorPrevious$).pipe(
    map(([a, b]) => diffString(a, b)),
  );

  // prepend the initial state
  return concat(sensor$.pipe(take(1)), sensorDiff$).subscribe(debugObserver());
}

if (require.main === module) {
  sensor().catch((err) => console.error(err));
}
