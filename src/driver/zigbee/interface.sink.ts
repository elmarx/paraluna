import { Observable } from "rxjs";
import { JsonValue } from "../../json";

export type ZigbeeDevice = {
  friendlyName: string;
  attribute?: string;
};

export type ZigbeeSinglePublish = {
  friendlyName: string;
  attribute?: string;
  value: JsonValue;
};

export type ZigbeeMulitPublish = {
  topic: string[] | ZigbeeDevice[];
  value: JsonValue;
};

export type ZigbeePublish = ZigbeeSinglePublish | ZigbeeMulitPublish;

// TODO: maybe also support Observable<ZigbeePublish>[] and/or Observable<ZigbeePublish[]>
export type ZigbeeSink = (p: Observable<ZigbeePublish>) => void;
