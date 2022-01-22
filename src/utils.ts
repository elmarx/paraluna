import { KnownColors, ZIGBEE2MQTT_COLORS } from "./devices";
import { Either, isRight } from "fp-ts/Either";

export function guessColor(x: number, y: number): KnownColors {
  return Object.entries(ZIGBEE2MQTT_COLORS)
    .map(([colorName, color]) => {
      const distance = Math.sqrt(
        Math.pow(color.x - x, 2) + Math.pow(color.y - y, 2),
      );

      return { colorName, distance };
    })
    .sort((a, b) => a.distance - b.distance)[0]!.colorName as any;
}

/**
 * unwrap an Either. This throws if ma is left, but returns the value otherwise
 * @param ma
 */
export function unwrap<E, A>(ma: Either<E, A>): A {
  if (isRight(ma)) {
    return ma.right;
  }

  throw ma.left;
}
