import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'legacy' | 'custom';
export type ColorScheme = 'blue' | 'green' | 'purple' | 'orange' | 'red';

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

export interface ThemeConfig {
  name: string;
  colors: ThemeColors;
  borderRadius: 'small' | 'medium' | 'large';
  spacing: 'compact' | 'comfortable' | 'spacious';
  animations: 'minimal' | 'comfortable' | 'enhanced';
  accessibility: {
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
    reducedMotion: boolean;
  };
}

export interface ThemeState {
  currentTheme: Theme;
  colorScheme: ColorScheme;
  customTheme?: ThemeConfig;
  darkMode: boolean;
  
  // Actions
  setTheme: (theme: Theme) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  setCustomTheme: (config: ThemeConfig) => void;
  toggleDarkMode: () => void;
  resetToDefaults: () => void;
  
  // Getters
  getCurrentThemeConfig: () => ThemeConfig;
  applyThemeToDocument: () => void;
}

const lightThemeColors: ThemeColors = {
  primary: '#3b82f6',
  secondary: '#6b7280',
  background: '#ffffff',
  surface: '#f9fafb',
  text: '#111827',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  accent: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

const darkThemeColors: ThemeColors = {
  primary: '#60a5fa',
  secondary: '#9ca3af',
  background: '#111827',
  surface: '#1f2937',
  text: '#f9fafb',
  textSecondary: '#d1d5db',
  border: '#374151',
  accent: '#a78bfa',
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
};

const legacyThemeColors: ThemeColors = {
  primary: '#00ff88',
  secondary: '#6b7280',
  background: '#0f1419',
  surface: '#1e2932',
  text: '#00ff88',
  textSecondary: '#64748b',
  border: '#334155',
  accent: '#00d4aa',
  success: '#00ff88',
  warning: '#ffa500',
  error: '#ff4444',
};

const themeConfigs: Record<Theme, ThemeConfig> = {
  light: {
    name: 'Light',
    colors: lightThemeColors,
    borderRadius: 'medium',
    spacing: 'comfortable',
    animations: 'comfortable',
    accessibility: {
      highContrast: false,
      fontSize: 'medium',
      reducedMotion: false,
    },
  },
  dark: {
    name: 'Dark',
    colors: darkThemeColors,
    borderRadius: 'medium',
    spacing: 'comfortable',
    animations: 'comfortable',
    accessibility: {
      highContrast: false,
      fontSize: 'medium',
      reducedMotion: false,
    },
  },
  legacy: {
    name: 'Legacy',
    colors: legacyThemeColors,
    borderRadius: 'small',
    spacing: 'compact',
    animations: 'minimal',
    accessibility: {
      highContrast: true,
      fontSize: 'medium',
      reducedMotion: false,
    },
  },
  custom: {
    name: 'Custom',
    colors: lightThemeColors,
    borderRadius: 'medium',
    spacing: 'comfortable',
    animations: 'comfortable',
    accessibility: {
      highContrast: false,
      fontSize: 'medium',
      reducedMotion: false,
    },
  },
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: 'dark',
      colorScheme: 'blue',
      darkMode: true,

      setTheme: (theme) => {
        set({ currentTheme: theme, darkMode: theme === 'dark' || theme === 'legacy' });
        get().applyThemeToDocument();
      },

      setColorScheme: (scheme) => {
        set({ colorScheme: scheme });
        get().applyThemeToDocument();
      },

      setCustomTheme: (config) => {
        set({ 
          customTheme: config,
          currentTheme: 'custom',
        });
        get().applyThemeToDocument();
      },

      toggleDarkMode: () => {
        set((state) => ({ 
          darkMode: !state.darkMode,
          currentTheme: !state.darkMode ? 'dark' : 'light',
        }));
        get().applyThemeToDocument();
      },

      resetToDefaults: () => {
        set({
          currentTheme: 'dark',
          colorScheme: 'blue',
          darkMode: true,
          customTheme: undefined,
        });
        get().applyThemeToDocument();
      },

      getCurrentThemeConfig: () => {
        const { currentTheme, customTheme } = get();
        if (currentTheme === 'custom' && customTheme) {
          return customTheme;
        }
        return themeConfigs[currentTheme] || themeConfigs.dark;
      },

      applyThemeToDocument: () => {
        if (typeof document === 'undefined') return;
        
        const { getCurrentThemeConfig, darkMode } = get();
        const config = getCurrentThemeConfig();
        
        const root = document.documentElement;
        
        // Apply dark/light mode
        root.classList.toggle('dark', darkMode);
        
        // Apply theme colors as CSS custom properties
        Object.entries(config.colors).forEach(([key, value]) => {
          root.style.setProperty(`--color-${key}`, value);
        });
        
        // Apply accessibility settings
        const accessibilityClass = `a11y-${config.accessibility.fontSize}-${config.accessibility.highContrast ? 'high-contrast' : 'normal'}`;
        root.className = root.className.replace(/a11y-\w+-\w+/, '');
        root.classList.add(accessibilityClass);
        
        // Apply reduced motion if enabled
        if (config.accessibility.reducedMotion) {
          root.style.setProperty('--animation-duration', '0.1ms');
        } else {
          root.style.removeProperty('--animation-duration');
        }
      },
    }),
    {
      name: 'rf-theme-store',
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        if (version < 1) {
          return { 
            ...(persistedState as Record<string, unknown>), 
            version: 1,
            accessibility: {
              highContrast: false,
              fontSize: 'medium',
              reducedMotion: false,
            },
          };
        }
        return persistedState;
      },
    }
  )
);

// Apply theme on store initialization
if (typeof window !== 'undefined') {
  const store = useThemeStore.getState();
  store.applyThemeToDocument();
}

// Legacy theme utilities for compatibility
export const useLegacyTheme = () => {
  const { setTheme, currentTheme } = useThemeStore();
  
  const activateLegacyTheme = () => {
    setTheme('legacy');
  };
  
  const isLegacyActive = currentTheme === 'legacy';
  
  return {
    activateLegacyTheme,
    isLegacyActive,
  };
};
