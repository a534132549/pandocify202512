import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';

interface PreviewProps {
  markdown: string;
}

export const Preview: React.FC<PreviewProps> = ({ markdown }) => {
  // Filter out citation tags to match the exported document
  const displayMarkdown = markdown.replace(/\[cite_start\]|\[cite:\s*\d+\]/g, '');

  return (
    <div className="w-full h-full overflow-y-auto p-4 md:p-8 prose prose-slate prose-sm md:prose-base max-w-none bg-slate-50 prose-headings:font-bold prose-h1:text-indigo-900 prose-a:text-indigo-600 prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-1 prose-code:rounded prose-pre:bg-slate-100 prose-pre:border prose-pre:border-slate-200 prose-pre:text-slate-800 prose-pre:shadow-sm">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkBreaks, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Override standard components if needed for better styling
          h1: ({ node, ...props }) => <h1 className="text-3xl font-extrabold text-slate-800 border-b-2 border-slate-200 pb-3 mb-6 mt-8 first:mt-0" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4 mt-8 flex items-center gap-2" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-slate-700 mb-3 mt-6" {...props} />,
          p: ({ node, ...props }) => <p className="mb-4 leading-7 text-slate-700" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
          li: ({ node, ...props }) => <li className="pl-1" {...props} />,
          blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-indigo-500 bg-indigo-50 pl-4 py-1 pr-4 my-4 rounded-r italic text-slate-700" {...props} />,
          table: ({ node, ...props }) => <div className="overflow-x-auto my-6 rounded-lg border border-slate-200"><table className="min-w-full divide-y divide-slate-200" {...props} /></div>,
          th: ({ node, ...props }) => <th className="bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-900 border-b border-slate-200" {...props} />,
          td: ({ node, ...props }) => <td className="bg-white px-4 py-3 text-sm text-slate-600 border-b border-slate-100 last:border-0" {...props} />,
        }}
      >
        {displayMarkdown}
      </ReactMarkdown>
    </div>
  );
};