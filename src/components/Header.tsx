import React from 'react';
import { 
  Sparkles, 
  History, 
  Bookmark, 
  Settings as SettingsIcon, 
  Sun, 
  Moon, 
  Terminal,
  Code2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  activeTab: 'generator' | 'history' | 'saved';
  setActiveTab: (tab: 'generator' | 'history' | 'saved') => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenSaved: () => void;
  savedCount: number;
  isOpenAIConfigured: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSettings,
  onOpenHistory,
  onOpenSaved,
  savedCount,
  isOpenAIConfigured,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-dark-950/80 backdrop-blur-md px-4 sm:px-6 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('generator')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-blue shadow-lg shadow-brand-purple/25 p-0.5 transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-dark-950/80 rounded-[10px] flex items-center justify-center">
              <Code2 className="w-5 h-5 text-indigo-400 group-hover:text-purple-300 transition-colors" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-cyan"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
                CodeAI
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-purple-300">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              AI-Powered Code Generator & Assistant
            </p>
          </div>
        </div>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'generator'
                ? 'bg-brand-purple/15 text-purple-300 border border-brand-purple/30 shadow-sm shadow-brand-purple/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-brand-purple" />
            <span className="hidden md:inline">Studio</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all"
            title="View Generation History"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">History</span>
          </button>

          <button
            onClick={onOpenSaved}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all"
            title="Saved Snippets"
          >
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="bg-amber-500/20 text-amber-300 text-[11px] px-1.5 py-0.2 rounded-full font-bold">
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Status & Utility Controls */}
        <div className="flex items-center gap-2">
          {/* AI Status Badge */}
          <div 
            onClick={onOpenSettings}
            className={`cursor-pointer hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
              isOpenAIConfigured
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20'
            }`}
            title={isOpenAIConfigured ? "OpenAI API Active" : "Smart Offline/Demo Mode Active (Click to add API Key)"}
          >
            <span className={`w-2 h-2 rounded-full ${isOpenAIConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-purple-400'}`}></span>
            <span>{isOpenAIConfigured ? 'OpenAI Live' : 'Smart AI Engine'}</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent hover:border-slate-700 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent hover:border-slate-700 transition-colors"
            title="Settings & Model Selection"
            aria-label="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
