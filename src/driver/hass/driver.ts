import { HomeAssistant } from "hasso";
import { hassSource } from "./source";
import { HassDriver } from "./interface";

export async function hassDriver(
  token: string,
  url: string = "http://localhost:8123",
): Promise<HassDriver> {
  const hass = new HomeAssistant(token, url);
  const socket = await hass.getWebsocket();

  return {
    close: socket.close.bind(socket),
    source: hassSource(hass, socket),
  };
}
