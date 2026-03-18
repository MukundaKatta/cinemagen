'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface SelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  className?: string;
}

export function Select({ label, value, options, onChange, className }: SelectProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="cinema-label">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cinema-select w-full"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface VisualSelectProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string; icon?: React.ReactNode; description?: string }[];
  onChange: (value: T) => void;
  columns?: number;
  className?: string;
}

export function VisualSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  columns = 3,
  className,
}: VisualSelectProps<T>) {
  return (
    <div className={cn('space-y-2', className)}>
      <label className="cinema-label">{label}</label>
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex flex-col items-center gap-1 p-2 rounded-md border text-xs transition-all duration-150',
              value === opt.value
                ? 'border-cinema-accent bg-cinema-accent/10 text-cinema-accent'
                : 'border-cinema-border bg-cinema-dark text-cinema-muted hover:text-cinema-text hover:border-cinema-muted'
            )}
            title={opt.description}
          >
            {opt.icon && <span className="text-base">{opt.icon}</span>}
            <span className="font-medium text-center leading-tight">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
