import { DeviceInformation, zigbeeDriver } from "../src";
import { take } from "rxjs/operators";
import { Observable } from "rxjs";
import { connectAsync } from "async-mqtt";
import { initMqttOptions } from "./index";
import { debugObserver, LOGGER } from "./logging";

async function main(deviceFriendlyName?: string) {
  const client = await connectAsync(undefined, initMqttOptions());

  const zigbee = zigbeeDriver(LOGGER, client);

  const info$: Observable<
    null | DeviceInformation | DeviceInformation[]
  > = deviceFriendlyName
    ? zigbee.source.deviceInfo(deviceFriendlyName)
    : zigbee.source.deviceInfos();

  info$
    .pipe(take(1))
    .subscribe(debugObserver("zigbee2mqtt"))
    .add(() => client.end());
}

if (require.main === module) {
  const deviceName = process.argv[2];

  main(deviceName).catch((err) => console.error(err));
}
