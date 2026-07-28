import { Sparkles, Minimize, CheckCircle, Copy, Download, Search, Quote, FileCode2 } from 'lucide-react';

interface ToolbarProps {
  onBeautify: () => void;
  onMinify: () => void;
  onValidate: () => void;
  onFind: () => void;
  onEscape: () => void;
  onUnescape: () => void;
  onCopy: () => void;
  onDownload: () => void;
}

export function Toolbar({ onBeautify, onMinify, onValidate, onFind, onEscape, onUnescape, onCopy, onDownload }: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-2 bg-muted/50 rounded-t-lg border-b border-border">
      <button 
        onClick={onBeautify}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded hover:bg-background hover:text-primary transition-colors"
      >
        <Sparkles className="w-4 h-4" />
        <span className="hidden sm:inline">Beautify</span>
      </button>

      <button 
        onClick={onMinify}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded hover:bg-background hover:text-primary transition-colors"
      >
        <Minimize className="w-4 h-4" />
        <span className="hidden sm:inline">Minify</span>
      </button>

      <button 
        onClick={onValidate}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded hover:bg-background hover:text-primary transition-colors"
      >
        <CheckCircle className="w-4 h-4" />
        <span className="hidden sm:inline">Validate</span>
      </button>

      <button 
        onClick={onFind}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded hover:bg-background hover:text-primary transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Find</span>
      </button>

      <div className="w-px h-5 bg-border mx-1" />

      <button 
        onClick={onEscape}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded hover:bg-background hover:text-primary transition-colors"
      >
        <Quote className="w-4 h-4" />
        <span className="hidden sm:inline">Escape</span>
      </button>

      <button 
        onClick={onUnescape}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded hover:bg-background hover:text-primary transition-colors"
      >
        <FileCode2 className="w-4 h-4" />
        <span className="hidden sm:inline">Unescape</span>
      </button>

      <div className="flex-1" />

      <button 
        onClick={onCopy}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded hover:bg-background transition-colors"
      >
        <Copy className="w-4 h-4" />
        <span className="hidden sm:inline">Copy</span>
      </button>

      <button 
        onClick={onDownload}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded hover:bg-background transition-colors"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Download</span>
      </button>
    </div>
  );
}
