# Legal Document Templates Dataset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a dataset of 13 Markdown business contract templates with `{{PLACEHOLDER}}` tokens in `data/templates/`.

**Architecture:** All templates live as flat `.md` files under `data/templates/`. A validation script at `scripts/validate_templates.py` ensures every template exists, has headings, and uses correctly-formatted `{{PLACEHOLDER}}` tokens. Templates are written first as failing validation (missing), then created to pass.

**Tech Stack:** Markdown, Python 3 (validation script only)

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `data/templates/nda.md` | One-way Non-Disclosure Agreement |
| Create | `data/templates/non_disclosure_mutual.md` | Mutual Non-Disclosure Agreement |
| Create | `data/templates/service_agreement.md` | Services Agreement |
| Create | `data/templates/consulting_agreement.md` | Consulting Agreement |
| Create | `data/templates/independent_contractor.md` | Independent Contractor Agreement |
| Create | `data/templates/employment_contract.md` | Employment Contract |
| Create | `data/templates/non_compete.md` | Non-Compete Agreement |
| Create | `data/templates/vendor_contract.md` | Vendor Contract |
| Create | `data/templates/ip_assignment.md` | IP Assignment Agreement |
| Create | `data/templates/partnership_agreement.md` | Partnership Agreement |
| Create | `data/templates/sla.md` | Service Level Agreement |
| Create | `data/templates/letter_of_intent.md` | Letter of Intent |
| Create | `data/templates/work_for_hire.md` | Work for Hire Agreement |
| Create | `scripts/validate_templates.py` | Validates all templates exist and are well-formed |

---

### Task 1: Validation script and directory setup

**Files:**
- Create: `scripts/validate_templates.py`
- Create: `data/templates/` (directory)

- [ ] **Step 1: Create the directory structure**

```bash
mkdir -p data/templates scripts
```

- [ ] **Step 2: Write the validation script**

Create `scripts/validate_templates.py`:

```python
#!/usr/bin/env python3
"""Validate that all expected legal document templates exist and are well-formed."""

import os
import re
import sys

TEMPLATES_DIR = "data/templates"

EXPECTED_TEMPLATES = [
    "nda.md",
    "non_disclosure_mutual.md",
    "service_agreement.md",
    "consulting_agreement.md",
    "independent_contractor.md",
    "employment_contract.md",
    "non_compete.md",
    "vendor_contract.md",
    "ip_assignment.md",
    "partnership_agreement.md",
    "sla.md",
    "letter_of_intent.md",
    "work_for_hire.md",
]

PLACEHOLDER_RE = re.compile(r"\{\{[A-Z][A-Z0-9_]*\}\}")
MALFORMED_RE = re.compile(r"\{\{[^}]*[a-z][^}]*\}\}|\{[^{][A-Z_]+[^}]\}")


def validate_template(filepath):
    errors = []
    with open(filepath) as f:
        content = f.read()

    if not re.search(r"^#\s+", content, re.MULTILINE):
        errors.append("No top-level heading found (expected '# Title')")

    placeholders = PLACEHOLDER_RE.findall(content)
    if not placeholders:
        errors.append("No {{PLACEHOLDER}} tokens found")

    malformed = MALFORMED_RE.findall(content)
    if malformed:
        errors.append(f"Malformed placeholders: {malformed}")

    return errors


def main():
    failed = False

    for template in EXPECTED_TEMPLATES:
        path = os.path.join(TEMPLATES_DIR, template)
        if not os.path.exists(path):
            print(f"MISSING: {path}")
            failed = True
            continue

        errors = validate_template(path)
        if errors:
            print(f"INVALID: {path}")
            for e in errors:
                print(f"  - {e}")
            failed = True
        else:
            placeholders = PLACEHOLDER_RE.findall(open(path).read())
            print(f"OK: {path} ({len(placeholders)} placeholders)")

    if failed:
        sys.exit(1)
    print(f"\nAll {len(EXPECTED_TEMPLATES)} templates valid.")


if __name__ == "__main__":
    main()
```

- [ ] **Step 3: Run validator to confirm it fails (all templates missing)**

```bash
python3 scripts/validate_templates.py
```

Expected: 13 `MISSING:` lines, exit code 1.

- [ ] **Step 4: Commit scaffold**

```bash
git add scripts/validate_templates.py
git commit -m "feat: add template validation script for GP-2"
```

---

### Task 2: NDA templates

**Files:**
- Create: `data/templates/nda.md`
- Create: `data/templates/non_disclosure_mutual.md`

- [ ] **Step 1: Create `data/templates/nda.md`**

```markdown
# Non-Disclosure Agreement

This Non-Disclosure Agreement (the "Agreement") is entered into as of {{EFFECTIVE_DATE}} by and between {{DISCLOSING_PARTY_NAME}} ("Disclosing Party") and {{RECEIVING_PARTY_NAME}} ("Receiving Party").

## 1. Purpose

The Receiving Party understands that the Disclosing Party has disclosed or may disclose information relating to {{PURPOSE}} (the "Confidential Information").

## 2. Confidentiality Obligations

The Receiving Party agrees to:

1. Hold the Confidential Information in strict confidence;
2. Not disclose the Confidential Information to any third party without the prior written consent of the Disclosing Party;
3. Use the Confidential Information solely for the Purpose described above;
4. Protect the Confidential Information using the same degree of care it uses to protect its own confidential information, but in no event less than reasonable care.

## 3. Exclusions

Confidentiality obligations do not apply to information that:

1. Is or becomes publicly known through no breach of this Agreement;
2. Was rightfully known to the Receiving Party before disclosure;
3. Is received from a third party without restriction;
4. Is independently developed by the Receiving Party without use of the Confidential Information.

## 4. Term

This Agreement shall remain in effect for {{TERM_YEARS}} years from the Effective Date, unless earlier terminated by mutual written agreement.

## 5. Return of Information

Upon request by the Disclosing Party, the Receiving Party shall promptly return or destroy all Confidential Information and any copies thereof.

## 6. Remedies

The Receiving Party acknowledges that breach of this Agreement may cause irreparable harm entitling the Disclosing Party to seek injunctive relief in addition to all other remedies.

## 7. Governing Law

This Agreement shall be governed by the laws of the State of {{GOVERNING_LAW_STATE}}, without regard to its conflict of law provisions.

## 8. Entire Agreement

This Agreement constitutes the entire agreement between the parties concerning its subject matter and supersedes all prior agreements.

---

**DISCLOSING PARTY**

Signature: ___________________________  
Name: {{DISCLOSING_PARTY_SIGNATORY_NAME}}  
Title: {{DISCLOSING_PARTY_SIGNATORY_TITLE}}  
Date: {{SIGNING_DATE}}

**RECEIVING PARTY**

Signature: ___________________________  
Name: {{RECEIVING_PARTY_SIGNATORY_NAME}}  
Title: {{RECEIVING_PARTY_SIGNATORY_TITLE}}  
Date: {{SIGNING_DATE}}
```

- [ ] **Step 2: Create `data/templates/non_disclosure_mutual.md`**

```markdown
# Mutual Non-Disclosure Agreement

This Mutual Non-Disclosure Agreement (the "Agreement") is entered into as of {{EFFECTIVE_DATE}} by and between {{PARTY_A_NAME}} ("Party A") and {{PARTY_B_NAME}} ("Party B") (collectively, the "Parties").

## 1. Purpose

The Parties intend to explore a potential business relationship involving {{PURPOSE}} (the "Permitted Purpose") and may disclose confidential information to each other in furtherance of that purpose.

## 2. Definition of Confidential Information

"Confidential Information" means any non-public information disclosed by either Party to the other, either directly or indirectly, in writing, orally, or by inspection of tangible objects, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information.

## 3. Mutual Confidentiality Obligations

Each Party agrees to:

1. Hold the other Party's Confidential Information in strict confidence;
2. Not disclose Confidential Information to any third party without prior written consent;
3. Use the Confidential Information solely for the Permitted Purpose;
4. Restrict access to Confidential Information to employees or contractors who need it for the Permitted Purpose and are bound by confidentiality obligations at least as protective as this Agreement.

## 4. Exclusions

Obligations under this Agreement do not apply to information that:

1. Is or becomes publicly known through no breach of this Agreement;
2. Was rightfully known to the receiving Party prior to disclosure;
3. Is received from a third party without confidentiality restriction;
4. Is independently developed without reference to the Confidential Information;
5. Is required to be disclosed by law or court order (with prompt notice to the disclosing Party).

## 5. Term

This Agreement shall remain in effect for {{TERM_YEARS}} years from the Effective Date. Confidentiality obligations survive termination with respect to information disclosed during the term.

## 6. Return or Destruction

Upon written request or termination, each Party shall promptly return or certifiably destroy all Confidential Information of the other Party.

## 7. No License

Nothing in this Agreement grants either Party any rights in the other Party's Confidential Information except as expressly set forth herein.

## 8. Governing Law

This Agreement shall be governed by the laws of the State of {{GOVERNING_LAW_STATE}}.

---

**PARTY A**

Signature: ___________________________  
Name: {{PARTY_A_SIGNATORY_NAME}}  
Title: {{PARTY_A_SIGNATORY_TITLE}}  
Date: {{SIGNING_DATE}}

**PARTY B**

Signature: ___________________________  
Name: {{PARTY_B_SIGNATORY_NAME}}  
Title: {{PARTY_B_SIGNATORY_TITLE}}  
Date: {{SIGNING_DATE}}
```

- [ ] **Step 3: Run validator — expect 11 MISSING, 2 OK**

```bash
python3 scripts/validate_templates.py
```

Expected: `OK: data/templates/nda.md`, `OK: data/templates/non_disclosure_mutual.md`, 11 `MISSING:` lines.

- [ ] **Step 4: Commit**

```bash
git add data/templates/nda.md data/templates/non_disclosure_mutual.md
git commit -m "feat: add NDA templates (GP-2)"
```

---

### Task 3: Service and consulting templates

**Files:**
- Create: `data/templates/service_agreement.md`
- Create: `data/templates/consulting_agreement.md`

- [ ] **Step 1: Create `data/templates/service_agreement.md`**

```markdown
# Services Agreement

This Services Agreement (the "Agreement") is entered into as of {{EFFECTIVE_DATE}} by and between {{CLIENT_NAME}} ("Client") and {{SERVICE_PROVIDER_NAME}} ("Service Provider").

## 1. Services

Service Provider agrees to perform the following services for Client: {{SERVICES_DESCRIPTION}} (the "Services"). Service Provider shall perform the Services in a professional and workmanlike manner.

## 2. Compensation

Client shall pay Service Provider {{PAYMENT_AMOUNT}} according to the following schedule: {{PAYMENT_SCHEDULE}}. Payment is due within {{PAYMENT_DUE_DAYS}} days of invoice.

## 3. Term

This Agreement shall commence on {{EFFECTIVE_DATE}} and continue for {{TERM_MONTHS}} months, unless earlier terminated in accordance with Section 7.

## 4. Intellectual Property

All work product, deliverables, and materials created by Service Provider in the performance of the Services shall be the sole and exclusive property of Client upon full payment of all fees due.

## 5. Confidentiality

Each Party agrees to keep confidential all non-public information of the other Party obtained in connection with this Agreement and not to disclose such information to any third party without prior written consent.

## 6. Independent Contractor

Service Provider is an independent contractor. Nothing in this Agreement creates an employment, partnership, joint venture, or agency relationship between the Parties.

## 7. Termination

Either Party may terminate this Agreement upon {{TERMINATION_NOTICE_DAYS}} days written notice. Client may terminate immediately for cause if Service Provider materially breaches this Agreement and fails to cure within 10 days of written notice.

## 8. Limitation of Liability

In no event shall either Party be liable for indirect, incidental, special, or consequential damages. Service Provider's total liability shall not exceed the fees paid in the {{LIABILITY_CAP_MONTHS}} months preceding the claim.

## 9. Governing Law

This Agreement shall be governed by the laws of the State of {{GOVERNING_LAW_STATE}}.

---

**CLIENT**

Signature: ___________________________  
Name: {{CLIENT_SIGNATORY_NAME}}  
Title: {{CLIENT_SIGNATORY_TITLE}}  
Date: {{SIGNING_DATE}}

**SERVICE PROVIDER**

Signature: ___________________________  
Name: {{PROVIDER_SIGNATORY_NAME}}  
Title: {{PROVIDER_SIGNATORY_TITLE}}  
Date: {{SIGNING_DATE}}
```

- [ ] **Step 2: Create `data/templates/consulting_agreement.md`**

```markdown
# Consulting Agreement

This Consulting Agreement (the "Agreement") is entered into as of {{EFFECTIVE_DATE}} by and between {{CLIENT_NAME}} ("Client") and {{CONSULTANT_NAME}} ("Consultant").

## 1. Consulting Services

Consultant agrees to provide the following consulting services: {{CONSULTING_SERVICES_DESCRIPTION}} (the "Services"). Consultant shall devote approximately {{ESTIMATED_HOURS_PER_WEEK}} hours per week to the Services unless otherwise agreed in writing.

## 2. Compensation

Client shall pay Consultant at the rate of {{HOURLY_RATE}} per hour. Consultant shall submit invoices {{INVOICE_FREQUENCY}}, and Client shall pay within {{PAYMENT_DUE_DAYS}} days of receipt.

## 3. Expenses

Client shall reimburse Consultant for pre-approved reasonable and necessary expenses incurred in performing the Services, upon submission of appropriate receipts.

## 4. Term

This Agreement commences on {{EFFECTIVE_DATE}} and continues for {{TERM_MONTHS}} months, unless earlier terminated. Either Party may terminate upon {{TERMINATION_NOTICE_DAYS}} days written notice.

## 5. Independent Contractor Status

Consultant is an independent contractor, not an employee of Client. Consultant is responsible for all taxes on compensation received under this Agreement.

## 6. Confidentiality

Consultant shall not disclose any Confidential Information of Client to any third party during or after the term of this Agreement. "Confidential Information" means all non-public business, technical, and financial information of Client.

## 7. Work Product Ownership

All deliverables, reports, analyses, and other materials created by Consultant under this Agreement ("Work Product") shall be owned by Client upon full payment of fees. Consultant assigns all rights, title, and interest in Work Product to Client.

## 8. Non-Solicitation

During the term of this Agreement and for {{NON_SOLICITATION_PERIOD_MONTHS}} months thereafter, Consultant shall not solicit Client's employees or customers without Client's prior written consent.

## 9. Governing Law

This Agreement is governed by the laws of the State of {{GOVERNING_LAW_STATE}}.

---

**CLIENT**

Signature: ___________________________  
Name: {{CLIENT_SIGNATORY_NAME}}  
Title: {{CLIENT_SIGNATORY_TITLE}}  
Date: {{SIGNING_DATE}}

**CONSULTANT**

Signature: ___________________________  
Name: {{CONSULTANT_SIGNATORY_NAME}}  
Date: {{SIGNING_DATE}}
```

- [ ] **Step 3: Run validator — expect 9 MISSING, 4 OK**

```bash
python3 scripts/validate_templates.py
```

Expected: `OK` for 4 templates, 9 `MISSING:` lines.

- [ ] **Step 4: Commit**

```bash
git add data/templates/service_agreement.md data/templates/consulting_agreement.md
git commit -m "feat: add service and consulting agreement templates (GP-2)"
```

---

### Task 4: Employment and independent contractor templates

**Files:**
- Create: `data/templates/employment_contract.md`
- Create: `data/templates/independent_contractor.md`

- [ ] **Step 1: Create `data/templates/employment_contract.md`**

```markdown
# Employment Contract

This Employment Contract (the "Agreement") is entered into as of {{EFFECTIVE_DATE}} between {{EMPLOYER_NAME}} ("Employer") and {{EMPLOYEE_NAME}} ("Employee").

## 1. Position and Duties

Employer hereby employs Employee in the position of {{JOB_TITLE}}. Employee shall report to {{REPORTING_MANAGER_TITLE}} and perform such duties as are customarily associated with this position and as may be assigned from time to time.

## 2. Start Date and Location

Employee's employment shall commence on {{START_DATE}}. Employee's primary work location shall be {{WORK_LOCATION}}.

## 3. Compensation

Employer shall pay Employee an annual base salary of {{ANNUAL_SALARY}}, payable in accordance with Employer's standard payroll schedule. Salary is subject to all required withholdings and deductions.

## 4. Benefits

Employee shall be eligible to participate in Employer's standard employee benefit programs, including {{BENEFITS_SUMMARY}}, subject to the terms of those programs.

## 5. At-Will Employment

Employment under this Agreement is at-will. Either Party may terminate the employment relationship at any time, with or without cause or notice, subject to applicable law.

## 6. Confidentiality

Employee agrees to keep confidential all proprietary and confidential information of Employer and not to disclose such information during or after employment.

## 7. Intellectual Property

All inventions, developments, and work product created by Employee in the course of employment that relate to Employer's business shall be the exclusive property of Employer. Employee hereby assigns all rights therein to Employer.

## 8. Non-Compete

During employment and for {{NON_COMPETE_PERIOD_MONTHS}} months after termination, Employee shall not engage in any business that directly competes with Employer within {{GEOGRAPHIC_SCOPE}}.

## 9. Governing Law

This Agreement shall be governed by the laws of the State of {{GOVERNING_LAW_STATE}}.

---

**EMPLOYER**

Signature: ___________________________  
Name: {{EMPLOYER_SIGNATORY_NAME}}  
Title: {{EMPLOYER_SIGNATORY_TITLE}}  
Date: {{SIGNING_DATE}}

**EMPLOYEE**

Signature: ___________________________  
Name: {{EMPLOYEE_NAME}}  
Date: {{SIGNING_DATE}}
```

- [ ] **Step 2: Create `data/templates/independent_contractor.md`**

```markdown
# Independent Contractor Agreement

This Independent Contractor Agreement (the "Agreement") is entered into as of {{EFFECTIVE_DATE}} between {{COMPANY_NAME}} ("Company") and {{CONTRACTOR_NAME}} ("Contractor").

## 1. Services

Contractor agrees to perform the following services for Company: {{SERVICES_DESCRIPTION}} (the "Services"). Contractor shall provide the Services in a professional manner and deliver {{DELIVERABLES_DESCRIPTION}} by the dates agreed in any applicable Statement of Work.

## 2. Compensation

Company shall pay Contractor {{COMPENSATION_AMOUNT}} as follows: {{PAYMENT_SCHEDULE}}. Payment shall be made within {{PAYMENT_DUE_DAYS}} days of receipt of a valid invoice.

## 3. Independent Contractor Status

Contractor is an independent contractor, not an employee, agent, or partner of Company. Contractor is solely responsible for all taxes, insurance, and other obligations arising from Contractor's self-employment. Contractor shall supply all tools and equipment necessary to perform the Services unless otherwise agreed.

## 4. Term

This Agreement commences on {{EFFECTIVE_DATE}} and continues until {{END_DATE}}, unless earlier terminated. Either Party may terminate this Agreement upon {{TERMINATION_NOTICE_DAYS}} days written notice.

## 5. Intellectual Property

All work product, inventions, and deliverables created by Contractor in the performance of the Services shall be the sole property of Company. Contractor hereby irrevocably assigns all rights, title, and interest in such work product to Company.

## 6. Confidentiality

Contractor shall not use or disclose any Confidential Information of Company for any purpose other than performing the Services. This obligation survives termination of this Agreement.

## 7. No Exclusivity

Nothing in this Agreement prevents Company from engaging other contractors or employees for the same or similar services.

## 8. Governing Law

This Agreement shall be governed by the laws of the State of {{GOVERNING_LAW_STATE}}.

---

**COMPANY**

Signature: ___________________________  
Name: {{COMPANY_SIGNATORY_NAME}}  
Title: {{COMPANY_SIGNATORY_TITLE}}  
Date: {{SIGNING_DATE}}

**CONTRACTOR**

Signature: ___________________________  
Name: {{CONTRACTOR_NAME}}  
Date: {{SIGNING_DATE}}
```

- [ ] **Step 3: Run validator — expect 7 MISSING, 6 OK**

```bash
python3 scripts/validate_templates.py
```

Expected: `OK` for 6 templates, 7 `MISSING:` lines.

- [ ] **Step 4: Commit**

```bash
git add data/templates/employment_contract.md data/templates/independent_contractor.md
git commit -m "feat: add employment and independent contractor templates (GP-2)"
```

---

### Task 5: Non-compete, vendor contract, and IP assignment templates

**Files:**
- Create: `data/templates/non_compete.md`
- Create: `data/templates/vendor_contract.md`
- Create: `data/templates/ip_assignment.md`

- [ ] **Step 1: Create `data/templates/non_compete.md`**

```markdown
# Non-Compete Agreement

This Non-Compete Agreement (the "Agreement") is entered into as of {{EFFECTIVE_DATE}} between {{COMPANY_NAME}} ("Company") and {{INDIVIDUAL_NAME}} ("Individual").

## 1. Background

Individual is or will be employed by or engaged as a contractor for Company, and in such capacity will have access to Company's confidential information, trade secrets, and customer relationships.

## 2. Non-Compete Covenant

During the Restricted Period (defined below) and within the Geographic Scope (defined below), Individual agrees not to, directly or indirectly:

1. Own, manage, operate, or participate in any business that competes with Company's business;
2. Provide services to any competitor of Company in a capacity substantially similar to Individual's role at Company;
3. Solicit Company's customers or clients for a competing business.

## 3. Restricted Period

The restrictions in Section 2 shall apply during Individual's engagement with Company and for {{RESTRICTED_PERIOD_MONTHS}} months following the termination of such engagement for any reason.

## 4. Geographic Scope

The restrictions in Section 2 shall apply within the following geographic area: {{GEOGRAPHIC_SCOPE}}.

## 5. Non-Solicitation of Employees

During the Restricted Period, Individual shall not solicit, recruit, or hire any employee of Company without Company's prior written consent.

## 6. Consideration

In consideration for entering into this Agreement, Company agrees to {{CONSIDERATION_DESCRIPTION}}.

## 7. Reasonableness

Individual acknowledges that the restrictions in this Agreement are reasonable and necessary to protect Company's legitimate business interests, including its confidential information and customer relationships.

## 8. Remedies

Individual acknowledges that a breach of this Agreement would cause irreparable harm to Company and that monetary damages would be inadequate. Company shall be entitled to seek injunctive relief without bond, in addition to any other remedies available at law or equity.

## 9. Governing Law

This Agreement is governed by the laws of the State of {{GOVERNING_LAW_STATE}}.

---

**COMPANY**

Signature: ___________________________  
Name: {{COMPANY_SIGNATORY_NAME}}  
Title: {{COMPANY_SIGNATORY_TITLE}}  
Date: {{SIGNING_DATE}}

**INDIVIDUAL**

Signature: ___________________________  
Name: {{INDIVIDUAL_NAME}}  
Date: {{SIGNING_DATE}}
```

- [ ] **Step 2: Create `data/templates/vendor_contract.md`**

```markdown
# Vendor Contract

This Vendor Contract (the "Agreement") is entered into as of {{EFFECTIVE_DATE}} between {{BUYER_NAME}} ("Buyer") and {{VENDOR_NAME}} ("Vendor").

## 1. Goods and Services

Vendor agrees to provide the following goods and/or services to Buyer: {{GOODS_SERVICES_DESCRIPTION}} (the "Deliverables"). Vendor shall deliver the Deliverables by {{DELIVERY_DATE}} in accordance with the specifications set forth in Exhibit A.

## 2. Purchase Price and Payment

Buyer shall pay Vendor {{CONTRACT_VALUE}} as follows: {{PAYMENT_TERMS}}. All payments are due within {{PAYMENT_DUE_DAYS}} days of invoice. Late payments shall accrue interest at {{LATE_PAYMENT_INTEREST_RATE}}% per month.

## 3. Delivery and Acceptance

Vendor shall deliver Deliverables to {{DELIVERY_ADDRESS}}. Buyer shall have {{ACCEPTANCE_PERIOD_DAYS}} business days after delivery to inspect and accept or reject the Deliverables. Rejection must be in writing with specific reasons stated.

## 4. Warranties

Vendor warrants that: (a) Deliverables shall conform to all agreed specifications; (b) Deliverables shall be free from defects in materials and workmanship for {{WARRANTY_PERIOD_MONTHS}} months after delivery; (c) Vendor has full authority to enter into this Agreement.

## 5. Intellectual Property

Unless otherwise specified, Vendor retains ownership of all pre-existing intellectual property. Any custom work product created specifically for Buyer under this Agreement shall be owned by Buyer upon full payment.

## 6. Confidentiality

Each Party agrees to keep confidential all non-public information of the other Party obtained in connection with this Agreement.

## 7. Indemnification

Vendor shall indemnify, defend, and hold harmless Buyer from any third-party claims arising from Vendor's breach of this Agreement, negligence, or willful misconduct.

## 8. Termination

Buyer may terminate this Agreement for convenience upon {{TERMINATION_NOTICE_DAYS}} days written notice. Either Party may terminate immediately for material breach that remains uncured for 15 days after written notice.

## 9. Governing Law

This Agreement shall be governed by the laws of the State of {{GOVERNING_LAW_STATE}}.

---

**BUYER**

Signature: ___________________________  
Name: {{BUYER_SIGNATORY_NAME}}  
Title: {{BUYER_SIGNATORY_TITLE}}  
Date: {{SIGNING_DATE}}

**VENDOR**

Signature: ___________________________  
Name: {{VENDOR_SIGNATORY_NAME}}  
Title: {{VENDOR_SIGNATORY_TITLE}}  
Date: {{SIGNING_DATE}}
```

- [ ] **Step 3: Create `data/templates/ip_assignment.md`**

```markdown
# Intellectual Property Assignment Agreement

This Intellectual Property Assignment Agreement (the "Agreement") is entered into as of {{EFFECTIVE_DATE}} by and between {{ASSIGNOR_NAME}} ("Assignor") and {{ASSIGNEE_NAME}} ("Assignee").

## 1. Assignment

Assignor hereby irrevocably assigns, transfers, and conveys to Assignee all right, title, and interest in and to the following intellectual property (the "IP"):

{{IP_DESCRIPTION}}

This assignment includes all patents, patent applications, copyrights, trade secrets, trademarks, and other intellectual property rights in the IP, whether currently existing or hereafter arising, in all jurisdictions worldwide.

## 2. Consideration

In consideration for this assignment, Assignee shall pay Assignor {{CONSIDERATION}} upon execution of this Agreement. The Parties agree this consideration is fair and adequate.

## 3. Further Assurances

Assignor agrees to execute all documents and take all actions reasonably requested by Assignee to perfect, record, and enforce the rights assigned hereunder, including executing patent assignments, copyright registrations, and similar instruments.

## 4. Warranties

Assignor warrants that: (a) Assignor is the sole and exclusive owner of the IP; (b) the IP is free of all liens, encumbrances, and third-party claims; (c) Assignor has full authority to make this assignment; (d) to Assignor's knowledge, the IP does not infringe any third-party intellectual property rights.

## 5. No Prior Assignments

Assignor represents that Assignor has not previously assigned, licensed, or otherwise encumbered the IP in any manner inconsistent with this Agreement.

## 6. Confidentiality

Each Party agrees to keep the terms of this Agreement and any related technical information confidential.

## 7. Governing Law

This Agreement shall be governed by the laws of the State of {{GOVERNING_LAW_STATE}}.

---

**ASSIGNOR**

Signature: ___________________________  
Name: {{ASSIGNOR_NAME}}  
Date: {{SIGNING_DATE}}

**ASSIGNEE**

Signature: ___________________________  
Name: {{ASSIGNEE_SIGNATORY_NAME}}  
Title: {{ASSIGNEE_SIGNATORY_TITLE}}  
Date: {{SIGNING_DATE}}
```

- [ ] **Step 4: Run validator — expect 4 MISSING, 9 OK**

```bash
python3 scripts/validate_templates.py
```

Expected: `OK` for 9 templates, 4 `MISSING:` lines.

- [ ] **Step 5: Commit**

```bash
git add data/templates/non_compete.md data/templates/vendor_contract.md data/templates/ip_assignment.md
git commit -m "feat: add non-compete, vendor contract, and IP assignment templates (GP-2)"
```

---

### Task 6: Partnership, SLA, letter of intent, and work for hire templates

**Files:**
- Create: `data/templates/partnership_agreement.md`
- Create: `data/templates/sla.md`
- Create: `data/templates/letter_of_intent.md`
- Create: `data/templates/work_for_hire.md`

- [ ] **Step 1: Create `data/templates/partnership_agreement.md`**

```markdown
# Partnership Agreement

This Partnership Agreement (the "Agreement") is entered into as of {{EFFECTIVE_DATE}} by and between {{PARTNER_A_NAME}} ("Partner A") and {{PARTNER_B_NAME}} ("Partner B") (collectively, the "Partners").

## 1. Formation

The Partners hereby form a general partnership (the "Partnership") under the name {{PARTNERSHIP_NAME}} for the purpose of {{BUSINESS_PURPOSE}}.

## 2. Capital Contributions

Each Partner shall contribute capital to the Partnership as follows:

- Partner A: {{PARTNER_A_CONTRIBUTION}}
- Partner B: {{PARTNER_B_CONTRIBUTION}}

Additional capital contributions require unanimous written consent of all Partners.

## 3. Profit and Loss Allocation

Profits and losses of the Partnership shall be allocated as follows:

- Partner A: {{PARTNER_A_PERCENTAGE}}%
- Partner B: {{PARTNER_B_PERCENTAGE}}%

## 4. Management

Each Partner shall have equal rights to manage and conduct Partnership business. Decisions requiring unanimous consent include: (a) admitting new partners; (b) disposing of Partnership assets outside the ordinary course of business; (c) amending this Agreement.

## 5. Distributions

Distributions shall be made at such times and in such amounts as the Partners unanimously agree, in proportion to each Partner's ownership percentage.

## 6. Books and Records

The Partnership shall maintain complete and accurate books of account. Each Partner shall have access to all Partnership books and records at any time.

## 7. Withdrawal and Dissolution

A Partner may withdraw upon {{WITHDRAWAL_NOTICE_DAYS}} days written notice. Upon withdrawal or dissolution, Partnership assets shall be liquidated and distributed after payment of all debts, in proportion to each Partner's ownership percentage.

## 8. Non-Compete

During the term of the Partnership and for {{NON_COMPETE_PERIOD_MONTHS}} months after dissolution or a Partner's withdrawal, no Partner shall engage in any business that directly competes with the Partnership within {{GEOGRAPHIC_SCOPE}}.

## 9. Governing Law

This Agreement shall be governed by the laws of the State of {{GOVERNING_LAW_STATE}}.

---

**PARTNER A**

Signature: ___________________________  
Name: {{PARTNER_A_NAME}}  
Date: {{SIGNING_DATE}}

**PARTNER B**

Signature: ___________________________  
Name: {{PARTNER_B_NAME}}  
Date: {{SIGNING_DATE}}
```

- [ ] **Step 2: Create `data/templates/sla.md`**

```markdown
# Service Level Agreement

This Service Level Agreement (the "SLA") is entered into as of {{EFFECTIVE_DATE}} between {{PROVIDER_NAME}} ("Provider") and {{CLIENT_NAME}} ("Client"), and is incorporated into and made part of the Services Agreement between the Parties dated {{MASTER_AGREEMENT_DATE}}.

## 1. Service Description

Provider shall provide the following services to Client: {{SERVICE_DESCRIPTION}} (the "Services").

## 2. Service Availability

Provider shall ensure the Services are available {{UPTIME_PERCENTAGE}}% of the time in any given calendar month, excluding Scheduled Maintenance Windows. Uptime is measured as: (Total Minutes in Month - Downtime Minutes) / Total Minutes in Month × 100.

## 3. Scheduled Maintenance

Provider shall notify Client at least {{MAINTENANCE_NOTICE_HOURS}} hours in advance of any scheduled maintenance that may affect Service availability. Maintenance shall be scheduled during {{PREFERRED_MAINTENANCE_WINDOW}}.

## 4. Response and Resolution Times

Provider shall respond to and resolve incidents according to the following priority levels:

| Priority | Description | Response Time | Resolution Time |
|----------|-------------|---------------|-----------------|
| Critical | Service unavailable | {{CRITICAL_RESPONSE_TIME}} | {{CRITICAL_RESOLUTION_TIME}} |
| High | Significant degradation | {{HIGH_RESPONSE_TIME}} | {{HIGH_RESOLUTION_TIME}} |
| Medium | Minor degradation | {{MEDIUM_RESPONSE_TIME}} | {{MEDIUM_RESOLUTION_TIME}} |
| Low | Cosmetic/non-impacting | {{LOW_RESPONSE_TIME}} | {{LOW_RESOLUTION_TIME}} |

## 5. Service Credits

If Provider fails to meet the uptime commitment in Section 2 in any calendar month, Client shall receive service credits as follows:

- Uptime below {{TIER_1_THRESHOLD}}%: credit of {{TIER_1_CREDIT_PERCENTAGE}}% of monthly fees
- Uptime below {{TIER_2_THRESHOLD}}%: credit of {{TIER_2_CREDIT_PERCENTAGE}}% of monthly fees

Credits are Client's sole remedy for SLA failures and shall be applied to future invoices.

## 6. Exclusions

SLA commitments do not apply to downtime caused by: (a) Client's systems or actions; (b) Force majeure events; (c) Scheduled maintenance; (d) Third-party services outside Provider's control.

## 7. Reporting

Provider shall provide Client with a monthly uptime report within {{REPORT_DELIVERY_DAYS}} business days following the end of each calendar month.

## 8. Governing Law

This SLA shall be governed by the laws of the State of {{GOVERNING_LAW_STATE}}.

---

**PROVIDER**

Signature: ___________________________  
Name: {{PROVIDER_SIGNATORY_NAME}}  
Title: {{PROVIDER_SIGNATORY_TITLE}}  
Date: {{SIGNING_DATE}}

**CLIENT**

Signature: ___________________________  
Name: {{CLIENT_SIGNATORY_NAME}}  
Title: {{CLIENT_SIGNATORY_TITLE}}  
Date: {{SIGNING_DATE}}
```

- [ ] **Step 3: Create `data/templates/letter_of_intent.md`**

```markdown
# Letter of Intent

{{DATE}}

{{RECIPIENT_NAME}}  
{{RECIPIENT_TITLE}}  
{{RECIPIENT_COMPANY}}  
{{RECIPIENT_ADDRESS}}

Dear {{RECIPIENT_NAME}},

This Letter of Intent ("LOI") sets forth the principal terms under which {{SENDER_NAME}} ("Buyer") proposes to acquire {{TRANSACTION_DESCRIPTION}} from {{SELLER_NAME}} ("Seller"). This LOI is intended to facilitate further negotiation and is not a binding agreement, except as expressly stated in Section 7.

## 1. Transaction Overview

Buyer proposes to acquire {{ASSET_OR_COMPANY_DESCRIPTION}} on the following principal terms.

## 2. Purchase Price

The proposed purchase price is {{PURCHASE_PRICE}}, subject to adjustment as described in the definitive agreement. Payment shall be structured as: {{PAYMENT_STRUCTURE}}.

## 3. Due Diligence

Buyer shall have {{DUE_DILIGENCE_PERIOD_DAYS}} days from the date of execution of this LOI to conduct due diligence on Seller and the assets to be acquired. Seller shall provide Buyer reasonable access to its books, records, personnel, and facilities during this period.

## 4. Definitive Agreement

The Parties intend to negotiate and execute a definitive purchase agreement within {{DEFINITIVE_AGREEMENT_DEADLINE_DAYS}} days of execution of this LOI. The transaction is subject to execution of a definitive agreement satisfactory to both Parties.

## 5. Conditions

Closing of the proposed transaction is subject to: (a) completion of satisfactory due diligence; (b) negotiation and execution of definitive transaction documents; (c) {{ADDITIONAL_CONDITIONS}}.

## 6. Exclusivity

For {{EXCLUSIVITY_PERIOD_DAYS}} days from execution, Seller agrees not to solicit, negotiate, or enter into any agreement with any third party regarding the sale of the assets or company described herein.

## 7. Binding Provisions

The following provisions of this LOI are legally binding: (a) Exclusivity (Section 6); (b) Confidentiality (Section 8); (c) Governing Law (Section 9). All other provisions are expressions of intent only and are not binding.

## 8. Confidentiality

The Parties agree to keep the existence and terms of this LOI and all related negotiations strictly confidential.

## 9. Governing Law

This LOI shall be governed by the laws of the State of {{GOVERNING_LAW_STATE}}.

---

**BUYER**

Signature: ___________________________  
Name: {{BUYER_SIGNATORY_NAME}}  
Title: {{BUYER_SIGNATORY_TITLE}}  
Date: {{SIGNING_DATE}}

**SELLER**

Signature: ___________________________  
Name: {{SELLER_SIGNATORY_NAME}}  
Title: {{SELLER_SIGNATORY_TITLE}}  
Date: {{SIGNING_DATE}}
```

- [ ] **Step 4: Create `data/templates/work_for_hire.md`**

```markdown
# Work for Hire Agreement

This Work for Hire Agreement (the "Agreement") is entered into as of {{EFFECTIVE_DATE}} between {{HIRING_PARTY_NAME}} ("Hiring Party") and {{CREATOR_NAME}} ("Creator").

## 1. Services and Deliverables

Creator agrees to create and deliver the following work product for Hiring Party: {{WORK_DESCRIPTION}} (the "Work"). Creator shall deliver the Work by {{DELIVERY_DATE}} in accordance with the specifications set forth in any attached Exhibit.

## 2. Compensation

Hiring Party shall pay Creator {{COMPENSATION_AMOUNT}} as follows: {{PAYMENT_SCHEDULE}}. Payment is contingent upon delivery and acceptance of the Work.

## 3. Work Made for Hire

The Work is specially ordered and commissioned by Hiring Party and shall be deemed a "work made for hire" as defined in 17 U.S.C. § 101. All copyrights and other intellectual property rights in the Work shall vest exclusively in Hiring Party from the moment of creation.

## 4. Assignment of Rights

To the extent the Work does not qualify as a work made for hire under applicable law, Creator hereby irrevocably assigns to Hiring Party all rights, title, and interest in and to the Work, including all copyrights, patent rights, trade secrets, and other intellectual property rights, in all media and formats, throughout the universe, in perpetuity.

## 5. Moral Rights Waiver

To the fullest extent permitted by applicable law, Creator waives any and all moral rights in the Work, including the right of attribution and the right to object to modification.

## 6. Creator Warranties

Creator warrants that: (a) the Work will be Creator's original work; (b) the Work will not infringe any third-party intellectual property rights; (c) Creator has full authority to enter into this Agreement and make the assignments herein.

## 7. Confidentiality

Creator agrees to keep confidential all information provided by Hiring Party in connection with the Work and not to disclose it to any third party.

## 8. Independent Contractor

Creator is an independent contractor. Nothing in this Agreement creates an employment relationship between the Parties.

## 9. Governing Law

This Agreement is governed by the laws of the State of {{GOVERNING_LAW_STATE}}.

---

**HIRING PARTY**

Signature: ___________________________  
Name: {{HIRING_PARTY_SIGNATORY_NAME}}  
Title: {{HIRING_PARTY_SIGNATORY_TITLE}}  
Date: {{SIGNING_DATE}}

**CREATOR**

Signature: ___________________________  
Name: {{CREATOR_NAME}}  
Date: {{SIGNING_DATE}}
```

- [ ] **Step 5: Run validator — expect all 13 OK**

```bash
python3 scripts/validate_templates.py
```

Expected output:
```
OK: data/templates/nda.md (N placeholders)
OK: data/templates/non_disclosure_mutual.md (N placeholders)
OK: data/templates/service_agreement.md (N placeholders)
OK: data/templates/consulting_agreement.md (N placeholders)
OK: data/templates/independent_contractor.md (N placeholders)
OK: data/templates/employment_contract.md (N placeholders)
OK: data/templates/non_compete.md (N placeholders)
OK: data/templates/vendor_contract.md (N placeholders)
OK: data/templates/ip_assignment.md (N placeholders)
OK: data/templates/partnership_agreement.md (N placeholders)
OK: data/templates/sla.md (N placeholders)
OK: data/templates/letter_of_intent.md (N placeholders)
OK: data/templates/work_for_hire.md (N placeholders)

All 13 templates valid.
```

Exit code: 0

- [ ] **Step 6: Commit**

```bash
git add data/templates/partnership_agreement.md data/templates/sla.md data/templates/letter_of_intent.md data/templates/work_for_hire.md
git commit -m "feat: add partnership, SLA, LOI, and work-for-hire templates (GP-2)"
```

---

### Task 7: Final validation and PR

**Files:** No new files.

- [ ] **Step 1: Run full validation one final time**

```bash
python3 scripts/validate_templates.py
```

Expected: All 13 templates `OK`, exit code 0.

- [ ] **Step 2: Verify file count**

```bash
ls data/templates/*.md | wc -l
```

Expected: `13`

- [ ] **Step 3: Create PR**

```bash
gh pr create \
  --title "GP-2: Add legal document templates dataset" \
  --body "## Summary
- Creates 13 Markdown business contract templates in \`data/templates/\`
- Templates use \`{{PLACEHOLDER}}\` tokens for variable fields
- Adds \`scripts/validate_templates.py\` to verify template completeness and formatting

## Templates Added
NDA, Mutual NDA, Service Agreement, Consulting Agreement, Independent Contractor, Employment Contract, Non-Compete, Vendor Contract, IP Assignment, Partnership Agreement, SLA, Letter of Intent, Work for Hire

## Test plan
- [ ] Run \`python3 scripts/validate_templates.py\` — all 13 templates pass
- [ ] Verify \`ls data/templates/*.md | wc -l\` returns 13

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```
