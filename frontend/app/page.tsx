'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NDAFormData, defaultParty, defaultTerms } from '@/lib/types';
import Step1Parties from '@/components/steps/Step1Parties';
import Step2Terms from '@/components/steps/Step2Terms';
import Step3Signatures from '@/components/steps/Step3Signatures';
import Step4Preview from '@/components/steps/Step4Preview';

const STEPS = [
  { number: 1, label: 'Parties' },
  { number: 2, label: 'Terms' },
  { number: 3, label: 'Signatures' },
  { number: 4, label: 'Preview' },
];

export default function Home() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
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

  const isFirst = step === 1;
  const isLast = step === STEPS.length;

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-lg font-semibold text-gray-900">Mutual NDA Creator</h1>
          <p className="text-xs text-gray-500 mt-0.5">Create a Mutual Non-Disclosure Agreement</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Step indicator */}
        <div className="flex items-center mb-10">
          {STEPS.map((s, i) => (
            <div key={s.number} className="flex items-center">
              <button
                onClick={() => step > s.number && setStep(s.number)}
                className={`flex items-center gap-2 ${
                  step > s.number ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                    step === s.number
                      ? 'bg-gray-900 text-white'
                      : step > s.number
                      ? 'bg-gray-300 text-gray-700'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step > s.number ? '✓' : s.number}
                </div>
                <span
                  className={`text-sm ${
                    step === s.number ? 'font-medium text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div className="w-12 h-px bg-gray-200 mx-3" />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          {step === 1 && <Step1Parties data={formData} onChange={setFormData} />}
          {step === 2 && <Step2Terms data={formData} onChange={setFormData} />}
          {step === 3 && <Step3Signatures data={formData} onChange={setFormData} />}
          {step === 4 && <Step4Preview data={formData} />}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={isFirst}
            className="px-5 py-2 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>
          {!isLast && (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="px-5 py-2 text-sm bg-gray-900 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
