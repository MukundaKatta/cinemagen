'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex items-center gap-1 p-1 bg-cinema-dark rounded-lg', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150',
            activeTab === tab.id
              ? 'bg-cinema-surface text-cinema-accent shadow-sm'
              : 'text-cinema-muted hover:text-cinema-text'
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.badge !== undefined && (
            <span className={cn(
              'px-1.5 py-0.5 rounded-full text-[10px] font-bold',
              activeTab === tab.id
                ? 'bg-cinema-accent/20 text-cinema-accent'
                : 'bg-cinema-border text-cinema-muted'
            )}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
