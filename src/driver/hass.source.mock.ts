import { HassSource } from "./hass.source";
import { Observable, of } from "rxjs";

export function hassSourceMock<T>(
  entities: Map<string, Observable<T>> = new Map(),
): HassSource {
  return {
    state(entityId: string): Observable<any> {
      return entities.get(entityId) || of();
    },
  };
}
