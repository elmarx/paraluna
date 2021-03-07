import { HassSource } from "./hass.source";
import {
  HomeAssistant,
  HomeAssistantWebSocket,
  StateChangedEvent,
  HassEvent,
  State,
} from "hasso";
import { from, fromEvent, Observable, concat, throwError, of } from "rxjs";
import { filter, map, switchMap } from "rxjs/operators";
import { isError } from "ts-try";
import { parseKnownEntities } from "./hass.entities";

export type HassDriver = { source: HassSource };

function hassSource(
  hass: HomeAssistant,
  socket: HomeAssistantWebSocket,
): HassSource {
  const stateChanged$: Observable<StateChangedEvent> = fromEvent(
    socket,
    HassEvent.STATE_CHANGED,
  );

  return {
    state(entityId: string): Observable<any> {
      const initState$ = from(hass.state(entityId)).pipe(
        switchMap((r) => (isError(r) ? throwError(r) : of(r))),
      );
      const stateUpdates$ = stateChanged$.pipe(
        filter((s) => s.data.entity_id === entityId),
        map((s) => s.data.new_state),
      );

      // as we return 'any' make sure we have the correct type here
      const state$: Observable<State> = concat(initState$, stateUpdates$);

      return state$.pipe(parseKnownEntities(entityId));
    },
  };
}

export async function hassDriver(
  token: string,
  url: string = "http://localhost:8123",
): Promise<HassDriver> {
  const hass = new HomeAssistant(token, url);
  const socket = await hass.getWebsocket();

  return {
    source: hassSource(hass, socket),
  };
}
