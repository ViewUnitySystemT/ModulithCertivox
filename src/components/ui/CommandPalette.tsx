// Professional Command Palette Component
// Provides global search and quick actions with keyboard shortcuts

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Command, 
  Settings, 
  Signal, 
  Shield, 
  Activity,
  Download,
  Upload,
  RefreshCw,
  Zap,
  Monitor,
  Brain,
  Satellite,
  Radio,
  Building2,
  X,
  ArrowRight,
  Clock,
  User
} from 'lucide-react';
import Fuse from 'fuse.js';
import { useUIStore } from '../../stores/uiStore';
import { useRFHardwareStore } from '../../stores/rfHardwareStore';
import { useThemeStore } from '../../stores/themeStore';
import { rfLogger } from '../../lib/logger';

interface CommandItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  keywords: string[];
  action: () => void;
  shortcut?: string;
  disabled?: boolean;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { mode, setMode } = useUIStore();
  const { connectionStatus, startScan, stopScan, exportAuditData } = useRFHardwareStore();
  const { currentTheme, setTheme } = useThemeStore();

  // Define available commands
  const commands: CommandItem[] = [
    // UI Mode Commands
    {
      id: 'mode-classic',
      title: 'Switch to Classic Mode',
      description: 'Full audit view with signal analysis and certifications',
      icon: Monitor,
      category: 'UI Mode',
      keywords: ['classic', 'audit', 'full', 'complete'],
      action: () => {
        setMode('classic');
        rfLogger.info('Switched to Classic UI mode', { mode: 'classic' });
        onClose();
      },
      shortcut: 'Ctrl+1',
    },
    {
      id: 'mode-minimal',
      title: 'Switch to Minimal Mode',
      description: 'Essential controls for limited hardware',
      icon: Activity,
      category: 'UI Mode',
      keywords: ['minimal', 'simple', 'essential', 'basic'],
      action: () => {
        setMode('minimal');
        rfLogger.info('Switched to Minimal UI mode', { mode: 'minimal' });
        onClose();
      },
      shortcut: 'Ctrl+2',
    },
    {
      id: 'mode-hardware',
      title: 'Switch to Hardware Mode',
      description: 'Real-time hardware status and GPIO control',
      icon: Radio,
      category: 'UI Mode',
      keywords: ['hardware', 'gpio', 'real-time', 'status'],
      action: () => {
        setMode('hardware');
        rfLogger.info('Switched to Hardware UI mode', { mode: 'hardware' });
        onClose();
      },
      shortcut: 'Ctrl+3',
    },
    {
      id: 'mode-neuro',
      title: 'Switch to Neuro Mode',
      description: 'EEG/EMG visualization and BCI interface',
      icon: Brain,
      category: 'UI Mode',
      keywords: ['neuro', 'eeg', 'emg', 'bci', 'brain'],
      action: () => {
        setMode('neuro');
        rfLogger.info('Switched to Neuro UI mode', { mode: 'neuro' });
        onClose();
      },
      shortcut: 'Ctrl+4',
    },
    {
      id: 'mode-satellite',
      title: 'Switch to Satellite Mode',
      description: 'Satellite communication and tracking',
      icon: Satellite,
      category: 'UI Mode',
      keywords: ['satellite', 'tracking', 'communication', 'orbit'],
      action: () => {
        setMode('satellite');
        rfLogger.info('Switched to Satellite UI mode', { mode: 'satellite' });
        onClose();
      },
      shortcut: 'Ctrl+5',
    },
    {
      id: 'mode-transceiver',
      title: 'Switch to Transceiver Mode',
      description: 'RF transceiver control and monitoring',
      icon: Radio,
      category: 'UI Mode',
      keywords: ['transceiver', 'rf', 'radio', 'transmit', 'receive'],
      action: () => {
        setMode('transceiver');
        rfLogger.info('Switched to Transceiver UI mode', { mode: 'transceiver' });
        onClose();
      },
      shortcut: 'Ctrl+6',
    },
    {
      id: 'mode-groundstation',
      title: 'Switch to Ground Station Mode',
      description: 'Ground station operations and monitoring',
      icon: Building2,
      category: 'UI Mode',
      keywords: ['ground', 'station', 'operations', 'monitoring'],
      action: () => {
        setMode('groundstation');
        rfLogger.info('Switched to Ground Station UI mode', { mode: 'groundstation' });
        onClose();
      },
      shortcut: 'Ctrl+7',
    },

    // RF Operations
    {
      id: 'scan-start',
      title: 'Start RF Signal Scan',
      description: 'Begin scanning for RF signals',
      icon: Search,
      category: 'RF Operations',
      keywords: ['scan', 'start', 'signal', 'rf', 'search'],
      action: () => {
        startScan();
        rfLogger.command('Started RF signal scan', { action: 'scan_start' });
        onClose();
      },
      shortcut: 'Ctrl+S',
      disabled: !connectionStatus,
    },
    {
      id: 'scan-stop',
      title: 'Stop RF Signal Scan',
      description: 'Stop current RF signal scan',
      icon: X,
      category: 'RF Operations',
      keywords: ['scan', 'stop', 'signal', 'rf', 'halt'],
      action: () => {
        stopScan();
        rfLogger.command('Stopped RF signal scan', { action: 'scan_stop' });
        onClose();
      },
      shortcut: 'Ctrl+Shift+S',
    },
    {
      id: 'export-audit',
      title: 'Export Audit Data',
      description: 'Export audit trail and system logs',
      icon: Download,
      category: 'RF Operations',
      keywords: ['export', 'audit', 'data', 'logs', 'download'],
      action: () => {
        exportAuditData();
        rfLogger.audit('Exported audit data', { action: 'export_audit' });
        onClose();
      },
      shortcut: 'Ctrl+E',
    },

    // Theme Commands
    {
      id: 'theme-light',
      title: 'Switch to Light Theme',
      description: 'Enable light color scheme',
      icon: Settings,
      category: 'Theme',
      keywords: ['theme', 'light', 'bright', 'day'],
      action: () => {
        setTheme('light');
        rfLogger.info('Switched to light theme', { theme: 'light' });
        onClose();
      },
    },
    {
      id: 'theme-dark',
      title: 'Switch to Dark Theme',
      description: 'Enable dark color scheme',
      icon: Settings,
      category: 'Theme',
      keywords: ['theme', 'dark', 'night', 'dim'],
      action: () => {
        setTheme('dark');
        rfLogger.info('Switched to dark theme', { theme: 'dark' });
        onClose();
      },
    },
    {
      id: 'theme-legacy',
      title: 'Switch to Legacy Theme',
      description: 'Enable legacy terminal-style theme',
      icon: Settings,
      category: 'Theme',
      keywords: ['theme', 'legacy', 'terminal', 'retro'],
      action: () => {
        setTheme('legacy');
        rfLogger.info('Switched to legacy theme', { theme: 'legacy' });
        onClose();
      },
    },

    // System Commands
    {
      id: 'refresh-data',
      title: 'Refresh System Data',
      description: 'Reload all system data and status',
      icon: RefreshCw,
      category: 'System',
      keywords: ['refresh', 'reload', 'update', 'data'],
      action: () => {
        window.location.reload();
        rfLogger.info('Refreshed system data', { action: 'refresh' });
        onClose();
      },
      shortcut: 'Ctrl+R',
    },
  ];

  // Setup Fuse.js for fuzzy search
  const fuse = new Fuse(commands, {
    keys: ['title', 'description', 'keywords', 'category'],
    threshold: 0.3,
    includeScore: true,
  });

  // Filter commands based on query
  const filteredCommands = query.trim() 
    ? fuse.search(query).map(result => result.item)
    : commands;

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex] && !filteredCommands[selectedIndex].disabled) {
          filteredCommands[selectedIndex].action();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  // Handle global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Open command palette with Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          setQuery('');
          setSelectedIndex(0);
          // Trigger open - this would be handled by parent component
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose]);

  // Handle command palette keyboard events
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search commands, modes, or actions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none"
                autoFocus
              />
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">↑↓</kbd>
                <span>navigate</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">↵</kbd>
                <span>select</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">esc</kbd>
                <span>close</span>
              </div>
            </div>

            {/* Commands List */}
            <div className="max-h-96 overflow-y-auto">
              {Object.keys(groupedCommands).length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No commands found</p>
                  <p className="text-sm">Try a different search term</p>
                </div>
              ) : (
                Object.entries(groupedCommands).map(([category, categoryCommands]) => (
                  <div key={category} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                      {category}
                    </div>
                    {categoryCommands.map((command, index) => {
                      const globalIndex = filteredCommands.indexOf(command);
                      const isSelected = globalIndex === selectedIndex;
                      
                      return (
                        <button
                          key={command.id}
                          onClick={() => !command.disabled && command.action()}
                          disabled={command.disabled}
                          className={`w-full px-4 py-3 text-left flex items-center space-x-3 transition-colors ${
                            isSelected 
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-900 dark:text-white'
                          } ${command.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <command.icon className={`w-5 h-5 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium">{command.title}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {command.description}
                            </div>
                          </div>
                          {command.shortcut && (
                            <div className="flex items-center space-x-1 text-xs text-gray-400 dark:text-gray-500">
                              {command.shortcut.split('+').map((key, i) => (
                                <span key={i}>
                                  <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                                    {key}
                                  </kbd>
                                  {i < command.shortcut.split('+').length - 1 && <span className="mx-1">+</span>}
                                </span>
                              ))}
                            </div>
                          )}
                          {isSelected && (
                            <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <Command className="w-3 h-3" />
                    <span>Command Palette</span>
                  </span>
                  <span>•</span>
                  <span>{filteredCommands.length} commands</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Press</span>
                  <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">Ctrl+K</kbd>
                  <span>to open</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
