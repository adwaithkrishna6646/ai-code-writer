import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Trash2, 
  Bookmark, 
  BookmarkCheck, 
  ArrowUpRight, 
  Clock, 
  Filter,
  Code2
} from 'lucide-react';
import { HistoryItem, SupportedLanguage, ToolType } from '../types';
import { fetchHistory, deleteHistoryItem, toggleFavorite } from '../services/api';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSnippet: (item: HistoryItem) => void;
  onUpdateFavoritesCount: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  onSelectSnippet,
  onUpdateFavoritesCount,
}) => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [filterTool, setFilterTool] = useState<string>('');
  const [filterLang, setFilterLang] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchHistory({
        q: search,
        toolType: filterTool || undefined,
        language: filterLang || undefined,
      });
      setItems(data);
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
  }, [isOpen, search, filterTool, filterLang]);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this history item?')) return;
    try {
      await deleteHistoryItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      onUpdateFavoritesCount();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStar = async (item: HistoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = await toggleFavorite(item.id, !item.is_saved);
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_saved: updated.is_saved } : i)));
      onUpdateFavoritesCount();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-lg bg-dark-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-dark-950">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-purple" />
            <h3 className="text-base font-bold text-slate-100">Generation History</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {items.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-4 border-b border-slate-800/80 space-y-3 bg-dark-900/60">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prompts, code, titles..."
              className="w-full bg-dark-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-purple"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterTool}
              onChange={(e) => setFilterTool(e.target.value)}
              className="bg-dark-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-purple"
            >
              <option value="">All Tools</option>
              <option value="generate">Generate</option>
              <option value="fix">Fix</option>
              <option value="explain">Explain</option>
              <option value="optimize">Optimize</option>
              <option value="convert">Convert</option>
            </select>

            <select
              value={filterLang}
              onChange={(e) => setFilterLang(e.target.value)}
              className="bg-dark-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-purple"
            >
              <option value="">All Languages</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="java">Java</option>
              <option value="sql">SQL</option>
            </select>
          </div>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs sm:text-sm">
              No generations found matching your criteria.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectSnippet(item);
                  onClose();
                }}
                className="group relative p-3.5 rounded-xl bg-dark-950 border border-slate-800/80 hover:border-brand-purple/40 hover:bg-slate-900/60 cursor-pointer transition-all shadow-sm"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-purple/15 text-purple-300 border border-brand-purple/30">
                      {item.tool_type}
                    </span>
                    <span className="text-[11px] font-mono text-cyan-400">
                      {item.language}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleToggleStar(item, e)}
                      className="p-1 rounded text-slate-400 hover:text-amber-400 transition-colors"
                      title={item.is_saved ? "Remove from Saved" : "Save Snippet"}
                    >
                      {item.is_saved ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1 rounded text-slate-400 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h4 className="text-xs sm:text-sm font-semibold text-slate-200 line-clamp-1 group-hover:text-purple-300 transition-colors">
                  {item.title || item.prompt || 'Generated Snippet'}
                </h4>

                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {item.description || item.prompt}
                </p>

                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-900 text-[10px] text-slate-500 font-mono">
                  <span>{new Date(item.created_at).toLocaleString()}</span>
                  <span className="flex items-center gap-0.5 text-brand-purple group-hover:underline">
                    Load Code <ArrowUpRight className="w-3 h-3" />
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
