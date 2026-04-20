import json
import os
import re
from pathlib import Path
from typing import Optional
from litellm import completion
from models import Message, ChatAIResponse

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["cerebras"]}}

BASE_DIR = Path(__file__).parent

with open(BASE_DIR / "catalog.json") as f:
    CATALOG = json.load(f)

# Short code → template filename
SHORT_CODES: dict[str, str] = {
    "MNDA": "Mutual-NDA.md",
    "MNDA-COVER": "Mutual-NDA-coverpage.md",
    "CSA": "CSA.md",
    "DESIGN": "design-partner-agreement.md",
    "SLA": "sla.md",
    "PSA": "psa.md",
    "DPA": "DPA.md",
    "PARTNER": "Partnership-Agreement.md",
    "LICENSE": "Software-License-Agreement.md",
    "PILOT": "Pilot-Agreement.md",
    "BAA": "BAA.md",
    "AI-ADD": "AI-Addendum.md",
}

_filename_to_name = {e["filename"]: e["name"] for e in CATALOG}
CODE_TO_NAME: dict[str, str] = {
    code: _filename_to_name.get(filename, filename)
    for code, filename in SHORT_CODES.items()
}

# Signing parties per doc type
PARTY_FIELDS: dict[str, list[str]] = {
    "MNDA": ["Party 1", "Party 2"],
    "MNDA-COVER": ["Party 1", "Party 2"],
    "CSA": ["Provider", "Customer"],
    "DESIGN": ["Provider", "Partner"],
    "SLA": ["Provider", "Customer"],
    "PSA": ["Provider", "Customer"],
    "DPA": ["Provider", "Customer"],
    "PARTNER": ["Company", "Partner"],
    "LICENSE": ["Provider", "Customer"],
    "PILOT": ["Provider", "Customer"],
    "BAA": ["Provider", "Company"],
    "AI-ADD": ["Provider", "Customer"],
}


def extract_template_fields(filename: str) -> list[str]:
    """Return unique placeholder field names from a template file."""
    path = BASE_DIR / "templates" / filename
    if not path.exists():
        return []
    content = path.read_text()
    raw = re.findall(r'class="[a-z_]+_link">([^<]+)', content)
    seen: set[str] = set()
    result: list[str] = []
    for m in raw:
        # Strip possessives (ASCII and Unicode curly apostrophe) and whitespace
        clean = re.sub(r"[\u2019']s?$", "", m.strip())
        if clean and clean not in seen:
            seen.add(clean)
            result.append(clean)
    return result


def _build_doc_prompt(doc_type: str) -> str:
    doc_name = CODE_TO_NAME.get(doc_type, doc_type)
    filename = SHORT_CODES[doc_type]
    parties = PARTY_FIELDS.get(doc_type, [])
    party_lower = {p.lower() for p in parties}

    template_fields = extract_template_fields(filename)
    # Exclude bare party names and their possessives from the terms list
    term_fields = [
        f for f in template_fields
        if f.lower() not in party_lower
    ]

    party_lines: list[str] = []
    for p in parties:
        party_lines.append(
            f'- {p} (signing party): "{p}" = company/org name, '
            f'"{p} Name" = signer\'s full name, "{p} Title" = their title, '
            f'"{p} Address" = notice address, "{p} Date" = signing date (YYYY-MM-DD)'
        )

    term_lines = [f'- "{f}"' for f in term_fields]

    return f"""You are a friendly legal assistant helping a user create a {doc_name}.

Gather the following information through natural conversation. Ask about one or two things at a time.

Signing parties:
{chr(10).join(party_lines)}

Document terms:
{chr(10).join(term_lines)}

Extract each piece of information into the `fields` list as {{key, value}} pairs using the exact key names shown above.
Set `complete` to true only when ALL fields have been collected.
Always keep `doc_type` set to "{doc_type}" in every response.
Be warm, professional, and concise. Dates in YYYY-MM-DD format."""


_CATALOG_LINES = "\n".join(
    f"- {code}: {name}" for code, name in CODE_TO_NAME.items()
)

_SELECTION_PROMPT = f"""You are a friendly legal assistant helping users create professional legal documents.

Supported document types:
{_CATALOG_LINES}

On first contact, warmly welcome the user and list all supported document types with their short codes.
Ask which document they'd like to create.

If the user requests a document not in the list, explain it is not supported and suggest the closest available type.

Once the user selects a document, set `doc_type` in your response to the short code (e.g. "MNDA", "CSA").
Keep `fields` empty and `complete` false until a document type is confirmed."""


def chat(messages: list[Message], doc_type: Optional[str] = None) -> ChatAIResponse:
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY not set")

    if doc_type and doc_type in SHORT_CODES:
        system_prompt = _build_doc_prompt(doc_type)
        seed_content = f"Hello, I'd like to create a {CODE_TO_NAME[doc_type]}."
    else:
        system_prompt = _SELECTION_PROMPT
        seed_content = "Hello, I need help creating a legal document."

    lm_messages = [{"role": "system", "content": system_prompt}]
    lm_messages += [{"role": m.role, "content": m.content} for m in messages]

    if not messages:
        lm_messages.append({"role": "user", "content": seed_content})

    response = completion(
        model=MODEL,
        messages=lm_messages,
        response_format=ChatAIResponse,
        reasoning_effort="low",
        extra_body=EXTRA_BODY,
        api_key=api_key,
        api_base="https://openrouter.ai/api/v1",
    )
    result = response.choices[0].message.content
    return ChatAIResponse.model_validate_json(result)
