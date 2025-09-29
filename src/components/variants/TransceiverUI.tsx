import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Radio, 
  Wifi, 
  Signal, 
  Zap, 
  Settings,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Power,
  Volume2,
  Mic,
  MicOff
} from 'lucide-react';

interface RFChannel {
  id: string;
  frequency: string;
  bandwidth: string;
  power: number;
  modulation: string;
  status: 'active' | 'idle' | 'error';
  signalStrength: number;
  noise: number;
  snr: number;
}

interface TransceiverStatus {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'error';
  temperature: number;
  voltage: number;
  current: number;
  uptime: string;
}

export default function TransceiverUI() {
  const [channels, setChannels] = useState<RFChannel[]>([]);
  const [transceivers, setTransceivers] = useState<TransceiverStatus[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<RFChannel | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Mock data initialization
  useEffect(() => {
    const mockChannels: RFChannel[] = [
      {
        id: '1',
        frequency: '433.92 MHz',
        bandwidth: '25 kHz',
        power: 85,
        modulation: 'FSK',
        status: 'active',
        signalStrength: -45,
        noise: -85,
        snr: 40
      },
      {
        id: '2',
        frequency: '868.35 MHz',
        bandwidth: '50 kHz',
        power: 92,
        modulation: 'GFSK',
        status: 'idle',
        signalStrength: -52,
        noise: -88,
        snr: 36
      },
      {
        id: '3',
        frequency: '2.4 GHz',
        bandwidth: '1 MHz',
        power: 78,
        modulation: 'OFDM',
        status: 'error',
        signalStrength: -65,
        noise: -90,
        snr: 25
      }
    ];

    const mockTransceivers: TransceiverStatus[] = [
      {
        id: 'tx1',
        name: 'RF Transceiver 01',
        status: 'online',
        temperature: 42.5,
        voltage: 12.1,
        current: 1.8,
        uptime: '2d 14h 32m'
      },
      {
        id: 'tx2',
        name: 'RF Transceiver 02',
        status: 'online',
        temperature: 38.2,
        voltage: 11.9,
        current: 1.5,
        uptime: '1d 8h 15m'
      },
      {
        id: 'tx3',
        name: 'RF Transceiver 03',
        status: 'error',
        temperature: 65.8,
        voltage: 10.2,
        current: 0.3,
        uptime: '0d 0h 5m'
      }
    ];

    setChannels(mockChannels);
    setTransceivers(mockTransceivers);
    setSelectedChannel(mockChannels[0]);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'idle': return <Activity className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'online': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'offline': return <XCircle className="w-4 h-4 text-gray-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'idle': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'online': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'offline': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleScan = async () => {
    setIsScanning(true);
    // Simulate scanning
    setTimeout(() => {
      setIsScanning(false);
      // Update channels with new scan results
      setChannels(prev => prev.map(ch => ({
        ...ch,
        signalStrength: Math.random() * -30 - 40,
        noise: Math.random() * -10 - 80,
        snr: Math.random() * 20 + 20
      })));
    }, 3000);
  };

  const handleTransmit = () => {
    setIsTransmitting(!isTransmitting);
  };

  const handleChannelSelect = (channel: RFChannel) => {
    setSelectedChannel(channel);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Radio className="w-8 h-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              RF Transceiver Control
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time RF transceiver monitoring and control
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RotateCcw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning...' : 'Scan Channels'}</span>
          </button>
          <button
            onClick={handleTransmit}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isTransmitting 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isTransmitting ? 'Stop TX' : 'Start TX'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          
          {/* Channels Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Channel List */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                RF Channels
              </h3>
              <div className="space-y-3">
                {channels.map((channel) => (
                  <motion.div
                    key={channel.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedChannel?.id === channel.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => handleChannelSelect(channel)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(channel.status)}
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {channel.frequency}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(channel.status)}`}>
                              {channel.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {channel.modulation} • {channel.bandwidth}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-4 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Power:</span>
                            <span className="ml-1 font-medium text-gray-900 dark:text-white">
                              {channel.power}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">SNR:</span>
                            <span className="ml-1 font-medium text-gray-900 dark:text-white">
                              {channel.snr} dB
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Selected Channel Details */}
            {selectedChannel && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Channel Details
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedChannel.signalStrength} dBm
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Signal Strength</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedChannel.noise} dBm
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Noise Floor</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedChannel.snr} dB
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">SNR</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedChannel.power}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Power</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Transceiver Status Panel */}
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Transceiver Status
              </h3>
              <div className="space-y-3">
                {transceivers.map((transceiver) => (
                  <div key={transceiver.id} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(transceiver.status)}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {transceiver.name}
                        </span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(transceiver.status)}`}>
                        {transceiver.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Temp:</span>
                        <span className="ml-1 font-medium text-gray-900 dark:text-white">
                          {transceiver.temperature}°C
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Voltage:</span>
                        <span className="ml-1 font-medium text-gray-900 dark:text-white">
                          {transceiver.voltage}V
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Current:</span>
                        <span className="ml-1 font-medium text-gray-900 dark:text-white">
                          {transceiver.current}A
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Uptime:</span>
                        <span className="ml-1 font-medium text-gray-900 dark:text-white">
                          {transceiver.uptime}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audio Controls */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Audio Controls
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg ${
                    audioEnabled 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-gray-600 hover:bg-gray-700 text-white'
                  }`}
                >
                  {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  <span>{audioEnabled ? 'Audio On' : 'Audio Off'}</span>
                </button>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Volume
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="75"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
