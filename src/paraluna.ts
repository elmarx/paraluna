import {
  Driver,
  hassDriver,
  MainFn,
  zigbeeDriver,
  ZigbeeResult,
} from "./index";
import { filter, map } from "rxjs/operators";
import { Logger } from "winston";
import { connectAsync, IClientOptions } from "async-mqtt";

/**
 * initialize all drivers
 * @param mqttOptions
 * @param logger
 * @param hassOptions
 */
export async function initDriver(
  logger: Logger,
  mqttOptions: IClientOptions,
  hassOptions: { token: string; url: string },
): Promise<Driver> {
  const mqttClient = await connectAsync(undefined, mqttOptions);

  const zigbee = zigbeeDriver(logger.child({ driver: "zigbee" }), mqttClient);
  const hass = await hassDriver(
    logger.child({ driver: "hass" }),
    mqttClient,
    hassOptions.token,
    hassOptions.url,
  );

  return {
    zigbee,
    hass,
  };
}

// TODO: set up typing so that it's possible to NOT pass certain drivers iff main does not require their sources
// TODO: use a logging facade instead of depending on winston
export function paraluna(logger: Logger, main: MainFn, driver: Driver) {
  const result = main({
    hass: driver.hass.source,
    zigbee: driver.zigbee.source,
  });

  const zigbee$ = result.pipe(
    filter((r): r is ZigbeeResult => !!r.zigbee),
    map((r) => r.zigbee),
  );

  driver.zigbee.sink(zigbee$);

  process.on("SIGTERM", async () => {
    logger.info("received SIGTERM, closing driver connections");
    try {
      await driver.hass.close();
      await driver.zigbee.close();
      process.exit();
    } catch (e) {
      logger.error("error closing connections", { error: e });
      process.exit(1);
    }
  });
}
