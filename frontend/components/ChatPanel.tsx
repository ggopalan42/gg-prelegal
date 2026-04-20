'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { DocumentFormData } from '@/lib/types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatApiResponse {
  reply: string;
  fields: { key: string; value: string }[];
  doc_type: string | null;
  complete: boolean;
}

interface Props {
  formData: DocumentFormData;
  onChange: (updater: DocumentFormData | ((prev: DocumentFormData) => DocumentFormData)) => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

export default function ChatPanel({ formData, onChange }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // AI initiates on mount
  useEffect(() => {
    sendToApi([], formData.docType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendToApi(history: Message[], docType: string | null) {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, doc_type: docType }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data: ChatApiResponse = await res.json();

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);

      // Merge extracted fields and doc_type into formData via functional updater
      // to avoid stale closure clobbering concurrent form edits
      onChange((prev) => {
        const updatedFields = { ...prev.fields };
        for (const { key, value } of data.fields ?? []) {
          if (key && value) updatedFields[key] = value;
        }
        return { ...prev, docType: data.doc_type ?? prev.docType, fields: updatedFields };
      });

      if (data.complete) setComplete(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading || complete) return;
    setInput('');
    const userMsg: Message = { role: 'user', content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    await sendToApi(updated, formData.docType);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] px-4 py-2 rounded-lg text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
              style={m.role === 'user' ? { backgroundColor: '#209dd7' } : {}}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-400 px-4 py-2 rounded-lg rounded-bl-none text-sm">
              Thinking…
            </div>
          </div>
        )}
        {complete && (
          <div
            className="text-center text-sm py-2 px-4 rounded font-medium"
            style={{ backgroundColor: '#ecad0a20', color: '#032147' }}
          >
            All information gathered! Review the document preview on the right.
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={complete ? 'Document complete.' : 'Type your message…'}
          disabled={loading || complete}
          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-400"
        />
        <button
          type="submit"
          disabled={loading || complete || !input.trim()}
          className="px-4 py-2 rounded text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          style={{ backgroundColor: '#753991' }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
