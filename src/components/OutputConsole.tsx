import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Eye, 
  Lightbulb, 
  Play, 
  Trash2, 
  Copy, 
  Check, 
  RefreshCw, 
  ExternalLink, 
  Smartphone, 
  Monitor, 
  Tablet, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  ListOrdered,
  Package,
  BookOpen
} from 'lucide-react';
import { SupportedLanguage, ExecuteResult } from '../types';

interface OutputConsoleProps {
  code: string;
  language: SupportedLanguage;
  executionResult: ExecuteResult | null;
  isExecuting: boolean;
  onRunCode: () => void;
  onClearOutput: () => void;
  description: string;
  explanation: string[];
  dependencies: string[];
  runInstructions: string;
}

export const OutputConsole: React.FC<OutputConsoleProps> = ({
  code,
  language,
  executionResult,
  isExecuting,
  onRunCode,
  onClearOutput,
  description,
  explanation,
  dependencies,
  runInstructions,
}) => {
  const isWebLang = ['html', 'css', 'javascript'].includes(language);
  const [activeTab, setActiveTab] = useState<'console' | 'preview' | 'insights'>(isWebLang ? 'preview' : 'console');
  const [copied, setCopied] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Auto switch tab when language changes
  useEffect(() => {
    if (isWebLang && activeTab === 'console' && !executionResult) {
      setActiveTab('preview');
    } else if (!isWebLang && activeTab === 'preview') {
      setActiveTab('console');
    }
  }, [language]);

  // When execution completes, switch to console tab to view output
  useEffect(() => {
    if (executionResult && !isWebLang) {
      setActiveTab('console');
      setIsCollapsed(false);
    }
  }, [executionResult]);

  const handleCopyOutput = async () => {
    const text = executionResult?.error 
      ? `${executionResult.output}\n\n[Error]:\n${executionResult.error}`
      : executionResult?.output || '';
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const getPreviewSrcDoc = () => {
    if (language === 'html') {
      return code;
    } else if (language === 'css') {
      return `<!DOCTYPE html><html><head><style>${code}</style></head><body style="margin:20px;font-family:sans-serif;">
        <div class="dashboard-grid">
          <div class="glass-card">
            <h2>CSS Preview Component</h2>
            <p>Your generated stylesheet is applied live to this container.</p>
            <button class="btn-gradient">Action Button</button>
          </div>
        </div>
      </body></html>`;
    } else if (language === 'javascript') {
      return `<!DOCTYPE html><html><head><style>body{font-family:sans-serif;margin:20px;background:#090d16;color:#f8fafc;}</style></head><body>
        <div id="app"></div>
        <div id="output" style="background:#131b2e;padding:12px;border-radius:8px;font-family:monospace;white-space:pre-wrap;font-size:12px;border:1px solid #334155;"></div>
        <script>
          const logDiv = document.getElementById('output');
          const oldLog = console.log;
          console.log = (...args) => {
            oldLog(...args);
            logDiv.innerText += args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : a).join(' ') + '\\n';
          };
          window.onerror = (msg, url, line) => {
            logDiv.innerText += '[Runtime Error]: ' + msg + ' (Line ' + line + ')\\n';
            logDiv.style.color = '#f87171';
          };
          try {
            ${code}
          } catch(err) {
            logDiv.innerText += '[Exception]: ' + err.message + '\\n';
            logDiv.style.color = '#f87171';
          }
        </script>
      </body></html>`;
    }
    return '';
  };

  const openPreviewInNewTab = () => {
    const srcDoc = getPreviewSrcDoc();
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(srcDoc);
      newWindow.document.close();
    }
  };

  const getDeviceWidth = () => {
    switch (previewDevice) {
      case 'mobile': return 'max-w-[375px]';
      case 'tablet': return 'max-w-[768px]';
      default: return 'w-full';
    }
  };

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-dark-900 shadow-2xl overflow-hidden transition-all flex flex-col">
      
      {/* IDE Terminal / Preview Header */}
      <div className="flex flex-wrap items-center justify-between px-3 sm:px-4 py-2 bg-dark-950 border-b border-slate-800 gap-2">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={() => { setActiveTab('console'); setIsCollapsed(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'console' && !isCollapsed
                ? 'bg-slate-800 text-purple-300 border border-brand-purple/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-brand-purple" />
            <span>Terminal</span>
            {executionResult && (
              <span className={`w-2 h-2 rounded-full ${executionResult.status === 'success' ? 'bg-emerald-400' : 'bg-red-400 animate-pulse'}`} />
            )}
          </button>

          {isWebLang && (
            <button
              onClick={() => { setActiveTab('preview'); setIsCollapsed(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'preview' && !isCollapsed
                  ? 'bg-slate-800 text-sky-300 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-sky-400" />
              <span>Live Preview</span>
            </button>
          )}

          <button
            onClick={() => { setActiveTab('insights'); setIsCollapsed(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'insights' && !isCollapsed
                ? 'bg-slate-800 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Insights</span>
          </button>
        </div>

        {/* Right Toolbar Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* Execution Status Badge */}
          {executionResult && (
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded bg-dark-950 border border-slate-800">
              <Clock className="w-3 h-3 text-slate-400" />
              <span className="text-slate-300">{executionResult.execution_time_ms}ms</span>
              {executionResult.status === 'success' ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              ) : (
                <AlertCircle className="w-3 h-3 text-red-400" />
              )}
            </div>
          )}

          {/* Device Switcher (for Web Preview) */}
          {activeTab === 'preview' && !isCollapsed && (
            <div className="hidden md:flex items-center gap-0.5 bg-dark-950 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1 rounded ${previewDevice === 'desktop' ? 'bg-slate-800 text-sky-400' : 'text-slate-500 hover:text-slate-300'}`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`p-1 rounded ${previewDevice === 'tablet' ? 'bg-slate-800 text-sky-400' : 'text-slate-500 hover:text-slate-300'}`}
                title="Tablet View"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1 rounded ${previewDevice === 'mobile' ? 'bg-slate-800 text-sky-400' : 'text-slate-500 hover:text-slate-300'}`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Refresh Preview */}
          {activeTab === 'preview' && !isCollapsed && (
            <button
              onClick={() => setPreviewKey((k) => k + 1)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Refresh Live Preview"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Open in New Window */}
          {activeTab === 'preview' && !isCollapsed && (
            <button
              onClick={openPreviewInNewTab}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Open Preview in New Tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Copy Console Output */}
          {activeTab === 'console' && !isCollapsed && executionResult && (
            <button
              onClick={handleCopyOutput}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Copy Output"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Clear Console */}
          {activeTab === 'console' && !isCollapsed && (
            <button
              onClick={onClearOutput}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Clear Terminal Output"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Collapse / Expand Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors ml-1"
            title={isCollapsed ? "Expand Terminal" : "Collapse Terminal"}
          >
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Panel Content Body */}
      {!isCollapsed && (
        <div className="bg-dark-950 p-3 sm:p-4 min-h-[220px] max-h-[380px] overflow-y-auto">
          
          {/* Tab 1: Terminal / Console Output */}
          {activeTab === 'console' && (
            <div className="font-mono text-xs leading-relaxed space-y-2">
              <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-slate-900 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="text-brand-purple font-semibold">$</span>
                  <span>CodeAI Integrated Terminal ({language.toUpperCase()})</span>
                </div>
                <span>Ctrl + R to Run</span>
              </div>

              {isExecuting ? (
                <div className="flex items-center gap-2 text-purple-300 py-6 justify-center">
                  <RefreshCw className="w-4 h-4 animate-spin text-brand-purple" />
                  <span>Executing {language} script...</span>
                </div>
              ) : executionResult ? (
                <div className="space-y-2">
                  {executionResult.output && (
                    <pre className="text-emerald-400/90 whitespace-pre-wrap select-text">
                      {executionResult.output}
                    </pre>
                  )}
                  {executionResult.error && (
                    <pre className="text-rose-400/90 whitespace-pre-wrap select-text p-2 rounded bg-rose-500/10 border border-rose-500/20">
                      {executionResult.error}
                    </pre>
                  )}
                  <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-900">
                    Process finished with exit code {executionResult.status === 'success' ? '0' : '1'} in {executionResult.execution_time_ms}ms
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500 space-y-2">
                  <Terminal className="w-8 h-8 text-slate-700 mx-auto opacity-60" />
                  <p>Click <strong className="text-emerald-400">Run</strong> in the editor toolbar to execute this {language} code.</p>
                  <p className="text-[11px] text-slate-600">Output, standard log streams, and runtime errors will appear here in real time.</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Live Web Preview */}
          {activeTab === 'preview' && (
            <div className="w-full flex justify-center bg-slate-950/50 rounded-xl p-2 min-h-[260px]">
              <div className={`w-full ${getDeviceWidth()} transition-all duration-300 border border-slate-800 rounded-lg overflow-hidden bg-white shadow-lg`}>
                <iframe
                  key={previewKey}
                  ref={iframeRef}
                  title="CodeAI Live Preview"
                  srcDoc={getPreviewSrcDoc()}
                  sandbox="allow-scripts allow-modals allow-same-origin"
                  className="w-full h-[260px] border-0 bg-white"
                />
              </div>
            </div>
          )}

          {/* Tab 3: AI Insights & Explanation */}
          {activeTab === 'insights' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              
              {/* Description */}
              <div className="flex items-start gap-2.5">
                <BookOpen className="w-4 h-4 text-brand-purple flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-slate-200">Architecture & Overview</h5>
                  <p className="text-slate-400 mt-0.5 leading-relaxed text-xs">
                    {description || 'No description available.'}
                  </p>
                </div>
              </div>

              {/* Step by Step Breakdown */}
              {explanation?.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-900">
                  <h5 className="font-semibold text-slate-200 flex items-center gap-2">
                    <ListOrdered className="w-4 h-4 text-indigo-400" />
                    <span>Logic Breakdown</span>
                  </h5>
                  <ol className="space-y-1.5 pl-2">
                    {explanation.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="text-purple-400 font-bold">{idx + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Dependencies & Run Command */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-900 text-xs">
                <div>
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                    <Package className="w-3.5 h-3.5 text-sky-400" />
                    Dependencies:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {dependencies?.length > 0 ? (
                      dependencies.map((dep, idx) => (
                        <span key={idx} className="font-mono text-[10px] px-2 py-0.5 rounded bg-dark-900 border border-slate-800 text-cyan-300">
                          {dep}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 italic">None</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    Run Command:
                  </span>
                  <code className="block font-mono text-[11px] p-1.5 rounded bg-dark-900 border border-slate-800 text-emerald-400">
                    {runInstructions || 'Run according to language environment.'}
                  </code>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
