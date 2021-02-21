import { Observable, of, timer } from "rxjs";
import { mapTo, switchMap } from "rxjs/operators";

/**
 * replay/repeat certain values every `rate` if they match a given predicate
 */
export function replayValueWhen<T>(predicate: (v: T) => boolean, rate: number) {
  return function (source: Observable<T>): Observable<T> {
    return source.pipe(
      switchMap((v) => {
        if (predicate(v)) {
          return timer(0, rate).pipe(mapTo(v));
        } else {
          return of(v);
        }
      })
    );
  };
}
