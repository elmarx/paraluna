import { Driver, MainFn, timeDriver } from "./index";

// TODO: set up typing so that it's possible to NOT pass certain drivers iff main does not require their sources
export function paraluna(main: MainFn, driver: Driver) {
  const time = driver.time || timeDriver();
  const result = main({
    hass: driver.hass.source,
    time: time.source,
    zigbee: driver.zigbee.source,
  });

  driver.zigbee.sink(result.zigbee);

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
