import { hassDriver } from "../src";
import { map, skip, take } from "rxjs/operators";
import { concat, zip } from "rxjs";
import { diffString } from "json-diff";
import { debugObserver, LOGGER } from "./logging";

/**
 * show usage of the hass source. Extended to match the "sun" example of hasso,
 * which shows a colored diff
 */
async function sun() {
  /*
  const { hassToken, hassUrl } = initHass();
  const hass = await hassDriver(LOGGER, hassToken, hassUrl);

  const sun$ = hass.source.state(KnownEntities.Sun);
  const sunPrevious$ = sun$.pipe(skip(1));

  // build a "sliding window" so we can always compare the current and the previous state
  const sunDiff$ = zip(sun$, sunPrevious$).pipe(
    map(([a, b]) => diffString(a, b)),
  );

  // prepend the initial state
  return concat(sun$.pipe(take(1)), sunDiff$).subscribe(debugObserver());
   */
}

if (require.main === module) {
  sun().catch((err) => console.error(err));
}
