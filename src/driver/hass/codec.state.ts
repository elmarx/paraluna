import * as t from "io-ts";
import * as tt from "io-ts-types";

export const HassState = t.type({
  entity_id: t.string,
  state: t.string,
  attributes: tt.Json,
  last_changed: tt.DateFromISOString,
  last_updated: tt.DateFromISOString,
  context: t.type({
    id: t.string,
    parent_id: t.union([t.null, t.string]),
    user_id: t.union([t.null, t.string]),
  }),
});

export type HassState = t.TypeOf<typeof HassState>;

export type HassStateBase = Omit<HassState, "attributes">;
