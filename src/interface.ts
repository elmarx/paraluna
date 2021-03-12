import {
  HassDriver,
  HassSource,
  TimeDriver,
  TimeSource,
  ZigbeeDriver,
  ZigbeeResult,
  ZigbeeSource,
} from "./driver";

export type Sources = {
  hass: HassSource;
  time: TimeSource;
  zigbee: ZigbeeSource;
};

export type Sinks = {
  zigbee: ZigbeeResult;
};

export type Driver = {
  hass: HassDriver;
  time?: TimeDriver;
  zigbee: ZigbeeDriver;
};

export type MainFn = (sources: Sources) => Sinks;
