from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Dict, Any
import os
import pandas as pd
from io import BytesIO
from fastapi.responses import StreamingResponse

from ..core.database import get_db
from ..models.models import ExtractionSession, ExtractionTask, ExtractionResult, SessionStatus, TaskStatus
from ..models.schemas import SessionCreate, SessionOut, ProgressStatus, ExtractionResultOut
from ..worker.tasks import process_subfolder_background
import httpx

router = APIRouter()

@router.post("/start", response_model=SessionOut)
async def start_session(
    session_data: SessionCreate,
    background_tasks: BackgroundTasks,
    api_key: str = None, # Optional API key passed from header or query
    db: AsyncSession = Depends(get_db)
):
    if not os.path.exists(session_data.folder_path):
        raise HTTPException(status_code=400, detail="Folder path does not exist on the server.")

    # Create session
    new_session = ExtractionSession(
        name=session_data.name,
        folder_path=session_data.folder_path,
        fields=session_data.fields,
        model_name=session_data.model_name,
        status=SessionStatus.PROCESSING
    )
    db.add(new_session)
    await db.flush()
    
    # Identify subfolders (each subfolder is one entity)
    subfolders = [
        os.path.join(session_data.folder_path, d)
        for d in os.listdir(session_data.folder_path)
        if os.path.isdir(os.path.join(session_data.folder_path, d))
    ]
    
    if not subfolders:
        raise HTTPException(status_code=400, detail="No subfolders found in the provided root folder.")

    # Create tasks and dispatch to Celery
    for subfolder in subfolders:
        folder_name = os.path.basename(subfolder)
        new_task = ExtractionTask(
            session_id=new_session.id,
            folder_name=folder_name,
            status=TaskStatus.PENDING
        )
        db.add(new_task)
        await db.flush()
        
        # Dispatch FastAPI background task instead of Celery for seamless Desktop execution
        background_tasks.add_task(
            process_subfolder_background,
            subfolder,
            new_session.id,
            new_task.id,
            session_data.fields,
            session_data.model_name,
            api_key
        )
    
    await db.commit()
    await db.refresh(new_session)
    return new_session

@router.get("/{session_id}/status", response_model=ProgressStatus)
async def get_session_status(session_id: int, db: AsyncSession = Depends(get_db)):
    session_res = await db.execute(select(ExtractionSession).where(ExtractionSession.id == session_id))
    session = session_res.scalars().one_or_none()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    tasks_res = await db.execute(select(ExtractionTask).where(ExtractionTask.session_id == session_id))
    tasks = tasks_res.scalars().all()
    
    total = len(tasks)
    completed = sum(1 for t in tasks if t.status == TaskStatus.COMPLETED)
    failed = sum(1 for t in tasks if t.status == TaskStatus.FAILED)
    
    # Logs could be recent error messages or general status updates
    logs = [f"Task {t.folder_name}: {t.status}" for t in tasks if t.error_message]
    
    return {
        "id": session.id,
        "name": session.name,
        "status": session.status,
        "total_tasks": total,
        "completed_tasks": completed,
        "failed_tasks": failed,
        "logs": logs[-10:] # Last 10 errors/logs
    }

@router.get("/{session_id}/results", response_model=List[ExtractionResultOut])
async def get_session_results(session_id: int, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(ExtractionResult).where(ExtractionResult.session_id == session_id))
    return res.scalars().all()

@router.get("/{session_id}/download")
async def download_excel(session_id: int, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(ExtractionResult).where(ExtractionResult.session_id == session_id))
    results = res.scalars().all()
    
    if not results:
        raise HTTPException(status_code=404, detail="No results found for this session.")
    
    # Flatten the results into a dataframe
    data = []
    for r in results:
        row = {"Folder": r.folder_name}
        row.update(r.extracted_json)
        data.append(row)
    
    df = pd.DataFrame(data)
    
    output = BytesIO()
    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="Extracted Data")
    
    output.seek(0)
    
    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename=results_session_{session_id}.xlsx"}
    )

@router.get("/models")
async def get_local_models():
    """Fetch locally installed AI models from Ollama."""
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            response = await client.get(f"{settings.OLLAMA_BASE_URL}/api/tags")
            if response.status_code == 200:
                data = response.json()
                models = [m["name"] for m in data.get("models", [])]
                return {"models": models}
    except Exception:
        pass # Ollama offline or not installed
    
    return {"models": []}

