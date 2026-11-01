import { AIResponse, HistoryItem, SupportedLanguage, ToolType, ExecuteResult } from '../types';

const API_BASE = '/api';

export async function checkHealth(): Promise<{ status: string; openai_configured: boolean; model: string }> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    return { status: 'error', openai_configured: false, model: 'unavailable' };
  }
}

export async function generateCode(payload: {
  prompt: string;
  language: SupportedLanguage;
  apiKey?: string;
  model?: string;
}): Promise<AIResponse> {
  const res = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: payload.prompt,
      language: payload.language,
      api_key: payload.apiKey || null,
      model: payload.model || null,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to generate code' }));
    throw new Error(err.detail || 'Failed to generate code');
  }
  return await res.json();
}

export async function fixCode(payload: {
  code: string;
  language: SupportedLanguage;
  errorDescription?: string;
  apiKey?: string;
  model?: string;
}): Promise<AIResponse> {
  const res = await fetch(`${API_BASE}/fix`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: payload.code,
      language: payload.language,
      error_description: payload.errorDescription || '',
      api_key: payload.apiKey || null,
      model: payload.model || null,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to fix code' }));
    throw new Error(err.detail || 'Failed to fix code');
  }
  return await res.json();
}

export async function explainCode(payload: {
  code: string;
  language: SupportedLanguage;
  apiKey?: string;
  model?: string;
}): Promise<AIResponse> {
  const res = await fetch(`${API_BASE}/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: payload.code,
      language: payload.language,
      api_key: payload.apiKey || null,
      model: payload.model || null,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to explain code' }));
    throw new Error(err.detail || 'Failed to explain code');
  }
  return await res.json();
}

export async function optimizeCode(payload: {
  code: string;
  language: SupportedLanguage;
  apiKey?: string;
  model?: string;
}): Promise<AIResponse> {
  const res = await fetch(`${API_BASE}/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: payload.code,
      language: payload.language,
      api_key: payload.apiKey || null,
      model: payload.model || null,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to optimize code' }));
    throw new Error(err.detail || 'Failed to optimize code');
  }
  return await res.json();
}

export async function convertCode(payload: {
  code: string;
  sourceLanguage: SupportedLanguage;
  targetLanguage: SupportedLanguage;
  apiKey?: string;
  model?: string;
}): Promise<AIResponse> {
  const res = await fetch(`${API_BASE}/convert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: payload.code,
      source_language: payload.sourceLanguage,
      target_language: payload.targetLanguage,
      api_key: payload.apiKey || null,
      model: payload.model || null,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to convert code' }));
    throw new Error(err.detail || 'Failed to convert code');
  }
  return await res.json();
}

export async function fetchHistory(filters?: {
  q?: string;
  toolType?: string;
  language?: string;
  savedOnly?: boolean;
}): Promise<HistoryItem[]> {
  const params = new URLSearchParams();
  if (filters?.q) params.append('q', filters.q);
  if (filters?.toolType) params.append('tool_type', filters.toolType);
  if (filters?.language) params.append('language', filters.language);
  if (filters?.savedOnly) params.append('saved_only', 'true');

  const res = await fetch(`${API_BASE}/history?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return await res.json();
}

export async function saveSnippet(payload: {
  title: string;
  language: string;
  code: string;
  description?: string;
  explanation?: string[];
  dependencies?: string[];
  runInstructions?: string;
  historyId?: number;
}): Promise<HistoryItem> {
  const res = await fetch(`${API_BASE}/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: payload.title,
      language: payload.language,
      code: payload.code,
      description: payload.description || '',
      explanation: payload.explanation || [],
      dependencies: payload.dependencies || [],
      run_instructions: payload.runInstructions || '',
      history_id: payload.historyId || null,
    }),
  });
  if (!res.ok) throw new Error('Failed to save snippet');
  return await res.json();
}

export async function toggleFavorite(historyId: number, isSaved: boolean): Promise<HistoryItem> {
  const res = await fetch(`${API_BASE}/history/${historyId}/favorite`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_saved: isSaved }),
  });
  if (!res.ok) throw new Error('Failed to update favorite status');
  return await res.json();
}

export async function deleteHistoryItem(historyId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/history/${historyId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete history item');
}

export async function executeCode(code: string, language: string): Promise<ExecuteResult> {
  const res = await fetch(`${API_BASE}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Execution request failed' }));
    throw new Error(err.detail || 'Execution request failed');
  }
  return await res.json();
}

