// Professional Logging System for RF UI Portal
// Replaces console.* statements with structured logging

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  context?: string;
  metadata?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
  requestId?: string;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
  batchSize?: number;
  flushInterval?: number;
}

class Logger {
  private config: LoggerConfig;
  private logBuffer: LogEntry[] = [];
  private flushTimer?: NodeJS.Timeout;

  constructor(config: LoggerConfig) {
    this.config = config;
    
    if (config.enableRemote && config.flushInterval) {
      this.startFlushTimer();
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: string,
    metadata?: Record<string, unknown>
  ): LogEntry {
    return {
      level,
      message,
      timestamp: Date.now(),
      context,
      metadata,
      userId: this.getCurrentUserId(),
      sessionId: this.getCurrentSessionId(),
      requestId: this.getCurrentRequestId(),
    };
  }

  private getCurrentUserId(): string | undefined {
    // In a real app, this would come from auth context
    return typeof window !== 'undefined' ? 
      localStorage.getItem('rf-portal-user-id') || undefined : undefined;
  }

  private getCurrentSessionId(): string | undefined {
    // In a real app, this would come from session management
    return typeof window !== 'undefined' ? 
      sessionStorage.getItem('rf-portal-session-id') || undefined : undefined;
  }

  private getCurrentRequestId(): string | undefined {
    // In a real app, this would come from request context
    return undefined;
  }

  private formatMessage(entry: LogEntry): string {
    const levelName = LogLevel[entry.level];
    const timestamp = new Date(entry.timestamp).toISOString();
    const context = entry.context ? `[${entry.context}]` : '';
    const metadata = entry.metadata ? ` ${JSON.stringify(entry.metadata)}` : '';
    
    return `${timestamp} ${levelName}${context}: ${entry.message}${metadata}`;
  }

  private log(level: LogLevel, message: string, context?: string, metadata?: Record<string, unknown>): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, message, context, metadata);

    if (this.config.enableConsole) {
      const formattedMessage = this.formatMessage(entry);
      
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formattedMessage);
          break;
        case LogLevel.INFO:
          console.info(formattedMessage);
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage);
          break;
        case LogLevel.ERROR:
          console.error(formattedMessage);
          break;
      }
    }

    if (this.config.enableRemote) {
      this.logBuffer.push(entry);
      
      if (this.logBuffer.length >= (this.config.batchSize || 10)) {
        this.flush();
      }
    }
  }

  private async flush(): Promise<void> {
    if (this.logBuffer.length === 0 || !this.config.remoteEndpoint) return;

    const logsToSend = [...this.logBuffer];
    this.logBuffer = [];

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logs: logsToSend,
          timestamp: Date.now(),
        }),
      });
    } catch (error) {
      // Fallback to console if remote logging fails
      console.error('Failed to send logs to remote endpoint:', error);
      logsToSend.forEach(entry => {
        console.log(this.formatMessage(entry));
      });
    }
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval || 30000);
  }

  public debug(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context, metadata);
  }

  public info(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context, metadata);
  }

  public warn(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context, metadata);
  }

  public error(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, context, metadata);
  }

  public destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush();
  }
}

// Create default logger instance
const defaultConfig: LoggerConfig = {
  level: process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG,
  enableConsole: true,
  enableRemote: false,
  batchSize: 10,
  flushInterval: 30000,
};

export const logger = new Logger(defaultConfig);

// RF-specific logging utilities
export const rfLogger = {
  signal: (message: string, metadata?: Record<string, unknown>) => 
    logger.info(message, 'RF-SIGNAL', metadata),
  
  hardware: (message: string, metadata?: Record<string, unknown>) => 
    logger.info(message, 'RF-HARDWARE', metadata),
  
  audit: (message: string, metadata?: Record<string, unknown>) => 
    logger.info(message, 'RF-AUDIT', metadata),
  
  command: (message: string, metadata?: Record<string, unknown>) => 
    logger.info(message, 'RF-COMMAND', metadata),
  
  error: (message: string, metadata?: Record<string, unknown>) => 
    logger.error(message, 'RF-ERROR', metadata),
  
  info: (message: string, metadata?: Record<string, unknown>) => 
    logger.info(message, 'RF-INFO', metadata),
  
  debug: (message: string, metadata?: Record<string, unknown>) => 
    logger.debug(message, 'RF-DEBUG', metadata),
  
  warn: (message: string, metadata?: Record<string, unknown>) => 
    logger.warn(message, 'RF-WARN', metadata),
};

// Performance logging
export const perfLogger = {
  start: (operation: string): string => {
    const id = `perf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    logger.debug(`Starting ${operation}`, 'PERFORMANCE', { operation, id });
    return id;
  },
  
  end: (id: string, operation: string, metadata?: Record<string, unknown>): void => {
    logger.debug(`Completed ${operation}`, 'PERFORMANCE', { operation, id, ...metadata });
  },
};

// Error boundary logging
export const errorLogger = {
  componentError: (error: Error, componentName: string, props?: Record<string, unknown>): void => {
    logger.error(`Component error in ${componentName}`, 'COMPONENT-ERROR', {
      error: error.message,
      stack: error.stack,
      componentName,
      props,
    });
  },
  
  apiError: (error: Error, endpoint: string, request?: Record<string, unknown>): void => {
    logger.error(`API error for ${endpoint}`, 'API-ERROR', {
      error: error.message,
      stack: error.stack,
      endpoint,
      request,
    });
  },
};

export default logger;

