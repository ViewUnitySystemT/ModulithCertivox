import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Satellite, 
  MapPin, 
  Radio,
  Network,
  Wifi,
  Bluetooth,
  Signal,
  Activity,
  Zap,
  Shield,
  Lock
} from 'lucide-react';
import { useRFHardwareStore } from '../../stores/rfHardwareStore';

export default function SatelliteUI() {
  const { signalData, connectionStatus } = useRFHardwareStore();
  const [satellites, setSatellites] = useState([
    { id: 1, name: 'GPS-1', signal: -120, status: 'active', frequency: 1575.42 },
    { id: 2, name: 'GPS-2', signal: -115, status: 'active', frequency: 1575.42 },
    { id: 3, name: 'GLONASS-1', signal: -125, status: 'active', frequency: 1602.0 },
    { id: 4, name: 'GALILEO-1', signal: -118, status: 'active', frequency: 1575.42 },
    { id: 5, name: 'BEIDOU-1', signal: -122, status: 'active', frequency: 1561.098 },
  ]);
  
  const [groundStations, setGroundStations] = useState([
    { id: 1, name: 'Station Alpha', location: '52.5200°N, 13.4050°E', status: 'online', connections: 12 },
    { id: 2, name: 'Station Beta', location: '40.7128°N, 74.0060°W', status: 'online', connections: 8 },
    { id: 3, name: 'Station Gamma', location: '35.6762°N, 139.6503°E', status: 'maintenance', connections: 0 },
  ]);

  const [selectedSatellite, setSelectedSatellite] = useState(1);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (isTracking) {
      const interval = setInterval(() => {
        setSatellites(prev => prev.map(sat => ({
          ...sat,
          signal: sat.signal + (Math.random() - 0.5) * 5,
        })));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTracking]);

  const getSignalColor = (signal: number) => {
    if (signal > -110) return 'text-green-500';
    if (signal > -120) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getSignalStrength = (signal: number) => {
    return Math.max(0, Math.min(100, ((signal + 140) / 30) * 100));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center text-gray-900 dark:text-white mb-2">
            <Satellite className="w-8 h-8 mr-3 text-blue-600" />
            Satellite Communication Interface
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Global satellite network monitoring and control
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsTracking(!isTracking)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isTracking
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>{isTracking ? 'Stop Tracking' : 'Start Tracking'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Satellite Status */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-600" />
                Active Satellites
              </h3>
              
              <div className="space-y-3">
                {satellites.map((satellite) => (
                  <motion.div
                    key={satellite.id}
                    onClick={() => setSelectedSatellite(satellite.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedSatellite === satellite.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          satellite.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                        }`} />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {satellite.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {satellite.frequency} MHz
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className={`text-sm font-mono ${getSignalColor(satellite.signal)}`}>
                            {satellite.signal.toFixed(1)} dBm
                          </div>
                          <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${getSignalStrength(satellite.signal)}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Ground Stations */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-green-600" />
                Ground Stations
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {groundStations.map((station) => (
                  <div key={station.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {station.name}
                      </h4>
                      <div className={`w-2 h-2 rounded-full ${
                        station.status === 'online' ? 'bg-green-400' : 'bg-yellow-400'
                      }`} />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {station.location}
                    </p>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Connections:</span>
                      <span className="font-mono text-blue-600">{station.connections}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="space-y-4">
            
            {/* Communication Controls */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Radio className="w-5 h-5 mr-2 text-purple-600" />
                Communication
              </h3>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button className="p-3 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                    <Wifi className="w-4 h-4 mx-auto mb-1" />
                    Uplink
                  </button>
                  <button className="p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-sm font-medium hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
                    <Signal className="w-4 h-4 mx-auto mb-1" />
                    Downlink
                  </button>
                </div>
                
                <button className="w-full p-3 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-lg text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors">
                  <Network className="w-4 h-4 inline mr-2" />
                  Establish Link
                </button>
                
                <button className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Bluetooth className="w-4 h-4 inline mr-2" />
                  Emergency Beacon
                </button>
              </div>
            </div>

            {/* Security Status */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-orange-600" />
                Security Status
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Encryption:</span>
                  <div className="flex items-center space-x-1">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">AES-256</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Authentication:</span>
                  <span className="text-sm font-medium text-green-600">Verified</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Threat Level:</span>
                  <span className="text-sm font-medium text-green-600">Low</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Last Update:</span>
                  <span className="text-sm font-mono text-blue-600">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            {/* System Info */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
                System Information
              </h4>
              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Mode:</span>
                  <span className="text-purple-600">Satellite</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={isTracking ? 'text-green-600' : 'text-red-600'}>
                    {isTracking ? 'Tracking' : 'Idle'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Active Links:</span>
                  <span className="text-blue-600">5</span>
                </div>
                <div className="flex justify-between">
                  <span>Coverage:</span>
                  <span className="text-green-600">Global</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
