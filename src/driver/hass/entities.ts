import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { KnownEntities, reviveSunState, State, Sun } from "hasso";

export { KnownEntities, Sun };

/**
 * parse/revive attributes of known entities
 */
export function parseKnownEntities(entityId: string) {
  return function (source: Observable<State>): Observable<State | Sun> {
    return source.pipe(
      map((s) => (entityId === KnownEntities.Sun ? reviveSunState(s) : s)),
    );
  };
}
