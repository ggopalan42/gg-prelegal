# Design: Legal Document Templates Dataset

**JIRA:** GP-2  
**Date:** 2026-04-12  
**Status:** Approved

## Summary

Create a dataset of ~13 general business contract templates in Markdown format with `{{PLACEHOLDER}}` tokens for variable fields. This dataset will serve as the foundation the system uses to generate and modify legal documents for users.

## Directory Structure

```
data/templates/
  nda.md
  service_agreement.md
  employment_contract.md
  consulting_agreement.md
  independent_contractor.md
  vendor_contract.md
  non_compete.md
  non_disclosure_mutual.md
  ip_assignment.md
  partnership_agreement.md
  sla.md
  letter_of_intent.md
  work_for_hire.md
```

## Template Format

Each `.md` file contains the full legal document text. No YAML frontmatter or metadata — just the template body with Markdown headings for structure and `{{PLACEHOLDER}}` tokens for variable fields.

### Placeholder Convention

- Format: `{{LIKE_THIS}}` — all caps, underscore-separated, double curly braces
- Descriptive and self-explanatory (e.g., `{{EMPLOYEE_ANNUAL_SALARY}}` not `{{AMOUNT}}`)
- Common cross-template placeholders: `{{PARTY_A_NAME}}`, `{{PARTY_B_NAME}}`, `{{EFFECTIVE_DATE}}`, `{{GOVERNING_LAW_STATE}}`

## Templates Included

| File | Document Type |
|------|--------------|
| `nda.md` | One-way Non-Disclosure Agreement |
| `non_disclosure_mutual.md` | Mutual Non-Disclosure Agreement |
| `service_agreement.md` | Services Agreement |
| `consulting_agreement.md` | Consulting Agreement |
| `independent_contractor.md` | Independent Contractor Agreement |
| `employment_contract.md` | Employment Contract |
| `non_compete.md` | Non-Compete Agreement |
| `vendor_contract.md` | Vendor Contract |
| `ip_assignment.md` | IP Assignment Agreement |
| `partnership_agreement.md` | Partnership Agreement |
| `sla.md` | Service Level Agreement |
| `letter_of_intent.md` | Letter of Intent |
| `work_for_hire.md` | Work for Hire Agreement |

## Design Decisions

- **Flat directory over subdirectories:** ~13 files don't warrant category nesting. Add subdirectories only if the set grows significantly.
- **Markdown over plain text:** Provides readable structure (headings, sections) without requiring a heavy format like DOCX.
- **No metadata for now:** Frontmatter and a manifest index are deferred — the system will parse templates and infer fields from placeholders when needed.
- **`{{PLACEHOLDER}}` tokens:** Double curly braces are the standard for templating systems and unambiguous in legal prose.
