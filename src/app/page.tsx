'use client';

import { useCinemaStore } from '@/hooks/use-cinema-store';
import { PromptEditor } from '@/components/cinema/prompt-editor';
import { ColorGradingPanel } from '@/components/cinema/color-grading';
import { ScriptToVideo } from '@/components/cinema/script-to-video';
import { AudioGenerator } from '@/components/cinema/audio-generator';
import { ExportPresetsPanel } from '@/components/cinema/export-presets';
import { CinemaPreview } from '@/components/cinema/cinema-preview';

export default function CinemaPage() {
  const activeTab = useCinemaStore((s) => s.activeTab);
  const setActiveTab = useCinemaStore((s) => s.setActiveTab);
  const isGenerating = useCinemaStore((s) => s.isGenerating);
  const jobs = useCinemaStore((s) => s.jobs);
  const currentProject = useCinemaStore((s) => s.currentProject);

  const tabs = [
    { key: 'generate' as const, label: 'Generate' },
    { key: 'compose' as const, label: 'Compose' },
    { key: 'script' as const, label: 'Script' },
    { key: 'export' as const, label: 'Export' },
  ];

  return (
    <div className="h-screen flex flex-col bg-[#08080c] overflow-hidden">
      <header className="h-11 flex items-center justify-between px-4 bg-[#0e0e14] border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-sm font-bold text-white">CinemaGen</span>
          {currentProject && <span className="text-xs text-white/30">{currentProject.name}</span>}
        </div>

        <div className="flex items-center gap-1 bg-white/5 rounded-md p-0.5">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                activeTab === t.key ? 'bg-amber-600 text-white' : 'text-white/30 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isGenerating && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-amber-300">Rendering...</span>
            </div>
          )}
          <span className="text-xs text-white/20">{jobs.length} jobs</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col">
          <CinemaPreview />
        </div>

        <div className="w-[340px] flex-shrink-0 border-l border-white/5 bg-[#0e0e14] overflow-y-auto">
          {activeTab === 'generate' && (
            <div className="space-y-0">
              <div className="p-3 border-b border-white/5">
                <PromptEditor />
              </div>
              <div className="p-3">
                <ColorGradingPanel />
              </div>
            </div>
          )}
          {activeTab === 'compose' && <AudioGenerator />}
          {activeTab === 'script' && <ScriptToVideo />}
          {activeTab === 'export' && <ExportPresetsPanel />}
        </div>
      </div>
    </div>
  );
}
