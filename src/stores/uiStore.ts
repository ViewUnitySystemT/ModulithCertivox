import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UIState {
  mode: 'classic' | 'minimal' | 'hardware' | 'neuro' | 'satellite' | 'audit' | 'transceiver' | 'groundstation';
  sidebarOpen: boolean;
  fullscreen: boolean;
  animationsEnabled: boolean;
  setMode: (mode: UIState['mode']) => void;
  toggleSidebar: () => void;
  toggleFullscreen: () => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  resetToDefaults: () => void;
}

const getDefaultState = (): Partial<UIState> => ({
  mode: 'classic',
  sidebarOpen: true,
  fullscreen: false,
  animationsEnabled: true,
});

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      ...getDefaultState(),
      
      setMode: (mode) => set({ mode }),
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      toggleFullscreen: () => set((state) => ({ fullscreen: !state.fullscreen })),
      
      setAnimationsEnabled: (animationsEnabled) => set({ animationsEnabled }),
      
      resetToDefaults: () => set(getDefaultState()),
    }),
    {
      name: 'rf-ui-store',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        // Migration logic for future store updates
        if (version < 1) {
          return { ...persistedState, version: 1 };
        }
        return persistedState;
      },
    }
  )
);

// Selectors for frequently used state
export const useCurrentMode = () => useUIStore((state) => state.mode);
export const useSidebarState = () => useUIStore((state) => ({
  sidebarOpen: state.sidebarOpen,
  toggleSidebar: state.toggleSidebar,
}));

// Mode-specific settings
export interface ModeSettings {
  classic: {
    enableAdvancedAnalysis: boolean;
    showCertificationPanel: boolean;
    autoExportEnabled: boolean;
  };
  minimal: {
    emergencyStopEnabled: boolean;
    quickActionsVisible: boolean;
    compactView: boolean;
  };
  hardware: {
    realtimeMonitoringEnabled: boolean;
    gpioControlEnabled: boolean;
    hardwareHealthAlerts: boolean;
  };
  neuro: {
    recordingEnabled: boolean;
    bciMode: 'passive' | 'active';
    neuralDataLogging: boolean;
  };
}

export const useModeSettings = () => {
  const mode = useCurrentMode();
  // This would be extended with actual mode-specific settings
  return {
    mode,
    settings: {} as ModeSettings[keyof ModeSettings],
  };
};
