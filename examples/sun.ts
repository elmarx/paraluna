import { debugObserver, initHass } from "./index";
import { hassDriver } from "../src/driver/hass";
import { KnownEntities } from "../../hasso";

/**
 * initialize driver and kick off paraluna (which wires together sources, sinks and main function)
 */
async function init() {
  const { hassToken, hassUrl } = initHass();
  const hass = await hassDriver(hassToken, hassUrl);

  hass.source.state(KnownEntities.Sun).subscribe(debugObserver());
}

if (require.main === module) {
  init().catch((err) => console.error(err));
}
