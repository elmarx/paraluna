import { DeviceSink, timeDriver, TimeDriver, TimeSource } from "./index";
import { HassDriver, HassSource, ZigbeeDriver, ZigbeeSource } from "./driver";

export type Sources = {
  hass: HassSource;
  time: TimeSource;
  zigbee: ZigbeeSource;
};

export type Driver = {
  hass: HassDriver;
  time?: TimeDriver;
  zigbee: ZigbeeDriver;
};

export type MainFn = (sources: Sources) => DeviceSink[];

// TODO: set up typing so that it's possible to NOT pass certain drivers iff main does not require their sources
export function paraluna(main: MainFn, driver: Driver) {
  const time = driver.time || timeDriver();
  const result = main({
    hass: driver.hass.source,
    time: time.source,
    zigbee: driver.zigbee.source,
  });

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

  result.forEach(driver.zigbee.sink);
}
