import * as t from "io-ts";

export const BridgeState = t.union([t.literal("online"), t.literal("offline")]);
export type BridgeState = t.TypeOf<typeof BridgeState>;
