'use client';

import { useRef, useCallback, useState, useEffect, Fragment } from 'react';
import ReactMarkdown from 'react-markdown';
import { DocumentFormData } from '@/lib/types';
import { getSchema, allFields, DocSchema } from '@/lib/doc-schemas';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

const PRINT_STYLES = `
  * { box-sizing: border-box; }
  body { font-family: Georgia, serif; font-size: 13px; line-height: 1.7; color: #111; margin: 40px; }
  h1 { font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; }
  h2 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; }
  p { margin-bottom: 0.75rem; line-height: 1.7; }
  a { color: #555; text-decoration: underline; }
  strong { font-weight: 700; }
  em { font-style: italic; }
  hr { border: none; border-top: 1px solid #ddd; margin: 40px 0; }
  table { border-collapse: collapse; width: 100%; }
  img { max-width: 100%; }
  @media print {
    body { margin: 0; }
    @page { margin: 20mm; }
  }
`;

interface Props {
  data: DocumentFormData;
}

function formatDate(val: string): string {
  if (!val) return '—';
  const d = new Date(val + 'T00:00:00');
  if (isNaN(d.getTime())) return val;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function substituteFields(markdown: string, fields: Record<string, string>): string {
  let result = markdown;
  for (const [key, value] of Object.entries(fields)) {
    if (!value) continue;
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Replace all span placeholder variants for this key (coverpage_link, keyterms_link, etc.)
    const regex = new RegExp(`<span class="[a-z_]+_link">${escaped}</span>`, 'g');
    const display = key.toLowerCase().includes('date') ? formatDate(value) : value;
    result = result.replace(regex, `**${display.replace(/\$/g, '$$$$')}**`);
  }
  return result;
}

function FieldRow({ label, value }: { label: string; value: string }) {
  const isDate = label.toLowerCase().includes('date');
  const display = value ? (isDate ? formatDate(value) : value) : '—';
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>{display}</div>
    </div>
  );
}

function SignatureBlock({
  partyName,
  fields,
  signatures,
}: {
  partyName: string;
  fields: Record<string, string>;
  signatures: DocumentFormData['signatures'];
}) {
  const sig = signatures[partyName];
  const rows: [string, string][] = [
    ['Print Name', fields[`${partyName} Name`] || ''],
    ['Title', fields[`${partyName} Title`] || ''],
    ['Company', fields[partyName] || ''],
    ['Notice Address', fields[`${partyName} Address`] || ''],
    ['Date', fields[`${partyName} Date`] ? formatDate(fields[`${partyName} Date`]) : ''],
  ];

  return (
    <td style={{ width: '45%', padding: '0 16px', verticalAlign: 'top' }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>{partyName}</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <tbody>
          <tr>
            <td style={{ paddingBottom: 8, borderBottom: '1px solid #ccc', width: 110, color: '#555' }}>
              Signature
            </td>
            <td style={{ paddingBottom: 8, borderBottom: '1px solid #ccc', paddingLeft: 12 }}>
              {sig?.signatureType === 'typed' && sig.typedSignature ? (
                <span style={{ fontFamily: 'cursive', fontSize: '1.15rem' }}>{sig.typedSignature}</span>
              ) : sig?.signatureType === 'drawn' && sig.drawnSignature ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={sig.drawnSignature} alt="signature" style={{ height: 48, maxWidth: 200 }} />
              ) : (
                <span style={{ color: '#aaa' }}>—</span>
              )}
            </td>
          </tr>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <td style={{ paddingTop: 6, paddingBottom: 6, borderBottom: '1px solid #eee', color: '#555', verticalAlign: 'top' }}>
                {label}
              </td>
              <td style={{ paddingTop: 6, paddingBottom: 6, borderBottom: '1px solid #eee', paddingLeft: 12, verticalAlign: 'top' }}>
                {value || <span style={{ color: '#aaa' }}>—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </td>
  );
}

export default function DocumentPreview({ data }: Props) {
  const { docType, fields, signatures } = data;
  const previewRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [templateMd, setTemplateMd] = useState<string | null>(null);

  const schema: DocSchema | undefined = docType ? getSchema(docType) : undefined;

  // Fetch template markdown when doc type changes
  useEffect(() => {
    if (!schema) { setTemplateMd(null); return; }
    fetch(`${API_BASE}/api/template/${schema.filename}`)
      .then((r) => r.text())
      .then(setTemplateMd)
      .catch(() => setTemplateMd(null));
  }, [schema?.filename]);

  const handleDownload = useCallback(() => {
    if (!previewRef.current || isPrinting) return;
    setIsPrinting(true);
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      alert('Please allow pop-ups to download the PDF.');
      setIsPrinting(false);
      return;
    }
    printWindow.document.write(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${schema?.name ?? 'Document'}</title>
    <style>${PRINT_STYLES}</style>
  </head>
  <body>${previewRef.current.innerHTML}</body>
</html>`);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
      setIsPrinting(false);
    };
    setTimeout(() => {
      if (!printWindow.closed) {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
      setIsPrinting(false);
    }, 1000);
  }, [isPrinting, schema]);

  if (!schema) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div style={{ color: '#032147' }} className="text-lg font-semibold mb-2">
          No document selected
        </div>
        <p className="text-sm" style={{ color: '#888888' }}>
          Use the AI chat to select a document type and fill in the details.
          The preview will appear here once a document type is chosen.
        </p>
      </div>
    );
  }

  const renderedMd = templateMd ? substituteFields(templateMd, fields) : null;
  const orderedKeyTerms = schema.keyTerms.filter((f) => !schema.parties.includes(f));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Preview &amp; Download</h2>
          <p className="text-sm text-gray-500">Review your document, then click Download PDF to save.</p>
        </div>
        <button
          onClick={handleDownload}
          disabled={isPrinting}
          className="bg-gray-900 text-white px-5 py-2 rounded text-sm hover:bg-gray-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPrinting ? 'Opening…' : 'Download PDF'}
        </button>
      </div>

      <div
        ref={previewRef}
        className="bg-white border border-gray-200 rounded p-10 text-sm leading-relaxed"
        style={{ fontFamily: 'Georgia, serif', color: '#111', maxWidth: 800, margin: '0 auto' }}
      >
        {/* Cover Page */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 6 }}>
            {schema.name}
          </h1>
          <p style={{ textAlign: 'center', fontSize: 12, color: '#555', marginBottom: 32 }}>
            Cover Page
          </p>

          {/* Key terms */}
          {orderedKeyTerms.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              {orderedKeyTerms.map((f) => (
                <FieldRow key={f} label={f} value={fields[f] ?? ''} />
              ))}
            </div>
          )}

          {/* Extra term sections */}
          {schema.extraTerms?.map(({ label, fields: termFields }) => (
            <div key={label} style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, borderBottom: '1px solid #eee', paddingBottom: 4 }}>
                {label}
              </div>
              {termFields.map((f) => (
                <FieldRow key={f} label={f} value={fields[f] ?? ''} />
              ))}
            </div>
          ))}

          {/* Signature blocks */}
          {schema.parties.length > 0 && (
            <div style={{ marginTop: 32 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Signatures</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    {schema.parties.map((party, i) => (
                      <Fragment key={party}>
                        <SignatureBlock partyName={party} fields={fields} signatures={signatures} />
                        {i < schema.parties.length - 1 && <td style={{ width: 10 }} />}
                      </Fragment>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Standard Terms */}
        {renderedMd && (
          <>
            <hr style={{ margin: '40px 0', borderColor: '#ddd' }} />
            <div style={{ fontFamily: 'Georgia, serif' }}>
              <ReactMarkdown>{renderedMd}</ReactMarkdown>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
