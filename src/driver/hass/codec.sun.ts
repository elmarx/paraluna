import * as t from "io-ts";
import * as tt from "io-ts-types";
import { HassStateBase } from "./codec.state";

export const SunAttributes = t.type({
  next_dawn: tt.DateFromISOString,
  next_dusk: tt.DateFromISOString,
  next_midnight: tt.DateFromISOString,
  next_noon: tt.DateFromISOString,
  next_rising: tt.DateFromISOString,
  next_setting: tt.DateFromISOString,
  elevation: t.number,
  azimuth: t.number,
  rising: t.boolean,
  friendly_name: t.literal("Sun"),
});

export type SunAttributes = t.TypeOf<typeof SunAttributes>;

export type Sun = HassStateBase & { attributes: SunAttributes };
