import React, { useState, useEffect } from 'react';
import { 
  X, 
  BookmarkCheck, 
  Trash2, 
  ArrowUpRight, 
  Code2, 
  Download, 
  Search,
  Copy,
  Check
} from 'lucide-react';
import { HistoryItem, SUPPORTED_LANGUAGES, SupportedLanguage } from '../types';
import { fetchHistory, deleteHistoryItem, toggleFavorite } from '../services/api';

interface SavedSnippetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSnippet: (item: HistoryItem) => void;
  onUpdateFavoritesCount: () => void;
}

export const SavedSnippetsModal: React.FC<SavedSnippetsModalProps> = ({
  isOpen,
  onClose,
  onSelectSnippet,
  onUpdateFavoritesCount,
}) => {
  const [savedItems, setSavedItems] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchHistory({
        q: search,
        savedOnly: true,
      });
      setSavedItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, search]);

  const handleRemoveFavorite = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleFavorite(id, false);
      setSavedItems((prev) => prev.filter((i) => i.id !== id));
      onUpdateFavoritesCount();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyCode = async (code: string, id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = (item: HistoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const lang = (item.language.toLowerCase() as SupportedLanguage) in SUPPORTED_LANGUAGES 
      ? SUPPORTED_LANGUAGES[item.language.toLowerCase() as SupportedLanguage]
      : SUPPORTED_LANGUAGES.python;
    
    const blob = new Blob([item.generated_code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(item.title || 'snippet').toLowerCase().replace(/\s+/g, '_')}${lang.extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-dark-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-dark-950">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-slate-100">Saved Code Snippets</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/20">
              {savedItems.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-800 bg-dark-900/60">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search saved snippets..."
              className="w-full bg-dark-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-purple"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
            </div>
          ) : savedItems.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-sm">
              <BookmarkCheck className="w-10 h-10 text-slate-600 mx-auto mb-2 opacity-50" />
              <p>No saved snippets yet.</p>
              <p className="text-xs text-slate-600 mt-1">Star any generated code snippet to access it quickly here.</p>
            </div>
          ) : (
            savedItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectSnippet(item);
                  onClose();
                }}
                className="group p-4 rounded-xl bg-dark-950 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900/50 cursor-pointer transition-all shadow-sm"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      {item.language}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-slate-500">
                      {item.tool_type}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleCopyCode(item.generated_code, item.id, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                      title="Copy Code"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={(e) => handleDownload(item, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                      title="Download File"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleRemoveFavorite(item.id, e)}
                      className="p-1.5 rounded-lg text-amber-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                      title="Remove from Saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-slate-100 group-hover:text-amber-300 transition-colors">
                  {item.title || 'Untitled Snippet'}
                </h4>
                
                {item.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-900 text-[10px] text-slate-500">
                  <span>Saved on {new Date(item.created_at).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1 text-amber-400 font-medium group-hover:underline">
                    Load into Editor <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
