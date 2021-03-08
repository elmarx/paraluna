import { DeviceSink } from "./index";
import { HassDriver, HassSource, ZigbeeDriver, ZigbeeSource } from "./driver";

export type Sources = {
  zigbee: ZigbeeSource;
  hass: HassSource;
};

export type Driver = {
  zigbee: ZigbeeDriver;
  hass: HassDriver;
};

export type MainFn = (sources: Sources) => DeviceSink[];

// TODO: set up typing so that it's possible to NOT pass certain drivers iff main does not require their sources
export function paraluna(main: MainFn, driver: Driver) {
  const result = main({
    zigbee: driver.zigbee.source,
    hass: driver.hass.source,
  });

  result.forEach(driver.zigbee.sink);
}
