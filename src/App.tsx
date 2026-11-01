import React, { useState, useEffect } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  ToolSelector 
} from './components/ToolSelector';
import { 
  PromptSection 
} from './components/PromptSection';
import { 
  CodeEditorSection 
} from './components/CodeEditorSection';
import { 
  OutputConsole 
} from './components/OutputConsole';
import { 
  HistoryDrawer 
} from './components/HistoryDrawer';
import { 
  SavedSnippetsModal 
} from './components/SavedSnippetsModal';
import { 
  SettingsModal 
} from './components/SettingsModal';
import { 
  SupportedLanguage, 
  ToolType, 
  AIResponse, 
  HistoryItem,
  ExecuteResult,
  SUPPORTED_LANGUAGES 
} from './types';
import { 
  generateCode, 
  fixCode, 
  explainCode, 
  optimizeCode, 
  convertCode, 
  executeCode,
  checkHealth,
  saveSnippet,
  toggleFavorite,
  fetchHistory 
} from './services/api';
import { AlertCircle, CheckCircle } from 'lucide-react';

const INITIAL_CODE_PYTHON = `def calculate_fibonacci(n: int) -> list[int]:
    """Generates the Fibonacci sequence up to n numbers."""
    if n <= 0:
        return []
    sequence = [0, 1] if n > 1 else [0]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])
    return sequence

if __name__ == "__main__":
    result = calculate_fibonacci(10)
    print("Fibonacci(10):", result)`;

export const App: React.FC = () => {
  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<'generator' | 'history' | 'saved'>('generator');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Tool & Language Selection
  const [currentTool, setCurrentTool] = useState<ToolType>('generate');
  const [language, setLanguage] = useState<SupportedLanguage>('python');
  const [targetLanguage, setTargetLanguage] = useState<SupportedLanguage>('javascript');

  // Inputs
  const [prompt, setPrompt] = useState('FastAPI REST API with item CRUD and pydantic models');
  const [inputCode, setInputCode] = useState('');
  const [errorDescription, setErrorDescription] = useState('');

  // AI Output
  const [code, setCode] = useState(INITIAL_CODE_PYTHON);
  const [description, setDescription] = useState('Demonstrates a clean Python function computing Fibonacci numbers with type annotations.');
  const [explanation, setExplanation] = useState<string[]>([
    'Defined calculate_fibonacci function with parameter type hinting.',
    'Initialized base sequence [0, 1] for sequences of length 2 or more.',
    'Iterated until list reached n elements, appending sums of last two values.',
    'Added standard __main__ execution test block.'
  ]);
  const [dependencies, setDependencies] = useState<string[]>(['Python 3.8+ Standard Library']);
  const [runInstructions, setRunInstructions] = useState('python main.py');
  const [currentHistoryId, setCurrentHistoryId] = useState<number | undefined>(undefined);
  const [isSaved, setIsSaved] = useState(false);

  // IDE Execution State
  const [executionResult, setExecutionResult] = useState<ExecuteResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // App & Execution State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [savedCount, setSavedCount] = useState(0);

  // Settings
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('codeai_custom_api_key') || '');
  const [model, setModel] = useState(() => localStorage.getItem('codeai_model') || 'gpt-4o-mini');
  const [isOpenAIConfigured, setIsOpenAIConfigured] = useState(false);

  // Check health and count saved items on startup
  const refreshStats = async () => {
    try {
      const health = await checkHealth();
      setIsOpenAIConfigured(health.openai_configured || Boolean(apiKey.trim()));

      const saved = await fetchHistory({ savedOnly: true });
      setSavedCount(saved.length);
    } catch (e) {
      console.warn('Initial status check notice:', e);
    }
  };

  useEffect(() => {
    refreshStats();
  }, [apiKey]);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Run Code in Integrated IDE Terminal / Preview
  const handleRunCode = async () => {
    if (!code.trim()) return;
    setIsExecuting(true);
    setErrorMsg(null);

    try {
      const res = await executeCode(code, language);
      setExecutionResult(res);
      if (res.status === 'success') {
        showToast(`Executed in ${res.execution_time_ms}ms`);
      } else if (res.status === 'timeout') {
        setErrorMsg(res.error || 'Execution timed out');
      }
    } catch (err: any) {
      setExecutionResult({
        output: '',
        error: err.message || 'Execution failed',
        execution_time_ms: 0,
        status: 'error',
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // Main AI Generation Handler
  const handleExecute = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      let res: AIResponse;

      switch (currentTool) {
        case 'generate':
          res = await generateCode({
            prompt,
            language,
            apiKey: apiKey.trim() || undefined,
            model,
          });
          break;
        case 'fix':
          res = await fixCode({
            code: inputCode,
            language,
            errorDescription,
            apiKey: apiKey.trim() || undefined,
            model,
          });
          break;
        case 'explain':
          res = await explainCode({
            code: inputCode,
            language,
            apiKey: apiKey.trim() || undefined,
            model,
          });
          break;
        case 'optimize':
          res = await optimizeCode({
            code: inputCode,
            language,
            apiKey: apiKey.trim() || undefined,
            model,
          });
          break;
        case 'convert':
          res = await convertCode({
            code: inputCode,
            sourceLanguage: language,
            targetLanguage: targetLanguage,
            apiKey: apiKey.trim() || undefined,
            model,
          });
          setLanguage(targetLanguage);
          break;
      }

      setCode(res.code);
      setDescription(res.description);
      setExplanation(res.explanation);
      setDependencies(res.dependencies);
      setRunInstructions(res.run_instructions);
      setCurrentHistoryId(res.history_id);
      setIsSaved(res.is_saved);

      // Reset previous execution output for newly generated code
      setExecutionResult(null);

      showToast(`Successfully processed with ${currentTool.toUpperCase()} tool!`);
      refreshStats();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred while communicating with the AI.');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Save Snippet
  const handleToggleSave = async () => {
    try {
      if (currentHistoryId) {
        const nextState = !isSaved;
        const updated = await toggleFavorite(currentHistoryId, nextState);
        setIsSaved(updated.is_saved);
        showToast(updated.is_saved ? 'Snippet saved to bookmarks!' : 'Snippet removed from bookmarks.');
      } else {
        // Save current code directly
        const title = prompt ? prompt.slice(0, 40) : `Snippet (${language})`;
        const record = await saveSnippet({
          title,
          language,
          code,
          description,
          explanation,
          dependencies,
          runInstructions,
        });
        setCurrentHistoryId(record.id);
        setIsSaved(true);
        showToast('Snippet saved to bookmarks!');
      }
      refreshStats();
    } catch (err: any) {
      setErrorMsg('Failed to update bookmark status: ' + err.message);
    }
  };

  // Restore snippet from History or Saved modal
  const handleSelectSnippet = (item: HistoryItem) => {
    setCode(item.generated_code);
    setDescription(item.description || item.prompt || '');
    if (item.explanation) {
      try {
        setExplanation(JSON.parse(item.explanation));
      } catch {
        setExplanation([item.explanation]);
      }
    }
    if (item.dependencies) {
      try {
        setDependencies(JSON.parse(item.dependencies));
      } catch {
        setDependencies([item.dependencies]);
      }
    }
    setRunInstructions(item.run_instructions || '');
    if (item.language in SUPPORTED_LANGUAGES) {
      setLanguage(item.language as SupportedLanguage);
    }
    if (['generate', 'fix', 'explain', 'optimize', 'convert'].includes(item.tool_type)) {
      setCurrentTool(item.tool_type as ToolType);
    }
    if (item.prompt) setPrompt(item.prompt);
    if (item.input_code) setInputCode(item.input_code);
    setCurrentHistoryId(item.id);
    setIsSaved(item.is_saved);
    setExecutionResult(null);
    showToast(`Loaded snippet "${item.title || item.language}"`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-slate-100">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-400 text-xs sm:text-sm font-medium shadow-2xl animate-in slide-in-from-bottom duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSaved={() => setIsSavedOpen(true)}
        savedCount={savedCount}
        isOpenAIConfigured={isOpenAIConfigured}
      />

      {/* Main Studio & IDE Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Error Alert Banner */}
        {errorMsg && (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-xs font-semibold hover:underline ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 5 AI Tools Bar */}
        <ToolSelector
          currentTool={currentTool}
          onSelectTool={(tool) => setCurrentTool(tool)}
        />

        {/* Two-Column Responsive Layout: AI Studio (Left) & Full IDE (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: AI Prompting, Code Inputs & Tools (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            <PromptSection
              currentTool={currentTool}
              prompt={prompt}
              setPrompt={setPrompt}
              inputCode={inputCode}
              setInputCode={setInputCode}
              language={language}
              setLanguage={setLanguage}
              targetLanguage={targetLanguage}
              setTargetLanguage={setTargetLanguage}
              errorDescription={errorDescription}
              setErrorDescription={setErrorDescription}
              onExecute={handleExecute}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column: Full Integrated IDE Workspace (Monaco + Terminal/Preview Dock) (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Monaco Code Editor */}
            <div className="h-[460px]">
              <CodeEditorSection
                code={code}
                setCode={setCode}
                language={language}
                isSaved={isSaved}
                onToggleSave={handleToggleSave}
                onRegenerate={handleExecute}
                isLoading={isLoading}
                onRunCode={handleRunCode}
                isExecuting={isExecuting}
              />
            </div>

            {/* Built-in IDE Terminal, Live Web Preview & AI Insights Panel */}
            <OutputConsole
              code={code}
              language={language}
              executionResult={executionResult}
              isExecuting={isExecuting}
              onRunCode={handleRunCode}
              onClearOutput={() => setExecutionResult(null)}
              description={description}
              explanation={explanation}
              dependencies={dependencies}
              runInstructions={runInstructions}
            />

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
        <p>
          CodeAI – Built with React, TypeScript, Monaco Editor, Tailwind CSS & FastAPI.
        </p>
      </footer>

      {/* Drawers and Modals */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectSnippet={handleSelectSnippet}
        onUpdateFavoritesCount={refreshStats}
      />

      <SavedSnippetsModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        onSelectSnippet={handleSelectSnippet}
        onUpdateFavoritesCount={refreshStats}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
        model={model}
        setModel={setModel}
      />

    </div>
  );
};
