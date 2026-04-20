'use client';

import { DocumentFormData, SignatureInfo, defaultSignature } from '@/lib/types';
import { getSchema, DOC_SCHEMAS, DocSchema } from '@/lib/doc-schemas';
import SignaturePad from './SignaturePad';

interface Props {
  data: DocumentFormData;
  onFieldChange: (key: string, value: string) => void;
  onSignatureChange: (party: string, sig: SignatureInfo) => void;
  onDocTypeChange: (docType: string) => void;
}

function TextInput({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const cls =
    'w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400';
  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
        />
      )}
    </div>
  );
}

function PartySection({
  party,
  fields,
  sig,
  onFieldChange,
  onSigChange,
}: {
  party: string;
  fields: Record<string, string>;
  sig: SignatureInfo;
  onFieldChange: (key: string, value: string) => void;
  onSigChange: (sig: SignatureInfo) => void;
}) {
  return (
    <div className="mb-6 p-4 border border-gray-200 rounded bg-gray-50">
      <h3 className="text-sm font-semibold mb-3" style={{ color: '#032147' }}>
        {party}
      </h3>
      <TextInput
        label="Company / Organization"
        value={fields[party] ?? ''}
        onChange={(v) => onFieldChange(party, v)}
      />
      <TextInput
        label="Signing Person's Full Name"
        value={fields[`${party} Name`] ?? ''}
        onChange={(v) => onFieldChange(`${party} Name`, v)}
      />
      <TextInput
        label="Title"
        value={fields[`${party} Title`] ?? ''}
        onChange={(v) => onFieldChange(`${party} Title`, v)}
      />
      <TextInput
        label="Notice Address"
        value={fields[`${party} Address`] ?? ''}
        onChange={(v) => onFieldChange(`${party} Address`, v)}
        multiline
      />
      <TextInput
        label="Signing Date (YYYY-MM-DD)"
        value={fields[`${party} Date`] ?? ''}
        onChange={(v) => onFieldChange(`${party} Date`, v)}
      />

      {/* Signature */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-2">Signature</label>
        <div className="flex gap-4 mb-2">
          {(['typed', 'drawn'] as const).map((type) => (
            <label key={type} className="flex items-center gap-1 text-xs cursor-pointer">
              <input
                type="radio"
                name={`sig-type-${party}`}
                value={type}
                checked={sig.signatureType === type}
                onChange={() => onSigChange({ ...sig, signatureType: type })}
              />
              {type === 'typed' ? 'Type signature' : 'Draw signature'}
            </label>
          ))}
        </div>

        {sig.signatureType === 'typed' ? (
          <div>
            <input
              type="text"
              value={sig.typedSignature}
              onChange={(e) => onSigChange({ ...sig, typedSignature: e.target.value })}
              placeholder="Type your name"
              className="px-3 py-2 border border-gray-300 rounded text-sm w-full focus:outline-none focus:border-blue-400"
              style={{ fontFamily: 'cursive', fontSize: '1.1rem' }}
            />
          </div>
        ) : (
          <SignaturePad
            existingDataUrl={sig.drawnSignature}
            onSave={(url) => onSigChange({ ...sig, drawnSignature: url })}
          />
        )}
      </div>
    </div>
  );
}

export default function DocForm({ data, onFieldChange, onSignatureChange, onDocTypeChange }: Props) {
  const { docType, fields, signatures } = data;
  const schema: DocSchema | undefined = docType ? getSchema(docType) : undefined;

  if (!schema) {
    return (
      <div className="p-6">
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Select document type
          </label>
          <select
            value=""
            onChange={(e) => e.target.value && onDocTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400"
          >
            <option value="">— Choose a document —</option>
            {Object.values(DOC_SCHEMAS).map((s) => (
              <option key={s.shortCode} value={s.shortCode}>
                {s.shortCode}: {s.name}
              </option>
            ))}
          </select>
        </div>
        <p className="text-xs text-gray-400">
          Or use AI Chat mode to have the assistant guide you through selecting and filling out a document.
        </p>
      </div>
    );
  }

  const sigFor = (party: string): SignatureInfo => signatures[party] ?? defaultSignature();

  return (
    <div className="p-6 overflow-y-auto">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold" style={{ color: '#032147' }}>
          {schema.name}
        </h2>
        <button
          onClick={() => onDocTypeChange('')}
          className="text-xs text-gray-400 hover:text-gray-600 underline"
        >
          Change document
        </button>
      </div>

      {/* Key terms */}
      {schema.keyTerms.length > 0 && (
        <section className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
            Key Terms
          </h3>
          {schema.keyTerms.map((f) => (
            <TextInput
              key={f}
              label={f}
              value={fields[f] ?? ''}
              onChange={(v) => onFieldChange(f, v)}
              multiline={f.toLowerCase().includes('description') || f.toLowerCase().includes('purpose') || f.toLowerCase().includes('obligations') || f.toLowerCase().includes('data')}
            />
          ))}
        </section>
      )}

      {/* Extra term sections */}
      {schema.extraTerms?.map(({ label, fields: termFields }) => (
        <section key={label} className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
            {label}
          </h3>
          {termFields.map((f) => (
            <TextInput
              key={f}
              label={f}
              value={fields[f] ?? ''}
              onChange={(v) => onFieldChange(f, v)}
              multiline={f.toLowerCase().includes('description') || f.toLowerCase().includes('obligations') || f.toLowerCase().includes('deliverable')}
            />
          ))}
        </section>
      ))}

      {/* Signing parties */}
      {schema.parties.length > 0 && (
        <section className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
            Signatures
          </h3>
          {schema.parties.map((party) => (
            <PartySection
              key={party}
              party={party}
              fields={fields}
              sig={sigFor(party)}
              onFieldChange={onFieldChange}
              onSigChange={(sig) => onSignatureChange(party, sig)}
            />
          ))}
        </section>
      )}
    </div>
  );
}
