import React, { useEffect, useRef, useState } from 'react';
import ChatMessage from './ChatMessage';
import useChat from '../hooks/useChat';

type Props = { isOpen: boolean; onClose: () => void };

export default function ChatDrawer({ isOpen, onClose }: Props) {
  const { clear, messages, send, loading, stop } = useChat();
  const [input, setInput] = useState('');
  const bodyRef = useRef<HTMLDivElement>(null);

  // Auto scroll on new messages and when opening
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading, isOpen]);

  // Escape to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div aria-hidden={!isOpen} className={`fixed inset-0 z-[80] ${isOpen ? '' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`absolute right-0 top-0 h-full w-full sm:w-[420px] max-w-[92vw] bg-[#0d1b2a] text-slate-100 shadow-2xl border-l border-white/10
        transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 bg-gradient-to-br from-[#14213d] to-[#1b2a4a] border-b border-white/10">
          <h3 className="text-sm font-semibold">MyLeakWatch Assistant</h3>
          <div className="flex items-center gap-1">
            <button onClick={clear} title="New chat" className="px-2 py-1 rounded-md hover:bg-white/10">⟳</button>
            <button onClick={onClose} title="Close" className="px-2 py-1 rounded-md hover:bg-white/10">✕</button>
          </div>
        </header>

        {/* Body: flexible, scrollable */}
        <div ref={bodyRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          {messages.length === 0 && (
            <ChatMessage
              role="assistant"
              text="Hi! Ask about breach checks, password safety, or features. Never share passwords—use the email checker on the homepage to test exposure."
            />
          )}
          {messages.map((m, i) => (
            <ChatMessage key={i} role={m.role} text={m.content} />
          ))}
          {loading && <ChatMessage role="assistant" text="…" />}
        </div>

        {/* Footer / Input */}
        <form
          className="h-[110px] p-3 border-t border-white/10 grid grid-cols-[1fr_auto] gap-2 bg-[#0b1321]"
          onSubmit={(e) => { e.preventDefault(); if (input.trim()) { send(input.trim()); setInput(''); } }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            className="resize-none h-[48px] max-h-[90px] bg-[#09101b] text-slate-100 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            {loading ? (
              <button type="button" onClick={stop} className="px-3 rounded-lg bg-slate-700 hover:bg-slate-600">
                Stop
              </button>
            ) : (
              <button type="submit" className="px-3 rounded-lg bg-blue-600 hover:bg-blue-500">
                Send
              </button>
            )}
          </div>
        </form>
      </aside>
    </div>
  );
}
