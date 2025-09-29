import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Satellite, 
  Radio, 
  Signal, 
  Clock,
  Globe,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Play,
  Pause,
  Square,
  Download,
  Upload,
  Settings
} from 'lucide-react';

interface GroundStation {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  status: 'online' | 'offline' | 'maintenance';
  elevation: number;
  azimuth: number;
  signalStrength: number;
  lastContact: string;
}

interface Satellite {
  id: string;
  name: string;
  noradId: string;
  altitude: number;
  inclination: number;
  period: number;
  status: 'active' | 'passive' | 'decaying';
  nextPass: string;
  duration: number;
  maxElevation: number;
}

interface CommunicationSession {
  id: string;
  satellite: string;
  groundStation: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'completed' | 'failed';
  dataTransferred: number;
  frequency: string;
  modulation: string;
}

export default function GroundStationUI() {
  const [groundStations, setGroundStations] = useState<GroundStation[]>([]);
  const [satellites, setSatellites] = useState<Satellite[]>([]);
  const [sessions, setSessions] = useState<CommunicationSession[]>([]);
  const [selectedStation, setSelectedStation] = useState<GroundStation | null>(null);
  const [selectedSatellite, setSelectedSatellite] = useState<Satellite | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Mock data initialization
  useEffect(() => {
    const mockGroundStations: GroundStation[] = [
      {
        id: 'gs1',
        name: 'Primary Ground Station',
        location: 'Cape Canaveral, FL',
        latitude: 28.3922,
        longitude: -80.6077,
        status: 'online',
        elevation: 45.2,
        azimuth: 180.5,
        signalStrength: -42,
        lastContact: '2025-01-18 14:25:30'
      },
      {
        id: 'gs2',
        name: 'Secondary Ground Station',
        location: 'Goldstone, CA',
        latitude: 35.4267,
        longitude: -116.8900,
        status: 'online',
        elevation: 38.7,
        azimuth: 225.1,
        signalStrength: -48,
        lastContact: '2025-01-18 14:20:15'
      },
      {
        id: 'gs3',
        name: 'Backup Ground Station',
        location: 'Canberra, Australia',
        latitude: -35.2809,
        longitude: 149.1300,
        status: 'maintenance',
        elevation: 0,
        azimuth: 0,
        signalStrength: -999,
        lastContact: '2025-01-18 12:45:00'
      }
    ];

    const mockSatellites: Satellite[] = [
      {
        id: 'sat1',
        name: 'ISS',
        noradId: '25544',
        altitude: 408,
        inclination: 51.6,
        period: 92.7,
        status: 'active',
        nextPass: '2025-01-18 15:30:00',
        duration: 8.5,
        maxElevation: 67.2
      },
      {
        id: 'sat2',
        name: 'NOAA-18',
        noradId: '28654',
        altitude: 850,
        inclination: 98.7,
        period: 102.1,
        status: 'active',
        nextPass: '2025-01-18 16:15:00',
        duration: 12.3,
        maxElevation: 45.8
      },
      {
        id: 'sat3',
        name: 'Hubble Space Telescope',
        noradId: '20580',
        altitude: 540,
        inclination: 28.5,
        period: 95.4,
        status: 'active',
        nextPass: '2025-01-18 17:45:00',
        duration: 6.2,
        maxElevation: 23.1
      }
    ];

    const mockSessions: CommunicationSession[] = [
      {
        id: 'sess1',
        satellite: 'ISS',
        groundStation: 'Primary Ground Station',
        startTime: '2025-01-18 14:00:00',
        endTime: '2025-01-18 14:08:30',
        status: 'completed',
        dataTransferred: 125.6,
        frequency: '437.8 MHz',
        modulation: 'FM'
      },
      {
        id: 'sess2',
        satellite: 'NOAA-18',
        groundStation: 'Secondary Ground Station',
        startTime: '2025-01-18 14:15:00',
        endTime: '2025-01-18 14:27:30',
        status: 'active',
        dataTransferred: 89.3,
        frequency: '137.9 MHz',
        modulation: 'APT'
      }
    ];

    setGroundStations(mockGroundStations);
    setSatellites(mockSatellites);
    setSessions(mockSessions);
    setSelectedStation(mockGroundStations[0]);
    setSelectedSatellite(mockSatellites[0]);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'offline': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'maintenance': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'passive': return <Activity className="w-4 h-4 text-yellow-500" />;
      case 'decaying': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'offline': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'passive': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'decaying': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleTracking = () => {
    setIsTracking(!isTracking);
  };

  const handleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Satellite className="w-8 h-8 text-indigo-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Ground Station Control
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Satellite tracking and communication management
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleTracking}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isTracking 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isTracking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isTracking ? 'Stop Tracking' : 'Start Tracking'}</span>
          </button>
          <button
            onClick={handleRecording}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isRecording 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            {isRecording ? <Square className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
          
          {/* Ground Stations */}
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Ground Stations
              </h3>
              <div className="space-y-3">
                {groundStations.map((station) => (
                  <motion.div
                    key={station.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedStation?.id === station.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedStation(station)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(station.status)}
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {station.name}
                        </span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(station.status)}`}>
                        {station.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      <div>{station.location}</div>
                      <div>Elev: {station.elevation.toFixed(1)}° Az: {station.azimuth.toFixed(1)}°</div>
                      <div>Signal: {station.signalStrength} dBm</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Selected Station Details */}
            {selectedStation && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Station Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Location:</span>
                    <span className="text-gray-900 dark:text-white">{selectedStation.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Coordinates:</span>
                    <span className="text-gray-900 dark:text-white">
                      {selectedStation.latitude.toFixed(4)}, {selectedStation.longitude.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Elevation:</span>
                    <span className="text-gray-900 dark:text-white">{selectedStation.elevation.toFixed(1)}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Azimuth:</span>
                    <span className="text-gray-900 dark:text-white">{selectedStation.azimuth.toFixed(1)}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Last Contact:</span>
                    <span className="text-gray-900 dark:text-white">{selectedStation.lastContact}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Satellites */}
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Satellites
              </h3>
              <div className="space-y-3">
                {satellites.map((satellite) => (
                  <motion.div
                    key={satellite.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedSatellite?.id === satellite.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedSatellite(satellite)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(satellite.status)}
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {satellite.name}
                        </span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(satellite.status)}`}>
                        {satellite.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      <div>NORAD: {satellite.noradId}</div>
                      <div>Altitude: {satellite.altitude} km</div>
                      <div>Next Pass: {satellite.nextPass}</div>
                      <div>Duration: {satellite.duration} min</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Selected Satellite Details */}
            {selectedSatellite && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Satellite Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">NORAD ID:</span>
                    <span className="text-gray-900 dark:text-white">{selectedSatellite.noradId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Altitude:</span>
                    <span className="text-gray-900 dark:text-white">{selectedSatellite.altitude} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Inclination:</span>
                    <span className="text-gray-900 dark:text-white">{selectedSatellite.inclination}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Period:</span>
                    <span className="text-gray-900 dark:text-white">{selectedSatellite.period} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Max Elevation:</span>
                    <span className="text-gray-900 dark:text-white">{selectedSatellite.maxElevation}°</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Communication Sessions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Communication Sessions
              </h3>
              <div className="space-y-3">
                {sessions.map((session) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(session.status)}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {session.satellite} ↔ {session.groundStation}
                        </span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(session.status)}`}>
                        {session.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Start:</span>
                        <div className="text-gray-900 dark:text-white">{session.startTime}</div>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">End:</span>
                        <div className="text-gray-900 dark:text-white">{session.endTime}</div>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Frequency:</span>
                        <div className="text-gray-900 dark:text-white">{session.frequency}</div>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Data:</span>
                        <div className="text-gray-900 dark:text-white">{session.dataTransferred} MB</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Real-time Status */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Real-time Status
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isTracking ? 'TRACKING' : 'STANDBY'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Tracking Status</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isRecording ? 'RECORDING' : 'IDLE'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Recording Status</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
