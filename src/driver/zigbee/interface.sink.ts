import { Observable } from "rxjs";
import { Json } from "fp-ts/Json";

export type ZigbeeDevice = {
  friendlyName: string;
  attribute?: string;
};

export type ZigbeeSinglePublish = {
  friendlyName: string;
  attribute?: string;
  value: Json;
};

export type ZigbeeMulitPublish = {
  topic: string[] | ZigbeeDevice[];
  value: Json;
};

export type ZigbeePublish = ZigbeeSinglePublish | ZigbeeMulitPublish;

// TODO: maybe also support Observable<ZigbeePublish>[] and/or Observable<ZigbeePublish[]>
export type ZigbeeSink = (p: Observable<ZigbeePublish>) => void;
