import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Activity, 
  Zap, 
  Eye,
  Waves,
  Target,
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface NeuralData {
  timestamp: number;
  eeg: number[];
  emg: number[];
  eyeTracking: { x: number; y: number };
  attention: number;
  meditation: number;
}

export default function NeuroUI() {
  const [neuralData, setNeuralData] = useState<NeuralData>({
    timestamp: Date.now(),
    eeg: new Array(8).fill(0),
    emg: new Array(4).fill(0),
    eyeTracking: { x: 0, y: 0 },
    attention: 50,
    meditation: 50,
  });
  
  const [isRecording, setIsRecording] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(0);
  const [bciMode, setBciMode] = useState<'passive' | 'active'>('passive');
  const animationRef = useRef<number>();

  // Simulate neural data streams
  useEffect(() => {
    const generateRandomNeuralData = () => {
      setNeuralData(prev => ({
        timestamp: Date.now(),
        eeg: prev.eeg.map(() => (Math.random() - 0.5) * 100),
        emg: prev.emg.map(() => Math.random() * 50),
        eyeTracking: {
          x: prev.eyeTracking.x + (Math.random() - 0.5) * 10,
          y: prev.eyeTracking.y + (Math.random() - 0.5) * 10 },
        attention: Math.max(0, Math.min(100, prev.attention + (Math.random() - 0.5) * 10)),
        meditation: Math.max(0, Math.min(100, prev.meditation + (Math.random() - 0.5) * 10)),
      }));
    };

    if (isRecording) {
      animationRef.current = requestAnimationFrame(generateRandomNeuralData);
    }

    if (isRecording) {
      const interval = setInterval(() => {
        generateRandomNeuralData();
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isRecording]);

  const renderEEGWaveform = (data: number[], color: string) => {
    return (
      <svg width="100%" height="60" className="border border-gray-200 dark:border-gray-700 rounded">
        <polyline
          points={data.map((value, index) => `${index * 10},${30 + value}`).join(' ')}
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        <line x1="0" y1="30" x2="100%" y2="30" stroke="#e5e7eb" strokeWidth="1" />
      </svg>
    );
  };

  const eegChannels = [
    { name: 'Fp1', color: '#ef4444' },
    { name: 'Fp2', color: '#f97316' },
    { name: 'F3', color: '#eab308' },
    { name: 'F4', color: '#22c55e' },
    { name: 'C3', color: '#06b6d4' },
    { name: 'C4', color: '#3b82f6' },
    { name: 'P3', color: '#8b5cf6' },
    { name: 'P4', color: '#ec4899' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center text-gray-900 dark:text-white mb-2">
            <Brain className="w-8 h-8 mr-3 text-purple-600" />
            Neural Interface Control
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            EEG/EMG visualization and Brain-Computer Interface control
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Recording Control */}
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isRecording
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            }`}
          >
            {isRecording ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
          </button>
          
          {/* BCI Mode Toggle */}
          <select
            value={bciMode}
            onChange={(e) => setBciMode(e.target.value as 'passive' | 'active')}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg border-0"
          >
            <option value="passive">Passive Mode</option>
            <option value="active">Active Mode</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* EEG Visualizations */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Waves className="w-5 h-5 mr-2 text-blue-600" />
                EEG Channel Analysis
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {eegChannels.map((channel, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {channel.name}
                      </h4>
                      <span 
                        className="text-xs font-mono"
                        style={{ color: channel.color }}
                      >
                        {neuralData.eeg[index]?.toFixed(2)} μV
                      </span>
                    </div>
                    {renderEEGWaveform(neuralData.eeg, channel.color)}
                  </div>
                ))}
              </div>
            </div>

            {/* EMG Data */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-600" />
                Electromyography (EMG)
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {['Frontalis', 'Temporalis', 'Masseter', 'Orbicularis'].map((muscle, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {muscle}
                    </h4>
                    <div className="h-16 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-end justify-center p-2">
                      <motion.div
                        className="bg-green-500 w-full rounded"
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.min(100, (neuralData.emg[index] || 0) * 2)}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {neuralData.emg[index]?.toFixed(1)} mV
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Eye Tracking */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-purple-600" />
                Eye Tracking
              </h3>
              
              <div className="relative w-full h-48 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-1">
                  <div className="grid grid-cols-3 gap-1">
                  {Array.from({ length: 9 }, (_, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full ${
                      Math.abs(neuralData.eyeTracking.x - 50) < 20 && 
                      Math.abs(neuralData.eyeTracking.y - 50) < 20
                        ? 'bg-blue-400' : 'bg-gray-200 dark:bg-gray-600'
                    }`} />
                  ))}
                </div>
                </div>
                
                <motion.div
                  className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"
                  animate={{
                    x: neuralData.eyeTracking.x === 0 ? 88 : neuralData.eyeTracking.x * 1.76,
                    y: neuralData.eyeTracking.y === 0 ? 88 : neuralData.eyeTracking.y * 1.76
                  }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-300">X Position:</span>
                  <span className="ml-2 font-mono text-blue-600">
                    {neuralData.eyeTracking.x.toFixed(1)}°
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-300">Y Position:</span>
                  <span className="ml-2 font-mono text-blue-600">
                    {neuralData.eyeTracking.y.toFixed(1)}°
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="space-y-4">
            {/* Mental State Metrics */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-orange-600" />
                Mental State
              </h3>
              
              <div className="space-y-4">
                {/* Attention Level */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Attention</span>
                    <span className="text-sm font-mono text-orange-600">
                      {neuralData.attention.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-orange-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${neuralData.attention}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
                
                {/* Meditation Level */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Meditation</span>
                    <span className="text-sm font-mono text-green-600">
                      {neuralData.meditation.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-green-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${neuralData.meditation}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* BCI Control Interface */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-purple-600" />
                BCI Control
              </h3>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg text-sm font-medium"
                  >
                    Left Click
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-sm font-medium"
                  >
                    Right Click
                  </motion.button>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full p-3 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-lg text-sm font-medium"
                >
                  Neural Scroll
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium"
                >
                  Reset Calibration
                </motion.button>
              </div>
            </div>

            {/* Session Info */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
                Session Information
              </h4>
              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Mode:</span>
                  <span className="capitalize">{bciMode}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={isRecording ? 'text-green-600' : 'text-red-600'}>
                    {isRecording ? 'Recording' : 'Idle'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Channels:</span>
                  <span>8 EEG + 4 EMG</span>
                </div>
                <div className="flex justify-between">
                  <span>Sample Rate:</span>
                  <span>512 Hz</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
