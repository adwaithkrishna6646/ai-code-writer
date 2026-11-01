import React, { useState, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { 
  Copy, 
  Check, 
  Download, 
  Maximize2, 
  Minimize2, 
  RotateCw, 
  Bookmark, 
  BookmarkCheck,
  AlignLeft,
  FileCode,
  Play,
  RefreshCw
} from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../types';
import { useTheme } from '../context/ThemeContext';

interface CodeEditorSectionProps {
  code: string;
  setCode: (code: string) => void;
  language: SupportedLanguage;
  isSaved: boolean;
  onToggleSave: () => void;
  onRegenerate: () => void;
  isLoading: boolean;
  onRunCode: () => void;
  isExecuting: boolean;
}

export const CodeEditorSection: React.FC<CodeEditorSectionProps> = ({
  code,
  setCode,
  language,
  isSaved,
  onToggleSave,
  onRegenerate,
  isLoading,
  onRunCode,
  isExecuting,
}) => {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef<any>(null);

  const langConfig = SUPPORTED_LANGUAGES[language] || SUPPORTED_LANGUAGES.python;

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Add keyboard shortcut for Run: Ctrl + Enter or Ctrl + R
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR, () => {
      onRunCode();
    });
  };

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleDownload = () => {
    if (!code) return;
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = langConfig.defaultFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  return (
    <div className={`flex flex-col rounded-2xl overflow-hidden border border-slate-800 bg-dark-900 shadow-2xl transition-all ${
      isFullscreen 
        ? 'fixed inset-4 z-50 shadow-2xl bg-dark-950 border-brand-purple/50' 
        : 'relative w-full h-full min-h-[460px]'
    }`}>
      
      {/* Editor Header / Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2.5 bg-dark-950 border-b border-slate-800">
        
        {/* File Name & Language Info */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            <FileCode className="w-3.5 h-3.5 text-brand-purple" />
            <span>{langConfig.defaultFilename}</span>
          </div>

          {/* High-Impact IDE Run Button */}
          <button
            onClick={onRunCode}
            disabled={isExecuting || !code.trim()}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 active:scale-95 disabled:opacity-50 transition-all shadow-sm shadow-emerald-500/10 cursor-pointer"
            title="Run Code in Integrated Terminal / Preview (Ctrl + R)"
          >
            {isExecuting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
            )}
            <span>{isExecuting ? 'Running...' : 'Run'}</span>
          </button>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          
          {/* Format Button */}
          <button
            onClick={handleFormat}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Auto-Format Code"
          >
            <AlignLeft className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Format</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              copied
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Copy Code to Clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Copy</span>
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title={`Download as ${langConfig.defaultFilename}`}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Download</span>
          </button>

          {/* Save / Favorite Button */}
          <button
            onClick={onToggleSave}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isSaved
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={isSaved ? "Saved to Favorites" : "Save Snippet"}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Save</span>
              </>
            )}
          </button>

          {/* Regenerate Button */}
          <button
            onClick={onRegenerate}
            disabled={isLoading}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-50 transition-colors"
            title="Regenerate with AI"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-brand-purple' : ''}`} />
            <span className="hidden lg:inline">Regenerate</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors ml-1"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Editor"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-brand-cyan" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="relative flex-1 w-full min-h-[380px] bg-dark-950">
        {isLoading && (
          <div className="absolute inset-0 z-20 bg-dark-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-2 border-brand-purple/20 border-t-brand-purple animate-spin" />
              <div className="absolute inset-2 rounded-full border-2 border-brand-blue/30 border-b-brand-blue animate-spin" />
            </div>
            <p className="text-xs font-medium text-slate-300 animate-pulse">
              Generating code & explanations...
            </p>
          </div>
        )}

        <Editor
          height="100%"
          language={langConfig.monacoLanguage}
          value={code}
          onChange={(val) => setCode(val || '')}
          onMount={handleEditorDidMount}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={{
            fontSize: 13.5,
            fontFamily: "'JetBrains Mono', Consolas, monospace",
            lineNumbers: 'on',
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            padding: { top: 12, bottom: 12 },
            tabSize: 2,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            renderLineHighlight: 'all',
          }}
        />
      </div>

    </div>
  );
};
