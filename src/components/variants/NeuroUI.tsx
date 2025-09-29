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
          y: prev.eyeTracking.y + (Math.random() - 0.5) * 10,
        },
        attention: Math.max(0, Math.min(100, prev.attention + (Math.random() - 0.5) * 10)),
        meditation: Math.max(0, Math.min(100, prev.meditation + (Math.random() - 0.5) * 10)),
      }));
    };

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
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isRecording ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
          </button>

          {/* BCI Mode Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">BCI Mode:</span>
            <button
              onClick={() => setBciMode(bciMode === 'passive' ? 'active' : 'passive')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                bciMode === 'active' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {bciMode === 'passive' ? 'Passive' : 'Active'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* EEG Waveforms */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Waves className="w-5 h-5 mr-2 text-blue-500" />
              EEG Waveforms
            </h3>
            
            <div className="space-y-4">
              {eegChannels.map((channel, index) => (
                <div key={channel.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {channel.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {neuralData.eeg[index]?.toFixed(1)} μV
                    </span>
                  </div>
                  {renderEEGWaveform(neuralData.eeg, channel.color)}
                </div>
              ))}
            </div>
          </div>

          {/* EMG Data */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-500" />
              EMG Signals
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {neuralData.emg.map((value, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      EMG {index + 1}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {value.toFixed(1)} mV
                    </span>
                  </div>
                  <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded relative overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-100"
                      style={{ width: `${Math.min(100, (value / 50) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="space-y-6">
          
          {/* Mental State */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-500" />
              Mental State
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Attention
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {neuralData.attention.toFixed(0)}%
                  </span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${neuralData.attention}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Meditation
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {neuralData.meditation.toFixed(0)}%
                  </span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ width: `${neuralData.meditation}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Eye Tracking */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-indigo-500" />
              Eye Tracking
            </h3>
            
            <div className="space-y-4">
              <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-lg relative overflow-hidden">
                <div 
                  className="absolute w-3 h-3 bg-red-500 rounded-full transition-all duration-100"
                  style={{ 
                    left: `${50 + neuralData.eyeTracking.x}%`, 
                    top: `${50 + neuralData.eyeTracking.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">X:</span>
                  <span className="ml-2 font-mono text-gray-900 dark:text-white">
                    {neuralData.eyeTracking.x.toFixed(1)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Y:</span>
                  <span className="ml-2 font-mono text-gray-900 dark:text-white">
                    {neuralData.eyeTracking.y.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-gray-500" />
              System Status
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  isRecording 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {isRecording ? 'Recording' : 'Idle'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Channels:</span>
                <span>8 EEG + 4 EMG</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Sample Rate:</span>
                <span>512 Hz</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}