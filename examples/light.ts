import { paraluna, zigbeeDeviceSink } from "../src";
import { map } from "rxjs/operators";
import { initClient } from "./index";
import { zigbeeDriver, ZigbeeSource } from "../src/driver";
import { LED1836G9SinkProperties } from "../src/devices";

/**
 * a basic example that connects a button ("az_trigger_dimmer") with a light ("az_desk_light")
 */
function light(zigbee: ZigbeeSource) {
  const azTriggerDimmer$ = zigbee.device(
    "az_trigger_dimmer",
    "TRADFRI on/off switch",
  );

  const azDeskLight$ = azTriggerDimmer$.pipe(
    map((v): LED1836G9SinkProperties => {
      switch (v.action) {
        case "on":
          return { state: "ON" };
        case "off":
          return { state: "OFF" };
        default:
          return {};
      }
    }),
  );

  return [zigbeeDeviceSink("az_desk_light", azDeskLight$)];
}

/**
 * initialize driver and kick off paraluna (which wires together sources, sinks and main function)
 */
async function init() {
  const client = await initClient();
  const zigbee = zigbeeDriver(client);

  paraluna(light, zigbee);
}

if (require.main === module) {
  init().catch((err) => console.error(err));
}
