import { interval, MonoTypeOperatorFunction, Observable } from "rxjs";
import { delay, map, share } from "rxjs/operators";
import { DateTime } from "luxon";

export type TimeSource = {
  delay: <T>(delay: number | Date) => MonoTypeOperatorFunction<T>;
  interval: (period?: number) => Observable<number>;
  dateTime: (precision?: number) => Observable<DateTime>;
};

export type TimeDriver = {
  source: TimeSource;
};

export function timeSourceMock(mock: Partial<TimeSource> = {}): TimeSource {
  return {
    dateTime(): Observable<DateTime> {
      throw new Error("Mock not pre-programmed");
    },
    delay<T>(): MonoTypeOperatorFunction<T> {
      throw new Error("Mock not pre-programmed");
    },
    interval(): Observable<number> {
      throw new Error("Mock not pre-programmed");
    },
    ...mock,
  };
}

export function timeDriver(): TimeDriver {
  return {
    source: {
      delay,
      interval(period: number = 1000) {
        return interval(period);
      },
      dateTime(precision: number = 1000) {
        return interval(precision).pipe(map(DateTime.now), share());
      },
    },
  };
}
