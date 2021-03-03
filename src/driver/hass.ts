import { HassSource } from "./hass.source";
import {
  HassEvent,
  HomeAssistant,
  HomeAssistantWebSocket,
  State,
  StateChangedEvent,
} from "hasso";
import { from, fromEvent, Observable, concat, throwError, of } from "rxjs";
import { filter, map, switchMap } from "rxjs/operators";
import { isError } from "ts-try";

export type HassDriver = { source: HassSource };

function hassSource(
  hass: HomeAssistant,
  socket: HomeAssistantWebSocket,
): HassSource {
  const state$: Observable<StateChangedEvent> = fromEvent(
    socket,
    HassEvent.STATE_CHANGED,
  );

  return {
    state(entityId: string): Observable<State> {
      const initState$ = from(hass.state(entityId)).pipe(
        switchMap((r) => (isError(r) ? throwError(r) : of(r))),
      );
      const stateUpdates$ = state$.pipe(
        filter((s) => s.data.entity_id === entityId),
        map((s) => s.data.new_state),
      );

      return concat(initState$, stateUpdates$);
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
