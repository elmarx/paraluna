import { scan } from "rxjs/operators";
import { replayValueWhen } from "../../src/operators/replayValueWhen";
import { ofTimed, v } from "../helper";

test("replayValueWhen() with predicate", async () => {
  jest.useFakeTimers("modern");

  const sampleInput$ = ofTimed(
    v("stop"),
    v("brightness_move_up", 2000),
    v("stop", 60000),
    v("brightness_move_down", 1000),
    v("stop"),
  );

  const expected = [
    "stop",
    "brightness_move_up",
    "brightness_move_up",
    "brightness_move_up",
    "brightness_move_up",
    "brightness_move_up",
    "brightness_move_up",
    "brightness_move_up",
    "brightness_move_up",
    "stop",
    "brightness_move_down",
    "brightness_move_down",
    "brightness_move_down",
    "brightness_move_down",
    "stop",
  ];

  const actualP = sampleInput$
    .pipe(
      replayValueWhen((a) => a.startsWith("brightness_move"), 250),
      scan((acc: string[], v) => [...acc, v], []),
    )
    .toPromise();

  jest.runAllTimers();

  const actual = await actualP;

  expect(actual).toEqual(expected);
});

test("replayValueWhen() with set", async () => {
  jest.useFakeTimers("modern");

  const sampleInput$ = ofTimed(
    v("stop"),
    v("brightness_move_up", 2000),
    v("stop", 60000),
    v("brightness_move_down", 1000),
    v("stop"),
  );

  const expected = [
    "stop",
    "brightness_move_up",
    "brightness_move_up",
    "brightness_move_up",
    "brightness_move_up",
    "brightness_move_up",
    "brightness_move_up",
    "brightness_move_up",
    "brightness_move_up",
    "stop",
    "brightness_move_down",
    "brightness_move_down",
    "brightness_move_down",
    "brightness_move_down",
    "stop",
  ];

  const replayValues = new Set(["brightness_move_up", "brightness_move_down"]);

  const actualP = sampleInput$
    .pipe(
      replayValueWhen(replayValues, 250),
      scan((acc: string[], v) => [...acc, v], []),
    )
    .toPromise();

  jest.runAllTimers();

  const actual = await actualP;

  expect(actual).toEqual(expected);
});
