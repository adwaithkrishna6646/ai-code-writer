from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas import (
    HistoryItemResponse, SaveSnippetRequest, ToggleFavoriteRequest
)
from app.services.history_service import (
    get_history_items, create_history_record, toggle_favorite_status,
    delete_history_item, get_history_item_by_id
)

router = APIRouter(prefix="", tags=["History & Snippets"])

@router.get("/history", response_model=List[HistoryItemResponse], summary="Retrieve generation history")
def get_history(
    q: Optional[str] = Query(None, description="Search query across title, prompt, description, and code"),
    tool_type: Optional[str] = Query(None, description="Filter by tool type: generate, fix, explain, optimize, convert"),
    language: Optional[str] = Query(None, description="Filter by language"),
    saved_only: bool = Query(False, description="Filter only favorited/saved snippets"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    items = get_history_items(
        db=db,
        query=q,
        tool_type=tool_type,
        language=language,
        is_saved_only=saved_only,
        limit=limit,
        offset=offset
    )
    return items

@router.post("/save", response_model=HistoryItemResponse, summary="Save or favorite code snippet")
def save_snippet(payload: SaveSnippetRequest, db: Session = Depends(get_db)):
    # If history_id is provided, mark that record as saved
    if payload.history_id:
        existing = toggle_favorite_status(db, payload.history_id, is_saved=True)
        if existing:
            return existing

    # Otherwise create a new saved snippet record
    record = create_history_record(
        db=db,
        tool_type=payload.tool_type or "saved",
        language=payload.language,
        generated_code=payload.code,
        description=payload.description or "User saved snippet",
        explanation=payload.explanation or [],
        dependencies=payload.dependencies or [],
        run_instructions=payload.run_instructions or "",
        title=payload.title,
        is_saved=True
    )
    return record

@router.put("/history/{item_id}/favorite", response_model=HistoryItemResponse, summary="Toggle snippet favorite")
def toggle_favorite(item_id: int, payload: ToggleFavoriteRequest, db: Session = Depends(get_db)):
    item = toggle_favorite_status(db, item_id, payload.is_saved)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"History item {item_id} not found"
        )
    return item

@router.delete("/history/{item_id}", status_code=status.HTTP_200_OK, summary="Delete history snippet")
def delete_history(item_id: int, db: Session = Depends(get_db)):
    success = delete_history_item(db, item_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"History item {item_id} not found"
        )
    return {"message": f"Snippet {item_id} successfully deleted", "id": item_id}
