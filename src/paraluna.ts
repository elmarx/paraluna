import { Driver, MainFn, ZigbeeResult } from "./index";
import { filter, map } from "rxjs/operators";

// TODO: set up typing so that it's possible to NOT pass certain drivers iff main does not require their sources
export function paraluna(main: MainFn, driver: Driver) {
  const result = main({
    hass: driver.hass.source,
    zigbee: driver.zigbee.source,
  });

  const zigbee$ = result.pipe(
    filter((r): r is ZigbeeResult => !!r.zigbee),
    map((r) => r.zigbee),
  );

  driver.zigbee.sink(zigbee$);

  process.on("SIGTERM", async () => {
    try {
      await driver.hass.close();
      await driver.zigbee.close();
      process.exit();
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  });
}
