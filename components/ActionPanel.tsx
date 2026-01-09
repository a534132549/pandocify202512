import React, { useState } from 'react';
import { Download, Sparkles, AlertCircle, FileType, Printer } from 'lucide-react';
import { ConversionStatus } from '../types';
import { convertMarkdownToDocx } from '../services/pandoc';
import { generateMathExample } from '../services/gemini';

interface ActionPanelProps {
  markdown: string;
  setMarkdown: (md: string) => void;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({ markdown, setMarkdown }) => {
  const [status, setStatus] = useState<ConversionStatus>(ConversionStatus.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConvert = async () => {
    setStatus(ConversionStatus.CONVERTING);
    setErrorMessage(null);
    try {
      const result = await convertMarkdownToDocx(markdown);
      if (result.success) {
        setStatus(ConversionStatus.SUCCESS);
        // Reset success status after a delay
        setTimeout(() => setStatus(ConversionStatus.IDLE), 3000);
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (err) {
      console.error(err);
      setStatus(ConversionStatus.ERROR);
      setErrorMessage("Could not connect to Backend API. Is it running? (See README)");
      setTimeout(() => setStatus(ConversionStatus.IDLE), 5000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAiGenerate = async () => {
    if (!process.env.API_KEY) {
      alert("Please set the API_KEY environment variable to use AI features.");
      return;
    }
    const originalText = markdown;
    setMarkdown(markdown + "\n\nGenerating example...");
    try {
      const example = await generateMathExample();
      setMarkdown(originalText + "\n\n" + example);
    } catch (e) {
      console.error(e);
      setMarkdown(originalText + "\n\nError generating example.");
    }
  };

  return (
    <div className="h-16 bg-white border-t border-slate-200 flex items-center justify-between px-4 md:px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
      <div className="flex items-center gap-4 text-sm text-slate-500 truncate max-w-[50%]">
        {status === ConversionStatus.ERROR && (
          <span className="text-red-600 flex items-center gap-1.5 font-medium animate-pulse">
            <AlertCircle size={16} />
            {errorMessage}
          </span>
        )}
        {status === ConversionStatus.SUCCESS && (
          <span className="text-emerald-600 flex items-center gap-1.5 font-medium">
            <Download size={16} />
            Download started!
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleAiGenerate}
          className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-colors"
        >
          <Sparkles size={16} className="text-purple-500" />
          AI Example
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-colors mr-2 text-red-600"
        >
          <Printer size={16} />
          Download PDF
        </button>

        <button
          onClick={handleConvert}
          disabled={status === ConversionStatus.CONVERTING}
          className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-lg shadow-sm transition-all
            ${status === ConversionStatus.CONVERTING
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow active:transform active:scale-95'
            }
          `}
        >
          {status === ConversionStatus.CONVERTING ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Converting...
            </>
          ) : (
            <>
              <FileType size={16} />
              Convert to Word
            </>
          )}
        </button>
      </div>
    </div>
  );
};