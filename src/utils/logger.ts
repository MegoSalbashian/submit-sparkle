type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogOptions {
  component?: string;
  data?: unknown;
}

class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, options?: LogOptions): string {
    const timestamp = new Date().toISOString();
    const component = options?.component ? `[${options.component}]` : '';
    return `${timestamp} ${level.toUpperCase()} ${component} ${message}`;
  }

  private log(level: LogLevel, message: string, options?: LogOptions): void {
    if (!this.isDevelopment) return;

    const formattedMessage = this.formatMessage(level, message, options);
    const data = options?.data;

    switch (level) {
      case 'info':
        console.log(formattedMessage, data || '');
        break;
      case 'warn':
        console.warn(formattedMessage, data || '');
        break;
      case 'error':
        console.error(formattedMessage, data || '');
        break;
      case 'debug':
        console.debug(formattedMessage, data || '');
        break;
    }
  }

  public info(message: string, options?: LogOptions): void {
    this.log('info', message, options);
  }

  public warn(message: string, options?: LogOptions): void {
    this.log('warn', message, options);
  }

  public error(message: string, options?: LogOptions): void {
    this.log('error', message, options);
  }

  public debug(message: string, options?: LogOptions): void {
    this.log('debug', message, options);
  }
}

export const logger = Logger.getInstance();