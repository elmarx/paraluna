import { Observable } from "rxjs";

export type DeviceSink = ZigbeeDeviceSink;

export type ZigbeeDeviceSink = {
  type: "zigbee2mqtt";
  friendlyName: string;
  sink: Observable<unknown>;
};
export function zigbeeDeviceSink<T>(
  friendlyName: string,
  sink: Observable<T>,
): ZigbeeDeviceSink {
  return {
    type: "zigbee2mqtt",
    friendlyName,
    sink,
  };
}
