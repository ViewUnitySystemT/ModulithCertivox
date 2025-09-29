import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface SignalData {
  frequency: number;
  power: number;
  bandwidth: number;
  modulation: string;
  snr: number;
  timestamp: number;
}

export interface HardwareData {
  cpuUsage: number;
  memoryUsage: number;
  temperature: number;
  voltage: number;
  current: number;
  gpioState: boolean[];
}

export interface AuditData {
  id: string;
  action: string;
  timestamp: number;
  user: string;
  result: 'success' | 'warning' | 'error';
  details?: string;
}

export interface RFHardwareState {
  connectionStatus: boolean;
  signalData: SignalData;
  hardwareData: HardwareData;
  auditData: AuditData[];
  isScanning: boolean;
  selectedFrequency: number;
  
  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  startScan: () => Promise<void>;
  stopScan: () => void;
  setFrequency: (frequency: number) => void;
  addAuditEntry: (entry: Omit<AuditData, 'id' | 'timestamp'>) => void;
  exportAuditData: () => void;
  
  // Real-time updates
  updateSignalData: (data: Partial<SignalData>) => void;
  updateHardwareData: (data: Partial<HardwareData>) => void;
}

const initialState = {
  connectionStatus: false,
  signalData: {
    frequency: 2400000000, // 2.4 GHz
    power: -45,
    bandwidth: 20000000, // 20 MHz
    modulation: 'QPSK',
    snr: 12.5,
    timestamp: Date.now(),
  },
  hardwareData: {
    cpuUsage: 23,
    memoryUsage: 68,
    temperature: 42,
    voltage: 3.3,
    current: 150,
    gpioState: Array.from({ length: 16 }, (_, i) => i % 2 === 0),
  },
  auditData: [
    {
      id: '1',
      action: 'System initialization',
      timestamp: Date.now() - 300000,
      user: 'system',
      result: 'success',
    },
    {
      id: '2',
      action: 'RF module calibration',
      timestamp: Date.now() - 180000,
      user: 'admin',
      result: 'success',
    },
  ],
  isScanning: false,
  selectedFrequency: 2400000000,
};

export const useRFHardwareStore = create<RFHardwareState>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    connect: async () => {
      try {
        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        set({ connectionStatus: true });
        get().addAuditEntry({
          action: 'RF hardware connection established',
          user: 'system',
          result: 'success',
        });
      } catch (error) {
        get().addAuditEntry({
          action: 'RF hardware connection failed',
          user: 'system',
          result: 'error',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    },

    disconnect: () => {
      set({ connectionStatus: false });
      get().addAuditEntry({
        action: 'RF hardware disconnected',
        user: 'system',
        result: 'success',
      });
    },

    startScan: async () => {
      const { isScanning } = get();
      if (isScanning) return;

      set({ isScanning: true });
      get().addAuditEntry({
        action: 'RF signal scan initiated',
        user: 'user',
        result: 'success',
      });

      // Simulate scanning process
      setTimeout(() => {
        get().stopScan();
      }, 10000);
    },

    stopScan: () => {
      set({ isScanning: false });
      get().addAuditEntry({
        action: 'RF signal scan completed',
        user: 'user',
        result: 'success',
      });
    },

    setFrequency: (frequency: number) => {
      set({ selectedFrequency: frequency });
      get().addAuditEntry({
        action: `Frequency changed to ${frequency / 1000000} MHz`,
        user: 'user',
        result: 'success',
      });
    },

    addAuditEntry: (entry) => {
      const newEntry: AuditData = {
        ...entry,
        id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
      };
      
      set((state) => ({
        auditData: [newEntry, ...state.auditData].slice(0, 100), // Keep only last 100 entries
      }));
    },

    exportAuditData: () => {
      const { auditData } = get();
      const dataStr = JSON.stringify(auditData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `rf-audit-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      get().addAuditEntry({
        action: 'Audit data exported',
        user: 'user',
        result: 'success',
      });
    },

    updateSignalData: (data) => {
      set((state) => ({
        signalData: { 
          ...state.signalData, 
          ...data, 
          timestamp: Date.now() 
        },
      }));
    },

    updateHardwareData: (data) => {
      set((state) => ({
        hardwareData: { 
          ...state.hardwareData, 
          ...data 
        },
      }));
    },
  }))
);

// Real-time data simulation (for development)
if (typeof window !== 'undefined') {
  const store = useRFHardwareStore.getState();
  
  // Simulate real-time data updates
  setInterval(() => {
    const { connectionStatus, isScanning } = store;
    
    if (connectionStatus) {
      // Simulate signal data variations
      const randomVariation = () => (Math.random() - 0.5) * 10;
      
      store.updateSignalData({
        power: -50 + randomVariation(),
        snr: 10 + Math.random() * 10,
      });
      
      store.updateHardwareData({
        cpuUsage: 20 + Math.random() * 20,
        memoryUsage: 60 + Math.random() * 20,
        temperature: 40 + Math.random() * 10,
        current: 140 + Math.random() * 20,
      });
    }
  }, 1000);
}

// Selectors
export const useConnectionStatus = () => 
  useRFHardwareStore((state) => state.connectionStatus);

export const useSignalData = () => 
  useRFHardwareStore((state) => state.signalData);

export const useHardwareData = () => 
  useRFHardwareStore((state) => state.hardwareData);

export const useAuditData = () => 
  useRFHardwareStore((state) => state.auditData);

export const useScanStatus = () => 
  useRFHardwareStore((state) => state.isScanning);
