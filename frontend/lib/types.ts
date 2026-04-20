export interface SignatureInfo {
  printName: string;
  title: string;
  signatureType: 'typed' | 'drawn';
  typedSignature: string;
  drawnSignature: string; // base64 data URL
}

export interface DocumentFormData {
  docType: string | null;
  fields: Record<string, string>;
  signatures: Record<string, SignatureInfo>; // keyed by party name e.g. "Provider"
}

export const defaultSignature = (): SignatureInfo => ({
  printName: '',
  title: '',
  signatureType: 'typed',
  typedSignature: '',
  drawnSignature: '',
});

export const defaultFormData = (): DocumentFormData => ({
  docType: null,
  fields: {},
  signatures: {},
});
