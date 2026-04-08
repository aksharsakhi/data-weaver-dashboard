from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class SessionBase(BaseModel):
    name: str
    folder_path: str
    fields: List[str]
    model_name: str

class SessionCreate(SessionBase):
    pass

class SessionOut(SessionBase):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class TaskOut(BaseModel):
    id: int
    folder_name: str
    status: str
    error_message: Optional[str]

    class Config:
        from_attributes = True

class ExtractionResultOut(BaseModel):
    id: int
    folder_name: str
    extracted_json: Dict[str, Any]

    class Config:
        from_attributes = True

class ProgressStatus(BaseModel):
    id: int
    name: str
    status: str
    total_tasks: int
    completed_tasks: int
    failed_tasks: int
    logs: List[str]
