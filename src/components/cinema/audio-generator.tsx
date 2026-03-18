'use client';

import { useState } from 'react';
import { useCinemaStore } from '@/hooks/use-cinema-store';
import type { AudioTrack, TransitionType } from '@/types/cinema';
import { v4 as uuid } from 'uuid';

const AUDIO_PRESETS = [
  { label: 'Cinematic Orchestra', prompt: 'cinematic orchestral film score, dramatic, sweeping' },
  { label: 'Ambient Tension', prompt: 'ambient tension music, suspenseful, dark synthesizers' },
  { label: 'Upbeat Pop', prompt: 'upbeat pop background music, energetic, modern' },
  { label: 'Gentle Piano', prompt: 'soft piano melody, emotional, reflective' },
  { label: 'Epic Drums', prompt: 'epic percussion, war drums, powerful rhythm' },
  { label: 'Lo-fi Chill', prompt: 'lo-fi hip hop beats, chill, relaxing study music' },
  { label: 'Jazz Club', prompt: 'smooth jazz saxophone, nightclub ambiance, moody' },
  { label: 'Electronic Pulse', prompt: 'electronic synthwave, retro futuristic, neon vibes' },
];

const TRANSITION_OPTIONS: { value: TransitionType; label: string }[] = [
  { value: 'cut', label: 'Cut' },
  { value: 'dissolve', label: 'Dissolve' },
  { value: 'fade-to-black', label: 'Fade to Black' },
  { value: 'wipe-left', label: 'Wipe Left' },
  { value: 'morph', label: 'Morph' },
  { value: 'whip', label: 'Whip' },
  { value: 'zoom-through', label: 'Zoom Through' },
  { value: 'match-cut', label: 'Match Cut' },
];

export function AudioGenerator() {
  const currentProject = useCinemaStore((s) => s.currentProject);
  const updateClip = useCinemaStore((s) => s.updateClip);
  const setClipTransition = useCinemaStore((s) => s.setClipTransition);
  const selectedClipId = useCinemaStore((s) => s.selectedClipId);
  const reorderClips = useCinemaStore((s) => s.reorderClips);
  const removeClipFromProject = useCinemaStore((s) => s.removeClipFromProject);
  const [audioPrompt, setAudioPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTracks, setGeneratedTracks] = useState<AudioTrack[]>([]);

  async function handleGenerateAudio() {
    if (!audioPrompt.trim()) return;
    setIsGenerating(true);

    await new Promise((r) => setTimeout(r, 1500));

    const track: AudioTrack = {
      id: uuid(),
      name: audioPrompt.slice(0, 30),
      url: '',
      duration: 30,
      type: 'generated',
      volume: 0.8,
      fadeIn: 1,
      fadeOut: 2,
    };

    setGeneratedTracks((prev) => [track, ...prev]);
    setIsGenerating(false);
  }

  const clips = currentProject?.clips || [];

  return (
    <div className="p-3 space-y-4">
      <h3 className="cinema-label text-[11px]">Compose & Audio</h3>

      {/* Timeline */}
      <div>
        <label className="cinema-label">Clip Sequence ({clips.length} clips)</label>
        {clips.length === 0 ? (
          <p className="text-[10px] text-white/20 py-4 text-center">Generate clips first, then compose here.</p>
        ) : (
          <div className="space-y-1">
            {clips.map((clip, idx) => (
              <div
                key={clip.id}
                className={`p-2 rounded-md border transition-all ${
                  selectedClipId === clip.id
                    ? 'border-amber-500/30 bg-amber-600/10'
                    : 'border-white/5 bg-white/3'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/60">{clip.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-white/20">{clip.duration}s</span>
                    <button onClick={() => removeClipFromProject(clip.id)} className="text-white/10 hover:text-red-400 transition">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {idx < clips.length - 1 && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[9px] text-white/20">Transition:</span>
                    <select
                      value={clip.transition}
                      onChange={(e) => setClipTransition(clip.id, e.target.value as TransitionType, clip.transitionDuration)}
                      className="cinema-select text-[9px] py-0.5 px-1"
                    >
                      {TRANSITION_OPTIONS.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={clip.transitionDuration}
                      onChange={(e) => setClipTransition(clip.id, clip.transition, parseFloat(e.target.value) || 0.5)}
                      className="cinema-input w-12 text-[9px] py-0.5 px-1"
                      min={0.1}
                      max={3}
                      step={0.1}
                    />
                    <span className="text-[9px] text-white/15">s</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="border-white/5" />

      {/* Audio Generation */}
      <div>
        <label className="cinema-label">Audio Generation</label>
        <div className="flex flex-wrap gap-1 mb-2">
          {AUDIO_PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setAudioPrompt(p.prompt)}
              className={`px-1.5 py-0.5 rounded text-[9px] transition ${
                audioPrompt === p.prompt ? 'bg-amber-600 text-white' : 'bg-white/5 text-white/30 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <textarea
          value={audioPrompt}
          onChange={(e) => setAudioPrompt(e.target.value)}
          placeholder="Describe the audio or soundtrack..."
          className="cinema-input h-16 resize-none text-xs"
        />

        <button onClick={handleGenerateAudio} disabled={isGenerating || !audioPrompt.trim()} className="cinema-btn-primary w-full text-xs mt-2">
          {isGenerating ? 'Generating Audio...' : 'Generate Soundtrack'}
        </button>
      </div>

      {generatedTracks.length > 0 && (
        <div>
          <label className="cinema-label">Generated Audio</label>
          <div className="space-y-1">
            {generatedTracks.map((track) => (
              <div key={track.id} className="flex items-center justify-between p-2 rounded-md bg-white/3 border border-white/5">
                <div>
                  <div className="text-xs text-white/60">{track.name}</div>
                  <div className="text-[10px] text-white/20">{track.duration}s | Vol: {Math.round(track.volume * 100)}%</div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-16 h-3 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500/40 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
