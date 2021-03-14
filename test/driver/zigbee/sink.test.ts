import { ZigbeePublish, zigbeeSink } from "../../../src";
import { of } from "rxjs";
import { map, scan } from "rxjs/operators";

describe("sending ZigbeeMultiPublish messages", () => {
  test("with devices as strings", (done) => {
    const sample: ZigbeePublish = {
      topic: ["light_a", "light_b", "light_c"],
      state: { state: "ON" },
    };

    const expected = sample.topic.map((topic: any) => ({
      topic: `zigbee2mqtt/${topic}/set`,
      value: sample.state,
    }));

    zigbeeSink(async (s) => {
      const result = await s
        .pipe(
          map(({ topic, value }) => ({
            topic,
            value: JSON.parse(value.toString()),
          })),
          scan((acc: any[], cur: any) => [...acc, cur], []),
        )
        .toPromise();
      expect(result).toEqual(expected);
      done();
    })(of(sample));
  });
});
