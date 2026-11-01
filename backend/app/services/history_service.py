import json
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.models import CodeHistoryItem

def create_history_record(
    db: Session,
    tool_type: str,
    language: str,
    generated_code: str,
    description: Optional[str] = None,
    explanation: Optional[List[str]] = None,
    dependencies: Optional[List[str]] = None,
    run_instructions: Optional[str] = None,
    prompt: Optional[str] = None,
    input_code: Optional[str] = None,
    target_language: Optional[str] = None,
    title: Optional[str] = None,
    is_saved: bool = False
) -> CodeHistoryItem:
    # Auto-generate a title if missing
    if not title:
        if prompt:
            title = prompt[:50] + ("..." if len(prompt) > 50 else "")
        else:
            title = f"{tool_type.capitalize()} {language.capitalize()}"

    item = CodeHistoryItem(
        tool_type=tool_type,
        title=title,
        prompt=prompt,
        language=language,
        target_language=target_language,
        input_code=input_code,
        generated_code=generated_code,
        description=description,
        explanation=json.dumps(explanation or []),
        dependencies=json.dumps(dependencies or []),
        run_instructions=run_instructions,
        is_saved=is_saved,
        created_at=datetime.utcnow()
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

def get_history_items(
    db: Session,
    query: Optional[str] = None,
    tool_type: Optional[str] = None,
    language: Optional[str] = None,
    is_saved_only: bool = False,
    limit: int = 50,
    offset: int = 0
) -> List[CodeHistoryItem]:
    stmt = db.query(CodeHistoryItem)

    if is_saved_only:
        stmt = stmt.filter(CodeHistoryItem.is_saved == True)

    if tool_type:
        stmt = stmt.filter(CodeHistoryItem.tool_type == tool_type)

    if language:
        stmt = stmt.filter(CodeHistoryItem.language.ilike(f"%{language}%"))

    if query and query.strip():
        search = f"%{query.strip()}%"
        stmt = stmt.filter(
            (CodeHistoryItem.prompt.ilike(search)) |
            (CodeHistoryItem.title.ilike(search)) |
            (CodeHistoryItem.generated_code.ilike(search)) |
            (CodeHistoryItem.description.ilike(search))
        )

    return stmt.order_by(CodeHistoryItem.created_at.desc()).offset(offset).limit(limit).all()

def get_history_item_by_id(db: Session, item_id: int) -> Optional[CodeHistoryItem]:
    return db.query(CodeHistoryItem).filter(CodeHistoryItem.id == item_id).first()

def toggle_favorite_status(db: Session, item_id: int, is_saved: bool) -> Optional[CodeHistoryItem]:
    item = get_history_item_by_id(db, item_id)
    if not item:
        return None
    item.is_saved = is_saved
    db.commit()
    db.refresh(item)
    return item

def delete_history_item(db: Session, item_id: int) -> bool:
    item = get_history_item_by_id(db, item_id)
    if not item:
        return False
    db.delete(item)
    db.commit()
    return True
