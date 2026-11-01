from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# Request Schemas
class GenerateRequest(BaseModel):
    prompt: str = Field(..., min_length=2, description="Natural language prompt describing the code to generate")
    language: str = Field(..., description="Target programming language (e.g., python, javascript, html, css, java, sql)")
    api_key: Optional[str] = Field(None, description="Optional custom OpenAI API Key")
    model: Optional[str] = Field(None, description="Optional model override")

class FixRequest(BaseModel):
    code: str = Field(..., min_length=1, description="Code containing bugs or errors")
    language: str = Field(..., description="Programming language of the code")
    error_description: Optional[str] = Field("", description="Optional details about error or unexpected behavior")
    api_key: Optional[str] = Field(None, description="Optional custom OpenAI API Key")
    model: Optional[str] = Field(None, description="Optional model override")

class ExplainRequest(BaseModel):
    code: str = Field(..., min_length=1, description="Code to be explained")
    language: str = Field(..., description="Programming language of the code")
    api_key: Optional[str] = Field(None, description="Optional custom OpenAI API Key")
    model: Optional[str] = Field(None, description="Optional model override")

class OptimizeRequest(BaseModel):
    code: str = Field(..., min_length=1, description="Code to optimize for performance and readability")
    language: str = Field(..., description="Programming language of the code")
    api_key: Optional[str] = Field(None, description="Optional custom OpenAI API Key")
    model: Optional[str] = Field(None, description="Optional model override")

class ConvertRequest(BaseModel):
    code: str = Field(..., min_length=1, description="Source code to convert")
    source_language: str = Field(..., description="Source programming language")
    target_language: str = Field(..., description="Target programming language to convert into")
    api_key: Optional[str] = Field(None, description="Optional custom OpenAI API Key")
    model: Optional[str] = Field(None, description="Optional model override")

# Response Schemas
class AIResponse(BaseModel):
    code: str
    description: str
    explanation: List[str]
    dependencies: List[str]
    run_instructions: str
    language: str
    history_id: Optional[int] = None
    is_saved: bool = False

class SaveSnippetRequest(BaseModel):
    title: str
    language: str
    code: str
    description: Optional[str] = ""
    explanation: Optional[List[str]] = []
    dependencies: Optional[List[str]] = []
    run_instructions: Optional[str] = ""
    tool_type: Optional[str] = "saved"
    history_id: Optional[int] = None

class ToggleFavoriteRequest(BaseModel):
    is_saved: bool

class ExecuteRequest(BaseModel):
    code: str = Field(..., description="Code to execute")
    language: str = Field(..., description="Language of the code (python, sql, javascript, etc.)")

class ExecuteResponse(BaseModel):
    output: str
    error: Optional[str] = None
    execution_time_ms: float
    status: str  # "success", "error", "timeout"

class HistoryItemResponse(BaseModel):
    id: int
    tool_type: str
    title: Optional[str]
    prompt: Optional[str]
    language: str
    target_language: Optional[str]
    input_code: Optional[str]
    generated_code: str
    description: Optional[str]
    explanation: Optional[str]
    dependencies: Optional[str]
    run_instructions: Optional[str]
    is_saved: bool
    created_at: datetime

    class Config:
        from_attributes = True
