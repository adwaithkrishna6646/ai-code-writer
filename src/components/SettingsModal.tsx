import React, { useState, useEffect } from 'react';
import { 
  X, 
  Key, 
  Cpu, 
  Save, 
  Server, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { checkHealth } from '../services/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  setApiKey: (k: string) => void;
  model: string;
  setModel: (m: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  setApiKey,
  model,
  setModel,
}) => {
  const [tempKey, setTempKey] = useState(apiKey);
  const [tempModel, setTempModel] = useState(model);
  const [serverHealth, setServerHealth] = useState<{ status: string; openai_configured: boolean; model: string }>({
    status: 'checking...',
    openai_configured: false,
    model: '',
  });

  useEffect(() => {
    if (isOpen) {
      setTempKey(apiKey);
      setTempModel(model);
      checkHealth().then(setServerHealth);
    }
  }, [isOpen, apiKey, model]);

  const handleSave = () => {
    setApiKey(tempKey.trim());
    setModel(tempModel);
    localStorage.setItem('codeai_custom_api_key', tempKey.trim());
    localStorage.setItem('codeai_model', tempModel);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-dark-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-dark-950">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-brand-purple" />
            <h3 className="text-base font-bold text-slate-100">Settings & AI Engine</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 text-sm">
          
          {/* Server Connection Card */}
          <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Server className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Backend Server Status</p>
                <p className="text-[11px] text-slate-400">
                  {serverHealth.status === 'healthy' ? 'FastAPI Connected' : 'Checking connection...'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {serverHealth.status === 'healthy' ? (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" /> Online
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  <AlertTriangle className="w-3 h-3" /> Offline
                </span>
              )}
            </div>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-brand-blue" />
              OpenAI Model:
            </label>
            <select
              value={tempModel}
              onChange={(e) => setTempModel(e.target.value)}
              className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-brand-purple"
            >
              <option value="gpt-4o-mini">gpt-4o-mini (Fastest, High Quality, Cost Effective)</option>
              <option value="gpt-4o">gpt-4o (Most Intelligent, Complex Architecture)</option>
              <option value="gpt-3.5-turbo">gpt-3.5-turbo (Legacy Standard)</option>
            </select>
          </div>

          {/* Custom API Key input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                Custom OpenAI API Key (Optional):
              </label>
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-brand-purple hover:underline flex items-center gap-0.5"
              >
                Get Key <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="sk-proj-..."
              className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 text-xs sm:text-sm placeholder-slate-600 focus:outline-none focus:border-brand-purple font-mono"
            />
            <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                Your key is stored only in your browser session or backend environment. If left blank, CodeAI runs in Smart AI Engine mode with complete offline generators.
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 p-4 border-t border-slate-800 bg-dark-950">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-90 shadow-md shadow-brand-purple/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>

      </div>
    </div>
  );
};
