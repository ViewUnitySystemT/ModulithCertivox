import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  HardDrive, 
  Thermometer, 
  Zap, 
  Activity,
  Wifi,
  Bluetooth,
  Usb,
  Gauge,
  Monitor,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useRFHardwareStore } from '../../stores/rfHardwareStore';

export default function HardwareUI() {
  const { hardwareData, connectionStatus } = useRFHardwareStore();
  const [realtimeData, setRealtimeData] = useState({
    cpuTemp: 42,
    memoryUsage: 68,
    rfPower: -45,
    voltage: 3.3,
    current: 150,
    frequency: 2400,
    gpio: Array.from({ length: 16 }, (_, i) => i % 2 === 0),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData(prev => ({
        ...prev,
        cpuTemp: 42 + Math.random() * 5,
        memoryUsage: 65 + Math.random() * 10,
        rfPower: -50 + Math.random() * 10,
        voltage: 3.3 + (Math.random() - 0.5) * 0.1,
        current: 145 + Math.random() * 15,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getGpioStatusColor = (pin: boolean) => 
    pin ? 'bg-green-400' : 'bg-gray-300';

  const getTemperatureColor = (temp: number) => {
    if (temp < 40) return 'text-green-600';
    if (temp < 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Hardware Control Center
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Real-time hardware monitoring and control
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${connectionStatus ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {connectionStatus ? 'Hardware Connected' : 'Hardware Disconnected'}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* System Status */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Cpu className="w-5 h-5 mr-2 text-blue-600" />
                System Status
              </h3>
              
              <div className="space-y-4">
                {/* CPU Temperature */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">CPU Temperature</span>
                  </div>
                  <span className={`font-mono font-bold ${getTemperatureColor(realtimeData.cpuTemp)}`}>
                    {realtimeData.cpuTemp.toFixed(1)}°C
                  </span>
                </div>

                {/* Memory Usage */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <HardDrive className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Memory Usage</span>
                  </div>
                  <span className="font-mono font-bold text-blue-600">
                    {realtimeData.memoryUsage.toFixed(1)}%
                  </span>
                </div>

                {/* Voltage & Current */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Voltage</span>
                    <span className="font-mono font-bold text-green-600">
                      {realtimeData.voltage.toFixed(2)}V
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Current</span>
                    <span className="font-mono font-bold text-green-600">
                      {realtimeData.current.toFixed(0)}mA
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RF Hardware */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-purple-600" />
                RF Hardware
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">RF Power</span>
                  <span className="font-mono font-bold text-purple-600">
                    {realtimeData.rfPower.toFixed(1)} dBm
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Frequency</span>
                  <span className="font-mono font-bold text-purple-600">
                    {realtimeData.frequency} MHz
                  </span>
                </div>
                
                {/* Signal Strength Visualization */}
                <div className="mt-4">
                  <div className="text-xs text-gray-500 mb-1">Signal Strength</div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.abs(realtimeData.rfPower) * 1.1}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* GPIO Control */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-600" />
                GPIO Status
              </h3>
              
              {/* GPIO Grid */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {realtimeData.gpio.map((pin, index) => (
                  <motion.div
                    key={index}
                    className={`w-12 h-12 rounded-lg flex items-center justify-center border-2 cursor-pointer ${
                      pin 
                        ? 'border-green-500 hover:border-green-600' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setRealtimeData(prev => ({
                        ...prev,
                        gpio: prev.gpio.map((p, i) => i === index ? !p : p)
                      }));
                    }}
                  >
                    <div className={`w-6 h-6 rounded-full ${getGpioStatusColor(pin)}`} />
                    <span className="absolute text-xs font-medium text-gray-600 mt-12">
                      GPIO{index}
                    </span>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                  <span className="text-gray-600 dark:text-gray-300">High</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gray-300 rounded-full" />
                  <span className="text-gray-600 dark:text-gray-300">Low</span>
                </div>
              </div>
            </div>

            {/* Hardware Connections */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Usb className="w-5 h-5 mr-2 text-blue-600" />
                Connections
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Wifi className={`w-4 h-4 ${connectionStatus ? 'text-green-600' : 'text-red-600'}`} />
                    <span className="text-sm text-gray-600 dark:text-gray-300">RF Module</span>
                  </div>
                  {connectionStatus ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bluetooth className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Bluetooth</span>
                  </div>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Usb className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">USB Debug</span>
                  </div>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </div>

            {/* Performance Gauge */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Gauge className="w-5 h-5 mr-2 text-orange-600" />
                Performance
              </h3>
              
              <div className="relative">
                <svg className="w-32 h-32 mx-auto" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#f59elem"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="314"
                    strokeDashoffset="157"
                    initial={{ strokeDashoffset: 314 }}
                    animate={{ strokeDashoffset: 314 - (realtimeData.memoryUsage / 100) * 314 }}
                    transition={{ duration: 0.5 }}
                  />
                  <text x="60" y="68" textAnchor="middle" className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    {Math.round(realtimeData.memoryUsage)}%
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
