import { useState, useCallback, useRef } from 'react';
import { type ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { openSearchPanel } from '@codemirror/search';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Toolbar } from '../components/Toolbar';
import { Editor } from '../components/Editor';
import { StatusPanel } from '../components/StatusPanel';
import type { StatusType } from '../components/StatusPanel';
import { DiffViewer } from '../components/DiffViewer';
import { JsonTreeView } from '../components/JsonTreeView';
// import { Advertisement } from '../components/Advertisement';
// import { Footer } from '../components/Footer';

export function Home() {
  const [jsonInput, setJsonInput] = useState<string>('');
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const [status, setStatus] = useState<{ type: StatusType; message: string }>({
    type: 'idle',
    message: 'Waiting for input...',
  });

  const handleFind = useCallback(() => {
    if (editorRef.current?.view) {
      openSearchPanel(editorRef.current.view);
    }
  }, []);

  const handleEditorChange = useCallback((value: string) => {
    setJsonInput(value);
    if (!value.trim()) {
      setStatus({ type: 'idle', message: 'Waiting for input...' });
    }
  }, []);

  const handleValidate = useCallback(() => {
    if (!jsonInput.trim()) {
      setStatus({ type: 'idle', message: 'Waiting for input...' });
      return false;
    }
    try {
      JSON.parse(jsonInput);
      setStatus({ type: 'success', message: 'Valid JSON' });
      return true;
    } catch (e: any) {
      setStatus({ type: 'error', message: `Invalid JSON: ${e.message}` });
      return false;
    }
  }, [jsonInput]);

  const handleBeautify = useCallback(() => {
    try {
      if (!jsonInput.trim()) return;
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
      setStatus({ type: 'success', message: 'JSON beautified successfully.' });
    } catch (e: any) {
      setStatus({ type: 'error', message: `Cannot beautify invalid JSON: ${e.message}` });
    }
  }, [jsonInput]);

  const handleMinify = useCallback(() => {
    try {
      if (!jsonInput.trim()) return;
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed));
      setStatus({ type: 'success', message: 'JSON minified successfully.' });
    } catch (e: any) {
      setStatus({ type: 'error', message: `Cannot minify invalid JSON: ${e.message}` });
    }
  }, [jsonInput]);

  const handleCopy = useCallback(() => {
    if (!jsonInput) return;
    navigator.clipboard.writeText(jsonInput).then(() => {
      setStatus({ type: 'success', message: 'Copied to clipboard!' });
    }).catch(() => {
      setStatus({ type: 'error', message: 'Failed to copy to clipboard.' });
    });
  }, [jsonInput]);

  const handleDownload = useCallback(() => {
    if (!jsonInput) return;
    try {
      const blob = new Blob([jsonInput], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'formatted_data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatus({ type: 'success', message: 'File downloaded successfully.' });
    } catch (e: any) {
      setStatus({ type: 'error', message: 'Failed to download file.' });
    }
  }, [jsonInput]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    if (!pastedText) return;
    
    try {
      // Check if it's valid JSON
      const parsed = JSON.parse(pastedText);
      // Auto-format only if the editor is currently empty
      if (!jsonInput.trim()) {
        e.preventDefault();
        const formatted = JSON.stringify(parsed, null, 2);
        setJsonInput(formatted);
        setStatus({ type: 'success', message: 'Auto-formatted pasted JSON.' });
      }
    } catch (err) {
      // Not valid JSON or parsing failed, allow default paste behavior
    }
  }, [jsonInput]);

  const handleEscape = useCallback(() => {
    try {
      if (!jsonInput.trim()) return;

      // Check if it's already an escaped string to prevent infinite double-escaping
      try {
        const parsed = JSON.parse(jsonInput);
        if (typeof parsed === 'string') {
          setStatus({ type: 'error', message: 'JSON is already escaped! Use Unescape first if you want to modify it.' });
          return;
        }
      } catch (e) {
        // If it doesn't parse, it's definitely not an escaped string, so we proceed to escape it.
      }

      // JSON.stringify on the raw input string will escape all quotes and preserve newlines if present.
      // If the user wants a single line, they can simply hit "Minify" before hitting "Escape".
      const stringified = JSON.stringify(jsonInput);
      setJsonInput(stringified);
      setStatus({ type: 'success', message: 'JSON escaped successfully. (Tip: Minify first for a single-line string)' });
    } catch (e: any) {
      setStatus({ type: 'error', message: `Cannot escape: ${e.message}` });
    }
  }, [jsonInput]);

  const handleUnescape = useCallback(() => {
    try {
      if (!jsonInput.trim()) return;
      // We parse the string to remove the outer quotes and unescape the inner quotes.
      const unescaped = JSON.parse(jsonInput);
      if (typeof unescaped !== 'string') {
         throw new Error('Input is not a valid escaped JSON string.');
      }
      setJsonInput(unescaped);
      setStatus({ type: 'success', message: 'JSON unescaped successfully. You can now beautify it.' });
    } catch (e: any) {
      setStatus({ type: 'error', message: `Cannot unescape: Make sure the string starts and ends with quotes.` });
    }
  }, [jsonInput]);

  const [mode, setMode] = useState<'format' | 'diff'>('format');
  const [viewType, setViewType] = useState<'code' | 'tree'>('code');

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Header />
      
      <main className="flex-1 flex flex-col">
        <Hero />
        
        <section className="container mx-auto px-4 pb-12 flex-1 flex flex-col">
          <div className="flex justify-center mb-6">
            <div className="bg-muted p-1 rounded-lg inline-flex">
              <button 
                onClick={() => setMode('format')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${mode === 'format' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Formatter
              </button>
              <button 
                onClick={() => setMode('diff')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${mode === 'diff' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Diff / Compare
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-card rounded-lg shadow-sm border border-border overflow-hidden">
            {mode === 'format' ? (
              <>
                <Toolbar 
                  onBeautify={handleBeautify}
                  onMinify={handleMinify}
                  onValidate={handleValidate}
                  onFind={handleFind}
                  onEscape={handleEscape}
                  onUnescape={handleUnescape}
                  onCopy={handleCopy}
                  onDownload={handleDownload}
                />
                
                <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
                  <StatusPanel status={status.type} message={status.message} />
                  <div className="flex bg-muted p-0.5 rounded-md">
                    <button 
                      onClick={() => setViewType('code')}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${viewType === 'code' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      Code View
                    </button>
                    <button 
                      onClick={() => setViewType('tree')}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${viewType === 'tree' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      Tree View
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col min-h-[500px]" onPaste={handlePaste}>
                  {viewType === 'code' ? (
                    <Editor 
                      editorRef={editorRef}
                      value={jsonInput}
                      onChange={handleEditorChange}
                    />
                  ) : (
                    <JsonTreeView value={jsonInput} />
                  )}
                </div>
              </>
            ) : (
              <DiffViewer />
            )}
          </div>
          
          {/* <Advertisement /> */}
        </section>
      </main>
      
      {/* <Footer /> */}
    </div>
  );
}
