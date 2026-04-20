from typing import Optional
from pydantic import BaseModel


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[Message]
    doc_type: Optional[str] = None


class FieldEntry(BaseModel):
    key: str
    value: str


class ChatAIResponse(BaseModel):
    reply: str
    fields: list[FieldEntry] = []
    doc_type: Optional[str] = None
    complete: bool = False


class ChatResponse(BaseModel):
    reply: str
    fields: list[FieldEntry] = []
    doc_type: Optional[str] = None
    complete: bool = False
