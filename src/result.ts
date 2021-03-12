import { Observable } from "rxjs";
import { TimerCommand, ZigbeePublish } from "./driver";
import { ClockResult, ZigbeeResult } from "./interface";
import { map } from "rxjs/operators";

export function wrapZigbee(
  o: Observable<ZigbeePublish>,
): Observable<ZigbeeResult> {
  return o.pipe(map((p) => ({ zigbee: p })));
}

export function wrapTimer(
  o: Observable<TimerCommand>,
): Observable<ClockResult> {
  return o.pipe(map((cmd) => ({ clock: cmd })));
}
