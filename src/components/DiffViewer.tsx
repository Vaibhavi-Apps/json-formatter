import { useState, useMemo } from 'react';
import ReactDiffViewer from 'react-diff-viewer-continued';
import { useTheme } from './ThemeProvider';
import { Editor } from './Editor';

export function DiffViewer() {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');
  const [showDiff, setShowDiff] = useState(false);

  // Helper to safely format JSON so we only diff actual structural changes, not accidental whitespace
  const formatForDiff = (input: string) => {
    if (!input.trim()) return '';
    try {
      return JSON.stringify(JSON.parse(input), null, 2);
    } catch (e) {
      return input; // If invalid JSON, just return raw to let them diff it anyway
    }
  };

  const handleCompare = () => {
    setShowDiff(true);
  };

  const formattedOriginal = useMemo(() => formatForDiff(original), [original]);
  const formattedModified = useMemo(() => formatForDiff(modified), [modified]);

  return (
    <div className="flex-1 flex flex-col w-full h-full min-h-[500px]">
      {!showDiff ? (
        <div className="flex-1 flex flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Paste JSON to Compare</h2>
            <button
              onClick={handleCompare}
              disabled={!original.trim() || !modified.trim()}
              className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Compare JSON
            </button>
          </div>
          <div className="flex-1 flex flex-col md:flex-row gap-4 h-full">
            <div className="flex-1 flex flex-col border border-border rounded-lg overflow-hidden bg-card relative">
              <div className="bg-muted px-4 py-2 text-sm font-medium border-b border-border text-center">Original JSON</div>
              <div className="flex-1 relative min-h-[400px]">
                <Editor value={original} onChange={setOriginal} />
              </div>
            </div>
            <div className="flex-1 flex flex-col border border-border rounded-lg overflow-hidden bg-card relative">
              <div className="bg-muted px-4 py-2 text-sm font-medium border-b border-border text-center">Modified JSON</div>
              <div className="flex-1 relative min-h-[400px]">
                <Editor value={modified} onChange={setModified} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden bg-card">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Comparison Results</h2>
            <button
              onClick={() => setShowDiff(false)}
              className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm font-medium"
            >
              Back to Editing
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4 custom-diff-container">
            <ReactDiffViewer
              oldValue={formattedOriginal}
              newValue={formattedModified}
              splitView={true}
              useDarkTheme={isDark}
              hideLineNumbers={false}
              showDiffOnly={false}
              leftTitle="Original"
              rightTitle="Modified"
            />
          </div>
        </div>
      )}
    </div>
  );
}
