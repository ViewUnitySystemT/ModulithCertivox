import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Plus, Minus } from 'lucide-react';

/**
 * FrequencyDial.tsx - UI-Komponente für Frequenzwahl
 * 
 * Pixelgenau nach Yaesu FTDX101D Referenz
 * Canvas-Only, ohne Build, auditierbar
 */

interface FrequencyDialProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export function FrequencyDial({ 
  value, 
  onChange, 
  min = 26.965, 
  max = 27.405, 
  step = 0.005,
  disabled = false 
}: FrequencyDialProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartValue, setDragStartValue] = useState(0);
  const dialRef = useRef<HTMLDivElement>(null);

  // Calculate frequency steps
  const totalSteps = Math.round((max - min) / step);
  const currentStep = Math.round((value - min) / step);
  const percentage = (currentStep / totalSteps) * 100;

  // Handle mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    const delta = e.deltaY > 0 ? -step : step;
    const newValue = Math.max(min, Math.min(max, value + delta));
    onChange(newValue);
  };

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    
    setIsDragging(true);
    setDragStartY(e.clientY);
    setDragStartValue(value);
  };

  // Handle mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || disabled) return;
      
      const deltaY = dragStartY - e.clientY;
      const deltaSteps = Math.round(deltaY / 10); // 10px per step
      const newValue = Math.max(min, Math.min(max, dragStartValue + (deltaSteps * step)));
      onChange(newValue);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStartY, dragStartValue, min, max, step, onChange, disabled]);

  // Handle touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    
    setIsDragging(true);
    setDragStartY(e.touches[0].clientY);
    setDragStartValue(value);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || disabled) return;
    
    e.preventDefault();
    const deltaY = dragStartY - e.touches[0].clientY;
    const deltaSteps = Math.round(deltaY / 10);
    const newValue = Math.max(min, Math.min(max, dragStartValue + (deltaSteps * step)));
    onChange(newValue);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Fine adjustment buttons
  const handleFineAdjust = (direction: 'up' | 'down') => {
    if (disabled) return;
    
    const delta = direction === 'up' ? step : -step;
    const newValue = Math.max(min, Math.min(max, value + delta));
    onChange(newValue);
  };

  // Reset to default
  const handleReset = () => {
    if (disabled) return;
    
    onChange(27.205); // Default CB Channel 20
  };

  return (
    <div className="frequency-dial-container">
      {/* Fine Adjustment Buttons */}
      <div className="flex justify-center space-x-4 mb-4">
        <motion.button
          onClick={() => handleFineAdjust('up')}
          disabled={disabled}
          className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Plus className="w-4 h-4" />
        </motion.button>
        
        <motion.button
          onClick={handleReset}
          disabled={disabled}
          className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>
        
        <motion.button
          onClick={() => handleFineAdjust('down')}
          disabled={disabled}
          className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Minus className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Main Dial */}
      <div 
        ref={dialRef}
        className="relative w-32 h-32 mx-auto"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Dial Background */}
        <div className="absolute inset-0 rounded-full bg-gray-800 border-4 border-gray-600">
          {/* Frequency Markers */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30) - 90; // Start from top
            const isMainMarker = i % 3 === 0;
            return (
              <div
                key={i}
                className="absolute w-1 bg-gray-400"
                style={{
                  height: isMainMarker ? '20px' : '10px',
                  left: '50%',
                  top: '10px',
                  transformOrigin: '50% 56px',
                  transform: `translateX(-50%) rotate(${angle}deg)`,
                }}
              />
            );
          })}
        </div>

        {/* Dial Pointer */}
        <motion.div
          className="absolute w-1 h-8 bg-blue-400 left-1/2 top-2"
          style={{
            transformOrigin: '50% 56px',
            transform: `translateX(-50%) rotate(${percentage * 3.6 - 90}deg)`,
          }}
          animate={{
            scale: isDragging ? 1.2 : 1,
          }}
        />

        {/* Center Dot */}
        <div className="absolute w-3 h-3 bg-blue-400 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />

        {/* Frequency Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-blue-400">
              {value.toFixed(3)}
            </div>
            <div className="text-xs text-gray-400">MHz</div>
          </div>
        </div>
      </div>

      {/* Frequency Range Display */}
      <div className="mt-4 text-center text-sm text-gray-400">
        <div>Range: {min.toFixed(3)} - {max.toFixed(3)} MHz</div>
        <div>Step: {step.toFixed(3)} MHz</div>
        <div>CB Band (26.965 - 27.405 MHz)</div>
      </div>

      {/* Quick Frequency Buttons */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {[
          { freq: 26.965, label: 'CH1' },
          { freq: 27.205, label: 'CH20' },
          { freq: 27.405, label: 'CH40' },
          { freq: 27.025, label: 'CH9' },
        ].map(({ freq, label }) => (
          <motion.button
            key={freq}
            onClick={() => onChange(freq)}
            disabled={disabled}
            className={`p-2 text-xs rounded ${
              Math.abs(value - freq) < step / 2
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            } disabled:opacity-50`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="font-semibold">{label}</div>
            <div className="text-xs">{freq.toFixed(3)}</div>
          </motion.button>
        ))}
      </div>

      {/* Status Indicator */}
      <div className="mt-4 flex items-center justify-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${isDragging ? 'bg-green-400' : 'bg-gray-500'}`} />
        <span className="text-xs text-gray-400">
          {isDragging ? 'Adjusting...' : 'Ready'}
        </span>
      </div>
    </div>
  );
}
