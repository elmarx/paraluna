import {
  ClockResult,
  hassDriver,
  paraluna,
  Sources,
  timerCmd,
  zigbeeDriver,
} from "../src";
import { debugObserver, initClient, initHass } from "./index";
import { Observable, of } from "rxjs";
import { wrapTimer } from "../src/result";

/**
 * initialize the zigbee2mqtt source/driver and subscribe to the bridge-state topic ("online" or "offline") printing to console
 */
function main({ clock }: Sources): Observable<ClockResult> {
  clock.timer("a").subscribe(debugObserver());
  clock.timer("b").subscribe(debugObserver());

  return wrapTimer(
    of(
      timerCmd("a", 1000, "first"),
      timerCmd("a", 900, "between"),
      timerCmd("a", 1, "start"),
    ),
  );
}

async function init() {
  const client = await initClient();
  const zigbee = zigbeeDriver(client);
  const { hassToken, hassUrl } = initHass();
  const hass = await hassDriver(hassToken, hassUrl);

  paraluna(main, { zigbee, hass });
}

if (require.main === module) {
  init().catch((err) => console.error(err));
}
