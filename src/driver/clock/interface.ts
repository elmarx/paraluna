import { Observable } from "rxjs";
import { DateTime, Duration } from "luxon";
import { JsonValue } from "../../json";

export type ClockSource = {
  timer: (name: string) => Observable<JsonValue | null>;
  dateTime: (precision?: number) => Observable<DateTime>;
};

export type TimerCommand = {
  name: string;
  timer: DateTime | Duration;
  payload?: JsonValue;
};

export type ClockSink = (commands: Observable<TimerCommand>) => void;

export type ClockDriver = {
  source: ClockSource;
  sink: ClockSink;
};
