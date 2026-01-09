import React from 'react';
import { FileText } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 md:px-6 justify-between flex-shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
            <FileText size={18} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">Pandocify</h1>
            <p className="text-[10px] text-slate-500 font-medium leading-none">MD to Docx Converter</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              Backend Required
           </div>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
};