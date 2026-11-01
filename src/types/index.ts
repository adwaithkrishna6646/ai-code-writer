export type SupportedLanguage = 'html' | 'css' | 'javascript' | 'python' | 'java' | 'sql';

export type ToolType = 'generate' | 'fix' | 'explain' | 'optimize' | 'convert';

export interface LanguageConfig {
  id: SupportedLanguage;
  name: string;
  monacoLanguage: string;
  extension: string;
  defaultFilename: string;
  badgeColor: string;
  iconName?: string;
}

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  python: {
    id: 'python',
    name: 'Python',
    monacoLanguage: 'python',
    extension: '.py',
    defaultFilename: 'main.py',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    monacoLanguage: 'javascript',
    extension: '.js',
    defaultFilename: 'index.js',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  html: {
    id: 'html',
    name: 'HTML',
    monacoLanguage: 'html',
    extension: '.html',
    defaultFilename: 'index.html',
    badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  },
  css: {
    id: 'css',
    name: 'CSS',
    monacoLanguage: 'css',
    extension: '.css',
    defaultFilename: 'styles.css',
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  },
  java: {
    id: 'java',
    name: 'Java',
    monacoLanguage: 'java',
    extension: '.java',
    defaultFilename: 'Main.java',
    badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20',
  },
  sql: {
    id: 'sql',
    name: 'SQL',
    monacoLanguage: 'sql',
    extension: '.sql',
    defaultFilename: 'query.sql',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  },
};

export interface AIResponse {
  code: string;
  description: string;
  explanation: string[];
  dependencies: string[];
  run_instructions: string;
  language: string;
  history_id?: number;
  is_saved: boolean;
}

export interface HistoryItem {
  id: number;
  tool_type: ToolType | 'saved';
  title?: string;
  prompt?: string;
  language: string;
  target_language?: string;
  input_code?: string;
  generated_code: string;
  description?: string;
  explanation?: string;
  dependencies?: string;
  run_instructions?: string;
  is_saved: boolean;
  created_at: string;
}

export interface UserSettings {
  apiKey: string;
  model: string;
  defaultLanguage: SupportedLanguage;
}

export interface ExecuteResult {
  output: string;
  error?: string | null;
  execution_time_ms: number;
  status: 'success' | 'error' | 'timeout';
}

