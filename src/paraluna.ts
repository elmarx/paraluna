import {
  clockDriver,
  ClockResult,
  Driver,
  MainFn,
  ZigbeeResult,
} from "./index";
import { filter, map } from "rxjs/operators";

// TODO: set up typing so that it's possible to NOT pass certain drivers iff main does not require their sources
export function paraluna(main: MainFn, driver: Driver) {
  const timeDriver = driver.clock || clockDriver();
  const result = main({
    hass: driver.hass.source,
    clock: timeDriver.source,
    zigbee: driver.zigbee.source,
  });

  const zigbee$ = result.pipe(
    filter((r): r is ZigbeeResult => !!r.zigbee),
    map((r) => r.zigbee),
  );

  const timer$ = result.pipe(
    filter((r): r is ClockResult => !!r.clock),
    map((r) => r.clock),
  );

  driver.zigbee.sink(zigbee$);
  timeDriver.sink(timer$);

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
