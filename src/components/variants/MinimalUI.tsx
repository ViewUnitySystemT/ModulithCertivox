import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Power, 
  Signal, 
  Volume2, 
  Wifi, 
  Bluetooth,
  Battery,
  Settings,
  Zap
} from 'lucide-react';
import { useRFHardwareStore } from '../../stores/rfHardwareStore';

export default function MinimalUI() {
  const { signalData, connectionStatus } = useRFHardwareStore();
  const [isActive, setIsActive] = useState(false);
  const [signalLevel, setSignalLevel] = useState(-45);

  const toggleSystem = () => {
    setIsActive(!isActive);
  };

  const handleSignalChange = (value: number) => {
    setSignalLevel(value);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4"
        >
          <Signal className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Minimal RF Control
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Essential controls for embedded systems
        </p>
      </div>

      {/* Main Control */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Power Control */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Power className="w-5 h-5 mr-2 text-blue-600" />
                System Control
              </h3>
              
              <div className="text-center mb-4">
                <motion.button
                  onClick={toggleSystem}
                  className={`w-24 h-24 rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/50' 
                      : 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50'
                  }`}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Power className={`w-8 h-8 mx-auto ${isActive ? 'text-white' : 'text-white'}`} />
                </motion.button>
                
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {isActive ? 'System Active' : 'System Offline'}
                </p>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="grid grid-cols-3 gap-3">
              <div className={`p-3 rounded-lg text-center ${connectionStatus ? 'bg-green-50 dark:bg-green-900' : 'bg-red-50 dark:bg-red-900'}`}>
                <Wifi className={`w-6 h-6 mx-auto mb-1 ${connectionStatus ? 'text-green-600' : 'text-red-600'}`} />
                <p className="text-xs text-gray-600 dark:text-gray-300">RF Link</p>
              </div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg text-center">
                <Battery className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                <p className="text-xs text-gray-600 dark:text-gray-300">Power</p>
              </div>
              
              <div className="p-3 bg-purple-50 dark:bg-purple-900 rounded-lg text-center">
                <Zap className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                <p className="text-xs text-gray-600 dark:text-gray-300">Signal</p>
              </div>
            </div>
          </div>

          {/* Signal Control */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Volume2 className="w-5 h-5 mr-2 text-blue-600" />
                Signal Control
              </h3>
              
              {/* Signal Level Slider */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Signal Level: {signalLevel} dBm
                </label>
                <input
                  type="range"
                  min="-90"
                  max="-10"
                  value={signalLevel}
                  onChange={(e) => handleSignalChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>-90</span>
                  <span>-50</span>
                  <span>-10</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button className="px-3 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                  Scan
                </button>
                <button className="px-3 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-sm font-medium hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
                  Reset
                </button>
              </div>
            </div>

            {/* Essential Info */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Status:</span>
                  <span className={`font-medium ${isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {isActive ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Frequency:</span>
                  <span className="font-mono text-blue-600">2.4 GHz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Mode:</span>
                  <span className="text-purple-600">Minimal</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Controls */}
        <div className="mt-8 text-center">
          <button className="px-6 py-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-800 transition-colors mr-4">
            Emergency Stop
          </button>
          <button className="px-6 py-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-lg font-medium hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors">
            Maintenance
          </button>
        </div>
      </div>
    </div>
  );
}
