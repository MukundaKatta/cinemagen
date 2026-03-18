import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import type {
  CinematicPrompt,
  GenerationJob,
  Project,
  VideoClip,
  Character,
  ColorGrading,
  ExportPreset,
  Script,
  AudioTrack,
  ShotType,
  CameraMovement,
  LightingStyle,
  FilmGrammarPreset,
  MotionPhysics,
  AspectRatio,
  LUTPreset,
  TransitionType,
  FILM_GRAMMAR_PRESETS,
} from '@/types/cinema';

const DEFAULT_COLOR_GRADING: ColorGrading = {
  lut: 'none',
  colorWheel: {
    shadows: { r: 0, g: 0, b: 0 },
    midtones: { r: 0, g: 0, b: 0 },
    highlights: { r: 0, g: 0, b: 0 },
  },
  exposure: 0,
  contrast: 0,
  saturation: 0,
  temperature: 0,
  tint: 0,
  vibrance: 0,
  blacks: 0,
  whites: 0,
  gamma: 1.0,
  filmGrain: 0.1,
  vignette: 0.15,
  chromaticAberration: 0,
  bloom: 0,
  letterbox: true,
};

function createDefaultPrompt(): CinematicPrompt {
  return {
    id: uuid(),
    description: '',
    shotType: 'medium',
    cameraMovement: 'static',
    lighting: 'natural',
    filmGrammar: null,
    colorGrading: { ...DEFAULT_COLOR_GRADING },
    motionPhysics: 'realistic',
    duration: 4,
    aspectRatio: '16:9',
    focalLength: 50,
    aperture: 2.8,
    negativePrompt: '',
    seed: null,
    characterRef: null,
    styleRef: null,
  };
}

interface CinemaStore {
  currentProject: Project | null;
  currentPrompt: CinematicPrompt;
  jobs: GenerationJob[];
  characters: Character[];
  scripts: Script[];
  activeTab: 'generate' | 'compose' | 'export' | 'script';
  selectedClipId: string | null;
  isGenerating: boolean;
  previewMode: 'split' | 'full' | 'timeline';

  setCurrentProject: (project: Project | null) => void;
  updatePrompt: (updates: Partial<CinematicPrompt>) => void;
  resetPrompt: () => void;
  applyFilmGrammar: (preset: FilmGrammarPreset) => void;
  updateColorGrading: (updates: Partial<ColorGrading>) => void;
  setLUT: (lut: LUTPreset) => void;

  addJob: (job: GenerationJob) => void;
  updateJob: (jobId: string, updates: Partial<GenerationJob>) => void;
  removeJob: (jobId: string) => void;

  addCharacter: (character: Character) => void;
  updateCharacter: (characterId: string, updates: Partial<Character>) => void;
  removeCharacter: (characterId: string) => void;

  addScript: (script: Script) => void;

  setActiveTab: (tab: CinemaStore['activeTab']) => void;
  setSelectedClip: (clipId: string | null) => void;
  setIsGenerating: (generating: boolean) => void;
  setPreviewMode: (mode: CinemaStore['previewMode']) => void;

  addClipToProject: (clip: VideoClip) => void;
  removeClipFromProject: (clipId: string) => void;
  reorderClips: (clipIds: string[]) => void;
  updateClip: (clipId: string, updates: Partial<VideoClip>) => void;
  setClipTransition: (clipId: string, transition: TransitionType, duration: number) => void;
}

export const useCinemaStore = create<CinemaStore>((set, get) => ({
  currentProject: null,
  currentPrompt: createDefaultPrompt(),
  jobs: [],
  characters: [],
  scripts: [],
  activeTab: 'generate',
  selectedClipId: null,
  isGenerating: false,
  previewMode: 'split',

  setCurrentProject: (project) => set({ currentProject: project }),

  updatePrompt: (updates) =>
    set((state) => ({
      currentPrompt: { ...state.currentPrompt, ...updates },
    })),

  resetPrompt: () => set({ currentPrompt: createDefaultPrompt() }),

  applyFilmGrammar: (preset) => {
    const grammarPresets: Record<FilmGrammarPreset, {
      shotType: ShotType;
      cameraMovement: CameraMovement;
      lighting: LightingStyle;
      duration: number;
    }> = {
      'establishing-shot': { shotType: 'extreme-wide', cameraMovement: 'pan-right', lighting: 'natural', duration: 5 },
      'close-up-reaction': { shotType: 'close-up', cameraMovement: 'static', lighting: 'rembrandt', duration: 3 },
      'tracking-follow': { shotType: 'medium', cameraMovement: 'steadicam', lighting: 'natural', duration: 6 },
      'dolly-zoom-vertigo': { shotType: 'medium', cameraMovement: 'dolly-zoom', lighting: 'low-key', duration: 4 },
      'overhead-surveillance': { shotType: 'birds-eye', cameraMovement: 'static', lighting: 'high-key', duration: 4 },
      'whip-pan-transition': { shotType: 'medium', cameraMovement: 'whip-pan', lighting: 'natural', duration: 2 },
      'slow-reveal': { shotType: 'medium-close', cameraMovement: 'tilt-up', lighting: 'low-key', duration: 5 },
      'pull-back-reveal': { shotType: 'close-up', cameraMovement: 'dolly-out', lighting: 'natural', duration: 6 },
      'circular-orbit': { shotType: 'medium', cameraMovement: 'orbit', lighting: 'rim', duration: 5 },
      'first-person-pov': { shotType: 'point-of-view', cameraMovement: 'handheld', lighting: 'natural', duration: 4 },
    };

    const p = grammarPresets[preset];
    set((state) => ({
      currentPrompt: {
        ...state.currentPrompt,
        filmGrammar: preset,
        shotType: p.shotType,
        cameraMovement: p.cameraMovement,
        lighting: p.lighting,
        duration: p.duration,
      },
    }));
  },

  updateColorGrading: (updates) =>
    set((state) => ({
      currentPrompt: {
        ...state.currentPrompt,
        colorGrading: { ...state.currentPrompt.colorGrading, ...updates },
      },
    })),

  setLUT: (lut) =>
    set((state) => ({
      currentPrompt: {
        ...state.currentPrompt,
        colorGrading: { ...state.currentPrompt.colorGrading, lut },
      },
    })),

  addJob: (job) => set((state) => ({ jobs: [job, ...state.jobs] })),

  updateJob: (jobId, updates) =>
    set((state) => ({
      jobs: state.jobs.map((j) => (j.id === jobId ? { ...j, ...updates } : j)),
    })),

  removeJob: (jobId) =>
    set((state) => ({ jobs: state.jobs.filter((j) => j.id !== jobId) })),

  addCharacter: (character) =>
    set((state) => ({ characters: [...state.characters, character] })),

  updateCharacter: (characterId, updates) =>
    set((state) => ({
      characters: state.characters.map((c) =>
        c.id === characterId ? { ...c, ...updates } : c
      ),
    })),

  removeCharacter: (characterId) =>
    set((state) => ({
      characters: state.characters.filter((c) => c.id !== characterId),
    })),

  addScript: (script) => set((state) => ({ scripts: [...state.scripts, script] })),

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedClip: (clipId) => set({ selectedClipId: clipId }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setPreviewMode: (mode) => set({ previewMode: mode }),

  addClipToProject: (clip) =>
    set((state) => {
      if (!state.currentProject) return state;
      return {
        currentProject: {
          ...state.currentProject,
          clips: [...state.currentProject.clips, clip],
        },
      };
    }),

  removeClipFromProject: (clipId) =>
    set((state) => {
      if (!state.currentProject) return state;
      return {
        currentProject: {
          ...state.currentProject,
          clips: state.currentProject.clips.filter((c) => c.id !== clipId),
        },
      };
    }),

  reorderClips: (clipIds) =>
    set((state) => {
      if (!state.currentProject) return state;
      const clipMap = new Map(state.currentProject.clips.map((c) => [c.id, c]));
      const reordered = clipIds
        .map((id, index) => {
          const clip = clipMap.get(id);
          return clip ? { ...clip, order: index } : null;
        })
        .filter(Boolean) as VideoClip[];
      return {
        currentProject: { ...state.currentProject, clips: reordered },
      };
    }),

  updateClip: (clipId, updates) =>
    set((state) => {
      if (!state.currentProject) return state;
      return {
        currentProject: {
          ...state.currentProject,
          clips: state.currentProject.clips.map((c) =>
            c.id === clipId ? { ...c, ...updates } : c
          ),
        },
      };
    }),

  setClipTransition: (clipId, transition, duration) =>
    set((state) => {
      if (!state.currentProject) return state;
      return {
        currentProject: {
          ...state.currentProject,
          clips: state.currentProject.clips.map((c) =>
            c.id === clipId ? { ...c, transition, transitionDuration: duration } : c
          ),
        },
      };
    }),
}));
