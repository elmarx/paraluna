import { Observable } from "rxjs";
import { KnownEntities, State, Sun } from "hasso";

export interface HassSource {
  /**
   * get an entity state
   *
   * starts the stream by fetching the state from the rest interface,
   * then continues with state updates fetched via websocket
   * @param entityId
   */
  state(entityId: string): Observable<State>;
  state(entityId: KnownEntities.Sun): Observable<Sun>;
}
