type LogLevel = "debug" | "info" | "warn" | "error"

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  module: string
  data?: any
}

class Logger {
  private module: string
  private static logStorage: LogEntry[] = []
  private static maxLogEntries = 1000

  constructor(module: string) {
    this.module = module
  }

  private log(level: LogLevel, message: string, data?: any): void {
    const timestamp = new Date().toISOString()
    const logEntry: LogEntry = {
      timestamp,
      level,
      message,
      module: this.module,
      data,
    }

    // Store log in memory (with limit)
    Logger.logStorage.push(logEntry)
    if (Logger.logStorage.length > Logger.maxLogEntries) {
      Logger.logStorage.shift()
    }

    // Format console output
    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] [${this.module}] ${message}`

    // Output to console with appropriate level
    switch (level) {
      case "debug":
        console.debug(formattedMessage, data || "")
        break
      case "info":
        console.info(formattedMessage, data || "")
        break
      case "warn":
        console.warn(formattedMessage, data || "")
        break
      case "error":
        console.error(formattedMessage, data || "")
        break
    }

    // In a production environment, you might want to send logs to a service
    if (process.env.NODE_ENV === "production" && level === "error") {
      this.sendToLogService(logEntry)
    }
  }

  private async sendToLogService(logEntry: LogEntry): Promise<void> {
    // This would be implemented to send logs to a service like Sentry, LogRocket, etc.
    // For example:
    // try {
    //   await fetch('/api/logs', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(logEntry),
    //   });
    // } catch (error) {
    //   console.error('Failed to send log to service', error);
    // }
  }

  debug(message: string, data?: any): void {
    this.log("debug", message, data)
  }

  info(message: string, data?: any): void {
    this.log("info", message, data)
  }

  warn(message: string, data?: any): void {
    this.log("warn", message, data)
  }

  error(message: string, error?: Error | any): void {
    let data = error

    // Extract useful information from Error objects
    if (error instanceof Error) {
      data = {
        message: error.message,
        stack: error.stack,
        name: error.name,
      }
    }

    this.log("error", message, data)
  }

  // Get all logs (for debugging or admin panels)
  static getAllLogs(): LogEntry[] {
    return [...Logger.logStorage]
  }

  // Clear logs (for testing or memory management)
  static clearLogs(): void {
    Logger.logStorage = []
  }
}

// Factory function to create loggers
export function createLogger(module: string): Logger {
  return new Logger(module)
}

