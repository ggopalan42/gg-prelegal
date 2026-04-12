'use client';

import { useRef, useCallback, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { NDAFormData } from '@/lib/types';
import {
  substituteStandardTerms,
  buildMndaTermText,
  buildConfidentialityTermText,
  formatDate,
} from '@/lib/nda-template';

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
  data: NDAFormData;
}

function SignatureBlock({ party, label }: { party: NDAFormData['party1']; label: string }) {
  return (
    <td style={{ width: '45%', padding: '0 16px', verticalAlign: 'top' }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>{label}</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <tbody>
          <tr>
            <td style={{ paddingBottom: 8, borderBottom: '1px solid #ccc', width: 100, color: '#555' }}>Signature</td>
            <td style={{ paddingBottom: 8, borderBottom: '1px solid #ccc', paddingLeft: 12 }}>
              {party.signatureType === 'typed' && party.typedSignature ? (
                <span style={{ fontFamily: 'cursive', fontSize: '1.15rem' }}>{party.typedSignature}</span>
              ) : party.signatureType === 'drawn' && party.drawnSignature ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={party.drawnSignature} alt="signature" style={{ height: 48, maxWidth: 200 }} />
              ) : (
                <span style={{ color: '#aaa' }}>—</span>
              )}
            </td>
          </tr>
          {[
            ['Print Name', party.printName],
            ['Title', party.title],
            ['Company', party.company],
            ['Notice Address', party.noticeAddress],
            ['Date', formatDate(party.date)],
          ].map(([field, value]) => (
            <tr key={field}>
              <td style={{ paddingTop: 6, paddingBottom: 6, borderBottom: '1px solid #eee', color: '#555', verticalAlign: 'top' }}>
                {field}
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
  const previewRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

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
    <title>Mutual-NDA</title>
    <style>${PRINT_STYLES}</style>
  </head>
  <body>${previewRef.current.innerHTML}</body>
</html>`);
    printWindow.document.close();

    // Wait for images (drawn signatures) to load before printing
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
      setIsPrinting(false);
    };

    // Fallback if onload doesn't fire (no images)
    setTimeout(() => {
      if (!printWindow.closed) {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
      setIsPrinting(false);
    }, 1000);
  }, [isPrinting]);

  const { party1, party2, terms } = data;
  const standardTermsMarkdown = substituteStandardTerms(terms);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Preview & Download</h2>
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

      {/* Document preview */}
      <div
        ref={previewRef}
        className="bg-white border border-gray-200 rounded p-10 text-sm leading-relaxed"
        style={{ fontFamily: 'Georgia, serif', color: '#111', maxWidth: 800, margin: '0 auto' }}
      >
        {/* Cover Page */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 6 }}>
            Mutual Non-Disclosure Agreement
          </h1>
          <p style={{ textAlign: 'center', fontSize: 12, color: '#555', marginBottom: 32 }}>
            Cover Page
          </p>

          <p style={{ marginBottom: 20, fontSize: 13 }}>
            This Mutual Non-Disclosure Agreement (the &ldquo;MNDA&rdquo;) consists of: (1) this Cover Page
            (&ldquo;<strong>Cover Page</strong>&rdquo;) and (2) the Common Paper Mutual NDA Standard Terms Version 1.0
            (&ldquo;<strong>Standard Terms</strong>&rdquo;) identical to those posted at{' '}
            <a href="https://commonpaper.com/standards/mutual-nda/1.0" style={{ color: '#555' }}>
              commonpaper.com/standards/mutual-nda/1.0
            </a>
            . Any modifications of the Standard Terms should be made on the Cover Page, which will control
            over conflicts with the Standard Terms.
          </p>

          {/* Cover page fields */}
          {[
            {
              title: 'Purpose',
              subtitle: 'How Confidential Information may be used',
              value: terms.purpose,
            },
            {
              title: 'Effective Date',
              value: formatDate(terms.effectiveDate),
            },
            {
              title: 'MNDA Term',
              subtitle: 'The length of this MNDA',
              value: buildMndaTermText(terms),
            },
            {
              title: 'Term of Confidentiality',
              subtitle: 'How long Confidential Information is protected',
              value: buildConfidentialityTermText(terms),
            },
            {
              title: 'Governing Law & Jurisdiction',
              value: `Governing Law: ${terms.governingLaw || '—'}\nJurisdiction: ${terms.jurisdiction || '—'}`,
            },
          ].map(({ title, subtitle, value }) => (
            <div key={title} style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>{title}</div>
              {subtitle && <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>{subtitle}</div>}
              <div style={{ whiteSpace: 'pre-line' }}>{value || '—'}</div>
            </div>
          ))}

          <div style={{ marginBottom: 18 }}>
            <div style={{ fontWeight: 700, marginBottom: 2 }}>MNDA Modifications</div>
            <div style={{ color: '#777' }}>None.</div>
          </div>

          <p style={{ marginBottom: 16, fontStyle: 'italic', fontSize: 13 }}>
            By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.
          </p>

          {/* Signature table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
            <tbody>
              <tr>
                <SignatureBlock party={party1} label="Party 1" />
                <td style={{ width: 10 }} />
                <SignatureBlock party={party2} label="Party 2" />
              </tr>
            </tbody>
          </table>

          <p style={{ fontSize: 11, color: '#888', textAlign: 'center' }}>
            Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use under{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/" style={{ color: '#888' }}>CC BY 4.0</a>.
          </p>
        </div>

        <hr style={{ margin: '40px 0', borderColor: '#ddd' }} />

        {/* Standard Terms */}
        <div className="nda-terms" style={{ fontFamily: 'Georgia, serif' }}>
          <ReactMarkdown>{standardTermsMarkdown}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
