// import { useEffect, useRef, useState } from 'react';

// export type Msg = { role: 'user' | 'assistant'; content: string };

// const STORAGE_KEY = 'mlw_chat';

// export default function useChat() {
//   // Load persisted messages
//   const [messages, setMessages] = useState<Msg[]>(() => {
//     try {
//       const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as unknown;
//       return Array.isArray(raw) ? (raw as Msg[]) : [];
//     } catch {
//       return [];
//     }
//   });
//   const [loading, setLoading] = useState(false);
//   const controllerRef = useRef<AbortController | null>(null);

//   // Persist latest messages
//   useEffect(() => {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
//   }, [messages]);

//   const clear = () => setMessages([]);

//   const send = async (text: string) => {
//     if (!text || loading) return;

//     const next: Msg[] = [...messages, { role: 'user' as const, content: text }];
//     setMessages(next);
//     setLoading(true);

//     const controller = new AbortController();
//     controllerRef.current = controller;

//     try {
//       const resp = await fetch('/api/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ messages: next }),
//         signal: controller.signal
//       });
//       if (!resp.ok || !resp.body) throw new Error('Network error');

//       const reader = resp.body.getReader();
//       const decoder = new TextDecoder();

//       let assistant: Msg = { role: 'assistant', content: '' };
//       setMessages(cur => [...cur, assistant]);

//       while (true) {
//         const { value, done } = await reader.read();
//         if (done) break;
//         const chunk = decoder.decode(value, { stream: true });

//         assistant = { role: 'assistant', content: assistant.content + chunk };
//         setMessages(cur => {
//           const copy = [...cur];
//           copy[copy.length - 1] = assistant;
//           return copy;
//         });
//       }
//     } catch {
//       setMessages(cur => [...cur, { role: 'assistant', content: 'Sorry, something went wrong. Try again.' }]);
//     } finally {
//       controllerRef.current = null;
//       setLoading(false);
//     }
//   };

//   const stop = () => { controllerRef.current?.abort(); controllerRef.current = null; setLoading(false); };

//   return { messages, send, loading, stop, clear };
// }

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
      if (!resp.ok || !resp.body) throw new Error('Network error');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();

      let assistant: Msg = { role: 'assistant', content: '' };
      setMessages(cur => [...cur, assistant]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        assistant = { role: 'assistant', content: assistant.content + chunk };
        setMessages(cur => {
          const copy = [...cur];
          copy[copy.length - 1] = assistant;
          return copy;
        });
      }
    } catch {
      setMessages(cur => [...cur, { role: 'assistant', content: 'Sorry, something went wrong. Try again.' }]);
    } finally {
      controllerRef.current = null;
      setLoading(false);
    }
  };

  const stop = () => { controllerRef.current?.abort(); controllerRef.current = null; setLoading(false); };

  return { messages, send, loading, stop, clear };
}
