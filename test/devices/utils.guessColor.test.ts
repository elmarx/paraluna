import { guessColor } from "../../src/utils";

test("guess color", () => {
  const sample = { x: 0.3415, y: 0.1707 };

  const actual = guessColor(sample.x, sample.y);

  expect(actual).toBe("PURPLE");
});
