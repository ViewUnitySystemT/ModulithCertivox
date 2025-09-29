import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Waves, Signal, Activity, Zap } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SpectrumCanvasProps {
  frequency: number;
  modulation: string;
  bandwidth?: number;
  resolution?: number;
  showWaterfall?: boolean;
  showPeaks?: boolean;
  audioFeedback?: boolean;
}

interface SpectrumData {
  frequency: number;
  amplitude: number;
  phase: number;
  timestamp: number;
}

interface PeakData {
  frequency: number;
  amplitude: number;
  modulation: string;
  signalType: string;
}

export const SpectrumCanvas: React.FC<SpectrumCanvasProps> = ({
  frequency,
  modulation,
  bandwidth = 100000,
  resolution = 1024,
  showWaterfall = true,
  showPeaks = true,
  audioFeedback = true,
}) => {
  const [spectrumData, setSpectrumData] = useState<SpectrumData[]>([]);
  const [peaks, setPeaks] = useState<PeakData[]>([]);
  const [waterfallData, setWaterfallData] = useState<number[][]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<'real-time' | 'sweep' | 'peak-hold'>('real-time');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  const generateSpectrumData = useCallback((): SpectrumData[] => {
    const data: SpectrumData[] = [];
    const centerFreq = frequency;
    const startFreq = centerFreq - bandwidth / 2000000;
    const endFreq = centerFreq + bandwidth / 2000000;
    const freqStep = (endFreq - startFreq) / resolution;

    for (let i = 0; i < resolution; i++) {
      const freq = startFreq + i * freqStep;
      let amplitude = 0;
      let phase = 0;

      switch (modulation) {
        case 'AM':
          amplitude = Math.exp(-Math.abs(freq - centerFreq) * 1000) * 50;
          if (Math.abs(freq - centerFreq) < 0.01) amplitude += 30;
          phase = Math.sin(freq * 1000) * Math.PI;
          break;
        case 'FM':
          amplitude = Math.exp(-Math.abs(freq - centerFreq) * 500) * 40;
          phase = Math.sin(freq * 2000) * Math.PI;
          break;
        case 'SSB':
          amplitude = freq > centerFreq ? Math.exp(-(freq - centerFreq) * 2000) * 60 : 0;
          phase = Math.sin(freq * 1500) * Math.PI;
          break;
        case 'CW':
          amplitude = Math.exp(-Math.abs(freq - centerFreq) * 10000) * 80;
          phase = Math.sin(freq * 500) * Math.PI;
          break;
        default:
          amplitude = Math.exp(-Math.abs(freq - centerFreq) * 1000) * 40;
          phase = Math.sin(freq * 1000) * Math.PI;
      }

      amplitude += (Math.random() - 0.5) * 5;
      
      if (freq >= 26.965 && freq <= 27.405) {
        const cbChannel = Math.round((freq - 26.965) / 0.01);
        if (cbChannel >= 0 && cbChannel <= 39) {
          amplitude += Math.sin(cbChannel * 0.5) * 20 + 30;
        }
      }

      data.push({
        frequency: freq,
        amplitude: Math.max(0, amplitude),
        phase: phase,
        timestamp: Date.now(),
      });
    }

    return data;
  }, [frequency, modulation, bandwidth, resolution]);

  const detectPeaks = useCallback((data: SpectrumData[]): PeakData[] => {
    const peaks: PeakData[] = [];
    const threshold = 30;
    
    for (let i = 1; i < data.length - 1; i++) {
      const current = data[i];
      const prev = data[i - 1];
      const next = data[i + 1];
      
      if (current.amplitude > threshold && 
          current.amplitude > prev.amplitude && 
          current.amplitude > next.amplitude) {
        
        let signalType = 'Unknown';
        if (current.frequency >= 26.965 && current.frequency <= 27.405) {
          signalType = 'CB-Funk';
        } else if (current.frequency >= 446.0 && current.frequency <= 446.2) {
          signalType = 'PMR446';
        } else if (current.frequency >= 462.5625 && current.frequency <= 467.7125) {
          signalType = 'FRS/GMRS';
        }
        
        peaks.push({
          frequency: current.frequency,
          amplitude: current.amplitude,
          modulation: modulation,
          signalType: signalType,
        });
      }
    }
    
    return peaks.sort((a, b) => b.amplitude - a.amplitude).slice(0, 10);
  }, [modulation]);

  const startAnalysis = useCallback(() => {
    setIsAnalyzing(true);
    
    const analyze = () => {
      if (!isAnalyzing) return;
      
      const newData = generateSpectrumData();
      setSpectrumData(newData);
      
      if (showPeaks) {
        const newPeaks = detectPeaks(newData);
        setPeaks(newPeaks);
      }
      
      if (showWaterfall) {
        const waterfallRow = newData.map(d => d.amplitude);
        setWaterfallData(prev => [waterfallRow, ...prev].slice(0, 100));
      }
      
      animationFrameRef.current = requestAnimationFrame(analyze);
    };
    
    analyze();
  }, [isAnalyzing, generateSpectrumData, detectPeaks, showPeaks, showWaterfall]);

  const stopAnalysis = useCallback(() => {
    setIsAnalyzing(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  useEffect(() => {
    startAnalysis();
    return () => stopAnalysis();
  }, [startAnalysis, stopAnalysis]);

  const chartData = {
    labels: spectrumData.map(d => d.frequency.toFixed(3)),
    datasets: [
      {
        label: 'Spectrum',
        data: spectrumData.map(d => d.amplitude),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 1,
        fill: true,
        tension: 0.1,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    scales: {
      x: {
        type: 'linear' as const,
        title: {
          display: true,
          text: 'Frequency (MHz)',
          color: 'rgb(156 163 175)',
        },
        ticks: {
          color: 'rgb(156 163 175)',
          callback: function(value: any) {
            return value.toFixed(3);
          },
        },
        grid: {
          color: 'rgba(100, 100, 100, 0.1)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Amplitude (dB)',
          color: 'rgb(156 163 175)',
        },
        ticks: {
          color: 'rgb(156 163 175)',
        },
        grid: {
          color: 'rgba(100, 100, 100, 0.1)',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: 'rgb(156 163 175)',
        },
      },
      title: {
        display: true,
        text: `Spectrum Analyzer - ${modulation} @ ${frequency.toFixed(3)} MHz`,
        color: 'rgb(249 250 251)',
      },
    },
  };

  return (
    <div className="spectrum-canvas-container">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Waves className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isAnalyzing ? 'Analyzing...' : 'Stopped'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Signal className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {peaks.length} peaks detected
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={analysisMode}
            onChange={(e) => setAnalysisMode(e.target.value as any)}
            className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="real-time">Real-time</option>
            <option value="sweep">Sweep</option>
            <option value="peak-hold">Peak Hold</option>
          </select>
          
          <motion.button
            onClick={isAnalyzing ? stopAnalysis : startAnalysis}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              isAnalyzing 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isAnalyzing ? 'Stop' : 'Start'}
          </motion.button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-80">
        <Line data={chartData} options={chartOptions} />
      </div>
      
      {showPeaks && peaks.length > 0 && (
        <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <Activity className="w-4 h-4 mr-2 text-orange-500" />
            Detected Peaks
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {peaks.slice(0, 8).map((peak, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded text-xs"
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }} />
                  <span className="font-mono">{peak.frequency.toFixed(3)} MHz</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{peak.amplitude.toFixed(1)} dB</div>
                  <div className="text-gray-500 dark:text-gray-400">{peak.signalType}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded">
          <div className="font-semibold text-gray-700 dark:text-gray-300">Center Freq</div>
          <div className="font-mono">{frequency.toFixed(3)} MHz</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded">
          <div className="font-semibold text-gray-700 dark:text-gray-300">Bandwidth</div>
          <div className="font-mono">{(bandwidth / 1000).toFixed(0)} kHz</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded">
          <div className="font-semibold text-gray-700 dark:text-gray-300">Resolution</div>
          <div className="font-mono">{resolution} pts</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded">
          <div className="font-semibold text-gray-700 dark:text-gray-300">Modulation</div>
          <div className="font-mono">{modulation}</div>
        </div>
      </div>
    </div>
  );
};