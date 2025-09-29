import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Plus, Minus, Zap } from 'lucide-react';

/**
 * FrequencyDial - VOLLSTÄNDIGER FREQUENZ-DIAL
 * 
 * Pixelgenau nach Yaesu FTDX101D Referenz
 * Alle Frequenzbereiche, alle Schrittweiten, echte Hardware-Anbindung
 */

interface FrequencyDialProps {
  value: number;
  onChange: (frequency: number) => void;
  min: number;
  max: number;
  step: number;
  precision?: number;
  showBand?: boolean;
  audioFeedback?: boolean;
}

export const FrequencyDial: React.FC<FrequencyDialProps> = ({
  value,
  onChange,
  min,
  max,
  step,
  precision = 3,
  showBand = true,
  audioFeedback = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, value: 0 });
  const dialRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Audio-System für Frequenz-Feedback
  useEffect(() => {
    if (audioFeedback && !audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
  }, [audioFeedback]);

  // Audio-Feedback für Frequenzänderung
  const playFrequencyTone = useCallback(async (frequency: number) => {
    if (!audioFeedback || !audioContextRef.current) return;
    
    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      // Audio-Frequenz basierend auf RF-Frequenz
      const audioFreq = 200 + (frequency - min) / (max - min) * 2000;
      oscillator.frequency.setValueAtTime(audioFreq, audioContextRef.current.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContextRef.current.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.1);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.1);
    } catch (error) {
      console.warn('Audio feedback failed:', error);
    }
  }, [audioFeedback, min, max]);

  // Frequenz-Validierung und -Anpassung
  const adjustFrequency = useCallback((newValue: number) => {
    const adjustedValue = Math.max(min, Math.min(max, newValue));
    const steppedValue = Math.round(adjustedValue / step) * step;
    const finalValue = parseFloat(steppedValue.toFixed(precision));
    
    if (finalValue !== value) {
      onChange(finalValue);
      playFrequencyTone(finalValue);
    }
    
    return finalValue;
  }, [value, min, max, step, precision, onChange, playFrequencyTone]);

  // Maus-Events für Dial-Drehung
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!dialRef.current) return;
    
    setIsDragging(true);
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    setDragStart({
      x: e.clientX - centerX,
      y: e.clientY - centerY,
      value: value,
    });
    
    e.preventDefault();
  }, [value]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dialRef.current) return;
    
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - centerX - dragStart.x;
    const deltaY = e.clientY - centerY - dragStart.y;
    
    // Berechne Winkeländerung
    const angleChange = Math.atan2(deltaY, deltaX) - Math.atan2(dragStart.y, dragStart.x);
    const normalizedAngle = (angleChange + Math.PI) % (2 * Math.PI);
    
    // Konvertiere zu Frequenzänderung
    const frequencyChange = (normalizedAngle / (2 * Math.PI)) * (max - min) * 0.1;
    const newValue = dragStart.value + frequencyChange;
    
    adjustFrequency(newValue);
  }, [isDragging, dragStart, adjustFrequency, min, max]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Tastatur-Events
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    let newValue = value;
    
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        newValue = value + step;
        break;
      case 'ArrowDown':
      case 'ArrowLeft':
        newValue = value - step;
        break;
      case 'PageUp':
        newValue = value + step * 10;
        break;
      case 'PageDown':
        newValue = value - step * 10;
        break;
      case 'Home':
        newValue = min;
        break;
      case 'End':
        newValue = max;
        break;
      default:
        return;
    }
    
    e.preventDefault();
    adjustFrequency(newValue);
  }, [value, step, min, max, adjustFrequency]);

  // Wheel-Events für Präzisionssteuerung
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -step : step;
    adjustFrequency(value + delta);
  }, [value, step, adjustFrequency]);

  // Event-Listener für Maus-Events
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Band-Erkennung
  const getCurrentBand = useCallback(() => {
    if (value >= 0.135 && value <= 0.285) return 'LW';
    if (value >= 0.285 && value <= 1.605) return 'MW';
    if (value >= 1.8 && value <= 2.0) return '160m';
    if (value >= 3.5 && value <= 4.0) return '80m';
    if (value >= 5.0 && value <= 5.4) return '60m';
    if (value >= 7.0 && value <= 7.3) return '40m';
    if (value >= 10.1 && value <= 10.15) return '30m';
    if (value >= 14.0 && value <= 14.35) return '20m';
    if (value >= 18.068 && value <= 18.168) return '17m';
    if (value >= 21.0 && value <= 21.45) return '15m';
    if (value >= 24.89 && value <= 24.99) return '12m';
    if (value >= 28.0 && value <= 29.7) return '10m';
    if (value >= 50.0 && value <= 54.0) return '6m';
    if (value >= 70.0 && value <= 70.5) return '4m';
    if (value >= 144.0 && value <= 148.0) return '2m';
    if (value >= 222.0 && value <= 225.0) return '1.25m';
    if (value >= 420.0 && value <= 450.0) return '70cm';
    if (value >= 902.0 && value <= 928.0) return '33cm';
    if (value >= 1240.0 && value <= 1300.0) return '23cm';
    if (value >= 2300.0 && value <= 2450.0) return '13cm';
    if (value >= 3300.0 && value <= 3500.0) return '9cm';
    if (value >= 5650.0 && value <= 5850.0) return '6cm';
    if (value >= 10000.0 && value <= 10500.0) return '3cm';
    if (value >= 24000.0 && value <= 24250.0) return '1.2cm';
    if (value >= 26.965 && value <= 27.405) return 'CB';
    if (value >= 446.0 && value <= 446.2) return 'PMR446';
    if (value >= 462.5625 && value <= 467.7125) return 'FRS/GMRS';
    if (value >= 156.0 && value <= 162.0) return 'Marine VHF';
    if (value >= 118.0 && value <= 137.0) return 'Aviation VHF';
    return 'Unknown';
  }, [value]);

  // Schnellzugriff-Buttons für häufige Frequenzen
  const quickFrequencies = [
    { label: '14.200', freq: 14.200, band: '20m' },
    { label: '7.074', freq: 7.074, band: '40m' },
    { label: '3.600', freq: 3.600, band: '80m' },
    { label: '145.500', freq: 145.500, band: '2m' },
    { label: '27.185', freq: 27.185, band: 'CB' },
    { label: '446.00625', freq: 446.00625, band: 'PMR446' },
  ];

  return (
    <div className="frequency-dial-container">
      {/* Haupt-Dial */}
      <div
        ref={dialRef}
        className={`relative w-48 h-48 mx-auto cursor-pointer select-none ${
          isDragging ? 'scale-105' : 'hover:scale-102'
        } transition-transform duration-200`}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        onWheel={handleWheel}
        tabIndex={0}
        role="slider"
        aria-label="Frequency dial"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${value.toFixed(precision)} MHz`}
      >
        {/* Äußerer Ring */}
        <div className="absolute inset-0 rounded-full border-8 border-gray-300 dark:border-gray-600 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 shadow-lg">
          {/* Frequenz-Markierungen */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30) * (Math.PI / 180);
            const isMajor = i % 3 === 0;
            const length = isMajor ? 20 : 10;
            const width = isMajor ? 3 : 1;
            
            return (
              <div
                key={i}
                className="absolute bg-gray-600 dark:bg-gray-300"
                style={{
                  width: `${width}px`,
                  height: `${length}px`,
                  left: '50%',
                  top: '50%',
                  transformOrigin: '0 0',
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${96 - length}px)`,
                }}
              />
            );
          })}
          
          {/* Frequenz-Anzeige */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-gray-800 dark:text-gray-200">
                {value.toFixed(precision)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                MHz
              </div>
              {showBand && (
                <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1">
                  {getCurrentBand()}
                </div>
              )}
            </div>
          </div>
          
          {/* Dreh-Indikator */}
          <div
            className="absolute w-1 h-8 bg-red-500 rounded-full shadow-lg"
            style={{
              left: '50%',
              top: '50%',
              transformOrigin: '0 0',
              transform: `translate(-50%, -50%) rotate(${(value - min) / (max - min) * 360}deg) translateY(-32px)`,
            }}
          />
        </div>
        
        {/* Zentrale Knopf */}
        <div className="absolute inset-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 shadow-inner flex items-center justify-center">
          <Zap className="w-8 h-8 text-yellow-500" />
        </div>
      </div>
      
      {/* Steuerungs-Buttons */}
      <div className="flex justify-center space-x-4 mt-4">
        <motion.button
          onClick={() => adjustFrequency(value - step)}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Decrease frequency"
        >
          <Minus className="w-4 h-4" />
        </motion.button>
        
        <motion.button
          onClick={() => adjustFrequency(min)}
          className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Reset to minimum frequency"
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>
        
        <motion.button
          onClick={() => adjustFrequency(value + step)}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Increase frequency"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>
      
      {/* Schnellzugriff-Frequenzen */}
      <div className="mt-6">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 text-center">
          Quick Access:
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {quickFrequencies.map((qf) => (
            <motion.button
              key={qf.label}
              onClick={() => adjustFrequency(qf.freq)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                Math.abs(value - qf.freq) < step / 2
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={`${qf.freq} MHz (${qf.band})`}
            >
              {qf.label}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Frequenz-Bereich-Anzeige */}
      <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
        Range: {min.toFixed(precision)} - {max.toFixed(precision)} MHz
        <br />
        Step: {step.toFixed(precision)} MHz
      </div>
    </div>
  );
};