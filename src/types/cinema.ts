export type ShotType =
  | 'extreme-wide'
  | 'wide'
  | 'full'
  | 'medium-wide'
  | 'medium'
  | 'medium-close'
  | 'close-up'
  | 'extreme-close-up'
  | 'over-the-shoulder'
  | 'point-of-view'
  | 'birds-eye'
  | 'worms-eye'
  | 'dutch-angle';

export type CameraMovement =
  | 'static'
  | 'pan-left'
  | 'pan-right'
  | 'tilt-up'
  | 'tilt-down'
  | 'dolly-in'
  | 'dolly-out'
  | 'dolly-zoom'
  | 'tracking-left'
  | 'tracking-right'
  | 'crane-up'
  | 'crane-down'
  | 'steadicam'
  | 'handheld'
  | 'orbit'
  | 'whip-pan'
  | 'zoom-in'
  | 'zoom-out'
  | 'rack-focus';

export type LightingStyle =
  | 'natural'
  | 'golden-hour'
  | 'blue-hour'
  | 'high-key'
  | 'low-key'
  | 'rembrandt'
  | 'split'
  | 'butterfly'
  | 'rim'
  | 'silhouette'
  | 'neon'
  | 'moonlight'
  | 'candlelight'
  | 'studio-three-point'
  | 'chiaroscuro';

export type FilmGrammarPreset =
  | 'establishing-shot'
  | 'close-up-reaction'
  | 'tracking-follow'
  | 'dolly-zoom-vertigo'
  | 'overhead-surveillance'
  | 'whip-pan-transition'
  | 'slow-reveal'
  | 'pull-back-reveal'
  | 'circular-orbit'
  | 'first-person-pov';

export type LUTPreset =
  | 'none'
  | 'cinematic-teal-orange'
  | 'film-noir'
  | 'bleach-bypass'
  | 'vintage-70s'
  | 'kodak-portra-400'
  | 'fuji-velvia-50'
  | 'cross-process'
  | 'day-for-night'
  | 'desaturated-drama'
  | 'warm-sunset'
  | 'cool-moonlight'
  | 'matrix-green'
  | 'wes-anderson-pastel'
  | 'noir-detective'
  | 'blockbuster-summer';

export type ExportPreset =
  | 'youtube-4k'
  | 'youtube-1080p'
  | 'instagram-reel'
  | 'instagram-post'
  | 'tiktok'
  | 'film-24fps'
  | 'film-30fps'
  | 'film-60fps'
  | 'twitter'
  | 'custom';

export type AspectRatio =
  | '16:9'
  | '21:9'
  | '4:3'
  | '1:1'
  | '9:16'
  | '2.39:1'
  | '1.85:1';

export type MotionPhysics =
  | 'realistic'
  | 'slow-motion-2x'
  | 'slow-motion-4x'
  | 'slow-motion-8x'
  | 'time-lapse'
  | 'hyper-lapse'
  | 'bullet-time'
  | 'reverse'
  | 'speed-ramp';

export type TransitionType =
  | 'cut'
  | 'dissolve'
  | 'fade-to-black'
  | 'fade-from-black'
  | 'wipe-left'
  | 'wipe-right'
  | 'wipe-up'
  | 'wipe-down'
  | 'iris'
  | 'morph'
  | 'whip'
  | 'zoom-through'
  | 'match-cut'
  | 'j-cut'
  | 'l-cut';

export interface ColorWheel {
  shadows: { r: number; g: number; b: number };
  midtones: { r: number; g: number; b: number };
  highlights: { r: number; g: number; b: number };
}

export interface ColorGrading {
  lut: LUTPreset;
  colorWheel: ColorWheel;
  exposure: number;
  contrast: number;
  saturation: number;
  temperature: number;
  tint: number;
  vibrance: number;
  blacks: number;
  whites: number;
  gamma: number;
  filmGrain: number;
  vignette: number;
  chromaticAberration: number;
  bloom: number;
  letterbox: boolean;
}

export interface CinematicPrompt {
  id: string;
  description: string;
  shotType: ShotType;
  cameraMovement: CameraMovement;
  lighting: LightingStyle;
  filmGrammar: FilmGrammarPreset | null;
  colorGrading: ColorGrading;
  motionPhysics: MotionPhysics;
  duration: number;
  aspectRatio: AspectRatio;
  focalLength: number;
  aperture: number;
  negativePrompt: string;
  seed: number | null;
  characterRef: string | null;
  styleRef: string | null;
}

export interface GenerationJob {
  id: string;
  projectId: string;
  prompt: CinematicPrompt;
  status: 'queued' | 'processing' | 'rendering' | 'upscaling' | 'complete' | 'failed';
  progress: number;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  cost: number;
  createdAt: string;
  completedAt: string | null;
  error: string | null;
}

export interface Character {
  id: string;
  projectId: string;
  name: string;
  description: string;
  referenceImages: string[];
  embedding: number[] | null;
  createdAt: string;
}

export interface VideoClip {
  id: string;
  projectId: string;
  jobId: string;
  name: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  resolution: { width: number; height: number };
  fps: number;
  order: number;
  transition: TransitionType;
  transitionDuration: number;
  trimStart: number;
  trimEnd: number;
  audioTrack: AudioTrack | null;
}

export interface AudioTrack {
  id: string;
  name: string;
  url: string;
  duration: number;
  type: 'generated' | 'uploaded' | 'soundtrack';
  volume: number;
  fadeIn: number;
  fadeOut: number;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  clips: VideoClip[];
  characters: Character[];
  exportPreset: ExportPreset;
  createdAt: string;
  updatedAt: string;
}

export interface ScriptScene {
  sceneNumber: number;
  description: string;
  dialogue: string;
  direction: string;
  shotType: ShotType;
  cameraMovement: CameraMovement;
  lighting: LightingStyle;
  duration: number;
  characters: string[];
  location: string;
  mood: string;
}

export interface Script {
  id: string;
  projectId: string;
  title: string;
  rawText: string;
  scenes: ScriptScene[];
  createdAt: string;
}

export interface CostEstimate {
  generationCost: number;
  upscalingCost: number;
  audioCost: number;
  storageCost: number;
  totalCost: number;
  estimatedTime: number;
  breakdown: {
    label: string;
    cost: number;
    detail: string;
  }[];
}

export interface ExportConfig {
  preset: ExportPreset;
  resolution: { width: number; height: number };
  fps: number;
  codec: string;
  bitrate: number;
  format: 'mp4' | 'mov' | 'webm';
  audioCodec: string;
  audioBitrate: number;
}

export const EXPORT_PRESETS: Record<ExportPreset, ExportConfig> = {
  'youtube-4k': {
    preset: 'youtube-4k',
    resolution: { width: 3840, height: 2160 },
    fps: 30,
    codec: 'H.265',
    bitrate: 40000,
    format: 'mp4',
    audioCodec: 'AAC',
    audioBitrate: 320,
  },
  'youtube-1080p': {
    preset: 'youtube-1080p',
    resolution: { width: 1920, height: 1080 },
    fps: 30,
    codec: 'H.264',
    bitrate: 12000,
    format: 'mp4',
    audioCodec: 'AAC',
    audioBitrate: 256,
  },
  'instagram-reel': {
    preset: 'instagram-reel',
    resolution: { width: 1080, height: 1920 },
    fps: 30,
    codec: 'H.264',
    bitrate: 8000,
    format: 'mp4',
    audioCodec: 'AAC',
    audioBitrate: 192,
  },
  'instagram-post': {
    preset: 'instagram-post',
    resolution: { width: 1080, height: 1080 },
    fps: 30,
    codec: 'H.264',
    bitrate: 6000,
    format: 'mp4',
    audioCodec: 'AAC',
    audioBitrate: 192,
  },
  tiktok: {
    preset: 'tiktok',
    resolution: { width: 1080, height: 1920 },
    fps: 30,
    codec: 'H.264',
    bitrate: 8000,
    format: 'mp4',
    audioCodec: 'AAC',
    audioBitrate: 192,
  },
  'film-24fps': {
    preset: 'film-24fps',
    resolution: { width: 3840, height: 2160 },
    fps: 24,
    codec: 'ProRes',
    bitrate: 100000,
    format: 'mov',
    audioCodec: 'PCM',
    audioBitrate: 1536,
  },
  'film-30fps': {
    preset: 'film-30fps',
    resolution: { width: 3840, height: 2160 },
    fps: 30,
    codec: 'ProRes',
    bitrate: 100000,
    format: 'mov',
    audioCodec: 'PCM',
    audioBitrate: 1536,
  },
  'film-60fps': {
    preset: 'film-60fps',
    resolution: { width: 3840, height: 2160 },
    fps: 60,
    codec: 'ProRes',
    bitrate: 150000,
    format: 'mov',
    audioCodec: 'PCM',
    audioBitrate: 1536,
  },
  twitter: {
    preset: 'twitter',
    resolution: { width: 1920, height: 1080 },
    fps: 30,
    codec: 'H.264',
    bitrate: 8000,
    format: 'mp4',
    audioCodec: 'AAC',
    audioBitrate: 192,
  },
  custom: {
    preset: 'custom',
    resolution: { width: 1920, height: 1080 },
    fps: 30,
    codec: 'H.264',
    bitrate: 12000,
    format: 'mp4',
    audioCodec: 'AAC',
    audioBitrate: 256,
  },
};

export const SHOT_TYPE_LABELS: Record<ShotType, { label: string; description: string }> = {
  'extreme-wide': { label: 'Extreme Wide Shot (EWS)', description: 'Vast landscape, subject tiny in frame' },
  wide: { label: 'Wide Shot (WS)', description: 'Full environment with subject visible' },
  full: { label: 'Full Shot (FS)', description: 'Subject fills frame head to toe' },
  'medium-wide': { label: 'Medium Wide (MWS)', description: 'Subject from knees up' },
  medium: { label: 'Medium Shot (MS)', description: 'Subject from waist up' },
  'medium-close': { label: 'Medium Close-Up (MCU)', description: 'Subject from chest up' },
  'close-up': { label: 'Close-Up (CU)', description: 'Face fills the frame' },
  'extreme-close-up': { label: 'Extreme Close-Up (ECU)', description: 'Single detail fills frame' },
  'over-the-shoulder': { label: 'Over the Shoulder (OTS)', description: 'Shot from behind one person' },
  'point-of-view': { label: 'Point of View (POV)', description: 'Camera as character eyes' },
  'birds-eye': { label: "Bird's Eye View", description: 'Directly overhead looking down' },
  'worms-eye': { label: "Worm's Eye View", description: 'Ground level looking up' },
  'dutch-angle': { label: 'Dutch Angle', description: 'Tilted frame for unease' },
};

export const CAMERA_MOVEMENT_LABELS: Record<CameraMovement, { label: string; description: string }> = {
  static: { label: 'Static', description: 'Camera stays fixed on tripod' },
  'pan-left': { label: 'Pan Left', description: 'Camera pivots left on axis' },
  'pan-right': { label: 'Pan Right', description: 'Camera pivots right on axis' },
  'tilt-up': { label: 'Tilt Up', description: 'Camera tilts upward' },
  'tilt-down': { label: 'Tilt Down', description: 'Camera tilts downward' },
  'dolly-in': { label: 'Dolly In', description: 'Camera physically moves toward subject' },
  'dolly-out': { label: 'Dolly Out', description: 'Camera physically pulls away' },
  'dolly-zoom': { label: 'Dolly Zoom (Vertigo)', description: 'Dolly in while zooming out' },
  'tracking-left': { label: 'Tracking Left', description: 'Camera moves parallel, left' },
  'tracking-right': { label: 'Tracking Right', description: 'Camera moves parallel, right' },
  'crane-up': { label: 'Crane Up', description: 'Camera rises vertically' },
  'crane-down': { label: 'Crane Down', description: 'Camera descends vertically' },
  steadicam: { label: 'Steadicam', description: 'Smooth floating movement' },
  handheld: { label: 'Handheld', description: 'Organic, slightly shaky movement' },
  orbit: { label: 'Orbit', description: 'Camera circles the subject' },
  'whip-pan': { label: 'Whip Pan', description: 'Very fast pan creating blur' },
  'zoom-in': { label: 'Zoom In', description: 'Lens zooms toward subject' },
  'zoom-out': { label: 'Zoom Out', description: 'Lens zooms away from subject' },
  'rack-focus': { label: 'Rack Focus', description: 'Shift focus between subjects' },
};

export const FILM_GRAMMAR_PRESETS: Record<FilmGrammarPreset, {
  label: string;
  description: string;
  shotType: ShotType;
  cameraMovement: CameraMovement;
  lighting: LightingStyle;
  duration: number;
}> = {
  'establishing-shot': {
    label: 'Establishing Shot',
    description: 'Wide shot to set the scene location and time',
    shotType: 'extreme-wide',
    cameraMovement: 'pan-right',
    lighting: 'natural',
    duration: 5,
  },
  'close-up-reaction': {
    label: 'Close-Up Reaction',
    description: 'Tight on face to capture emotional response',
    shotType: 'close-up',
    cameraMovement: 'static',
    lighting: 'rembrandt',
    duration: 3,
  },
  'tracking-follow': {
    label: 'Tracking Follow',
    description: 'Camera follows subject through space',
    shotType: 'medium',
    cameraMovement: 'steadicam',
    lighting: 'natural',
    duration: 6,
  },
  'dolly-zoom-vertigo': {
    label: 'Dolly Zoom (Vertigo Effect)',
    description: 'Disorienting perspective shift on subject',
    shotType: 'medium',
    cameraMovement: 'dolly-zoom',
    lighting: 'low-key',
    duration: 4,
  },
  'overhead-surveillance': {
    label: 'Overhead Surveillance',
    description: 'Top-down view of the action',
    shotType: 'birds-eye',
    cameraMovement: 'static',
    lighting: 'high-key',
    duration: 4,
  },
  'whip-pan-transition': {
    label: 'Whip Pan Transition',
    description: 'Fast pan to transition between scenes',
    shotType: 'medium',
    cameraMovement: 'whip-pan',
    lighting: 'natural',
    duration: 2,
  },
  'slow-reveal': {
    label: 'Slow Reveal',
    description: 'Gradual pan or tilt to reveal key element',
    shotType: 'medium-close',
    cameraMovement: 'tilt-up',
    lighting: 'low-key',
    duration: 5,
  },
  'pull-back-reveal': {
    label: 'Pull-Back Reveal',
    description: 'Dolly out to reveal wider context',
    shotType: 'close-up',
    cameraMovement: 'dolly-out',
    lighting: 'natural',
    duration: 6,
  },
  'circular-orbit': {
    label: 'Circular Orbit',
    description: 'Camera orbits around the subject',
    shotType: 'medium',
    cameraMovement: 'orbit',
    lighting: 'rim',
    duration: 5,
  },
  'first-person-pov': {
    label: 'First Person POV',
    description: 'Camera as the character eyes',
    shotType: 'point-of-view',
    cameraMovement: 'handheld',
    lighting: 'natural',
    duration: 4,
  },
};

export const LUT_DESCRIPTIONS: Record<LUTPreset, string> = {
  none: 'No color grading applied',
  'cinematic-teal-orange': 'Hollywood blockbuster teal shadows, orange highlights',
  'film-noir': 'High contrast black and white with dramatic shadows',
  'bleach-bypass': 'Desaturated, high contrast, silver-retained look',
  'vintage-70s': 'Warm, faded tones with soft grain',
  'kodak-portra-400': 'Natural skin tones, soft colors, classic film',
  'fuji-velvia-50': 'Vivid saturated colors, deep blacks',
  'cross-process': 'Shifted colors, high saturation, experimental',
  'day-for-night': 'Blue-tinted to simulate nighttime from daylight',
  'desaturated-drama': 'Pulled-back colors for serious tone',
  'warm-sunset': 'Rich warm golden tones throughout',
  'cool-moonlight': 'Cool blue tones with soft contrast',
  'matrix-green': 'Green-tinted cyberpunk digital world',
  'wes-anderson-pastel': 'Soft pastel palette with symmetry-friendly tones',
  'noir-detective': 'Deep shadows, minimal highlights, moody',
  'blockbuster-summer': 'Vibrant, punchy colors with clean contrast',
};
