'use client';

import { NDAFormData, PartyInfo } from '@/lib/types';

interface Props {
  data: NDAFormData;
  onChange: (data: NDAFormData) => void;
}

function PartyForm({
  label,
  party,
  onChange,
}: {
  label: string;
  party: PartyInfo;
  onChange: (p: PartyInfo) => void;
}) {
  const field = (name: keyof PartyInfo, displayLabel: string, placeholder: string, type = 'text') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{displayLabel}</label>
      <input
        type={type}
        value={party[name] as string}
        onChange={(e) => onChange({ ...party, [name]: e.target.value })}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
      />
    </div>
  );

  return (
    <div className="flex-1 min-w-0">
      <h3 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b">{label}</h3>
      <div className="space-y-4">
        {field('company', 'Company Name', 'Acme Inc.')}
        {field('printName', 'Representative Name', 'Jane Smith')}
        {field('title', 'Title', 'CEO')}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notice Address <span className="text-gray-400 font-normal">(email or postal)</span>
          </label>
          <textarea
            value={party.noticeAddress}
            onChange={(e) => onChange({ ...party, noticeAddress: e.target.value })}
            placeholder="jane@acme.com or 123 Main St, Springfield, IL 62701"
            rows={2}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none"
          />
        </div>
      </div>
    </div>
  );
}

export default function Step1Parties({ data, onChange }: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Party Information</h2>
      <p className="text-sm text-gray-500 mb-6">Enter details for both parties to this agreement.</p>
      <div className="flex gap-8">
        <PartyForm
          label="Party 1"
          party={data.party1}
          onChange={(p) => onChange({ ...data, party1: p })}
        />
        <div className="w-px bg-gray-200" />
        <PartyForm
          label="Party 2"
          party={data.party2}
          onChange={(p) => onChange({ ...data, party2: p })}
        />
      </div>
    </div>
  );
}
