import type {
  CinematicPrompt,
  ShotType,
  CameraMovement,
  LightingStyle,
  MotionPhysics,
  ColorGrading,
  LUTPreset,
  SHOT_TYPE_LABELS,
  CAMERA_MOVEMENT_LABELS,
  LUT_DESCRIPTIONS,
} from '@/types/cinema';

function shotTypeToText(shot: ShotType): string {
  const map: Record<ShotType, string> = {
    'extreme-wide': 'extreme wide shot showing vast landscape',
    wide: 'wide shot capturing full environment',
    full: 'full shot with subject head to toe',
    'medium-wide': 'medium-wide shot from knees up',
    medium: 'medium shot from waist up',
    'medium-close': 'medium close-up from chest up',
    'close-up': 'close-up shot focused on the face',
    'extreme-close-up': 'extreme close-up on fine detail',
    'over-the-shoulder': 'over-the-shoulder shot',
    'point-of-view': 'first-person point of view shot',
    'birds-eye': 'bird\'s eye view looking straight down',
    'worms-eye': 'worm\'s eye view looking up from ground',
    'dutch-angle': 'dutch angle with tilted frame',
  };
  return map[shot];
}

function cameraToText(movement: CameraMovement): string {
  const map: Record<CameraMovement, string> = {
    static: 'static camera on tripod',
    'pan-left': 'smooth pan to the left',
    'pan-right': 'smooth pan to the right',
    'tilt-up': 'camera tilting upward',
    'tilt-down': 'camera tilting downward',
    'dolly-in': 'dolly moving toward subject',
    'dolly-out': 'dolly pulling away from subject',
    'dolly-zoom': 'dolly zoom vertigo effect',
    'tracking-left': 'tracking shot moving left',
    'tracking-right': 'tracking shot moving right',
    'crane-up': 'crane shot rising vertically',
    'crane-down': 'crane shot descending',
    steadicam: 'smooth steadicam floating movement',
    handheld: 'organic handheld camera movement',
    orbit: 'camera orbiting around subject',
    'whip-pan': 'fast whip pan with motion blur',
    'zoom-in': 'lens zooming in toward subject',
    'zoom-out': 'lens zooming out from subject',
    'rack-focus': 'rack focus shifting between planes',
  };
  return map[movement];
}

function lightingToText(lighting: LightingStyle): string {
  const map: Record<LightingStyle, string> = {
    natural: 'natural lighting',
    'golden-hour': 'warm golden hour sunlight',
    'blue-hour': 'cool blue hour twilight',
    'high-key': 'bright high-key lighting',
    'low-key': 'dramatic low-key lighting with deep shadows',
    rembrandt: 'Rembrandt lighting with triangle cheek light',
    split: 'split lighting half-face illuminated',
    butterfly: 'butterfly lighting from above',
    rim: 'rim lighting outlining the subject',
    silhouette: 'silhouette with backlit subject',
    neon: 'neon-lit environment with colored lights',
    moonlight: 'soft cool moonlight',
    candlelight: 'warm flickering candlelight',
    'studio-three-point': 'professional three-point studio lighting',
    chiaroscuro: 'dramatic chiaroscuro contrast',
  };
  return map[lighting];
}

function motionToText(physics: MotionPhysics): string {
  const map: Record<MotionPhysics, string> = {
    realistic: '',
    'slow-motion-2x': 'in 2x slow motion',
    'slow-motion-4x': 'in 4x slow motion',
    'slow-motion-8x': 'in dramatic 8x slow motion',
    'time-lapse': 'as time-lapse',
    'hyper-lapse': 'as hyper-lapse',
    'bullet-time': 'in bullet-time freeze frame',
    reverse: 'played in reverse',
    'speed-ramp': 'with speed ramping effect',
  };
  return map[physics];
}

function colorGradingToText(grading: ColorGrading): string {
  const parts: string[] = [];

  if (grading.lut !== 'none') {
    const lutMap: Partial<Record<LUTPreset, string>> = {
      'cinematic-teal-orange': 'cinematic teal and orange color grading',
      'film-noir': 'film noir black and white',
      'bleach-bypass': 'bleach bypass desaturated look',
      'vintage-70s': 'vintage 1970s warm faded tones',
      'kodak-portra-400': 'Kodak Portra 400 film stock',
      'fuji-velvia-50': 'Fuji Velvia vivid saturated colors',
      'cross-process': 'cross-processed experimental colors',
      'day-for-night': 'day-for-night blue tinted',
      'desaturated-drama': 'desaturated dramatic tones',
      'warm-sunset': 'warm sunset golden tones',
      'cool-moonlight': 'cool moonlit blue tones',
      'matrix-green': 'green-tinted digital cyberpunk',
      'wes-anderson-pastel': 'Wes Anderson pastel palette',
      'noir-detective': 'dark noir detective mood',
      'blockbuster-summer': 'vibrant summer blockbuster colors',
    };
    if (lutMap[grading.lut]) {
      parts.push(lutMap[grading.lut]!);
    }
  }

  if (grading.filmGrain > 0.3) parts.push('with visible film grain');
  if (grading.vignette > 0.3) parts.push('with vignette');
  if (grading.letterbox) parts.push('with cinematic letterbox');

  return parts.join(', ');
}

function lensToText(focalLength: number, aperture: number): string {
  let lens = '';
  if (focalLength <= 24) lens = `ultra-wide ${focalLength}mm lens`;
  else if (focalLength <= 35) lens = `wide ${focalLength}mm lens`;
  else if (focalLength <= 50) lens = `standard ${focalLength}mm lens`;
  else if (focalLength <= 85) lens = `portrait ${focalLength}mm lens`;
  else if (focalLength <= 135) lens = `telephoto ${focalLength}mm lens`;
  else lens = `super telephoto ${focalLength}mm lens`;

  if (aperture <= 1.8) lens += ` at f/${aperture} with heavy bokeh`;
  else if (aperture <= 2.8) lens += ` at f/${aperture} with shallow depth of field`;
  else if (aperture >= 11) lens += ` at f/${aperture} with everything in focus`;

  return lens;
}

export function buildPromptText(prompt: CinematicPrompt): string {
  const parts: string[] = [];

  parts.push('Cinematic film quality,');
  parts.push(shotTypeToText(prompt.shotType) + ',');
  parts.push(cameraToText(prompt.cameraMovement) + ',');
  parts.push(lightingToText(prompt.lighting) + ',');
  parts.push(lensToText(prompt.focalLength, prompt.aperture) + ',');

  parts.push(prompt.description);

  const motion = motionToText(prompt.motionPhysics);
  if (motion) parts.push(motion);

  const color = colorGradingToText(prompt.colorGrading);
  if (color) parts.push(color);

  parts.push(`${prompt.aspectRatio} aspect ratio`);
  parts.push('8K resolution, photorealistic, film grain, cinematic depth of field');

  return parts.filter(Boolean).join(' ');
}

export function buildNegativePrompt(prompt: CinematicPrompt): string {
  const defaults = [
    'low quality',
    'blurry',
    'distorted',
    'deformed',
    'watermark',
    'text overlay',
    'amateur',
    'overexposed',
    'underexposed',
    'noise',
    'artifacts',
    'glitch',
    'unrealistic physics',
    'floating objects',
    'wrong perspective',
  ];

  if (prompt.negativePrompt) {
    return [...defaults, ...prompt.negativePrompt.split(',').map(s => s.trim())].join(', ');
  }

  return defaults.join(', ');
}

export function buildApiPayload(prompt: CinematicPrompt) {
  return {
    prompt: buildPromptText(prompt),
    negative_prompt: buildNegativePrompt(prompt),
    duration: prompt.duration,
    aspect_ratio: prompt.aspectRatio,
    seed: prompt.seed,
    motion_physics: prompt.motionPhysics,
    camera_movement: prompt.cameraMovement,
    character_ref: prompt.characterRef,
    style_ref: prompt.styleRef,
    color_grading: prompt.colorGrading,
  };
}
