import {
  HassDriver,
  HassSource,
  TimeDriver,
  TimeSource,
  ZigbeeDriver,
  ZigbeePublish,
  ZigbeeSource,
} from "./driver";
import { Observable } from "rxjs";

export type Sources = {
  hass: HassSource;
  time: TimeSource;
  zigbee: ZigbeeSource;
};

export type Sinks = {
  zigbee: Observable<ZigbeePublish>;
};

export type Driver = {
  hass: HassDriver;
  time?: TimeDriver;
  zigbee: ZigbeeDriver;
};

export type MainFn = (sources: Sources) => Sinks;
