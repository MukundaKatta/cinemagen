import type {
  CinematicPrompt,
  CostEstimate,
  ExportPreset,
  EXPORT_PRESETS,
  MotionPhysics,
} from '@/types/cinema';

const BASE_COST_PER_SECOND = 15; // cents
const UPSCALE_4K_COST = 50; // cents per clip
const AUDIO_GEN_COST_PER_SECOND = 5; // cents
const STORAGE_COST_PER_GB_MONTH = 2; // cents

const MOTION_MULTIPLIERS: Record<MotionPhysics, number> = {
  realistic: 1.0,
  'slow-motion-2x': 1.5,
  'slow-motion-4x': 2.0,
  'slow-motion-8x': 3.0,
  'time-lapse': 0.8,
  'hyper-lapse': 0.9,
  'bullet-time': 3.5,
  reverse: 1.0,
  'speed-ramp': 1.8,
};

const RESOLUTION_MULTIPLIERS: Record<string, number> = {
  '1080': 1.0,
  '1920': 1.5,
  '2160': 2.5,
  '3840': 3.0,
};

function getResolutionMultiplier(height: number): number {
  if (height <= 1080) return 1.0;
  if (height <= 1920) return 1.5;
  if (height <= 2160) return 2.5;
  return 3.0;
}

export function estimateCost(
  prompts: CinematicPrompt[],
  exportPreset: ExportPreset,
  includeAudio: boolean = false,
  include4KUpscale: boolean = false
): CostEstimate {
  const breakdown: CostEstimate['breakdown'] = [];
  let totalDuration = 0;

  let generationCost = 0;
  for (const prompt of prompts) {
    const motionMult = MOTION_MULTIPLIERS[prompt.motionPhysics];
    const clipCost = Math.ceil(prompt.duration * BASE_COST_PER_SECOND * motionMult);
    generationCost += clipCost;
    totalDuration += prompt.duration;

    breakdown.push({
      label: `Generation: ${prompt.description.slice(0, 40)}...`,
      cost: clipCost,
      detail: `${prompt.duration}s @ ${prompt.motionPhysics} (${motionMult}x)`,
    });
  }

  let upscalingCost = 0;
  if (include4KUpscale) {
    upscalingCost = prompts.length * UPSCALE_4K_COST;
    breakdown.push({
      label: '4K Upscaling',
      cost: upscalingCost,
      detail: `${prompts.length} clips @ $${(UPSCALE_4K_COST / 100).toFixed(2)} each`,
    });
  }

  let audioCost = 0;
  if (includeAudio) {
    audioCost = Math.ceil(totalDuration * AUDIO_GEN_COST_PER_SECOND);
    breakdown.push({
      label: 'Audio Generation',
      cost: audioCost,
      detail: `${totalDuration}s of audio`,
    });
  }

  const estimatedFileSizeGB = (totalDuration * 50) / 1024; // rough estimate
  const storageCost = Math.ceil(estimatedFileSizeGB * STORAGE_COST_PER_GB_MONTH);
  breakdown.push({
    label: 'Storage (monthly)',
    cost: storageCost,
    detail: `~${estimatedFileSizeGB.toFixed(2)} GB`,
  });

  const totalCost = generationCost + upscalingCost + audioCost + storageCost;

  const estimatedTimePerSecond = 12; // seconds of processing per second of video
  const estimatedTime = Math.ceil(totalDuration * estimatedTimePerSecond);

  return {
    generationCost,
    upscalingCost,
    audioCost,
    storageCost,
    totalCost,
    estimatedTime,
    breakdown,
  };
}

export function estimateSingleClipCost(prompt: CinematicPrompt): number {
  const motionMult = MOTION_MULTIPLIERS[prompt.motionPhysics];
  return Math.ceil(prompt.duration * BASE_COST_PER_SECOND * motionMult);
}

export function formatEstimatedTime(seconds: number): string {
  if (seconds < 60) return `~${seconds}s`;
  if (seconds < 3600) return `~${Math.ceil(seconds / 60)}min`;
  const hours = Math.floor(seconds / 3600);
  const mins = Math.ceil((seconds % 3600) / 60);
  return `~${hours}h ${mins}min`;
}
