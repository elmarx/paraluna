import {
  ClockDriver,
  ClockSource,
  HassDriver,
  HassSource,
  TimerCommand,
  ZigbeeDriver,
  ZigbeePublish,
  ZigbeeSource,
} from "./driver";
import { Observable } from "rxjs";

export type Sources = {
  hass: HassSource;
  clock: ClockSource;
  zigbee: ZigbeeSource;
};

export type ZigbeeResult = {
  zigbee: ZigbeePublish;
};

export type ClockResult = {
  clock: TimerCommand;
};

export type Result = Partial<ZigbeeResult & ClockResult>;

export type Driver = {
  hass: HassDriver;
  clock?: ClockDriver;
  zigbee: ZigbeeDriver;
};

export type MainFn = (sources: Sources) => Observable<Result>;
