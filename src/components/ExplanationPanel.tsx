import React, { useState } from 'react';
import { 
  BookOpen, 
  ListOrdered, 
  Package, 
  PlayCircle, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Info
} from 'lucide-react';

interface ExplanationPanelProps {
  description: string;
  explanation: string[];
  dependencies: string[];
  runInstructions: string;
  language: string;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  description,
  explanation,
  dependencies,
  runInstructions,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'steps' | 'dependencies' | 'run'>('overview');
  const [copiedRun, setCopiedRun] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCopyRun = async () => {
    if (!runInstructions) return;
    try {
      await navigator.clipboard.writeText(runInstructions);
      setCopiedRun(true);
      setTimeout(() => setCopiedRun(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-dark-900/90 shadow-xl overflow-hidden">
      
      {/* Panel Header & Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 px-4 py-2.5 bg-dark-950/70">
        <div className="flex items-center gap-1 sm:gap-2">
          
          <button
            onClick={() => { setActiveTab('overview'); setIsCollapsed(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'overview' && !isCollapsed
                ? 'bg-brand-purple/20 text-purple-300 border border-brand-purple/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-3.5 h-3.5 text-brand-purple" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => { setActiveTab('steps'); setIsCollapsed(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'steps' && !isCollapsed
                ? 'bg-brand-purple/20 text-purple-300 border border-brand-purple/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5 text-indigo-400" />
            <span>Step-by-Step</span>
            {explanation?.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                {explanation.length}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('dependencies'); setIsCollapsed(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'dependencies' && !isCollapsed
                ? 'bg-brand-purple/20 text-purple-300 border border-brand-purple/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-sky-400" />
            <span>Dependencies</span>
            {dependencies?.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                {dependencies.length}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('run'); setIsCollapsed(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'run' && !isCollapsed
                ? 'bg-brand-purple/20 text-purple-300 border border-brand-purple/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>How to Run</span>
          </button>
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title={isCollapsed ? "Expand Explanation" : "Collapse Panel"}
        >
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Panel Content */}
      {!isCollapsed && (
        <div className="p-4 sm:p-5 text-sm text-slate-300">
          
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-brand-purple mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">
                    Code Description & Architecture
                  </h4>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                    {description || 'No description available for this generation.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Step-by-Step Explanation */}
          {activeTab === 'steps' && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-200 mb-2">
                Step-by-Step Code Walkthrough
              </h4>
              {explanation?.length > 0 ? (
                <ol className="space-y-2.5">
                  {explanation.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-purple-400 text-xs font-bold border border-slate-700 flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-xs text-slate-500 italic">No breakdown available.</p>
              )}
            </div>
          )}

          {/* Tab 3: Dependencies */}
          {activeTab === 'dependencies' && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-200">
                Required Libraries & Dependencies
              </h4>
              <div className="flex flex-wrap gap-2 pt-1">
                {dependencies?.length > 0 ? (
                  dependencies.map((dep, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-950 border border-slate-800 text-xs font-mono text-cyan-300"
                    >
                      <Package className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{dep}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">None required (Standard library only)</span>
                )}
              </div>
            </div>
          )}

          {/* Tab 4: How to Run */}
          {activeTab === 'run' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-200">
                  Execution Instructions
                </h4>
                {runInstructions && (
                  <button
                    onClick={handleCopyRun}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {copiedRun ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedRun ? 'Copied Command' : 'Copy'}</span>
                  </button>
                )}
              </div>
              <div className="p-3 rounded-xl bg-dark-950 border border-slate-800 font-mono text-xs text-emerald-400 whitespace-pre-wrap leading-relaxed">
                {runInstructions || `Run according to standard ${language} execution environment.`}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
