import { matchesSubscription } from "../../../src/driver/mqtt";

function subject(topicSubscription: string, topic: string): boolean {
  return matchesSubscription(topicSubscription)({
    topic,
    value: Buffer.alloc(0),
  });
}

describe("matchesTopic()", () => {
  test("topic names are equal", () => {
    expect(subject("a/b", "a/b")).toBeTruthy();
  });

  test("subscription ends with wildcard", () => {
    expect(
      subject(
        "homeassistant/state/switch/xyz/+",
        "homeassistant/state/switch/xyz/state",
      ),
    ).toBeTruthy();

    expect(
      subject("homeassistant/state/+", "homeassistant/state/switch/xyz/state"),
    ).toBeFalsy();
  });

  test("subscription ends with multilevel wildcard (#)", () => {
    expect(
      subject("homeassistant/state/#", "homeassistant/state/switch/xyz/state"),
    ).toBeTruthy();
  });

  test("examples from mqtt(7)", () => {
    expect(
      subject(
        "sensors/+/temperature/+",
        "sensors/COMPUTER_NAME/temperature/HARDDRIVE_NAME",
      ),
    ).toBeTruthy();

    ["a/b/c/d", "+/b/c/d", "a/+/c/d", "a/+/+/d", "+/+/+/+"].forEach((sub) =>
      expect(subject(sub, "a/b/c/d")).toBeTruthy(),
    );

    ["a/b/c", "b/+/c/d", "+/+/+"].forEach((sub) =>
      expect(subject(sub, "a/b/c/d")).toBeFalsy(),
    );

    ["a/b/c/d", "#", "a/#", "a/b/#", "a/b/c/#", "+/b/c/#"].forEach((sub) =>
      expect(subject(sub, "a/b/c/d")).toBeTruthy(),
    );
  });
});
