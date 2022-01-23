import * as t from "io-ts";
import { HassState } from "./codec.state";

export const HassEvent = t.type({
  event_type: t.literal("state_changed"),
  event_data: t.type({
    entity_id: t.string,
    old_state: HassState,
    new_state: HassState,
  }),
});

export type HassEvent = t.TypeOf<typeof HassEvent>;
