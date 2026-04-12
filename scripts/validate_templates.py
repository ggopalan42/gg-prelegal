#!/usr/bin/env python3
"""Validate that all expected legal document templates exist and are well-formed."""

import os
import re
import sys

TEMPLATES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "templates")

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
MALFORMED_RE = re.compile(r"\{\{[^}]*[a-z][^}]*\}\}|(?<!\{)\{[A-Z][A-Z0-9_]*\}(?!\})")


def validate_template(filepath):
    errors = []
    try:
        with open(filepath) as f:
            content = f.read()
    except OSError as e:
        return [f"Could not read file: {e}"], []

    if not re.search(r"^#\s+", content, re.MULTILINE):
        errors.append("No top-level heading found (expected '# Title')")

    placeholders = PLACEHOLDER_RE.findall(content)
    if not placeholders:
        errors.append("No {{PLACEHOLDER}} tokens found")

    malformed = MALFORMED_RE.findall(content)
    if malformed:
        errors.append(f"Malformed placeholders: {malformed}")

    return errors, placeholders


def main():
    failed = False

    for template in EXPECTED_TEMPLATES:
        path = os.path.join(TEMPLATES_DIR, template)
        if not os.path.exists(path):
            print(f"MISSING: {path}")
            failed = True
            continue

        errors, placeholders = validate_template(path)
        if errors:
            print(f"INVALID: {path}")
            for e in errors:
                print(f"  - {e}")
            failed = True
        else:
            print(f"OK: {path} ({len(placeholders)} placeholders)")

    if failed:
        sys.exit(1)
    print(f"\nAll {len(EXPECTED_TEMPLATES)} templates valid.")


if __name__ == "__main__":
    main()
