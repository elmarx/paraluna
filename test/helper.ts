import { concat, Observable } from "rxjs";

/**
 * of() with values that will are 'current value' of the stream for a given duration
 */
export function ofTimed<T>(
  ...args: { value: T; duration?: number }[]
): Observable<T> {
  return concat(
    ...args.map(
      ({ value, duration }) =>
        new Observable<T>((s) => {
          s.next(value);
          if (duration) {
            setTimeout(() => {
              s.complete();
            }, duration);
          } else {
            s.complete();
          }
        }),
    ),
  );
}

export function v<T>(
  value: T,
  duration?: number,
): { value: T; duration?: number } {
  return { value, duration };
}
