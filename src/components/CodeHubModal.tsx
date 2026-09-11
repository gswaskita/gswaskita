import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  FileCode, 
  FolderTree, 
  Terminal, 
  Download, 
  Code2, 
  Sparkles,
  Layers
} from 'lucide-react';
import { ASTRO_PROJECT_FILES } from '../data/portfolioData';

interface CodeHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeHubModal: React.FC<CodeHubModalProps> = ({ isOpen, onClose }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const activeFile = ASTRO_PROJECT_FILES[selectedFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([activeFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative max-w-5xl w-full h-[88vh] rounded-2xl bg-[#0A192F] border border-white/20 shadow-2xl flex flex-col overflow-hidden text-white">
        
        {/* Modal Top Navigation Bar */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-white/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>Astro + Tailwind + Keystatic CMS Architecture Code Hub</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Ready-to-Deploy
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Exact production-grade source code for Astro SSG, Dynamic ToC, and Keystatic Schemas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadFile}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
              title="Download Current File"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: File Sidebar (Left) + Code Viewer (Right) */}
        <div className="grid md:grid-cols-12 flex-1 overflow-hidden">
          
          {/* File Explorer (4 cols) */}
          <div className="md:col-span-4 bg-slate-900/60 border-r border-white/10 p-4 overflow-y-auto space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-300 px-2 py-1">
              <FolderTree className="w-3.5 h-3.5" />
              <span>Project Files & Schemas</span>
            </div>

            <div className="space-y-1.5">
              {ASTRO_PROJECT_FILES.map((file, index) => {
                const isSelected = selectedFileIndex === index;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFileIndex(index)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex flex-col gap-1 border ${
                      isSelected
                        ? 'bg-blue-900/60 border-blue-400/60 text-white shadow-lg'
                        : 'bg-slate-900/40 border-white/5 text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold flex items-center gap-1.5">
                        <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-300' : 'text-slate-400'}`} />
                        {file.filename}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/40 text-slate-400">
                        {file.language}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400 truncate">
                      {file.path}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Terminal Guide */}
            <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-slate-400 p-2">
              <div className="flex items-center gap-1.5 text-blue-300 font-mono font-bold">
                <Terminal className="w-3.5 h-3.5" />
                <span>Quick Setup</span>
              </div>
              <pre className="p-2.5 rounded-lg bg-black/60 border border-white/10 font-mono text-[11px] text-slate-300 overflow-x-auto">
npm create astro@latest
npx astro add tailwind
npm i @keystatic/core @keystatic/astro
              </pre>
            </div>
          </div>

          {/* Code Viewer (8 cols) */}
          <div className="md:col-span-8 flex flex-col bg-[#071120] overflow-hidden">
            {/* File Path & Info */}
            <div className="px-5 py-2.5 bg-slate-900/90 border-b border-white/10 flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="text-blue-300 truncate font-semibold">
                {activeFile.path}
              </span>
              <span className="text-slate-400">
                {activeFile.description}
              </span>
            </div>

            {/* Preformatted Code Content */}
            <div className="flex-1 p-5 overflow-auto font-mono text-xs text-slate-200 leading-relaxed selection:bg-blue-600 selection:text-white">
              <pre className="whitespace-pre overflow-x-auto">
                <code>{activeFile.content}</code>
              </pre>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
