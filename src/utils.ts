import { KnownColors, ZIGBEE2MQTT_COLORS } from "./devices";

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
