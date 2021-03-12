import { DateTime, Duration } from "luxon";
import { JsonValue } from "../../json";
import { TimerCommand } from "./interface";

export function timerCmd(
  name: string,
  timer: DateTime | Date | Duration | number,
  payload?: JsonValue,
): TimerCommand {
  if (DateTime.isDateTime(timer) || Duration.isDuration(timer)) {
    return {
      name,
      timer,
      payload,
    };
  }

  const t =
    timer instanceof Date
      ? DateTime.fromJSDate(timer)
      : Duration.fromMillis(timer);
  return {
    name,
    timer: t,
    payload,
  };
}
