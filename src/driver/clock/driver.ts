import { interval, Observable, of, Subject } from "rxjs";
import { JsonValue } from "../../json";
import { delay, filter, map, mergeMap, share } from "rxjs/operators";
import { DateTime } from "luxon";
import { ClockDriver } from "./interface";

export function clockDriver(): ClockDriver {
  const timer = new Subject<{ name: string; payload?: JsonValue }>();

  return {
    sink(commands): void {
      commands
        .pipe(
          mergeMap((cmd) => {
            const duration = DateTime.isDateTime(cmd.timer)
              ? cmd.timer.toJSDate()
              : cmd.timer.toMillis();

            return of({ name: cmd.name, payload: cmd.payload }).pipe(
              delay(duration),
            );
          }),
        )
        .subscribe(timer);
    },

    source: {
      timer(name: string): Observable<JsonValue | null> {
        return timer.pipe(
          filter((e) => e.name === name),
          map((e) => e.payload || null),
        );
      },
      dateTime(precision: number = 1000) {
        return interval(precision).pipe(map(DateTime.now), share());
      },
    },
  };
}
