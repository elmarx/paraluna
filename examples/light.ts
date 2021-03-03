import { LED1836G9Sink, paraluna, zigbeeDeviceSink } from "../src";
import { map } from "rxjs/operators";
import { initClient } from "./index";
import { zigbeeDriver } from "../src/driver";
import { Sources } from "../src/paraluna";

/**
 * a basic example that connects a button ("az_trigger_dimmer") with a light ("az_desk_light")
 */
function light(sources: Partial<Sources>) {
  const azTriggerDimmer$ = sources.zigbee!.device(
    "az_trigger_dimmer",
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
  );

  return [zigbeeDeviceSink("az_desk_light", azDeskLight$)];
}

/**
 * initialize driver and kick off paraluna (which wires together sources, sinks and main function)
 */
async function init() {
  const client = await initClient();
  const zigbee = zigbeeDriver(client);

  paraluna(light, { zigbee } as any);
}

if (require.main === module) {
  init().catch((err) => console.error(err));
}
