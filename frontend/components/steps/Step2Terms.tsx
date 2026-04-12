'use client';

import { NDAFormData, AgreementTerms } from '@/lib/types';

interface Props {
  data: NDAFormData;
  onChange: (data: NDAFormData) => void;
}

function Radio({
  name,
  value,
  checked,
  onChange,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-start gap-2 cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="mt-0.5"
      />
      <span className="text-sm text-gray-700">{children}</span>
    </label>
  );
}

export default function Step2Terms({ data, onChange }: Props) {
  const terms = data.terms;
  const set = (patch: Partial<AgreementTerms>) =>
    onChange({ ...data, terms: { ...terms, ...patch } });

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Agreement Terms</h2>
      <p className="text-sm text-gray-500 mb-6">Define the scope and duration of the MNDA.</p>

      <div className="space-y-6">
        {/* Purpose */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purpose <span className="text-gray-400 font-normal">— how Confidential Information may be used</span>
          </label>
          <textarea
            value={terms.purpose}
            onChange={(e) => set({ purpose: e.target.value })}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none"
          />
        </div>

        {/* Effective Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
          <input
            type="date"
            value={terms.effectiveDate}
            onChange={(e) => set({ effectiveDate: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        {/* MNDA Term */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            MNDA Term <span className="text-gray-400 font-normal">— the length of this MNDA</span>
          </label>
          <div className="space-y-2">
            <Radio
              name="mndaTerm"
              value="expires"
              checked={terms.mndaTermType === 'expires'}
              onChange={() => set({ mndaTermType: 'expires' })}
            >
              Expires from Effective Date —{' '}
              <input
                type="number"
                min="1"
                max="10"
                value={terms.mndaTermYears}
                onChange={(e) => set({ mndaTermYears: e.target.value })}
                onClick={(e) => e.stopPropagation()}
                className="w-16 border border-gray-300 rounded px-2 py-0.5 text-sm mx-1 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />{' '}
              year(s)
            </Radio>
            <Radio
              name="mndaTerm"
              value="until_terminated"
              checked={terms.mndaTermType === 'until_terminated'}
              onChange={() => set({ mndaTermType: 'until_terminated' })}
            >
              Continues until terminated in accordance with the terms of the MNDA.
            </Radio>
          </div>
        </div>

        {/* Term of Confidentiality */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Term of Confidentiality <span className="text-gray-400 font-normal">— how long Confidential Information is protected</span>
          </label>
          <div className="space-y-2">
            <Radio
              name="confidentiality"
              value="years"
              checked={terms.confidentialityType === 'years'}
              onChange={() => set({ confidentialityType: 'years' })}
            >
              <input
                type="number"
                min="1"
                max="10"
                value={terms.confidentialityYears}
                onChange={(e) => set({ confidentialityYears: e.target.value })}
                onClick={(e) => e.stopPropagation()}
                className="w-16 border border-gray-300 rounded px-2 py-0.5 text-sm mr-1 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />{' '}
              year(s) from Effective Date, but in the case of trade secrets until no longer considered a trade secret under applicable laws.
            </Radio>
            <Radio
              name="confidentiality"
              value="perpetuity"
              checked={terms.confidentialityType === 'perpetuity'}
              onChange={() => set({ confidentialityType: 'perpetuity' })}
            >
              In perpetuity.
            </Radio>
          </div>
        </div>

        {/* Governing Law & Jurisdiction */}
        <div className="flex gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Governing Law (State)</label>
            <input
              type="text"
              value={terms.governingLaw}
              onChange={(e) => set({ governingLaw: e.target.value })}
              placeholder="e.g. Delaware"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Jurisdiction</label>
            <input
              type="text"
              value={terms.jurisdiction}
              onChange={(e) => set({ jurisdiction: e.target.value })}
              placeholder="e.g. New Castle, DE"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
