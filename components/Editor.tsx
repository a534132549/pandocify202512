import React from 'react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  return (
    <textarea
      className="w-full h-full resize-none p-4 md:p-6 outline-none font-mono text-sm leading-relaxed text-slate-700 bg-white placeholder-slate-300"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Type your markdown here... Use $ for inline math and $$ for block math."
      spellCheck={false}
    />
  );
};