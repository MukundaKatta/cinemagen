'use client';

import { useState } from 'react';
import { useCinemaStore } from '@/hooks/use-cinema-store';
import { parseScript, scenesToPromptDescriptions } from '@/lib/script-parser';
import { estimateCost, formatEstimatedTime } from '@/lib/cost-estimator';
import type { ScriptScene } from '@/types/cinema';
import { v4 as uuid } from 'uuid';

const SAMPLE_SCRIPTS = [
  {
    label: 'Noir Detective',
    text: `INT. DETECTIVE'S OFFICE - NIGHT
Rain streaks down the window. DETECTIVE COLE sits at his desk, whiskey glass in hand, shadows playing across his weathered face.

The phone rings. He stares at it. Three rings. Four. He picks up.

COLE
Yeah?

EXT. RAIN-SOAKED ALLEY - NIGHT
A dark figure stands under a flickering streetlight, collar up against the rain. This is MARLOWE.

MARLOWE
We need to talk. The dock. One hour.

The line goes dead. Cole looks out the window at the neon-lit streets below.`,
  },
  {
    label: 'Sci-Fi Discovery',
    text: `EXT. ALIEN PLANET SURFACE - DAY
Wide shot of an otherworldly landscape. Twin suns hang low on the horizon, casting long purple shadows across crystalline formations.

DR. CHEN walks across the terrain, scanning with a handheld device. The device beeps urgently.

She kneels beside a formation, brushing away dust to reveal a glowing symbol etched into the rock.

DR. CHEN
(whispering)
My god... it's a language.

Close up on the symbol pulsing with soft blue light.`,
  },
];

export function ScriptToVideo() {
  const { addScript, updatePrompt, applyFilmGrammar, setActiveTab } = useCinemaStore();
  const [scriptText, setScriptText] = useState('');
  const [parsedScenes, setParsedScenes] = useState<ScriptScene[]>([]);
  const [selectedSceneIdx, setSelectedSceneIdx] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  function handleParse() {
    const scenes = parseScript(scriptText);
    setParsedScenes(scenes);
    setSelectedSceneIdx(scenes.length > 0 ? 0 : null);

    addScript({
      id: uuid(),
      projectId: 'local',
      title: 'Untitled Script',
      rawText: scriptText,
      scenes,
      createdAt: new Date().toISOString(),
    });
  }

  function handleLoadScene(idx: number) {
    const scene = parsedScenes[idx];
    if (!scene) return;

    updatePrompt({
      description: scene.description,
      shotType: scene.shotType,
      cameraMovement: scene.cameraMovement,
      lighting: scene.lighting,
      duration: scene.duration,
    });

    setActiveTab('generate');
  }

  async function handleGenerateAll() {
    setIsProcessing(true);
    for (let i = 0; i < parsedScenes.length; i++) {
      setSelectedSceneIdx(i);
      handleLoadScene(i);
      await new Promise((r) => setTimeout(r, 500));
    }
    setIsProcessing(false);
  }

  const prompts = parsedScenes.map((s) => ({
    ...useCinemaStore.getState().currentPrompt,
    description: s.description,
    shotType: s.shotType,
    cameraMovement: s.cameraMovement,
    lighting: s.lighting,
    duration: s.duration,
  }));

  const costEstimate = prompts.length > 0 ? estimateCost(prompts, 'youtube-1080p') : null;

  return (
    <div className="p-3 space-y-3">
      <h3 className="cinema-label text-[11px]">Script to Video</h3>

      <div>
        <label className="cinema-label">Quick Load</label>
        <div className="flex gap-1">
          {SAMPLE_SCRIPTS.map((s) => (
            <button key={s.label} onClick={() => setScriptText(s.text)} className="cinema-btn-secondary text-[10px] flex-1 py-1">
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="cinema-label">Script</label>
        <textarea
          value={scriptText}
          onChange={(e) => setScriptText(e.target.value)}
          placeholder="Paste your screenplay or scene descriptions...&#10;&#10;Use INT./EXT. scene headers for automatic parsing.&#10;Character names in CAPS for dialogue detection."
          className="cinema-input h-48 resize-none text-xs font-mono"
        />
      </div>

      <button onClick={handleParse} disabled={!scriptText.trim()} className="cinema-btn-primary w-full text-xs">
        Parse Script
      </button>

      {parsedScenes.length > 0 && (
        <>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="cinema-label mb-0">Scenes ({parsedScenes.length})</label>
              {costEstimate && (
                <span className="text-[10px] text-amber-400/60">
                  ~${(costEstimate.totalCost / 100).toFixed(2)} | {formatEstimatedTime(costEstimate.estimatedTime)}
                </span>
              )}
            </div>

            <div className="space-y-1 max-h-48 overflow-y-auto">
              {parsedScenes.map((scene, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedSceneIdx(idx)}
                  className={`p-2 rounded-md cursor-pointer transition-all text-xs ${
                    selectedSceneIdx === idx
                      ? 'bg-amber-600/15 border border-amber-500/20'
                      : 'bg-white/3 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-white/60 font-medium">Scene {scene.sceneNumber}</span>
                    <span className="text-white/20">{scene.duration}s</span>
                  </div>
                  <p className="text-white/30 truncate">{scene.description.slice(0, 80)}</p>
                  <div className="flex gap-1 mt-1">
                    <span className="cinema-badge-accent">{scene.shotType}</span>
                    <span className="cinema-badge-accent">{scene.lighting}</span>
                    {scene.mood !== 'neutral' && <span className="cinema-badge-accent">{scene.mood}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedSceneIdx !== null && (
            <div className="flex gap-2">
              <button onClick={() => handleLoadScene(selectedSceneIdx)} className="cinema-btn-secondary flex-1 text-xs">
                Load Scene {selectedSceneIdx + 1}
              </button>
              <button onClick={handleGenerateAll} disabled={isProcessing} className="cinema-btn-primary flex-1 text-xs">
                {isProcessing ? 'Processing...' : 'Generate All'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
