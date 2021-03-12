import {
  E1743Source,
  hassDriver,
  LED1836G9Sink,
  paraluna,
  Sinks,
  Sources,
  zigbeeDriver,
  ZigbeePublish,
} from "../src";
import { map } from "rxjs/operators";
import { initClient, initHass } from "./index";
import { Observable } from "rxjs";

/**
 * a basic example that connects a button ("az_trigger_dimmer") with a light ("az_desk_light")
 */
function light(sources: Partial<Sources>): Sinks {
  const azTriggerDimmer$: Observable<E1743Source> = sources.zigbee!.device(
    "az/trigger/dimmer",
    "TRADFRI on/off switch",
  );

  const azDeskLight$ = azTriggerDimmer$.pipe(
    map(
      (v): LED1836G9Sink => {
        switch (v.action) {
          case "on":
            return { state: "ON" };
          case "off":
            return { state: "OFF" };
          case "brightness_move_up":
          case "brightness_move_down":
          case undefined:
            return { brightness: v.brightness };
          default:
            return {};
        }
      },
    ),
    map<LED1836G9Sink, ZigbeePublish>((state) => ({
      friendlyName: "az/light/desk",
      state,
    })),
  );

  return {
    zigbee: {
      publish$: azDeskLight$,
    },
  };
}

/**
 * initialize driver and kick off paraluna (which wires together sources, sinks and main function)
 */
async function init() {
  const client = await initClient();
  const zigbee = zigbeeDriver(client);
  const { hassToken, hassUrl } = initHass();
  const hass = await hassDriver(hassToken, hassUrl);

  paraluna(light, { zigbee, hass });
}

if (require.main === module) {
  init().catch((err) => console.error(err));
}
