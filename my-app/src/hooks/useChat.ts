import { useEffect, useRef, useState } from 'react';

export type Msg = { role: 'user' | 'assistant'; content: string };

const STORAGE_KEY = 'mlw_chat';

export default function useChat() {
  const [messages, setMessages] = useState<Msg[]>(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as unknown;
      return Array.isArray(raw) ? (raw as Msg[]) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
  }, [messages]);

  const clear = () => setMessages([]);

  const appendAssistant = (text: string) =>
    setMessages(cur => [...cur, { role: 'assistant', content: text }]);

  const send = async (text: string) => {
    if (!text || loading) return;

    const next: Msg[] = [...messages, { role: 'user' as const, content: text }];
    setMessages(next);
    setLoading(true);

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
        signal: controller.signal
      });

      // Surface HTTP errors with body text for quick diagnosis
      if (!resp.ok) {
        const txt = await safeReadText(resp);
        throw new Error(`HTTP ${resp.status}: ${txt || 'Upstream error'}`);
      }

      // If the environment/browser doesn’t support streaming, fall back to full JSON parse
      if (!resp.body) {
        try {
          const data = await resp.json();
          const content =
            data?.choices?.[0]?.message?.content ??
            data?.choices?.[0]?.delta?.content ??
            '';
          if (content) {
            appendAssistant(content);
            return;
          }
          throw new Error('No stream and no JSON content');
        } catch {
          throw new Error('No response body (stream unsupported)');
        }
      }

      // STREAMING PATH
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();

      let assistant: Msg = { role: 'assistant', content: '' };
      setMessages(cur => [...cur, assistant]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        // Append chunk to the last assistant message
        assistant = { role: 'assistant', content: assistant.content + chunk };
        setMessages(cur => {
          const copy = [...cur];
          copy[copy.length - 1] = assistant;
          return copy;
        });
      }
    } catch (e: any) {
      const msg = typeof e?.message === 'string' ? e.message : 'Unknown error';
      appendAssistant(`Error: ${msg}`);
    } finally {
      controllerRef.current = null;
      setLoading(false);
    }
  };

  const stop = () => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setLoading(false);
  };

  return { messages, send, loading, stop, clear };
}

// Safely read text; if JSON, stringify for visibility
async function safeReadText(resp: Response): Promise<string> {
  try {
    const ct = resp.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const j = await resp.json();
      return typeof j === 'string' ? j : JSON.stringify(j);
    }
    return await resp.text();
  } catch {
    return '';
  }
}
