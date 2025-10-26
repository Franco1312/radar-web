/**
 * Simple logger utility
 */

type LogLevel = "info" | "warn" | "error" | "debug";

class Logger {
  private prefix = "[radar-web]";

  private log(level: LogLevel, message: string, ...args: unknown[]): void {
    const timestamp = new Date().toISOString();
    const logMessage = `${this.prefix} [${level.toUpperCase()}] ${message}`;
    
    switch (level) {
      case "info":
        console.info(logMessage, ...args);
        break;
      case "warn":
        console.warn(logMessage, ...args);
        break;
      case "error":
        console.error(logMessage, ...args);
        break;
      case "debug":
        if (process.env.NODE_ENV === "development") {
          console.debug(logMessage, ...args);
        }
        break;
    }
  }

  info(message: string, ...args: unknown[]): void {
    this.log("info", message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.log("warn", message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this.log("error", message, ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    this.log("debug", message, ...args);
  }
}

export const logger = new Logger();
