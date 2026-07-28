import { useMemo } from 'react';
import JsonView from '@uiw/react-json-view';
import { vscodeTheme } from '@uiw/react-json-view/vscode';
import { githubLightTheme } from '@uiw/react-json-view/githubLight';
import { useTheme } from './ThemeProvider';

interface JsonTreeViewProps {
  value: string;
}

export function JsonTreeView({ value }: JsonTreeViewProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  const parsedValue = useMemo(() => {
    try {
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  }, [value]);

  if (!parsedValue) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-card">
        <p className="text-lg font-medium mb-2 text-foreground">Invalid JSON</p>
        <p className="text-sm">Please fix formatting errors in Code View to see the interactive tree.</p>
      </div>
    );
  }

  return (
    <div className={`flex-1 p-4 overflow-auto rounded-b-md ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
      <JsonView 
        value={parsedValue} 
        style={isDark ? vscodeTheme : githubLightTheme}
        displayDataTypes={false}
        displayObjectSize={true}
        enableClipboard={true}
      />
    </div>
  );
}
