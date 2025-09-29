// RF UI Portal - Type Definitions
// All interfaces and types for the professional RF communication system

export interface SignalData {
  frequency: number;
  power: number;
  bandwidth: number;
  modulation: string;
  snr: number;
  timestamp: number;
  source?: string;
  quality?: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface HardwareData {
  cpuUsage: number;
  memoryUsage: number;
  temperature: number;
  voltage: number;
  current: number;
  gpioState: boolean[];
  fans: number[];
  voltages?: {
    vcore: number;
    v5: number;
    v12: number;
  };
}

export interface AuditData {
  id: string;
  action: string;
  timestamp: number;
  user: string;
  result: 'success' | 'warning' | 'error';
  details?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  sessionId?: string;
}

export interface NeuralData {
  timestamp: number;
  eeg: number[];
  emg: number[];
  eyeTracking: { x: number; y: number };
  attention: number;
  meditation: number;
  alpha?: number;
  beta?: number;
  theta?: number;
  delta?: number;
  gamma?: number;
}

export interface UITheme {
  name: string;
  colors: ThemeColors;
  borderRadius: 'small' | 'medium' | 'large';
  spacing: 'compact' | 'comfortable' | 'spacious';
  animations: 'minimal' | 'comfortable' | 'enhanced';
  accessibility: AccessibilitySettings;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
}

export interface UIVariant {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  features: string[];
  limitations?: string[];
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'system' | 'rf-response' | 'error';
  content: string;
  timestamp: number;
  metadata?: {
    frequency?: number;
    power?: number;
    command?: string;
    channel?: number;
  };
}

export interface RFCommand {
  id: string;
  command: string;
  parameters: Record<string, any>;
  result?: any;
  timestamp: number;
  userId: string;
}

export interface GPIOPin {
  id: number;
  name: string;
  state: boolean;
  mode: 'input' | 'output';
  voltage?: number;
  current?: number;
}

export interface NetworkConnection {
  id: string;
  type: 'rf' | 'bluetooth' | 'wifi' | 'ethernet' | 'usb';
  status: 'connected' | 'disconnected' | 'error';
  signalStrength?: number;
  latency?: number;
  bandwidth?: number;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  valid: boolean;
  expires: Date;
  type: 'rf-hardware' | 'signal-integrity' | 'security' | 'compliance';
  details: Record<string, any>;
}

export interface PerformanceMetrics {
  cpu: {
    usage: number;
    temperature: number;
    cores: number[];
  };
  memory: {
    usage: number;
    total: number;
    available: number;
  };
  network: {
    throughput: number;
    latency: number;
    errors: number;
  };
  rf: {
    signalStrength: number;
    noiseFloor: number;
    snr: number;
  };
}

export interface ExportOptions {
  format: 'json' | 'csv' | 'pdf' | 'xml';
  includeMetadata: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  filters?: Record<string, any>;
}

export interface NotificationSettings {
  enabled: boolean;
  types: {
    hardware: boolean;
    signal: boolean;
    security: boolean;
    performance: boolean;
  };
  channels: {
    inApp: boolean;
    email: boolean;
    sms: boolean;
  };
}

// RF-Specific Types
export type FrequencyBand = 'LF' | 'MF' | 'HF' | 'VHF' | 'UHF' | 'SHF' | 'EHF';
export type ModulationType = 'AM' | 'FM' | 'PM' | 'ASK' | 'FSK' | 'PSK' | 'QAM';
export type PowerLevel = 'microwatt' | 'milliwatt' | 'watt' | 'kilowatt';

export interface RFConfiguration {
  frequency: number;
  bandwidth: number;
  modulation: ModulationType;
  powerLevel: PowerLevel;
  antenna?: {
    gain: number;
    pattern: string;
    polarization: 'horizontal' | 'vertical' | 'circular';
  };
}

// Hardware Interface Types
export interface HardwareInterface {
  id: string;
  name: string;
  type: 'serial' | 'usb' | 'ethernet' | 'gpio' | 'spi' | 'i2c';
  connected: boolean;
  drivers: string[];
  capabilities: string[];
}

export interface SensorReading {
  id: string;
  value: number;
  unit: string;
  timestamp: number;
  sensor: string;
  accuracy?: number;
}

// UI State Types
export interface AppState {
  ui: UIState;
  rf: RFHardwareState;
  theme: ThemeState;
  chat: ChatState;
}

export interface UIState {
  mode: UIMode;
  sidebarOpen: boolean;
  fullscreen: boolean;
  animationsEnabled: boolean;
}

export interface RFHardwareState extends SignalData, HardwareData {
  connectionStatus: boolean;
  auditData: AuditData[];
  isScanning: boolean;
  selectedFrequency: number;
}

export interface ThemeState {
  currentTheme: Theme;
  colorScheme: ColorScheme;
  customTheme?: ThemeConfig;
  darkMode: boolean;
}

export interface ChatState {
  messages: ChatMessage[];
  isRecording: boolean;
  commandHistory: string[];
}

// Enums
export enum UIMode {
  CLASSIC = 'classic',
  MINIMAL = 'minimal', 
  HARDWARE = 'hardware',
  NEURO = 'neuro',
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  LEGACY = 'legacy',
  CUSTOM = 'custom',
}

export enum ColorScheme {
  BLUE = 'blue',
  GREEN = 'green',
  PURPLE = 'purple',
  ORANGE = 'orange',
  RED = 'red',
}

export enum MessageType {
  USER = 'user',
  SYSTEM = 'system',
  RF_RESPONSE = 'rf-response',
  ERROR = 'error',
}

export enum ScanStatus {
  IDLE = 'idle',
  SCANNING = 'scanning',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ERROR = 'error',
}

// API Types
export interface APIResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: number;
  requestId: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: number;
}

// Event Types
export interface RFEvent {
  type: 'signal-change' | 'connection-change' | 'error' | 'scan-complete';
  data: any;
  timestamp: number;
  source: string;
}

export interface CommandEvent extends RFEvent {
  command: string;
  parameters: Record<string, any>;
  result?: any;
}

// Storage Types
export interface PersistentData {
  userPreferences: UserPreferences;
  uiState: Partial<UIState>;
  rfConfiguration: Partial<RFConfiguration>;
  themeSettings: Partial<ThemeSettings>;
  commandHistory: string[];
  auditLog: AuditData[];
}

export interface UserPreferences {
  defaultMode: UIMode;
  autoConnect: boolean;
  notifications: NotificationSettings;
  shortcuts: Record<string, string>;
  language: 'en' | 'de' | 'fr' | 'es';
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K>] & Partial[Pick<T, K>;
export type Required<T, K extends keyof T> = T & Required[Pick<T, K>;
export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };

// React Component Types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  'data-testid'?: string;
}

export interface AnimationProps {
  duration?: number;
  delay?: number;
  easing?: string;
  enabled?: boolean;
}

export interface AccessibilityProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-hidden'?: boolean;
为 'role'?: 'button' | 'link' | 'tab' | 'menuitem' | 'dialog';
  'tabIndex'?: number;
}

// Make these available globally for TypeScript
declare global {
  type UITypes = typeof import('./index');
  
  interface Window {
    rfPortalAPI: {
      connect: () => Promise<boolean>;
      disconnect: () => void;
      sendCommand: (command: string) => Promise<any>;
      getStatus: () => Promise<PerformanceMetrics>;
    };
  }
}
