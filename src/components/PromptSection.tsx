import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Code2, 
  Layers, 
  SendHorizontal, 
  Lightbulb, 
  AlertCircle 
} from 'lucide-react';
import { SupportedLanguage, ToolType, SUPPORTED_LANGUAGES } from '../types';

interface PromptSectionProps {
  currentTool: ToolType;
  prompt: string;
  setPrompt: (p: string) => void;
  inputCode: string;
  setInputCode: (c: string) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  targetLanguage: SupportedLanguage;
  setTargetLanguage: (lang: SupportedLanguage) => void;
  errorDescription: string;
  setErrorDescription: (e: string) => void;
  onExecute: () => void;
  isLoading: boolean;
}

const SAMPLE_PROMPTS: Record<ToolType, { text: string; lang: SupportedLanguage }[]> = {
  generate: [
    { text: "FastAPI REST API with item CRUD and pydantic models", lang: "python" },
    { text: "Modern responsive pricing card with glassmorphism in CSS", lang: "css" },
    { text: "Interactive Kanban board with drag-and-drop support", lang: "html" },
    { text: "Asynchronous task worker with queue concurrency limit", lang: "javascript" },
    { text: "Relational database schema with foreign keys and index query", lang: "sql" },
    { text: "Generic thread-safe in-memory cache with expiry", lang: "java" }
  ],
  fix: [
    { text: "Fix missing colon syntax errors and handle IndexError", lang: "python" },
    { text: "Fix unhandled promise rejection and async state bug", lang: "javascript" }
  ],
  explain: [
    { text: "Explain how this algorithm processes data in O(N) time", lang: "python" },
    { text: "Explain recursive tree traversal and space complexity", lang: "java" }
  ],
  optimize: [
    { text: "Optimize loop iterations, reduce memory allocations", lang: "python" },
    { text: "Refactor nested callbacks into clean async/await pipelines", lang: "javascript" }
  ],
  convert: [
    { text: "Convert Python data dictionary processor into JavaScript", lang: "python" },
    { text: "Convert JavaScript async fetch function to Python httpx", lang: "javascript" }
  ]
};

export const PromptSection: React.FC<PromptSectionProps> = ({
  currentTool,
  prompt,
  setPrompt,
  inputCode,
  setInputCode,
  language,
  setLanguage,
  targetLanguage,
  setTargetLanguage,
  errorDescription,
  setErrorDescription,
  onExecute,
  isLoading,
}) => {
  const languageList = Object.values(SUPPORTED_LANGUAGES);

  const getActionLabel = () => {
    switch (currentTool) {
      case 'generate': return 'Generate Code';
      case 'fix': return 'Fix Code';
      case 'explain': return 'Explain Code';
      case 'optimize': return 'Optimize Code';
      case 'convert': return 'Convert Code';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading) onExecute();
    }
  };

  return (
    <div className="w-full space-y-4">
      
      {/* Hero Heading for Generator */}
      {currentTool === 'generate' && (
        <div className="text-center sm:text-left pt-2 pb-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2.5">
            <span>Build Anything with</span>
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
              AI
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Describe your idea. Let AI write the code.
          </p>
        </div>
      )}

      {/* Control Bar: Language Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-dark-900/70 border border-slate-800/80 rounded-xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {currentTool === 'convert' ? 'Source Language:' : 'Language:'}
            </span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="bg-dark-950 border border-slate-700/80 text-slate-200 text-xs sm:text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-colors cursor-pointer"
            >
              {languageList.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name} ({lang.extension})
                </option>
              ))}
            </select>
          </div>

          {/* Target Language for Convert tool */}
          {currentTool === 'convert' && (
            <div className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Target:
              </span>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value as SupportedLanguage)}
                className="bg-dark-950 border border-slate-700/80 text-slate-200 text-xs sm:text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-colors cursor-pointer"
              >
                {languageList.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name} ({lang.extension})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Selected Language Badge */}
        <div className="hidden sm:flex items-center gap-2">
          <span className={`text-[11px] font-mono font-medium px-2.5 py-1 rounded-md border ${SUPPORTED_LANGUAGES[language]?.badgeColor || ''}`}>
            {SUPPORTED_LANGUAGES[language]?.defaultFilename}
          </span>
        </div>
      </div>

      {/* Code Input (Required for Fix, Explain, Optimize, Convert) */}
      {currentTool !== 'generate' && (
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-brand-purple" />
              Source Code ({SUPPORTED_LANGUAGES[language].name}):
            </span>
            <span className="text-[11px] text-slate-500">Paste code to process</span>
          </label>
          <textarea
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder={`// Paste your ${SUPPORTED_LANGUAGES[language].name} code here...`}
            rows={6}
            className="w-full bg-dark-950/90 border border-slate-800 text-slate-200 font-mono text-xs sm:text-sm p-3 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-colors resize-y"
          />
        </div>
      )}

      {/* Error description for Fix Code */}
      {currentTool === 'fix' && (
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            Error Details or Unexpected Behavior (optional):
          </label>
          <input
            type="text"
            value={errorDescription}
            onChange={(e) => setErrorDescription(e.target.value)}
            placeholder="e.g. IndexError on line 12, or syntax error with brackets"
            className="w-full bg-dark-950/90 border border-slate-800 text-slate-200 text-xs sm:text-sm p-2.5 rounded-xl focus:outline-none focus:border-brand-purple transition-colors"
          />
        </div>
      )}

      {/* Natural Language Prompt Input */}
      <div className="space-y-2">
        <div className="relative rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/80 p-0.5 shadow-xl">
          <div className="relative bg-dark-950 rounded-[14px] p-3 sm:p-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                currentTool === 'generate'
                  ? "Describe what you want to build (e.g., 'A responsive navbar with mobile menu and dark mode toggle', 'FastAPI endpoint with authentication and SQLite storage')..."
                  : "Additional guidance or instructions for the AI (optional)..."
              }
              rows={currentTool === 'generate' ? 4 : 2}
              className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm sm:text-base focus:outline-none resize-none leading-relaxed"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-2 border-t border-slate-800/60">
              <span className="text-[11px] text-slate-500 hidden sm:flex items-center gap-1">
                Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">Enter</kbd> to run
              </span>

              {/* Action Button */}
              <button
                onClick={onExecute}
                disabled={isLoading || (currentTool === 'generate' ? !prompt.trim() : !inputCode.trim())}
                className="w-full sm:w-auto ml-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-brand-purple via-brand-indigo to-brand-blue hover:opacity-95 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-brand-purple/25 transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{getActionLabel()}</span>
                    <SendHorizontal className="w-3.5 h-3.5 opacity-80" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        {SAMPLE_PROMPTS[currentTool]?.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 flex-shrink-0">
              <Lightbulb className="w-3 h-3 text-amber-400" />
              Try:
            </span>
            <div className="flex items-center gap-1.5 flex-nowrap">
              {SAMPLE_PROMPTS[currentTool].map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(sample.text);
                    setLanguage(sample.lang);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 whitespace-nowrap transition-colors"
                >
                  {sample.text}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
