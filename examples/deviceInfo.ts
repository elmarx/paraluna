import { DeviceInformation, zigbeeDriver } from "../src";
import { debugObserver, initClient } from "./index";
import { take } from "rxjs/operators";
import { Observable } from "rxjs";

async function main(deviceFriendlyName?: string) {
  const client = await initClient();
  const zigbee = zigbeeDriver(client);

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
