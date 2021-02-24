import { DeviceSink } from "./index";
import { ZigbeeDriver, ZigbeeSource } from "./driver";

export type MainFn = (zigbee: ZigbeeSource) => DeviceSink[];

export function paraluna(main: MainFn, zigbeeDriver: ZigbeeDriver) {
  const result = main(zigbeeDriver.source);

  result.forEach(zigbeeDriver.sink);
}
