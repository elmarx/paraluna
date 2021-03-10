import { Observable, of } from "rxjs";
import { HassSource } from "./interface";

export function hassSourceMock<T>(
  entities: Map<string, Observable<T>> = new Map(),
): HassSource {
  return {
    state(entityId: string): Observable<any> {
      return entities.get(entityId) || of();
    },
  };
}
