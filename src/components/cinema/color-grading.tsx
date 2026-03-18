'use client';

import { useCinemaStore } from '@/hooks/use-cinema-store';
import { Slider } from '@/components/ui/slider';
import { LUT_DESCRIPTIONS, type LUTPreset } from '@/types/cinema';

const LUT_OPTIONS: LUTPreset[] = [
  'none', 'cinematic-teal-orange', 'film-noir', 'bleach-bypass', 'vintage-70s',
  'kodak-portra-400', 'fuji-velvia-50', 'cross-process', 'day-for-night',
  'desaturated-drama', 'warm-sunset', 'cool-moonlight', 'matrix-green',
  'wes-anderson-pastel', 'noir-detective', 'blockbuster-summer',
];

export function ColorGradingPanel() {
  const { currentPrompt, updateColorGrading, setLUT } = useCinemaStore();
  const grading = currentPrompt.colorGrading;

  return (
    <div className="space-y-3">
      <h3 className="cinema-label text-[11px]">Color Grading</h3>

      <div>
        <label className="cinema-label">LUT Preset</label>
        <div className="grid grid-cols-2 gap-1 max-h-36 overflow-y-auto">
          {LUT_OPTIONS.map((lut) => (
            <button
              key={lut}
              onClick={() => setLUT(lut)}
              className={`text-left p-1.5 rounded text-[10px] transition-all ${
                grading.lut === lut
                  ? 'bg-amber-600/20 border border-amber-500/30 text-amber-300'
                  : 'bg-white/3 text-white/40 hover:text-white/60 border border-transparent'
              }`}
            >
              {lut === 'none' ? 'No LUT' : lut.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>
        {grading.lut !== 'none' && (
          <p className="text-[9px] text-white/20 mt-1">{LUT_DESCRIPTIONS[grading.lut]}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        <Slider label="Exposure" value={grading.exposure} min={-2} max={2} step={0.1} unit="" onChange={(v) => updateColorGrading({ exposure: v })} />
        <Slider label="Contrast" value={grading.contrast} min={-1} max={1} step={0.05} unit="" onChange={(v) => updateColorGrading({ contrast: v })} />
        <Slider label="Saturation" value={grading.saturation} min={-1} max={1} step={0.05} unit="" onChange={(v) => updateColorGrading({ saturation: v })} />
        <Slider label="Temperature" value={grading.temperature} min={-1} max={1} step={0.05} unit="" onChange={(v) => updateColorGrading({ temperature: v })} />
        <Slider label="Tint" value={grading.tint} min={-1} max={1} step={0.05} unit="" onChange={(v) => updateColorGrading({ tint: v })} />
        <Slider label="Vibrance" value={grading.vibrance} min={-1} max={1} step={0.05} unit="" onChange={(v) => updateColorGrading({ vibrance: v })} />
        <Slider label="Blacks" value={grading.blacks} min={-1} max={1} step={0.05} unit="" onChange={(v) => updateColorGrading({ blacks: v })} />
        <Slider label="Whites" value={grading.whites} min={-1} max={1} step={0.05} unit="" onChange={(v) => updateColorGrading({ whites: v })} />
        <Slider label="Gamma" value={grading.gamma} min={0.2} max={3} step={0.05} unit="" onChange={(v) => updateColorGrading({ gamma: v })} />
        <Slider label="Film Grain" value={grading.filmGrain} min={0} max={1} step={0.05} unit="" onChange={(v) => updateColorGrading({ filmGrain: v })} />
        <Slider label="Vignette" value={grading.vignette} min={0} max={1} step={0.05} unit="" onChange={(v) => updateColorGrading({ vignette: v })} />
        <Slider label="Bloom" value={grading.bloom} min={0} max={1} step={0.05} unit="" onChange={(v) => updateColorGrading({ bloom: v })} />
      </div>

      <div>
        <label className="cinema-label">Chromatic Aberration</label>
        <Slider label="" value={grading.chromaticAberration} min={0} max={1} step={0.01} unit="" onChange={(v) => updateColorGrading({ chromaticAberration: v })} />
      </div>

      <div className="flex items-center justify-between">
        <label className="cinema-label mb-0">Letterbox</label>
        <button
          onClick={() => updateColorGrading({ letterbox: !grading.letterbox })}
          className={`w-8 h-4 rounded-full transition ${grading.letterbox ? 'bg-amber-600' : 'bg-white/10'}`}
        >
          <div className={`w-3 h-3 rounded-full bg-white transition-transform ${grading.letterbox ? 'translate-x-4' : 'translate-x-0.5'}`} />
        </button>
      </div>

      <button
        onClick={() => {
          updateColorGrading({
            lut: 'none', exposure: 0, contrast: 0, saturation: 0, temperature: 0,
            tint: 0, vibrance: 0, blacks: 0, whites: 0, gamma: 1, filmGrain: 0.1,
            vignette: 0.15, chromaticAberration: 0, bloom: 0, letterbox: true,
          });
        }}
        className="cinema-btn-ghost text-[10px] w-full"
      >
        Reset to Defaults
      </button>
    </div>
  );
}
