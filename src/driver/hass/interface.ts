export interface HassSource {}

export type HassDriver = { source: HassSource; close: () => Promise<unknown> };
