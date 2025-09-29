import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';

/**
 * SpectrumCanvas.tsx - Echtzeit-Spektrumanzeige
 * 
 * Canvas-Only, ohne Build, auditierbar
 * Realistische RF-Spektrum-Darstellung
 */

interface SpectrumCanvasProps {
  frequency: number;
  modulation: 'AM' | 'FM' | 'SSB';
  signalStrength: number;
  noiseLevel: number;
  width?: number;
  height?: number;
}

export interface SpectrumCanvasRef {
  startAnimation: () => void;
  stopAnimation: () => void;
  updateSpectrum: (data: Float32Array) => void;
}

export const SpectrumCanvas = forwardRef<SpectrumCanvasRef, SpectrumCanvasProps>(({
  frequency,
  modulation,
  signalStrength,
  noiseLevel,
  width = 400,
  height = 200
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const spectrumDataRef = useRef<Float32Array>(new Float32Array(width));
  const isAnimatingRef = useRef(false);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    startAnimation: () => {
      isAnimatingRef.current = true;
      animate();
    },
    stopAnimation: () => {
      isAnimatingRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    },
    updateSpectrum: (data: Float32Array) => {
      spectrumDataRef.current = data;
    },
  }));

  // Generate realistic spectrum data
  const generateSpectrumData = (): Float32Array => {
    const data = new Float32Array(width);
    const centerFreq = frequency;
    const bandwidth = modulation === 'AM' ? 0.01 : modulation === 'FM' ? 0.05 : 0.003; // MHz
    
    for (let i = 0; i < width; i++) {
      const freq = centerFreq - bandwidth/2 + (i / width) * bandwidth;
      const distanceFromCenter = Math.abs(freq - centerFreq);
      
      // Base signal
      let amplitude = 0;
      
      if (modulation === 'AM') {
        // AM: Carrier + sidebands
        amplitude = Math.exp(-distanceFromCenter * 100) * (signalStrength / 100);
        // Add sidebands
        amplitude += Math.exp(-Math.abs(distanceFromCenter - 0.003) * 200) * (signalStrength / 200);
        amplitude += Math.exp(-Math.abs(distanceFromCenter + 0.003) * 200) * (signalStrength / 200);
      } else if (modulation === 'FM') {
        // FM: Wider spectrum
        amplitude = Math.exp(-distanceFromCenter * 50) * (signalStrength / 100);
      } else if (modulation === 'SSB') {
        // SSB: Single sideband
        amplitude = Math.exp(-distanceFromCenter * 150) * (signalStrength / 100);
      }
      
      // Add noise
      amplitude += (Math.random() - 0.5) * (noiseLevel / 100) * 0.1;
      
      // Add some realistic variations
      amplitude += Math.sin(Date.now() / 1000 + i * 0.1) * 0.02;
      
      data[i] = Math.max(0, Math.min(1, amplitude));
    }
    
    return data;
  };

  // Draw spectrum
  const drawSpectrum = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set canvas size
    canvas.width = width;
    canvas.height = height;
    
    // Generate spectrum data
    const spectrumData = generateSpectrumData();
    
    // Draw background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid lines
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 10; i++) {
      const y = (height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = (width / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Draw spectrum
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i < width; i++) {
      const x = i;
      const y = height - (spectrumData[i] * height);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    
    // Draw center frequency line
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    
    // Draw frequency labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    
    const centerFreq = frequency.toFixed(3);
    const bandwidth = modulation === 'AM' ? 0.01 : modulation === 'FM' ? 0.05 : 0.003;
    const startFreq = (frequency - bandwidth/2).toFixed(3);
    const endFreq = (frequency + bandwidth/2).toFixed(3);
    
    ctx.fillText(startFreq, 20, height - 10);
    ctx.fillText(centerFreq, width / 2, height - 10);
    ctx.fillText(endFreq, width - 20, height - 10);
    
    // Draw modulation type
    ctx.fillStyle = '#ffff00';
    ctx.font = '14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(modulation, 10, 20);
    
    // Draw signal strength indicator
    ctx.fillStyle = '#00ffff';
    ctx.fillText(`S: ${signalStrength.toFixed(1)}%`, 10, 40);
    ctx.fillText(`N: ${noiseLevel.toFixed(1)}%`, 10, 60);
    
    // Draw waterfall effect (optional)
    if (modulation === 'SSB') {
      // Add some waterfall-like effect for SSB
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      // Shift existing data up
      for (let y = height - 1; y > 0; y--) {
        for (let x = 0; x < width; x++) {
          const currentIndex = (y * width + x) * 4;
          const aboveIndex = ((y - 1) * width + x) * 4;
          
          data[currentIndex] = data[aboveIndex];     // R
          data[currentIndex + 1] = data[aboveIndex + 1]; // G
          data[currentIndex + 2] = data[aboveIndex + 2]; // B
          data[currentIndex + 3] = data[aboveIndex + 3]; // A
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
    }
  };

  // Animation loop
  const animate = () => {
    if (!isAnimatingRef.current) return;
    
    drawSpectrum();
    animationRef.current = requestAnimationFrame(animate);
  };

  // Start animation on mount
  useEffect(() => {
    isAnimatingRef.current = true;
    animate();
    
    return () => {
      isAnimatingRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Update spectrum when props change
  useEffect(() => {
    drawSpectrum();
  }, [frequency, modulation, signalStrength, noiseLevel]);

  return (
    <div className="spectrum-canvas-container">
      <motion.canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-600 rounded-lg bg-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Spectrum Controls */}
      <div className="mt-2 flex justify-between items-center text-xs text-gray-400">
        <div>Frequency: {frequency.toFixed(3)} MHz</div>
        <div>Modulation: {modulation}</div>
        <div>Signal: {signalStrength.toFixed(1)}%</div>
      </div>
    </div>
  );
});

SpectrumCanvas.displayName = 'SpectrumCanvas';
