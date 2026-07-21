import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { EditorView } from '@codemirror/view';
import { search } from '@codemirror/search';
import { useTheme } from './ThemeProvider';

import { type ReactCodeMirrorRef } from '@uiw/react-codemirror';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  editorRef?: React.RefObject<ReactCodeMirrorRef | null>;
}

export function Editor({ value, onChange, editorRef }: EditorProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className={`w-full flex-1 relative min-h-[500px] h-full flex flex-col [&>div]:flex-1 ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
      <CodeMirror
        ref={editorRef}
        value={value}
        height="100%"
        theme={isDark ? vscodeDark : 'light'}
        extensions={[json(), EditorView.lineWrapping, search({ top: true })]}
        onChange={onChange}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: true,
          tabSize: 2,
        }}
        className="h-full text-[15px] absolute inset-0"
      />
    </div>
  );
}
