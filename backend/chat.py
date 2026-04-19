import os
from litellm import completion
from models import Message, ChatAIResponse

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["cerebras"]}}

SYSTEM_PROMPT = """You are a friendly legal assistant helping a user create a Mutual Non-Disclosure Agreement (MNDA).

Your job is to gather the following information through natural conversation. Ask about one or two things at a time — don't overwhelm the user with a long list.

Fields to gather:
- Party 1: full name, title, company name, notice address, date of signing
- Party 2: full name, title, company name, notice address, date of signing
- Purpose: what is the confidential information being shared for?
- Effective Date: when does the agreement start? (format: YYYY-MM-DD)
- MNDA Term: does the agreement expire after a set number of years, or continue until terminated? If it expires, how many years?
- Confidentiality Term: how long is confidential information protected? Provide a number of years, or say "perpetuity".
- Governing Law: which US state's laws govern the agreement?
- Jurisdiction: which city/state for legal proceedings?

As you learn each piece of information, extract it into the structured fields in your response. Set `complete` to true only when ALL fields above have been collected.

Be warm, professional and concise. Use plain language. Dates should be in YYYY-MM-DD format.
For mndaTermType use "expires" or "until_terminated".
For confidentialityType use "years" or "perpetuity"."""


def chat(messages: list[Message]) -> ChatAIResponse:
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY not set")

    os.environ["OPENROUTER_API_KEY"] = api_key

    lm_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    lm_messages += [{"role": m.role, "content": m.content} for m in messages]

    # If no messages, trigger the AI's opening greeting
    if not messages:
        lm_messages.append({"role": "user", "content": "Hello, I'd like to create a Mutual NDA."})

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
