// Environment Variable Validation System
// Ensures all required environment variables are present and properly typed

import { z } from 'zod';

// Define environment variable schema
const envSchema = z.object({
  // Next.js built-in variables
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_NAME: z.string().default('RF UI Portal'),
  NEXT_PUBLIC_APP_VERSION: z.string().default('1.0.0'),
  
  // RF Hardware Configuration
  RF_HARDWARE_ENDPOINT: z.string().url().optional(),
  RF_HARDWARE_API_KEY: z.string().min(1).optional(),
  RF_HARDWARE_TIMEOUT: z.string().transform(Number).default('5000'),
  
  // Logging Configuration
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  LOG_REMOTE_ENDPOINT: z.string().url().optional(),
  LOG_BATCH_SIZE: z.string().transform(Number).default('10'),
  LOG_FLUSH_INTERVAL: z.string().transform(Number).default('30000'),
  
  // Security Configuration
  SECRET_KEY: z.string().min(32).optional(),
  JWT_SECRET: z.string().min(32).optional(),
  CORS_ORIGIN: z.string().default('*'),
  
  // Database Configuration (if needed)
  DATABASE_URL: z.string().url().optional(),
  DATABASE_POOL_SIZE: z.string().transform(Number).default('10'),
  
  // External Services
  SENTRY_DSN: z.string().url().optional(),
  ANALYTICS_ID: z.string().optional(),
  
  // Feature Flags
  ENABLE_RF_HARDWARE: z.string().transform(val => val === 'true').default('false'),
  ENABLE_NEURAL_INTERFACE: z.string().transform(val => val === 'true').default('false'),
  ENABLE_AUDIT_EXPORT: z.string().transform(val => val === 'true').default('true'),
  ENABLE_REAL_TIME_MONITORING: z.string().transform(val => val === 'true').default('true'),
});

// Type for validated environment variables
export type EnvConfig = z.infer<typeof envSchema>;

// Validation function
export function validateEnv(): EnvConfig {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Environment validation failed:\n${missingVars.join('\n')}`);
    }
    throw error;
  }
}

// Get validated environment configuration
export const env = validateEnv();

// Environment-specific configurations
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

// Feature flags
export const features = {
  rfHardware: env.ENABLE_RF_HARDWARE,
  neuralInterface: env.ENABLE_NEURAL_INTERFACE,
  auditExport: env.ENABLE_AUDIT_EXPORT,
  realTimeMonitoring: env.ENABLE_REAL_TIME_MONITORING,
} as const;

// Security configuration
export const security = {
  corsOrigin: env.CORS_ORIGIN,
  secretKey: env.SECRET_KEY,
  jwtSecret: env.JWT_SECRET,
} as const;

// RF Hardware configuration
export const rfConfig = {
  endpoint: env.RF_HARDWARE_ENDPOINT,
  apiKey: env.RF_HARDWARE_API_KEY,
  timeout: env.RF_HARDWARE_TIMEOUT,
  enabled: env.ENABLE_RF_HARDWARE,
} as const;

// Logging configuration
export const loggingConfig = {
  level: env.LOG_LEVEL,
  remoteEndpoint: env.LOG_REMOTE_ENDPOINT,
  batchSize: env.LOG_BATCH_SIZE,
  flushInterval: env.LOG_FLUSH_INTERVAL,
} as const;

// Database configuration
export const databaseConfig = {
  url: env.DATABASE_URL,
  poolSize: env.DATABASE_POOL_SIZE,
} as const;

// External services configuration
export const externalServices = {
  sentryDsn: env.SENTRY_DSN,
  analyticsId: env.ANALYTICS_ID,
} as const;

// App metadata
export const appConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  version: env.NEXT_PUBLIC_APP_VERSION,
  environment: env.NODE_ENV,
} as const;

// Validation helper for runtime checks
export function validateRequiredEnv(key: keyof EnvConfig): void {
  if (!env[key]) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
}

// Safe environment variable getter with defaults
export function getEnvVar<K extends keyof EnvConfig>(
  key: K,
  defaultValue?: EnvConfig[K]
): EnvConfig[K] {
  return env[key] ?? defaultValue;
}

// Environment variable documentation
export const envDocs = {
  NODE_ENV: 'Node.js environment (development, production, test)',
  NEXT_PUBLIC_APP_NAME: 'Application name displayed in UI',
  NEXT_PUBLIC_APP_VERSION: 'Application version for display',
  RF_HARDWARE_ENDPOINT: 'RF hardware API endpoint URL',
  RF_HARDWARE_API_KEY: 'API key for RF hardware authentication',
  RF_HARDWARE_TIMEOUT: 'Timeout for RF hardware requests (ms)',
  LOG_LEVEL: 'Logging level (debug, info, warn, error)',
  LOG_REMOTE_ENDPOINT: 'Remote logging endpoint URL',
  LOG_BATCH_SIZE: 'Number of logs to batch before sending',
  LOG_FLUSH_INTERVAL: 'Interval for flushing logs (ms)',
  SECRET_KEY: 'Secret key for encryption (min 32 chars)',
  JWT_SECRET: 'JWT signing secret (min 32 chars)',
  CORS_ORIGIN: 'CORS origin configuration',
  DATABASE_URL: 'Database connection URL',
  DATABASE_POOL_SIZE: 'Database connection pool size',
  SENTRY_DSN: 'Sentry error tracking DSN',
  ANALYTICS_ID: 'Analytics tracking ID',
  ENABLE_RF_HARDWARE: 'Enable RF hardware integration (true/false)',
  ENABLE_NEURAL_INTERFACE: 'Enable neural interface features (true/false)',
  ENABLE_AUDIT_EXPORT: 'Enable audit data export (true/false)',
  ENABLE_REAL_TIME_MONITORING: 'Enable real-time monitoring (true/false)',
} as const;

export default env;

