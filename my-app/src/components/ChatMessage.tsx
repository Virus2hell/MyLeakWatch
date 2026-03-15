import React from 'react';
import ReactMarkdown from 'react-markdown';

type Props = { role: 'user' | 'assistant'; text: string };

export default function ChatMessage({ role, text }: Props) {
  const side = role === 'user' ? 'items-end' : 'items-start';

  const bubble =
    role === 'user'
      ? 'bg-blue-600 text-white rounded-l-2xl rounded-tr-2xl'
      : 'bg-slate-900/70 border border-white/10 text-slate-100 rounded-r-2xl rounded-tl-2xl';

  return (
    <div className={`w-full flex ${side}`}>
      <div className={`max-w-[85%] px-3 py-2 text-sm leading-relaxed ${bubble}`}>
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-2">{children}</p>,
            strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
            ul: ({ children }) => <ul className="list-disc pl-5 space-y-1">{children}</ul>,
            li: ({ children }) => <li>{children}</li>
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
}