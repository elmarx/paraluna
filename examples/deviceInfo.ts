import { zigbeeDriver } from "../src/driver";
import { debugObserver, initClient } from "./index";
import { take } from "rxjs/operators";
import assert from "assert";

async function main(deviceFriendlyName: string) {
  const client = await initClient();
  const zigbee = zigbeeDriver(client);

  zigbee.source
    .deviceInfo(deviceFriendlyName)
    .pipe(take(1))
    .subscribe(debugObserver("zigbee2mqtt"))
    .add(() => client.end());
}

if (require.main === module) {
  const deviceName = process.argv[2];
  assert(deviceName, "no device name given");

  main(deviceName).catch((err) => console.error(err));
}
