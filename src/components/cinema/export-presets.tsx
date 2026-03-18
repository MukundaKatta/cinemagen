'use client';

import { useState } from 'react';
import { useCinemaStore } from '@/hooks/use-cinema-store';
import { EXPORT_PRESETS, type ExportPreset, type ExportConfig } from '@/types/cinema';

export function ExportPresetsPanel() {
  const currentProject = useCinemaStore((s) => s.currentProject);
  const [selectedPreset, setSelectedPreset] = useState<ExportPreset>('youtube-1080p');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const config = EXPORT_PRESETS[selectedPreset];
  const clips = currentProject?.clips || [];
  const totalDuration = clips.reduce((sum, c) => sum + c.duration, 0);

  const presetGroups: { label: string; presets: ExportPreset[] }[] = [
    { label: 'Social Media', presets: ['youtube-4k', 'youtube-1080p', 'instagram-reel', 'instagram-post', 'tiktok', 'twitter'] },
    { label: 'Film', presets: ['film-24fps', 'film-30fps', 'film-60fps'] },
    { label: 'Custom', presets: ['custom'] },
  ];

  async function handleExport() {
    setIsExporting(true);
    setExportProgress(0);

    for (let i = 0; i <= 100; i += 5) {
      await new Promise((r) => setTimeout(r, 150));
      setExportProgress(i);
    }

    setIsExporting(false);
    setExportProgress(0);
  }

  return (
    <div className="p-3 space-y-4">
      <h3 className="cinema-label text-[11px]">Export</h3>

      <div>
        <label className="cinema-label">Project Summary</label>
        <div className="p-2.5 rounded-md bg-white/3 border border-white/5 text-[10px] text-white/30 space-y-0.5">
          <div>Clips: {clips.length}</div>
          <div>Total Duration: {totalDuration.toFixed(1)}s</div>
          <div>Characters: {currentProject?.characters.length || 0}</div>
        </div>
      </div>

      {presetGroups.map((group) => (
        <div key={group.label}>
          <label className="cinema-label">{group.label}</label>
          <div className="grid grid-cols-2 gap-1">
            {group.presets.map((preset) => {
              const cfg = EXPORT_PRESETS[preset];
              return (
                <button
                  key={preset}
                  onClick={() => setSelectedPreset(preset)}
                  className={`text-left p-2 rounded-md border transition-all ${
                    selectedPreset === preset
                      ? 'border-amber-500/30 bg-amber-600/10'
                      : 'border-white/5 bg-white/3 hover:bg-white/5'
                  }`}
                >
                  <div className="text-[10px] font-medium text-white/60">{preset.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</div>
                  <div className="text-[9px] text-white/20">{cfg.resolution.width}x{cfg.resolution.height} | {cfg.fps}fps</div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="p-2.5 rounded-md bg-white/3 border border-white/5">
        <label className="cinema-label">Export Settings</label>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] text-white/30">
          <div>Resolution: <span className="text-white/50">{config.resolution.width}x{config.resolution.height}</span></div>
          <div>FPS: <span className="text-white/50">{config.fps}</span></div>
          <div>Codec: <span className="text-white/50">{config.codec}</span></div>
          <div>Bitrate: <span className="text-white/50">{(config.bitrate / 1000).toFixed(0)} Mbps</span></div>
          <div>Format: <span className="text-white/50">{config.format.toUpperCase()}</span></div>
          <div>Audio: <span className="text-white/50">{config.audioCodec} {config.audioBitrate}kbps</span></div>
        </div>
      </div>

      {isExporting && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-white/40">Exporting...</span>
            <span className="text-[10px] text-amber-400">{exportProgress}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5">
            <div className="bg-amber-500 h-1.5 rounded-full transition-all" style={{ width: `${exportProgress}%` }} />
          </div>
        </div>
      )}

      <button
        onClick={handleExport}
        disabled={isExporting || clips.length === 0}
        className="cinema-btn-primary w-full text-xs"
      >
        {isExporting ? `Exporting... ${exportProgress}%` : `Export ${config.format.toUpperCase()} (${selectedPreset})`}
      </button>

      {clips.length === 0 && (
        <p className="text-[10px] text-white/20 text-center">Generate some clips first before exporting.</p>
      )}
    </div>
  );
}
