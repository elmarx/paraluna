import { Observable, of } from "rxjs";
import { HassSource } from "./interface";
import { Sun } from "./codec.sun";
import { HassState } from "./codec.state";

export function hassSourceMock(): HassSource {
  return {
    sun(): Observable<Sun> {
      return of() as any;
    },
    sensor(_name: string): Observable<HassState> {
      return of();
    },
  };
}
