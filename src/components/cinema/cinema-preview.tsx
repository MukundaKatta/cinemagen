'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useCinemaStore } from '@/hooks/use-cinema-store';
import { buildPromptText } from '@/lib/prompt-builder';
import { estimateSingleClipCost, formatEstimatedTime } from '@/lib/cost-estimator';

export function CinemaPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentPrompt = useCinemaStore((s) => s.currentPrompt);
  const isGenerating = useCinemaStore((s) => s.isGenerating);
  const setIsGenerating = useCinemaStore((s) => s.setIsGenerating);
  const addJob = useCinemaStore((s) => s.addJob);
  const jobs = useCinemaStore((s) => s.jobs);

  const renderPreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.clientWidth * 2;
    canvas.height = canvas.clientHeight * 2;
    ctx.scale(2, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    // Background based on lighting
    const bgMap: Record<string, string> = {
      'natural': '#1a1f25', 'golden-hour': '#2a1f10', 'blue-hour': '#0f1520',
      'high-key': '#252530', 'low-key': '#0a0a0f', 'neon': '#0a0515',
      'moonlight': '#0c1018', 'candlelight': '#1a1510', 'silhouette': '#050508',
    };
    ctx.fillStyle = bgMap[currentPrompt.lighting] || '#0f1015';
    ctx.fillRect(0, 0, w, h);

    // Letterbox
    if (currentPrompt.colorGrading.letterbox) {
      const barH = h * 0.1;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, barH);
      ctx.fillRect(0, h - barH, w, barH);
    }

    // Vignette
    if (currentPrompt.colorGrading.vignette > 0) {
      const grad = ctx.createRadialGradient(w / 2, h / 2, w * 0.25, w / 2, h / 2, w * 0.7);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, `rgba(0,0,0,${currentPrompt.colorGrading.vignette})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    // Film grain
    if (currentPrompt.colorGrading.filmGrain > 0.1) {
      ctx.globalAlpha = currentPrompt.colorGrading.filmGrain * 0.3;
      for (let i = 0; i < 200; i++) {
        const gx = Math.random() * w;
        const gy = Math.random() * h;
        ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
        ctx.fillRect(gx, gy, 1, 1);
      }
      ctx.globalAlpha = 1;
    }

    // Center info
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.font = '11px Inter';
    ctx.textAlign = 'center';
    if (currentPrompt.description) {
      ctx.fillText(currentPrompt.description.slice(0, 60) + (currentPrompt.description.length > 60 ? '...' : ''), w / 2, h / 2 - 8);
    } else {
      ctx.fillText('Enter a scene description to preview', w / 2, h / 2 - 8);
    }

    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.font = '9px Inter';
    ctx.fillText(`${currentPrompt.shotType} | ${currentPrompt.cameraMovement} | ${currentPrompt.lighting} | ${currentPrompt.aspectRatio}`, w / 2, h / 2 + 12);

    // LUT overlay
    const lutColors: Record<string, string> = {
      'cinematic-teal-orange': 'rgba(0,128,128,0.06)', 'film-noir': 'rgba(0,0,0,0.15)',
      'vintage-70s': 'rgba(255,200,100,0.06)', 'cool-moonlight': 'rgba(50,100,200,0.06)',
      'warm-sunset': 'rgba(255,150,50,0.06)', 'matrix-green': 'rgba(0,255,0,0.04)',
    };
    const lutOverlay = lutColors[currentPrompt.colorGrading.lut];
    if (lutOverlay) {
      ctx.fillStyle = lutOverlay;
      ctx.fillRect(0, 0, w, h);
    }
  }, [currentPrompt]);

  useEffect(() => { renderPreview(); }, [renderPreview]);

  const cost = estimateSingleClipCost(currentPrompt);
  const promptText = buildPromptText(currentPrompt);

  async function handleGenerate() {
    if (!currentPrompt.description.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentPrompt }),
      });

      if (res.ok) {
        const data = await res.json();
        addJob({
          id: data.id || crypto.randomUUID(),
          projectId: 'local',
          prompt: currentPrompt,
          status: 'queued',
          progress: 0,
          videoUrl: null,
          thumbnailUrl: null,
          cost,
          createdAt: new Date().toISOString(),
          completedAt: null,
          error: null,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 bg-black/30">
        <div className="relative rounded-lg overflow-hidden shadow-2xl" style={{ maxWidth: '720px', width: '100%', aspectRatio: currentPrompt.aspectRatio.replace(':', '/') }}>
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      </div>

      <div className="px-4 py-2 border-t border-white/5 bg-[#0e0e14] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-white/20">
            {currentPrompt.focalLength}mm f/{currentPrompt.aperture} | {currentPrompt.duration}s | {currentPrompt.motionPhysics}
          </span>
          <span className="text-[10px] text-amber-400/60">${(cost / 100).toFixed(2)} est.</span>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !currentPrompt.description.trim()}
          className="cinema-btn-primary text-xs"
        >
          {isGenerating ? 'Generating...' : 'Generate Clip'}
        </button>
      </div>

      {jobs.length > 0 && (
        <div className="px-4 py-2 border-t border-white/5 bg-[#0a0a10] max-h-24 overflow-y-auto">
          {jobs.slice(0, 5).map((job) => (
            <div key={job.id} className="flex items-center justify-between py-1">
              <span className="text-[10px] text-white/30 truncate max-w-[200px]">{job.prompt.description.slice(0, 40)}</span>
              <span className={`text-[10px] ${
                job.status === 'complete' ? 'text-green-400' : job.status === 'failed' ? 'text-red-400' : 'text-amber-300'
              }`}>{job.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
