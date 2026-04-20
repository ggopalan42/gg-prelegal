export interface DocSchema {
  name: string;
  shortCode: string;
  filename: string;
  description: string;
  parties: string[];       // signing party names e.g. ["Provider", "Customer"]
  keyTerms: string[];      // ordered list of non-party fields to show/collect
  extraTerms?: { label: string; fields: string[] }[]; // additional sections (order form, SOW, etc.)
}

export const DOC_SCHEMAS: Record<string, DocSchema> = {
  MNDA: {
    name: 'Mutual Non-Disclosure Agreement',
    shortCode: 'MNDA',
    filename: 'Mutual-NDA.md',
    description: 'Standard mutual NDA for sharing confidential information between two parties.',
    parties: ['Party 1', 'Party 2'],
    keyTerms: ['Purpose', 'Effective Date', 'MNDA Term', 'Term of Confidentiality', 'Governing Law', 'Jurisdiction'],
  },
  'MNDA-COVER': {
    name: 'Mutual NDA Cover Page',
    shortCode: 'MNDA-COVER',
    filename: 'Mutual-NDA-coverpage.md',
    description: 'Cover page to be completed and signed alongside the Mutual NDA standard terms.',
    parties: ['Party 1', 'Party 2'],
    keyTerms: ['Purpose', 'Effective Date', 'MNDA Term', 'Term of Confidentiality', 'Governing Law', 'Jurisdiction'],
  },
  CSA: {
    name: 'Cloud Service Agreement',
    shortCode: 'CSA',
    filename: 'CSA.md',
    description: 'Standard agreement for selling and buying cloud software and SaaS products.',
    parties: ['Provider', 'Customer'],
    keyTerms: [
      'Effective Date', 'Governing Law', 'Chosen Courts', 'DPA',
      'General Cap Amount', 'Increased Cap Amount', 'Increased Claims',
      'Unlimited Claims', 'Provider Covered Claims', 'Customer Covered Claims',
      'Additional Warranties',
    ],
    extraTerms: [
      {
        label: 'Order Form',
        fields: [
          'Subscription Period', 'Technical Support', 'Use Limitations',
          'Payment Process', 'Order Date', 'Non-Renewal Notice Date',
        ],
      },
    ],
  },
  DESIGN: {
    name: 'Design Partner Agreement',
    shortCode: 'DESIGN',
    filename: 'design-partner-agreement.md',
    description: 'Standard agreement for early-stage design partnerships.',
    parties: ['Provider', 'Partner'],
    keyTerms: ['Term', 'Program', 'Fees', 'Effective Date', 'Governing Law', 'Chosen Courts', 'Notice Address'],
  },
  SLA: {
    name: 'Service Level Agreement',
    shortCode: 'SLA',
    filename: 'sla.md',
    description: 'Standard SLA defining uptime commitments and remedies.',
    parties: ['Provider', 'Customer'],
    keyTerms: [],
    extraTerms: [
      {
        label: 'Service Terms',
        fields: [
          'Target Uptime', 'Subscription Period', 'Target Response Time',
          'Support Channel', 'Uptime Credit', 'Response Time Credit', 'Scheduled Downtime',
        ],
      },
    ],
  },
  PSA: {
    name: 'Professional Services Agreement',
    shortCode: 'PSA',
    filename: 'psa.md',
    description: 'Standard agreement for professional services engagements.',
    parties: ['Provider', 'Customer'],
    keyTerms: [
      'Customer Policies', 'Effective Date', 'DPA', 'Security Policy',
      'Governing Law', 'Chosen Courts', 'Insurance Minimums', 'Additional Warranties',
      'SOW Term', 'General Cap Amount', 'Increased Cap Amount', 'Increased Claims',
      'Unlimited Claims', 'Provider Covered Claims', 'Customer Covered Claims',
    ],
    extraTerms: [
      {
        label: 'Statement of Work',
        fields: [
          'Deliverables', 'Rejection Period', 'Resubmission Period',
          'Fees', 'Payment Period', 'Time of Assignment', 'Customer Obligations',
        ],
      },
    ],
  },
  DPA: {
    name: 'Data Processing Agreement',
    shortCode: 'DPA',
    filename: 'DPA.md',
    description: 'Standard DPA for governing the processing of personal data.',
    parties: ['Provider', 'Customer'],
    keyTerms: [
      'Agreement', 'Categories of Personal Data', 'Categories of Data Subjects',
      'Special Category Data', 'Special Category Data Restrictions or Safeguards',
      'Frequency of Transfer', 'Nature and Purpose of Processing',
      'Duration of Processing', 'Approved Subprocessors', 'Governing Member State',
      'Security Policy', 'Provider Security Contact',
    ],
  },
  PARTNER: {
    name: 'Partnership Agreement',
    shortCode: 'PARTNER',
    filename: 'Partnership-Agreement.md',
    description: 'Standard agreement for technology vendor partnerships.',
    parties: ['Company', 'Partner'],
    keyTerms: [
      'Governing Law', 'Chosen Courts', 'DPA', 'Brand Guidelines',
      'General Cap Amount', 'Increased Cap Amount', 'Increased Claims',
      'Unlimited Claims', 'Company Covered Claim', 'Partner Covered Claims', 'Additional Warranties',
    ],
    extraTerms: [
      {
        label: 'Business Terms',
        fields: ['Obligations', 'Payment Process', 'Payment Schedule', 'Territory', 'End Date'],
      },
    ],
  },
  LICENSE: {
    name: 'Software License Agreement',
    shortCode: 'LICENSE',
    filename: 'Software-License-Agreement.md',
    description: 'Standard agreement for licensing software to customers.',
    parties: ['Provider', 'Customer'],
    keyTerms: [
      'Effective Date', 'Governing Law', 'Chosen Courts',
      'General Cap Amount', 'Increased Cap Amount', 'Increased Claims',
      'Unlimited Claims', 'Provider Covered Claims', 'Customer Covered Claims', 'Additional Warranties',
    ],
    extraTerms: [
      {
        label: 'Order Form',
        fields: [
          'Subscription Period', 'Permitted Uses', 'License Limits',
          'Payment Process', 'Order Date', 'Non-Renewal Notice Date',
          'Deletion Procedure', 'Warranty Period',
        ],
      },
    ],
  },
  PILOT: {
    name: 'Pilot Agreement',
    shortCode: 'PILOT',
    filename: 'Pilot-Agreement.md',
    description: 'Short-term agreement for trialing a product or service.',
    parties: ['Provider', 'Customer'],
    keyTerms: ['Pilot Period', 'Effective Date', 'Governing Law', 'Chosen Courts', 'Notice Address', 'General Cap Amount'],
  },
  BAA: {
    name: 'Business Associate Agreement',
    shortCode: 'BAA',
    filename: 'BAA.md',
    description: 'Standard BAA for HIPAA compliance.',
    parties: ['Provider', 'Company'],
    keyTerms: ['Agreement', 'Limitations', 'BAA Effective Date', 'Breach Notification Period'],
  },
  'AI-ADD': {
    name: 'AI Addendum',
    shortCode: 'AI-ADD',
    filename: 'AI-Addendum.md',
    description: 'Standard addendum for AI products and services.',
    parties: ['Provider', 'Customer'],
    keyTerms: ['Training Data', 'Training Purposes', 'Training Restrictions', 'Improvement Restrictions'],
  },
};

export const ALL_SCHEMAS = Object.values(DOC_SCHEMAS);

export function getSchema(shortCode: string): DocSchema | undefined {
  return DOC_SCHEMAS[shortCode];
}

export function allFields(schema: DocSchema): string[] {
  const extra = schema.extraTerms?.flatMap((s) => s.fields) ?? [];
  return [...schema.keyTerms, ...extra];
}
