import type { ScriptScene, ShotType, CameraMovement, LightingStyle } from '@/types/cinema';

const SHOT_KEYWORDS: Record<string, ShotType> = {
  'extreme wide': 'extreme-wide',
  'wide shot': 'wide',
  'full shot': 'full',
  'medium wide': 'medium-wide',
  'medium shot': 'medium',
  'medium close': 'medium-close',
  'close up': 'close-up',
  'closeup': 'close-up',
  'extreme close': 'extreme-close-up',
  'over the shoulder': 'over-the-shoulder',
  'ots': 'over-the-shoulder',
  'pov': 'point-of-view',
  'point of view': 'point-of-view',
  'bird': 'birds-eye',
  'overhead': 'birds-eye',
  'low angle': 'worms-eye',
  'dutch': 'dutch-angle',
};

const CAMERA_KEYWORDS: Record<string, CameraMovement> = {
  'pan left': 'pan-left',
  'pan right': 'pan-right',
  'tilt up': 'tilt-up',
  'tilt down': 'tilt-down',
  'dolly in': 'dolly-in',
  'push in': 'dolly-in',
  'dolly out': 'dolly-out',
  'pull out': 'dolly-out',
  'dolly zoom': 'dolly-zoom',
  'vertigo': 'dolly-zoom',
  'track left': 'tracking-left',
  'track right': 'tracking-right',
  'tracking': 'tracking-right',
  'crane up': 'crane-up',
  'crane down': 'crane-down',
  'steadicam': 'steadicam',
  'steady cam': 'steadicam',
  'handheld': 'handheld',
  'orbit': 'orbit',
  'whip pan': 'whip-pan',
  'zoom in': 'zoom-in',
  'zoom out': 'zoom-out',
  'rack focus': 'rack-focus',
};

const LIGHTING_KEYWORDS: Record<string, LightingStyle> = {
  'golden hour': 'golden-hour',
  'sunset': 'golden-hour',
  'blue hour': 'blue-hour',
  'twilight': 'blue-hour',
  'bright': 'high-key',
  'dark': 'low-key',
  'dramatic': 'low-key',
  'shadow': 'low-key',
  'neon': 'neon',
  'moon': 'moonlight',
  'night': 'moonlight',
  'candle': 'candlelight',
  'silhouette': 'silhouette',
  'backlit': 'rim',
};

const MOOD_KEYWORDS = [
  'tense', 'peaceful', 'romantic', 'mysterious', 'chaotic',
  'melancholic', 'joyful', 'suspenseful', 'epic', 'intimate',
  'eerie', 'nostalgic', 'triumphant', 'somber', 'whimsical',
];

function detectFromText<T>(text: string, keywords: Record<string, T>, fallback: T): T {
  const lower = text.toLowerCase();
  for (const [keyword, value] of Object.entries(keywords)) {
    if (lower.includes(keyword)) return value;
  }
  return fallback;
}

function detectMood(text: string): string {
  const lower = text.toLowerCase();
  for (const mood of MOOD_KEYWORDS) {
    if (lower.includes(mood)) return mood;
  }
  return 'neutral';
}

function extractCharacters(text: string): string[] {
  const characterPatterns = [
    /([A-Z][A-Z\s]+)(?:\s*\(.*?\))?\s*:/g,
    /(?:^|\n)\s*([A-Z]{2,}(?:\s+[A-Z]+)*)\s*$/gm,
  ];

  const characters = new Set<string>();
  for (const pattern of characterPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const name = match[1].trim();
      if (name.length > 1 && name.length < 30 && !['INT', 'EXT', 'CUT', 'FADE', 'DISSOLVE', 'SCENE'].includes(name)) {
        characters.add(name.charAt(0) + name.slice(1).toLowerCase());
      }
    }
  }
  return Array.from(characters);
}

function extractLocation(text: string): string {
  const locationMatch = text.match(/(?:INT|EXT)\.?\s*[-–]\s*(.+?)(?:\s*[-–]\s*(DAY|NIGHT|DAWN|DUSK|MORNING|EVENING))?$/im);
  if (locationMatch) {
    return locationMatch[1].trim();
  }
  return 'Unknown location';
}

function estimateDuration(text: string): number {
  const words = text.split(/\s+/).length;
  const baseDuration = Math.max(3, Math.min(10, Math.ceil(words / 15)));
  return baseDuration;
}

export function parseScript(rawText: string): ScriptScene[] {
  const scenes: ScriptScene[] = [];

  const sceneBlocks = rawText.split(/(?=(?:INT|EXT)\.?\s*[-–])/i).filter(block => block.trim());

  if (sceneBlocks.length === 0) {
    const paragraphs = rawText.split(/\n\n+/).filter(p => p.trim());
    for (let i = 0; i < paragraphs.length; i++) {
      const text = paragraphs[i].trim();
      scenes.push({
        sceneNumber: i + 1,
        description: text,
        dialogue: '',
        direction: text,
        shotType: detectFromText(text, SHOT_KEYWORDS, i === 0 ? 'wide' : 'medium'),
        cameraMovement: detectFromText(text, CAMERA_KEYWORDS, 'static'),
        lighting: detectFromText(text, LIGHTING_KEYWORDS, 'natural'),
        duration: estimateDuration(text),
        characters: extractCharacters(text),
        location: extractLocation(text),
        mood: detectMood(text),
      });
    }
    return scenes;
  }

  for (let i = 0; i < sceneBlocks.length; i++) {
    const block = sceneBlocks[i].trim();
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);

    const headerLine = lines[0] || '';
    const bodyLines = lines.slice(1);
    const bodyText = bodyLines.join(' ');

    const dialogueLines: string[] = [];
    const directionLines: string[] = [];
    let inDialogue = false;

    for (const line of bodyLines) {
      if (/^[A-Z]{2,}(\s+[A-Z]+)*\s*(\(.*?\))?\s*$/.test(line)) {
        inDialogue = true;
        continue;
      }
      if (/^\(.*?\)$/.test(line)) continue;

      if (inDialogue && !/^[A-Z]{2,}/.test(line)) {
        dialogueLines.push(line);
        inDialogue = false;
      } else {
        directionLines.push(line);
        inDialogue = false;
      }
    }

    const fullText = headerLine + ' ' + bodyText;

    scenes.push({
      sceneNumber: i + 1,
      description: directionLines.join(' ') || bodyText,
      dialogue: dialogueLines.join(' '),
      direction: directionLines.join(' '),
      shotType: detectFromText(fullText, SHOT_KEYWORDS, i === 0 ? 'extreme-wide' : 'medium'),
      cameraMovement: detectFromText(fullText, CAMERA_KEYWORDS, i === 0 ? 'pan-right' : 'static'),
      lighting: detectFromText(fullText, LIGHTING_KEYWORDS, 'natural'),
      duration: estimateDuration(bodyText || headerLine),
      characters: extractCharacters(block),
      location: extractLocation(headerLine),
      mood: detectMood(fullText),
    });
  }

  return scenes;
}

export function scenesToPromptDescriptions(scenes: ScriptScene[]): string[] {
  return scenes.map(scene => {
    const parts = [scene.description];
    if (scene.location !== 'Unknown location') parts.unshift(`At ${scene.location}:`);
    if (scene.mood !== 'neutral') parts.push(`Mood: ${scene.mood}`);
    if (scene.characters.length > 0) parts.push(`Characters: ${scene.characters.join(', ')}`);
    return parts.join(' ');
  });
}
