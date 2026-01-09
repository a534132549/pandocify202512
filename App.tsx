import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { ActionPanel } from './components/ActionPanel';
import { Tab } from './types';

const INITIAL_MARKDOWN = `# Physics Assignment

## 1. Newton's Second Law
The force $F$ acting on an object is equal to the mass $m$ of that object times its acceleration $a$.

$$
F = ma
$$

## 2. Mass-Energy Equivalence
The famous equation by **Einstein**:

$$
E = mc^2
$$

Where:
- $E$ is energy
- $m$ is mass
- $c$ is the speed of light

## 3. Quadratic Formula
The solution for $ax^2 + bx + c = 0$ is:

$$
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$
`;

export default function App() {
  const [markdown, setMarkdown] = useState<string>(INITIAL_MARKDOWN);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.EDITOR);
  const [isMobile, setIsMobile] = useState(false);

  // Simple responsive check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Layout>
      <div className="flex flex-col h-full">
        {/* Mobile Tabs */}
        <div className="md:hidden flex border-b border-slate-200 bg-white">
          <button
            onClick={() => setActiveTab(Tab.EDITOR)}
            className={`flex-1 py-3 text-sm font-medium ${activeTab === Tab.EDITOR
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-slate-500'
              }`}
          >
            Editor
          </button>
          <button
            onClick={() => setActiveTab(Tab.PREVIEW)}
            className={`flex-1 py-3 text-sm font-medium ${activeTab === Tab.PREVIEW
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-slate-500'
              }`}
          >
            Preview
          </button>
        </div>

        {/* Content Area */}
        <div id="content-area" className="flex-1 overflow-hidden relative flex flex-row">
          {/* Editor Pane */}
          <div
            className={`w-full md:w-1/2 h-full border-r border-slate-200 bg-white flex flex-col transition-all duration-300 ${isMobile && activeTab !== Tab.EDITOR ? 'hidden' : 'block'
              }`}
          >
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Markdown Input</span>
              <span className="text-xs text-slate-400">Supports LaTeX ($)</span>
            </div>
            <Editor value={markdown} onChange={setMarkdown} />
          </div>

          {/* Preview Pane */}
          <div
            id="preview-container"
            className={`w-full md:w-1/2 h-full bg-slate-50 flex flex-col transition-all duration-300 ${isMobile && activeTab !== Tab.PREVIEW ? 'hidden' : 'block'
              }`}
          >
            <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Preview</span>
              <span className="text-xs text-slate-400">Rendered with KaTeX</span>
            </div>
            <Preview markdown={markdown} />
          </div>
        </div>

        {/* Action Bar */}
        <ActionPanel markdown={markdown} setMarkdown={setMarkdown} />
      </div>
    </Layout>
  );
}