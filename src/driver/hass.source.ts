import { Observable } from "rxjs";
import { State } from "hasso";

export type Sun = State & {
  attributes: {
    next_dawn: Date;
    next_dusk: Date;
    next_midnight: Date;
    next_noon: Date;
    next_rising: Date;
    next_setting: Date;
    elevation: number;
    azimuth: number;
    rising: boolean;
    friendly_name: "Sun";
  };
};

export interface HassSource {
  /**
   * get an entity state
   *
   * starts the stream by fetching the state from the rest interface,
   * then continues with state updates fetched via websocket
   * @param entityId
   */
  state(entityId: string): Observable<State>;
  // state(entityId: "sun.sun"): Observable<Sun>;
}
