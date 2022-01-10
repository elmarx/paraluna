import { hassSource } from "./source";
import { HassDriver } from "./interface";
import { Logger } from "winston";

export async function hassDriver(logger: Logger): Promise<HassDriver> {
  return {
    close: Promise.resolve,
    source: hassSource(logger.child({ direction: "source" })),
  };
}
