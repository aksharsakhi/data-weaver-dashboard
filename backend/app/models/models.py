from sqlalchemy import Column, Integer, String, JSON, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from ..core.database import Base

class SessionStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class ExtractionSession(Base):
    __tablename__ = "extraction_sessions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    folder_path = Column(String)
    fields = Column(JSON)  # List of fields to extract
    model_name = Column(String)
    status = Column(Enum(SessionStatus), default=SessionStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    tasks = relationship("ExtractionTask", back_populates="session")
    results = relationship("ExtractionResult", back_populates="session")

class TaskStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class ExtractionTask(Base):
    __tablename__ = "extraction_tasks"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("extraction_sessions.id"))
    folder_name = Column(String)
    status = Column(Enum(TaskStatus), default=TaskStatus.PENDING)
    error_message = Column(String, nullable=True)
    
    session = relationship("ExtractionSession", back_populates="tasks")

class ExtractionResult(Base):
    __tablename__ = "extraction_results"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("extraction_sessions.id"))
    folder_name = Column(String)
    extracted_json = Column(JSON)
    
    session = relationship("ExtractionSession", back_populates="results")
