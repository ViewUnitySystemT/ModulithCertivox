import React, { useEffect, useRef } from 'react';

export const SpectrumCanvas = ({ frequency, modulation }: { frequency: number; modulation: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 400, 100);
      ctx.fillStyle = 'lime';
      for (let i = 0; i < 400; i += 10) {
        const height = Math.random() * 100;
        ctx.fillRect(i, 100 - height, 8, height);
      }
    }
  }, [frequency, modulation]);

  return <canvas ref={canvasRef} width={400} height={100} className="bg-black rounded-md" />;
};