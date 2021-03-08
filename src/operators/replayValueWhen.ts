import { Observable, of, timer } from "rxjs";
import { mapTo, switchMap } from "rxjs/operators";

/**
 * replay/repeat certain values every `rate` if they match a given predicate
 */
export function replayValueWhen<T>(
  predicate: ((v: T) => boolean) | Set<T>,
  rate: number,
) {
  return function (source: Observable<T>): Observable<T> {
    // if "predicate" is a function, execute that function
    if (typeof predicate === "function") {
      return source.pipe(
        switchMap((v) => {
          if (predicate(v)) {
            return timer(0, rate).pipe(mapTo(v));
          } else {
            return of(v);
          }
        }),
      );
    }
    // if it's not a function it's a set, so lookup that value in the set
    else {
      return source.pipe(
        switchMap((v) => {
          if (predicate.has(v)) {
            return timer(0, rate).pipe(mapTo(v));
          } else {
            return of(v);
          }
        }),
      );
    }
  };
}
