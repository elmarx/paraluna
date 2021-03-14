import { HomeAssistant } from "hasso";
import { hassSource } from "./source";
import { HassDriver } from "./interface";
import { Logger } from "winston";

export async function hassDriver(
  logger: Logger,
  token: string,
  url: string = "http://localhost:8123",
): Promise<HassDriver> {
  const hass = new HomeAssistant(token, url);
  const socket = await hass.getWebsocket();

  return {
    close: socket.close.bind(socket),
    source: hassSource(logger.child({ direction: "source" }), hass, socket),
  };
}
