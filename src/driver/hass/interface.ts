import { Observable } from "rxjs";
import { Sun } from "./codec.sun";
import { HassState } from "./codec.state";

export interface HassSource {
  sun(): Observable<Sun>;
  sensor(name: string): Observable<HassState>;
}

export type HassDriver = { source: HassSource; close: () => Promise<unknown> };
