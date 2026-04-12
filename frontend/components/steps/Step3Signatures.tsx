'use client';

import dynamic from 'next/dynamic';
import { NDAFormData, PartyInfo } from '@/lib/types';

const SignaturePad = dynamic(() => import('@/components/SignaturePad'), { ssr: false });

interface Props {
  data: NDAFormData;
  onChange: (data: NDAFormData) => void;
}

function PartySignature({
  label,
  party,
  onChange,
}: {
  label: string;
  party: PartyInfo;
  onChange: (p: PartyInfo) => void;
}) {
  return (
    <div className="flex-1 min-w-0">
      <h3 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b">{label}</h3>

      {/* Toggle */}
      <div className="flex border border-gray-300 rounded overflow-hidden w-fit mb-4">
        <button
          type="button"
          onClick={() => onChange({ ...party, signatureType: 'typed' })}
          className={`px-4 py-1.5 text-sm ${
            party.signatureType === 'typed'
              ? 'bg-gray-800 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          Type
        </button>
        <button
          type="button"
          onClick={() => onChange({ ...party, signatureType: 'drawn' })}
          className={`px-4 py-1.5 text-sm border-l border-gray-300 ${
            party.signatureType === 'drawn'
              ? 'bg-gray-800 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          Draw
        </button>
      </div>

      {party.signatureType === 'typed' ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type your name</label>
          <input
            type="text"
            value={party.typedSignature}
            onChange={(e) => onChange({ ...party, typedSignature: e.target.value })}
            placeholder="Full name"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            style={{ fontFamily: 'cursive', fontSize: '1.1rem' }}
          />
          {party.typedSignature && (
            <p className="mt-2 text-gray-500 text-xs">
              Preview:{' '}
              <span style={{ fontFamily: 'cursive', fontSize: '1.1rem', color: '#111' }}>
                {party.typedSignature}
              </span>
            </p>
          )}
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Draw your signature <span className="text-gray-400 font-normal">(sign in the box below)</span>
          </label>
          <SignaturePad
            existingDataUrl={party.drawnSignature}
            onSave={(dataUrl) => onChange({ ...party, drawnSignature: dataUrl })}
          />
        </div>
      )}

      {/* Signing date */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          value={party.date}
          onChange={(e) => onChange({ ...party, date: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
        />
      </div>
    </div>
  );
}

export default function Step3Signatures({ data, onChange }: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Signatures</h2>
      <p className="text-sm text-gray-500 mb-6">
        Each party can type their name or draw a signature.
      </p>
      <div className="flex gap-8">
        <PartySignature
          label="Party 1"
          party={data.party1}
          onChange={(p) => onChange({ ...data, party1: p })}
        />
        <div className="w-px bg-gray-200" />
        <PartySignature
          label="Party 2"
          party={data.party2}
          onChange={(p) => onChange({ ...data, party2: p })}
        />
      </div>
    </div>
  );
}
