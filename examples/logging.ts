import winston, { format, transports } from "winston";
import { Observer } from "rxjs";

const enumerateErrorFormat = format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  if ((info.message as any) instanceof Error) {
    Object.assign(info, { message: (info.message as any).stack });
  }
  return info;
});

const prefixName = format((info) => {
  if (info.hasOwnProperty("name")) {
    Object.assign(info, { message: `[${info.name}] ${info.message}` });
    delete info.name;
  }

  return info;
});

export const LOGGER: winston.Logger = winston.createLogger({
  level: "debug",
  format: format.combine(
    enumerateErrorFormat(),
    prefixName(),
    format.colorize(),
    format.simple(),
  ),
  transports: [new transports.Console()],
});

export function debugObserver<T>(name?: string): Observer<T> {
  const rest = name ? { name } : undefined;
  return {
    error: (error) => LOGGER.error(error, rest),
    next: (value) => {
      const msg =
        typeof value === "object" ? JSON.stringify(value, null, 2) : value;
      LOGGER.info(`▶️ ${msg}`, rest);
    },
    complete: () => LOGGER.info(`⏹ completed`, rest),
  };
}
