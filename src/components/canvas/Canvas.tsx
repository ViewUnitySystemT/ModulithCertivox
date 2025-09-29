import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUIStore } from '../../stores/uiStore';
import { useRFHardwareStore } from '../../stores/rfHardwareStore';
import ClassicUI from '../variants/ClassicUI';
import MinimalUI from '../variants/MinimalUI';
import HardwareUI from '../variants/HardwareUI';
import NeuroUI from '../variants/NeuroUI';
import SatelliteUI from '../variants/SatelliteUI';
import AuditUI from '../variants/AuditUI';
import TransceiverUI from '../variants/TransceiverUI';
import GroundStationUI from '../variants/GroundStationUI';
import ModulithFunkCore from '../variants/ModulithFunkCore';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function Canvas() {
  const { mode } = useUIStore();
  const { connectionStatus, signalData } = useRFHardwareStore();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [mode]);

  const renderUI = () => {
    if (isTransitioning) {
      return <LoadingSpinner />;
    }

    try {
      switch (mode) {
        case 'minimal':
          return <MinimalUI />;
        case 'hardware':
          return <HardwareUI />;
        case 'neuro':
          return <NeuroUI />;
        case 'satellite':
          return <SatelliteUI />;
        case 'audit':
          return <AuditUI />;
        case 'transceiver':
          return <TransceiverUI />;
        case 'groundstation':
          return <GroundStationUI />;
        case 'funkcore':
          return <ModulithFunkCore />;
        default:
          return <ClassicUI />;
      }
    } catch (error) {
      console.error('Error rendering UI component:', error);
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              UI Component Error
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Switching to Classic UI mode
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <motion.div
      key={mode}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-full"
    >
      {/* Mode Indicator */}
      <div className="mb-4 flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${
          connectionStatus 
            ? 'bg-green-400 animate-pulse' 
            : 'bg-red-400'
        }`} />
        <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
          {mode} Mode {connectionStatus ? '- Live Data' : '- Offline'}
        </span>
      </div>

      {/* Dynamic UI Container */}
      <div className="relative">
        {renderUI()}
        
        {/* Background Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
          {mode === 'hardware' && (
            <div className="absolute top-4 right-4 text-xs text-gray-500">
              <div className="grid grid-cols-2 gap-1">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-current rounded animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
