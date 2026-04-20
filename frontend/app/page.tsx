'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DocumentFormData, SignatureInfo, defaultFormData } from '@/lib/types';
import { getSchema } from '@/lib/doc-schemas';
import ChatPanel from '@/components/ChatPanel';
import DocumentPreview from '@/components/DocumentPreview';
import DocForm from '@/components/DocForm';

type Mode = 'chat' | 'form';

export default function Home() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<Mode>('chat');
  const [formData, setFormData] = useState<DocumentFormData>(defaultFormData());

  useEffect(() => {
    if (!localStorage.getItem('prelegal_user')) {
      router.replace('/login');
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) return null;

  const schema = formData.docType ? getSchema(formData.docType) : undefined;

  function handleFieldChange(key: string, value: string) {
    setFormData((prev) => ({ ...prev, fields: { ...prev.fields, [key]: value } }));
  }

  function handleSignatureChange(party: string, sig: SignatureInfo) {
    setFormData((prev) => ({ ...prev, signatures: { ...prev.signatures, [party]: sig } }));
  }

  function handleDocTypeChange(docType: string) {
    // Reset fields and signatures when switching document types to avoid cross-doc contamination
    setFormData({ docType: docType || null, fields: {}, signatures: {} });
  }

  const docLabel = schema ? schema.name : 'Legal Document Creator';
  const docSub = schema ? schema.shortCode : 'Select a document type to get started';

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold" style={{ color: '#032147' }}>
              {docLabel}
            </h1>
            <p className="text-xs" style={{ color: '#888888' }}>
              {docSub}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded p-1">
            <button
              onClick={() => setMode('chat')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                mode === 'chat' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              AI Chat
            </button>
            <button
              onClick={() => setMode('form')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                mode === 'form' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Form
            </button>
          </div>
        </div>
      </header>

      {/* Split panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div className="w-1/2 border-r border-gray-200 flex flex-col overflow-hidden bg-white">
          {mode === 'chat' ? (
            <ChatPanel formData={formData} onChange={setFormData} />
          ) : (
            <div className="flex-1 overflow-y-auto">
              <DocForm
                data={formData}
                onFieldChange={handleFieldChange}
                onSignatureChange={handleSignatureChange}
                onDocTypeChange={handleDocTypeChange}
              />
            </div>
          )}
        </div>

        {/* Right panel — document preview */}
        <div className="w-1/2 overflow-y-auto bg-gray-50 p-6">
          <DocumentPreview data={formData} />
        </div>
      </div>
    </div>
  );
}
