import asyncio
from ..models.models import ExtractionSession, ExtractionTask, ExtractionResult, TaskStatus, SessionStatus
from ..core.database import AsyncSessionLocal
from sqlalchemy import select, update
from ..services.extraction_service import ExtractionService
from ..services.llm_service import OllamaProvider, OpenAICompatibleProvider
from ..core.config import settings
import os

async def process_subfolder_background(subfolder_path, session_id, task_id, fields, model_name, api_key):
    async with AsyncSessionLocal() as db:
        # Update status to processing
        await db.execute(
            update(ExtractionTask)
            .where(ExtractionTask.id == task_id)
            .values(status=TaskStatus.PROCESSING)
        )
        await db.commit()

        try:
            # Determine provider
            if api_key:
                provider = OpenAICompatibleProvider(api_key=api_key, model=model_name)
            else:
                provider = OllamaProvider(base_url=settings.OLLAMA_BASE_URL, model=model_name)
            
            result = await ExtractionService.process_subfolder(subfolder_path, fields, provider)
            
            # Save result to DB
            folder_name = os.path.basename(subfolder_path)
            new_result = ExtractionResult(
                session_id=session_id,
                folder_name=folder_name,
                extracted_json=result
            )
            db.add(new_result)
            
            # Update task status to completed
            await db.execute(
                update(ExtractionTask)
                .where(ExtractionTask.id == task_id)
                .values(status=TaskStatus.COMPLETED)
            )
            await db.commit()
            
            # Check if all tasks for this session are done
            await _check_and_update_session_status(db, session_id)
            
            return {"status": "success", "folder": folder_name}
            
        except Exception as e:
            # Update task status to failed
            await db.execute(
                update(ExtractionTask)
                .where(ExtractionTask.id == task_id)
                .values(status=TaskStatus.FAILED, error_message=str(e))
            )
            await db.commit()
            
            await _check_and_update_session_status(db, session_id)
            return {"status": "failed", "error": str(e), "folder": os.path.basename(subfolder_path)}

async def _check_and_update_session_status(db, session_id):
    # Fetch all tasks for this session
    result = await db.execute(
        select(ExtractionTask).where(ExtractionTask.session_id == session_id)
    )
    tasks = result.scalars().all()
    
    all_done = all(t.status in [TaskStatus.COMPLETED, TaskStatus.FAILED] for t in tasks)
    
    if all_done:
        await db.execute(
            update(ExtractionSession)
            .where(ExtractionSession.id == session_id)
            .values(status=SessionStatus.COMPLETED)
        )
        await db.commit()
