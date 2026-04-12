'use client';

import { useRef, useCallback, useEffect } from 'react';
import ReactSignatureCanvas from 'react-signature-canvas';

interface Props {
  onSave: (dataUrl: string) => void;
  existingDataUrl?: string;
}

export default function SignaturePad({ onSave, existingDataUrl }: Props) {
  const sigRef = useRef<ReactSignatureCanvas>(null);

  // Restore existing signature when navigating back to this step
  useEffect(() => {
    if (existingDataUrl && sigRef.current) {
      sigRef.current.fromDataURL(existingDataUrl);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = useCallback(() => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      onSave(sigRef.current.toDataURL('image/png'));
    }
  }, [onSave]);

  const handleClear = useCallback(() => {
    sigRef.current?.clear();
    onSave('');
  }, [onSave]);

  return (
    <div>
      <div className="border border-gray-300 rounded bg-white">
        <ReactSignatureCanvas
          ref={sigRef}
          penColor="black"
          canvasProps={{ width: 340, height: 120, className: 'block' }}
          onEnd={handleSave}
        />
      </div>
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onClick={handleClear}
          className="text-xs text-gray-500 hover:text-gray-700 underline"
        >
          Clear
        </button>
        {existingDataUrl && (
          <span className="text-xs text-green-600">Signature saved</span>
        )}
      </div>
    </div>
  );
}
