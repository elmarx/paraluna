import { Observable } from "rxjs";

export type ZigbeeDeviceSink = {
  type: "zigbee2mqtt";
  friendlyName: string;
  sink: Observable<unknown>;
};
