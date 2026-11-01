from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from datetime import datetime
from app.database import Base

class CodeHistoryItem(Base):
    __tablename__ = "code_history"

    id = Column(Integer, primary_key=True, index=True)
    tool_type = Column(String(50), nullable=False, index=True) # generate, fix, explain, optimize, convert
    title = Column(String(255), nullable=True)
    prompt = Column(Text, nullable=True)
    language = Column(String(50), nullable=False, index=True)
    target_language = Column(String(50), nullable=True)
    input_code = Column(Text, nullable=True)
    generated_code = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    explanation = Column(Text, nullable=True) # JSON or markdown string
    dependencies = Column(Text, nullable=True) # JSON list or string
    run_instructions = Column(Text, nullable=True)
    is_saved = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
