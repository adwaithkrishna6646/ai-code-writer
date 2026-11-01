import React from 'react';
import { Sparkles, Wrench, HelpCircle, Zap, RefreshCw } from 'lucide-react';
import { ToolType } from '../types';

interface ToolSelectorProps {
  currentTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
}

interface ToolItem {
  id: ToolType;
  label: string;
  icon: React.ElementType;
  description: string;
  badge?: string;
}

const TOOLS: ToolItem[] = [
  {
    id: 'generate',
    label: 'Generate Code',
    icon: Sparkles,
    description: 'Transform natural language into functional code',
    badge: 'Popular',
  },
  {
    id: 'fix',
    label: 'Fix Code',
    icon: Wrench,
    description: 'Diagnose bugs, fix syntax, and repair errors',
  },
  {
    id: 'explain',
    label: 'Explain Code',
    icon: HelpCircle,
    description: 'Break down complex logic into step-by-step guides',
  },
  {
    id: 'optimize',
    label: 'Optimize Code',
    icon: Zap,
    description: 'Enhance speed, reduce complexity, and clean syntax',
  },
  {
    id: 'convert',
    label: 'Convert Code',
    icon: RefreshCw,
    description: 'Translate logic seamlessly across languages',
  },
];

export const ToolSelector: React.FC<ToolSelectorProps> = ({ currentTool, onSelectTool }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 p-1.5 bg-dark-900/90 rounded-2xl border border-slate-800/80 shadow-inner">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isActive = currentTool === tool.id;

          return (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className={`relative flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-brand-purple to-brand-blue text-white shadow-md shadow-brand-purple/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="truncate">{tool.label}</span>
              {tool.badge && !isActive && (
                <span className="hidden lg:inline text-[9px] px-1.5 py-0.5 rounded-full bg-brand-purple/20 text-purple-300 font-semibold border border-brand-purple/30">
                  {tool.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
