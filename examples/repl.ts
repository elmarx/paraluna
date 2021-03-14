import { LOGGER } from "./logging";

const logger = LOGGER;

const e1 = new Error("1 someting wong");
const e2 = new Error("2 someting wong");

// logger.info("OK");
logger.error(e1);
logger.error(e2 as any, { name: "repl" });
