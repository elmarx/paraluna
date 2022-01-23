import { HassSource } from "./interface";
import { Logger } from "winston";
import { MqttSource } from "../mqtt";
import { concat, filter, map, Observable } from "rxjs";
import { hassHttp } from "./hassHttp";
import { unwrap } from "../../utils";
import { HassEvent } from "./codec.event";
import { Sun, SunAttributes } from "./codec.sun";
import { HassState } from "./codec.state";

type StateStream = (entityId: string) => Observable<HassState>;

/**
 * stream of events from mqtt, initialized with the current state from the HTTP API
 */
function stateFn(
  client: StateStream,
  events$: Observable<HassState>,
): StateStream {
  return (entityId) => {
    const events = events$.pipe(filter((e) => e.entity_id === entityId));
    return concat(client(entityId), events);
  };
}

export function hassSource(
  _logger: Logger,
  mqtt: MqttSource,
  token: string,
  url: string,
): HassSource {
  const client = hassHttp(token, url);
  const events$ = mqtt.topic("homeassistant/event").pipe(
    map((m) => {
      const v = JSON.parse(m.value.toString());
      return unwrap(HassEvent.decode(v)).event_data.new_state;
    }),
  );

  const state = stateFn(client, events$);

  return {
    sun(): Observable<Sun> {
      return state("sun.sun").pipe(
        map((s) => {
          const attributes = unwrap(SunAttributes.decode(s.attributes));
          return {
            ...s,
            attributes,
          };
        }),
      );
    },

    sensor(name: string): Observable<HassState> {
      return state("sensor." + name);
    },
  };
}
