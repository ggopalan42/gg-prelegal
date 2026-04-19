from typing import Optional
from pydantic import BaseModel


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[Message]


class PartyFields(BaseModel):
    printName: Optional[str] = None
    title: Optional[str] = None
    company: Optional[str] = None
    noticeAddress: Optional[str] = None
    date: Optional[str] = None


class TermsFields(BaseModel):
    purpose: Optional[str] = None
    effectiveDate: Optional[str] = None
    mndaTermType: Optional[str] = None
    mndaTermYears: Optional[str] = None
    confidentialityType: Optional[str] = None
    confidentialityYears: Optional[str] = None
    governingLaw: Optional[str] = None
    jurisdiction: Optional[str] = None


class ChatAIResponse(BaseModel):
    reply: str
    party1: Optional[PartyFields] = None
    party2: Optional[PartyFields] = None
    terms: Optional[TermsFields] = None
    complete: bool = False


class ChatResponse(BaseModel):
    reply: str
    party1: Optional[PartyFields] = None
    party2: Optional[PartyFields] = None
    terms: Optional[TermsFields] = None
    complete: bool = False
