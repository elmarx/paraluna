import { DeviceInformation } from "./interface.bridge";
import { JsonRecord } from "fp-ts/Json";
import { BridgeState } from "./codec.bridge";

export type DeviceMessage<S = JsonRecord> = {
  type: "device";
  friendlyName: string;
  state: S;
};

export type DeviceAttributeMessage = {
  type: "deviceAttribute";
  friendlyName: string;
  attribute: string;
  value: string | number | boolean | Date;
};

export type BridgeStateMessage = {
  type: "bridge";
  state: BridgeState;
};

export type BridgeDevicesMessage = {
  type: "devices";
  value: DeviceInformation[];
};

export type UnknownMessage = {
  type: "unknown";
  value: Buffer;
};

export type ZigbeeMessage =
  | DeviceMessage
  | DeviceAttributeMessage
  | BridgeStateMessage
  | BridgeDevicesMessage
  | UnknownMessage;
