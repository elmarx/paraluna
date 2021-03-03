import { paraluna, zigbeeDeviceSink } from "../src";
import { map } from "rxjs/operators";
import { debugObserver, initClient, initHass } from "./index";
import { zigbeeDriver, ZigbeeSource } from "../src/driver";
import { LED1836G9Sink } from "../src";
import { hassDriver } from "../src/driver/hass";
import assert from "assert";

/**
 * initialize driver and kick off paraluna (which wires together sources, sinks and main function)
 */
async function init() {
  const { hassToken, hassUrl } = initHass();
  const hass = await hassDriver(hassToken, hassUrl);

  hass.source.state("sun.sun").subscribe(debugObserver());
}

if (require.main === module) {
  init().catch((err) => console.error(err));
}
