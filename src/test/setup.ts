// Test setup file for Vitest
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js router
beforeAll(() => {
  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });

  // Mock sessionStorage
  const sessionStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
  });

  // Mock fetch
  global.fetch = vi.fn();
});

afterAll(() => {
  vi.clearAllMocks();
});

// Mock environment variables
vi.mock('../lib/env', () => ({
  env: {
    NODE_ENV: 'test',
    NEXT_PUBLIC_APP_NAME: 'RF UI Portal Test',
    NEXT_PUBLIC_APP_VERSION: '1.0.0-test',
    LOG_LEVEL: 'error',
    ENABLE_RF_HARDWARE: false,
    ENABLE_NEURAL_INTERFACE: false,
    ENABLE_AUDIT_EXPORT: true,
    ENABLE_REAL_TIME_MONITORING: false,
  },
  isDevelopment: false,
  isProduction: false,
  isTest: true,
  features: {
    rfHardware: false,
    neuralInterface: false,
    auditExport: true,
    realTimeMonitoring: false,
  },
}));

// Mock logger to prevent console output during tests
vi.mock('../lib/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
  rfLogger: {
    signal: vi.fn(),
    hardware: vi.fn(),
    audit: vi.fn(),
    command: vi.fn(),
    error: vi.fn(),
  },
  perfLogger: {
    start: vi.fn(() => 'test-id'),
    end: vi.fn(),
  },
  errorLogger: {
    componentError: vi.fn(),
    apiError: vi.fn(),
  },
}));

