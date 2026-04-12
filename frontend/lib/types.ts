export interface PartyInfo {
  printName: string;
  title: string;
  company: string;
  noticeAddress: string;
  date: string;
  signatureType: 'typed' | 'drawn';
  typedSignature: string;
  drawnSignature: string; // base64 data URL
}

export interface AgreementTerms {
  purpose: string;
  effectiveDate: string;
  mndaTermType: 'expires' | 'until_terminated';
  mndaTermYears: string;
  confidentialityType: 'years' | 'perpetuity';
  confidentialityYears: string;
  governingLaw: string;
  jurisdiction: string;
}

export interface NDAFormData {
  party1: PartyInfo;
  party2: PartyInfo;
  terms: AgreementTerms;
}

export const defaultParty = (): PartyInfo => ({
  printName: '',
  title: '',
  company: '',
  noticeAddress: '',
  date: '',
  signatureType: 'typed',
  typedSignature: '',
  drawnSignature: '',
});

export const defaultTerms = (): AgreementTerms => ({
  purpose: 'Evaluating whether to enter into a business relationship with the other party.',
  effectiveDate: new Date().toISOString().split('T')[0],
  mndaTermType: 'expires',
  mndaTermYears: '1',
  confidentialityType: 'years',
  confidentialityYears: '1',
  governingLaw: '',
  jurisdiction: '',
});
