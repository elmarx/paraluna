import {
  HassEvent,
  HomeAssistant,
  HomeAssistantWebSocket,
  State,
  StateChangedEvent,
} from "hasso";
import { concat, from, fromEvent, Observable, of, throwError } from "rxjs";
import { filter, map, switchMap } from "rxjs/operators";
import { isError } from "ts-try";
import { parseKnownEntities } from "./entities";
import { HassSource } from "./interface";

export function hassSource(
  hass: HomeAssistant,
  socket: HomeAssistantWebSocket,
): HassSource {
  const stateChanged$: Observable<StateChangedEvent> = fromEvent(
    socket as any, // TODO: okay, I put "a lot" of work to strip HomeAssistantWebSocket down to StrictEventEmmitter, and now it's to strict for fromEvent :/
    HassEvent.STATE_CHANGED,
  );

  return {
    state(entityId: string): Observable<any> {
      const initState$ = from(hass.state(entityId)).pipe(
        switchMap((r) => (isError(r) ? throwError(r) : of(r))),
      );
      const stateUpdates$: Observable<State> = stateChanged$.pipe(
        filter(
          (s) => s.data.entity_id === entityId && s.data.new_state !== null,
        ),
        map((s) => s.data.new_state as State),
      );

      // as we return 'any' make sure we have the correct type here
      const state$: Observable<State> = concat(initState$, stateUpdates$);

      return state$.pipe(parseKnownEntities(entityId));
    },
  };
}
