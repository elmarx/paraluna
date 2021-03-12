import {
  HassDriver,
  HassSource,
  ZigbeeDriver,
  ZigbeePublish,
  ZigbeeSource,
} from "./driver";
import { Observable } from "rxjs";

export type Sources = {
  hass: HassSource;
  zigbee: ZigbeeSource;
};

export type ZigbeeResult = {
  zigbee: ZigbeePublish;
};

export type Result = Partial<ZigbeeResult>;

export type Driver = {
  hass: HassDriver;
  zigbee: ZigbeeDriver;
};

export type MainFn = (sources: Sources) => Observable<Result>;
