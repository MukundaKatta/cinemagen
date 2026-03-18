'use client';

import React, { useState } from 'react';
import { useCinemaStore } from '@/hooks/use-cinema-store';
import { Button } from '@/components/ui/button';
import { Select, VisualSelect } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import type {
  ShotType,
  CameraMovement,
  LightingStyle,
  MotionPhysics,
  AspectRatio,
  FilmGrammarPreset,
} from '@/types/cinema';
import {
  SHOT_TYPE_LABELS,
  CAMERA_MOVEMENT_LABELS,
  FILM_GRAMMAR_PRESETS,
} from '@/types/cinema';
import { cn } from '@/lib/utils';

export function PromptEditor() {
  const { currentPrompt, updatePrompt, applyFilmGrammar, resetPrompt } = useCinemaStore();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showGrammarPresets, setShowGrammarPresets] = useState(false);

  const shotOptions = Object.entries(SHOT_TYPE_LABELS).map(([value, { label, description }]) => ({
    value,
    label,
    description,
  }));

  const cameraOptions = Object.entries(CAMERA_MOVEMENT_LABELS).map(([value, { label, description }]) => ({
    value,
    label,
    description,
  }));

  const lightingOptions: { value: LightingStyle; label: string }[] = [
    { value: 'natural', label: 'Natural' },
    { value: 'golden-hour', label: 'Golden Hour' },
    { value: 'blue-hour', label: 'Blue Hour' },
    { value: 'high-key', label: 'High Key' },
    { value: 'low-key', label: 'Low Key' },
    { value: 'rembrandt', label: 'Rembrandt' },
    { value: 'split', label: 'Split' },
    { value: 'butterfly', label: 'Butterfly' },
    { value: 'rim', label: 'Rim Light' },
    { value: 'silhouette', label: 'Silhouette' },
    { value: 'neon', label: 'Neon' },
    { value: 'moonlight', label: 'Moonlight' },
    { value: 'candlelight', label: 'Candlelight' },
    { value: 'studio-three-point', label: 'Studio 3-Point' },
    { value: 'chiaroscuro', label: 'Chiaroscuro' },
  ];

  const motionOptions: { value: MotionPhysics; label: string }[] = [
    { value: 'realistic', label: 'Realistic' },
    { value: 'slow-motion-2x', label: 'Slow Mo 2x' },
    { value: 'slow-motion-4x', label: 'Slow Mo 4x' },
    { value: 'slow-motion-8x', label: 'Slow Mo 8x' },
    { value: 'time-lapse', label: 'Time Lapse' },
    { value: 'hyper-lapse', label: 'Hyper Lapse' },
    { value: 'bullet-time', label: 'Bullet Time' },
    { value: 'reverse', label: 'Reverse' },
    { value: 'speed-ramp', label: 'Speed Ramp' },
  ];

  const aspectOptions: { value: AspectRatio; label: string }[] = [
    { value: '16:9', label: '16:9 HD' },
    { value: '21:9', label: '21:9 Ultra' },
    { value: '2.39:1', label: '2.39:1 Scope' },
    { value: '1.85:1', label: '1.85:1 Flat' },
    { value: '4:3', label: '4:3 Classic' },
    { value: '1:1', label: '1:1 Square' },
    { value: '9:16', label: '9:16 Vertical' },
  ];

  const grammarPresets = Object.entries(FILM_GRAMMAR_PRESETS).map(([value, preset]) => ({
    value: value as FilmGrammarPreset,
    label: preset.label,
    description: preset.description,
  }));

  return (
    <div className="space-y-4">
      {/* Main Prompt Description */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="cinema-label">Scene Description</label>
          <button onClick={resetPrompt} className="text-[10px] text-cinema-muted hover:text-cinema-accent transition-colors">
            Reset All
          </button>
        </div>
        <textarea
          value={currentPrompt.description}
          onChange={(e) => updatePrompt({ description: e.target.value })}
          placeholder="Describe your cinematic scene... e.g., 'A lone detective walks through rain-soaked neon-lit streets of Tokyo at night, trenchcoat collar raised against the rain'"
          className="cinema-input w-full h-28 resize-none"
          rows={4}
        />
      </div>

      {/* Film Grammar Presets */}
      <div className="space-y-2">
        <button
          onClick={() => setShowGrammarPresets(!showGrammarPresets)}
          className="flex items-center gap-2 cinema-label hover:text-cinema-accent transition-colors cursor-pointer"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={cn('transition-transform', showGrammarPresets && 'rotate-90')}>
            <polyline points="9 18 15 12 9 6" />
          </svg>
          Film Grammar Presets
          {currentPrompt.filmGrammar && (
            <span className="cinema-badge-accent">{FILM_GRAMMAR_PRESETS[currentPrompt.filmGrammar].label}</span>
          )}
        </button>

        {showGrammarPresets && (
          <div className="grid grid-cols-2 gap-1.5 animate-slide-up">
            {grammarPresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => applyFilmGrammar(preset.value)}
                className={cn(
                  'text-left p-2.5 rounded-md border text-xs transition-all',
                  currentPrompt.filmGrammar === preset.value
                    ? 'border-cinema-accent bg-cinema-accent/10 text-cinema-accent'
                    : 'border-cinema-border bg-cinema-dark text-cinema-muted hover:text-cinema-text hover:border-cinema-muted'
                )}
              >
                <div className="font-medium">{preset.label}</div>
                <div className="text-[10px] mt-0.5 opacity-70">{preset.description}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Shot Type & Camera */}
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Shot Type"
          value={currentPrompt.shotType}
          options={shotOptions}
          onChange={(v) => updatePrompt({ shotType: v as ShotType })}
        />
        <Select
          label="Camera Movement"
          value={currentPrompt.cameraMovement}
          options={cameraOptions}
          onChange={(v) => updatePrompt({ cameraMovement: v as CameraMovement })}
        />
      </div>

      {/* Lighting & Motion */}
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Lighting"
          value={currentPrompt.lighting}
          options={lightingOptions}
          onChange={(v) => updatePrompt({ lighting: v as LightingStyle })}
        />
        <Select
          label="Motion Physics"
          value={currentPrompt.motionPhysics}
          options={motionOptions}
          onChange={(v) => updatePrompt({ motionPhysics: v as MotionPhysics })}
        />
      </div>

      {/* Aspect Ratio & Duration */}
      <div className="grid grid-cols-2 gap-3">
        <VisualSelect
          label="Aspect Ratio"
          value={currentPrompt.aspectRatio}
          options={aspectOptions}
          onChange={(v) => updatePrompt({ aspectRatio: v })}
          columns={4}
        />
        <div className="space-y-3">
          <Slider
            label="Duration"
            value={currentPrompt.duration}
            min={2}
            max={16}
            step={1}
            unit="s"
            onChange={(v) => updatePrompt({ duration: v })}
          />
        </div>
      </div>

      {/* Advanced Controls */}
      <div className="space-y-2">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 cinema-label hover:text-cinema-accent transition-colors cursor-pointer"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={cn('transition-transform', showAdvanced && 'rotate-90')}>
            <polyline points="9 18 15 12 9 6" />
          </svg>
          Lens & Advanced
        </button>

        {showAdvanced && (
          <div className="space-y-3 p-3 bg-cinema-dark rounded-md border border-cinema-border animate-slide-up">
            <div className="grid grid-cols-2 gap-3">
              <Slider
                label="Focal Length"
                value={currentPrompt.focalLength}
                min={14}
                max={200}
                step={1}
                unit="mm"
                onChange={(v) => updatePrompt({ focalLength: v })}
              />
              <Slider
                label="Aperture"
                value={currentPrompt.aperture}
                min={1.2}
                max={22}
                step={0.1}
                unit=""
                onChange={(v) => updatePrompt({ aperture: v })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="cinema-label">Negative Prompt</label>
              <textarea
                value={currentPrompt.negativePrompt}
                onChange={(e) => updatePrompt({ negativePrompt: e.target.value })}
                placeholder="Things to exclude from the generation..."
                className="cinema-input w-full h-16 resize-none text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="cinema-label">Seed (optional)</label>
                <input
                  type="number"
                  value={currentPrompt.seed ?? ''}
                  onChange={(e) => updatePrompt({ seed: e.target.value ? parseInt(e.target.value) : null })}
                  placeholder="Random"
                  className="cinema-input w-full"
                />
              </div>
              <div className="space-y-1.5">
                <label className="cinema-label">Character Ref</label>
                <select
                  value={currentPrompt.characterRef ?? ''}
                  onChange={(e) => updatePrompt({ characterRef: e.target.value || null })}
                  className="cinema-select w-full"
                >
                  <option value="">None</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
