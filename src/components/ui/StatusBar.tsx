import { motion } from 'framer-motion';
import { 
  Activity, 
  Thermometer, 
  Cpu, 
  HardDrive,
  Wifi,
  Battery,
  Clock
} from 'lucide-react';
import { useRFHardwareStore } from '../../stores/rfHardwareStore';

interface StatusBarProps {
  connectionStatus: boolean;
  currentMode: string;
  currentTheme: string;
}

export default function StatusBar({ connectionStatus, currentMode, currentTheme }: StatusBarProps) {
  const { hardwareData, signalData } = useRFHardwareStore();

  const statusItems = [
    {
      id: 'connection',
      icon: Wifi,
      label: 'RF Link',
      value: connectionStatus ? 'Connected' : 'Disconnected',
      status: connectionStatus ? 'success' : 'error',
      color: connectionStatus ? 'text-green-600' : 'text-red-600',
    },
    {
      id: 'signal',
      icon: Activity,
      label: 'Signal',
      value: `${signalData?.power?.toFixed(0) || -45} dBm`,
      status: 'info',
      color: 'text-blue-600',
    },
    {
      id: 'cpu',
      icon: Cpu,
      label: 'CPU',
      value: `${hardwareData?.cpuUsage?.toFixed(0) || 23}%`,
      status: hardwareData?.cpuUsage > 80 ? 'warning' : 'success',
      color: hardwareData?.cpuUsage > 80 ? 'text-yellow-600' : 'text-green-600',
    },
    {
      id: 'memory',
      icon: HardDrive,
      label: 'Memory',
      value: `${hardwareData?.memoryUsage?.toFixed(0) || 68}%`,
      status: hardwareData?.memoryUsage > 85 ? 'warning' : 'success',
      color: hardwareData?.memoryUsage > 85 ? 'text-yellow-600' : 'text-green-600',
    },
    {
      id: 'temperature',
      icon: Thermometer,
      label: 'Temp',
      value: `${hardwareData?.temperature?.toFixed(0) || 42}°C`,
      status: hardwareData?.temperature > 60 ? 'warning' : 'success',
      color: hardwareData?.temperature > 60 ? 'text-red-600' : 'text-green-600',
    },
    {
      id: 'mode',
      icon: Activity,
      label: 'Mode',
      value: currentMode?.charAt(0).toUpperCase() + currentMode?.slice(1),
      status: 'info',
      color: 'text-purple-600',
    },
    {
      id: 'theme',
      icon: Activity,
      label: 'Theme',
      value: currentTheme?.charAt(0).toUpperCase() + currentTheme?.slice(1),
      status: 'info',
      color: 'text-gray-600',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`border-b ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          
          {/* Status Items */}
          <div className="flex items-center space-x-6 overflow-x-auto">
            {statusItems.map((item, index) => {
              const Icon = item.icon;
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center space-x-2 whitespace-nowrap"
                >
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span className={`text-xs font-medium ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {item.label}:
                  </span>
                  <span className={`text-xs font-mono font-bold ${item.color}`}>
                    {item.value}
                  </span>
                  
                  {/* Status indicator */}
                  <div className={`w-2 h-2 rounded-full ${
                    item.status === 'success' ? 'bg-green-400 animate-pulse' :
                    item.status === 'warning' ? 'bg-yellow-400' :
                    item.status === 'error' ? 'bg-red-400' : 'bg-blue-400'
                  }`} />
                </motion.div>
              );
            })}
          </div>

          {/* System Time */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex items-center space-x-2 text-xs"
          >
            <Clock className={`w-4 h-4 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`font-mono ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {new Date().toLocaleTimeString()}
            </span>
          </motion.div>
        </div>

      </div>

      {/* Performance Bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative"
      >
        <div className={`h-1 ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div className="h-full bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 opacity-20" />
        </div>
        
        {/* Indicator points */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="flex justify-between items-center h-full">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="w-1 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
