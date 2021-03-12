import { Observable } from "rxjs";
import { JsonValue } from "../../json";

export type ZigbeePublish = {
  friendlyName: string;
  attribute?: string;
  state: JsonValue;
};

// TODO: maybe also support Observable<ZigbeePublish>[] and/or Observable<ZigbeePublish[]>
export type ZigbeeSink = (p: Observable<ZigbeePublish>) => void;
