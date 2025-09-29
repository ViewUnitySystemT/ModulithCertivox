import React from 'react';

export const FrequencyDial = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => {
  return (
    <input
      type="range"
      min="26.965"
      max="27.405"
      step="0.005"
      value={value}
      onChange={e => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
    />
  );
};