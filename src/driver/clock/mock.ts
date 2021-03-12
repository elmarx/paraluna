import { Observable } from "rxjs";
import { JsonValue } from "../../json";
import { DateTime } from "luxon";
import { ClockSource } from "./interface";

export function clockSourceMock(mock: Partial<ClockSource> = {}): ClockSource {
  return {
    timer(_name: string): Observable<JsonValue> {
      throw new Error("Mock not pre-programmed");
    },
    dateTime(): Observable<DateTime> {
      throw new Error("Mock not pre-programmed");
    },
    ...mock,
  };
}
