import { Observable } from "rxjs";
import { ZigbeePublish } from "./driver";
import { ZigbeeResult } from "./interface";
import { map } from "rxjs/operators";

export function wrapZigbee(
  o: Observable<ZigbeePublish>,
): Observable<ZigbeeResult> {
  return o.pipe(map((p) => ({ zigbee: p })));
}
