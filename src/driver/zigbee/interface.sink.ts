import { Observable } from "rxjs";
import { JsonValue } from "../../json";

export type ZigbeeSubscription = {
  friendlyName: string;
  attribute?: string;
};

export type ZigbeePublish = {
  friendlyName: string;
  attribute?: string;
  state: JsonValue;
};

export type ZigbeeResult = {
  publish$: Observable<ZigbeePublish>;
  subscriptions?: ZigbeeSubscription[];
};
