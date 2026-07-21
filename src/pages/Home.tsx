import { useState, useCallback, useRef } from 'react';
import { type ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { openSearchPanel } from '@codemirror/search';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Toolbar } from '../components/Toolbar';
import { Editor } from '../components/Editor';
import { StatusPanel } from '../components/StatusPanel';
import type { StatusType } from '../components/StatusPanel';
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

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Header />
      
      <main className="flex-1 flex flex-col">
        <Hero />
        
        <section className="container mx-auto px-4 pb-12 flex-1 flex flex-col">
          <div className="flex-1 flex flex-col bg-card rounded-lg shadow-sm border border-border overflow-hidden">
            <Toolbar 
              onBeautify={handleBeautify}
              onMinify={handleMinify}
              onValidate={handleValidate}
              onFind={handleFind}
              onCopy={handleCopy}
              onDownload={handleDownload}
            />
            <StatusPanel status={status.type} message={status.message} />
            <div className="flex-1 flex flex-col min-h-[500px]" onPaste={handlePaste}>
              <Editor 
                editorRef={editorRef}
                value={jsonInput}
                onChange={handleEditorChange}
              />
            </div>
          </div>
          
          {/* <Advertisement /> */}
        </section>
      </main>
      
      {/* <Footer /> */}
    </div>
  );
}
