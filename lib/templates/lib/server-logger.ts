import { createLogger } from "./logger"

const logger = createLogger("server")

export const serverLogger = {
  info: (message: string, data?: any) => {
    logger.info(message, data)
  },

  warn: (message: string, data?: any) => {
    logger.warn(message, data)
  },

  error: (message: string, error?: Error | any) => {
    logger.error(message, error)
  },

  debug: (message: string, data?: any) => {
    logger.debug(message, data)
  },
}

