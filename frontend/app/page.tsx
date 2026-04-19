'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NDAFormData, defaultParty, defaultTerms } from '@/lib/types';
import ChatPanel from '@/components/ChatPanel';
import DocumentPreview from '@/components/DocumentPreview';
import Step1Parties from '@/components/steps/Step1Parties';
import Step2Terms from '@/components/steps/Step2Terms';
import Step3Signatures from '@/components/steps/Step3Signatures';

type Mode = 'chat' | 'form';

const WIZARD_STEPS = [
  { number: 1, label: 'Parties' },
  { number: 2, label: 'Terms' },
  { number: 3, label: 'Signatures' },
];

export default function Home() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<Mode>('chat');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<NDAFormData>({
    party1: defaultParty(),
    party2: defaultParty(),
    terms: defaultTerms(),
  });

  useEffect(() => {
    if (!localStorage.getItem('prelegal_user')) {
      router.replace('/login');
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) return null;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold" style={{ color: '#032147' }}>
              Mutual NDA Creator
            </h1>
            <p className="text-xs" style={{ color: '#888888' }}>
              Mutual Non-Disclosure Agreement
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
            <div className="flex flex-col h-full overflow-hidden">
              {/* Step indicator */}
              <div className="flex items-center px-6 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
                {WIZARD_STEPS.map((s, i) => (
                  <div key={s.number} className="flex items-center">
                    <button
                      onClick={() => step > s.number && setStep(s.number)}
                      className={`flex items-center gap-2 ${step > s.number ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                          step === s.number
                            ? 'bg-gray-900 text-white'
                            : step > s.number
                            ? 'bg-gray-300 text-gray-700'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {step > s.number ? '✓' : s.number}
                      </div>
                      <span className={`text-xs ${step === s.number ? 'font-medium text-gray-900' : 'text-gray-400'}`}>
                        {s.label}
                      </span>
                    </button>
                    {i < WIZARD_STEPS.length - 1 && <div className="w-8 h-px bg-gray-200 mx-2" />}
                  </div>
                ))}
              </div>

              {/* Step content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {step === 1 && <Step1Parties data={formData} onChange={setFormData} />}
                {step === 2 && <Step2Terms data={formData} onChange={setFormData} />}
                {step === 3 && <Step3Signatures data={formData} onChange={setFormData} />}
              </div>

              {/* Navigation */}
              <div className="flex justify-between px-6 py-4 border-t border-gray-100 flex-shrink-0">
                <button
                  onClick={() => setStep((s) => s - 1)}
                  disabled={step === 1}
                  className="px-4 py-2 text-xs border border-gray-300 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Back
                </button>
                {step < WIZARD_STEPS.length && (
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    className="px-4 py-2 text-xs text-white rounded transition-colors hover:opacity-90"
                    style={{ backgroundColor: '#753991' }}
                  >
                    Next
                  </button>
                )}
              </div>
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
