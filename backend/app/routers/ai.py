from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import (
    GenerateRequest, FixRequest, ExplainRequest, OptimizeRequest,
    ConvertRequest, AIResponse, ExecuteRequest, ExecuteResponse
)
from app.services.openai_service import (
    generate_code_service, fix_code_service, explain_code_service,
    optimize_code_service, convert_code_service
)
from app.services.executor_service import execute_code
from app.services.history_service import create_history_record

router = APIRouter(prefix="", tags=["AI Tools"])

@router.post("/generate", response_model=AIResponse, summary="Generate Code from Natural Language")
def generate_code(request: GenerateRequest, db: Session = Depends(get_db)):
    try:
        result = generate_code_service(
            prompt=request.prompt,
            language=request.language,
            api_key=request.api_key,
            model=request.model
        )
        # Store in database
        history_item = create_history_record(
            db=db,
            tool_type="generate",
            language=request.language,
            generated_code=result["code"],
            description=result["description"],
            explanation=result["explanation"],
            dependencies=result["dependencies"],
            run_instructions=result["run_instructions"],
            prompt=request.prompt
        )
        return AIResponse(
            code=result["code"],
            description=result["description"],
            explanation=result["explanation"],
            dependencies=result["dependencies"],
            run_instructions=result["run_instructions"],
            language=result["language"],
            history_id=history_item.id,
            is_saved=history_item.is_saved
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating code: {str(e)}"
        )

@router.post("/fix", response_model=AIResponse, summary="Detect and Fix Code Errors")
def fix_code(request: FixRequest, db: Session = Depends(get_db)):
    try:
        result = fix_code_service(
            code=request.code,
            language=request.language,
            error_desc=request.error_description or "",
            api_key=request.api_key,
            model=request.model
        )
        history_item = create_history_record(
            db=db,
            tool_type="fix",
            language=request.language,
            generated_code=result["code"],
            description=result["description"],
            explanation=result["explanation"],
            dependencies=result["dependencies"],
            run_instructions=result["run_instructions"],
            input_code=request.code,
            prompt=request.error_description or "Fix code bugs and issues"
        )
        return AIResponse(
            code=result["code"],
            description=result["description"],
            explanation=result["explanation"],
            dependencies=result["dependencies"],
            run_instructions=result["run_instructions"],
            language=result["language"],
            history_id=history_item.id,
            is_saved=history_item.is_saved
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fixing code: {str(e)}"
        )

@router.post("/explain", response_model=AIResponse, summary="Explain Code")
def explain_code(request: ExplainRequest, db: Session = Depends(get_db)):
    try:
        result = explain_code_service(
            code=request.code,
            language=request.language,
            api_key=request.api_key,
            model=request.model
        )
        history_item = create_history_record(
            db=db,
            tool_type="explain",
            language=request.language,
            generated_code=result["code"],
            description=result["description"],
            explanation=result["explanation"],
            dependencies=result["dependencies"],
            run_instructions=result["run_instructions"],
            input_code=request.code,
            prompt="Explain code structure and logic"
        )
        return AIResponse(
            code=result["code"],
            description=result["description"],
            explanation=result["explanation"],
            dependencies=result["dependencies"],
            run_instructions=result["run_instructions"],
            language=result["language"],
            history_id=history_item.id,
            is_saved=history_item.is_saved
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error explaining code: {str(e)}"
        )

@router.post("/optimize", response_model=AIResponse, summary="Optimize Code")
def optimize_code(request: OptimizeRequest, db: Session = Depends(get_db)):
    try:
        result = optimize_code_service(
            code=request.code,
            language=request.language,
            api_key=request.api_key,
            model=request.model
        )
        history_item = create_history_record(
            db=db,
            tool_type="optimize",
            language=request.language,
            generated_code=result["code"],
            description=result["description"],
            explanation=result["explanation"],
            dependencies=result["dependencies"],
            run_instructions=result["run_instructions"],
            input_code=request.code,
            prompt="Optimize code performance and readability"
        )
        return AIResponse(
            code=result["code"],
            description=result["description"],
            explanation=result["explanation"],
            dependencies=result["dependencies"],
            run_instructions=result["run_instructions"],
            language=result["language"],
            history_id=history_item.id,
            is_saved=history_item.is_saved
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error optimizing code: {str(e)}"
        )

@router.post("/convert", response_model=AIResponse, summary="Convert Code Between Languages")
def convert_code(request: ConvertRequest, db: Session = Depends(get_db)):
    try:
        result = convert_code_service(
            code=request.code,
            source_lang=request.source_language,
            target_lang=request.target_language,
            api_key=request.api_key,
            model=request.model
        )
        history_item = create_history_record(
            db=db,
            tool_type="convert",
            language=request.target_language,
            target_language=request.target_language,
            generated_code=result["code"],
            description=result["description"],
            explanation=result["explanation"],
            dependencies=result["dependencies"],
            run_instructions=result["run_instructions"],
            input_code=request.code,
            prompt=f"Convert from {request.source_language} to {request.target_language}"
        )
        return AIResponse(
            code=result["code"],
            description=result["description"],
            explanation=result["explanation"],
            dependencies=result["dependencies"],
            run_instructions=result["run_instructions"],
            language=result["language"],
            history_id=history_item.id,
            is_saved=history_item.is_saved
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error converting code: {str(e)}"
        )

@router.post("/execute", response_model=ExecuteResponse, summary="Execute Code and Return Output")
def execute(request: ExecuteRequest):
    try:
        res = execute_code(request.code, request.language)
        return ExecuteResponse(
            output=res["output"],
            error=res["error"],
            execution_time_ms=res["execution_time_ms"],
            status=res["status"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Execution error: {str(e)}"
        )

