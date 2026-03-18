'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'accent' | 'green' | 'blue' | 'gold';
  size?: 'sm' | 'md';
  className?: string;
}

const variantColors = {
  accent: 'bg-cinema-accent',
  green: 'bg-cinema-green',
  blue: 'bg-cinema-blue',
  gold: 'bg-cinema-gold',
};

export function Progress({
  value,
  max = 100,
  label,
  showPercentage = true,
  variant = 'accent',
  size = 'md',
  className,
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('space-y-1', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-xs text-cinema-muted">{label}</span>}
          {showPercentage && (
            <span className="text-xs font-mono text-cinema-text">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={cn(
        'w-full bg-cinema-dark rounded-full overflow-hidden',
        size === 'sm' ? 'h-1' : 'h-2'
      )}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            variantColors[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
