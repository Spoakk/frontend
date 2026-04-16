"use client";

import { useRef, useEffect, useState } from "react";

interface RamSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
}

export function RamSlider({
  value,
  onChange,
  min = 512,
  max = 32768,
  step = 512,
  label,
  className = "",
}: RamSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const percentage = ((value - min) / (max - min)) * 100;

  const formatRam = (mb: number) => {
    if (mb >= 1024) {
      const gb = mb / 1024;
      return gb % 1 === 0 ? `${gb}GB` : `${gb.toFixed(1)}GB`;
    }
    return `${mb}MB`;
  };

  const updateValue = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawValue = min + percent * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));
    onChange(clampedValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateValue(e.clientX);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      updateValue(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={className}>
      {label && (
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-medium text-zinc-400">{label}</label>
          <span className="text-sm font-semibold font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
            {formatRam(value)}
          </span>
        </div>
      )}

      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        className="relative h-2 rounded-full bg-white/5 border border-white/10 cursor-pointer group"
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500/80 to-emerald-400/80 transition-all duration-150"
          style={{ width: `${percentage}%` }}
        />

        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-150"
          style={{ left: `${percentage}%` }}
        >
          <div
            className={`h-5 w-5 rounded-full border-2 border-emerald-400 bg-emerald-500 shadow-lg shadow-emerald-500/30 transition-transform ${
              isDragging ? "scale-125" : "group-hover:scale-110"
            }`}
          />
        </div>
      </div>

      <div className="flex justify-between text-xs text-zinc-600 mt-2">
        <span>{formatRam(min)}</span>
        <span>{formatRam(max)}</span>
      </div>
    </div>
  );
}
