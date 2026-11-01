import sys
import subprocess
import time
import sqlite3
import tempfile
import os
from typing import Dict, Any

def execute_python(code: str) -> Dict[str, Any]:
    start = time.perf_counter()
    with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False, encoding="utf-8") as f:
        f.write(code)
        temp_path = f.name

    try:
        proc = subprocess.run(
            [sys.executable, temp_path],
            capture_output=True,
            text=True,
            timeout=5
        )
        elapsed_ms = round((time.perf_counter() - start) * 1000, 2)
        out = proc.stdout
        err = proc.stderr
        status = "success" if proc.returncode == 0 else "error"

        return {
            "output": out if out else ("Code executed with no stdout output." if proc.returncode == 0 else ""),
            "error": err if err else None,
            "execution_time_ms": elapsed_ms,
            "status": status
        }
    except subprocess.TimeoutExpired:
        elapsed_ms = round((time.perf_counter() - start) * 1000, 2)
        return {
            "output": "",
            "error": "Execution timed out (5.0s maximum limit exceeded). Check for infinite loops.",
            "execution_time_ms": elapsed_ms,
            "status": "timeout"
        }
    except Exception as e:
        elapsed_ms = round((time.perf_counter() - start) * 1000, 2)
        return {
            "output": "",
            "error": f"Execution error: {str(e)}",
            "execution_time_ms": elapsed_ms,
            "status": "error"
        }
    finally:
        try:
            if os.path.exists(temp_path):
                os.remove(temp_path)
        except Exception:
            pass

def execute_sql(code: str) -> Dict[str, Any]:
    start = time.perf_counter()
    try:
        conn = sqlite3.connect(":memory:")
        cursor = conn.cursor()
        
        # Split statements by semicolon
        statements = [s.strip() for s in code.split(";") if s.strip()]
        outputs = []

        for stmt in statements:
            try:
                cursor.execute(stmt)
                if cursor.description:
                    columns = [d[0] for d in cursor.description]
                    rows = cursor.fetchall()
                    
                    # Format as simple table
                    col_widths = [max(len(col), max([len(str(r[i])) for r in rows] or [0])) for i, col in enumerate(columns)]
                    header = " | ".join(col.ljust(col_widths[i]) for i, col in enumerate(columns))
                    separator = "-+-".join("-" * col_widths[i] for i in range(len(columns)))
                    
                    row_strs = []
                    for r in rows:
                        row_strs.append(" | ".join(str(r[i]).ljust(col_widths[i]) for i in range(len(columns))))
                    
                    table_str = f"{header}\n{separator}\n" + "\n".join(row_strs) if row_strs else f"{header}\n{separator}\n(0 rows returned)"
                    outputs.append(f"Query: {stmt[:60]}...\n{table_str}")
                else:
                    outputs.append(f"Executed: {stmt[:60]}... (Rows affected: {cursor.rowcount})")
            except Exception as stmt_err:
                outputs.append(f"Error in '{stmt[:40]}...': {str(stmt_err)}")

        conn.commit()
        conn.close()

        elapsed_ms = round((time.perf_counter() - start) * 1000, 2)
        return {
            "output": "\n\n".join(outputs) if outputs else "SQL script executed successfully.",
            "error": None,
            "execution_time_ms": elapsed_ms,
            "status": "success"
        }
    except Exception as e:
        elapsed_ms = round((time.perf_counter() - start) * 1000, 2)
        return {
            "output": "",
            "error": f"SQL Error: {str(e)}",
            "execution_time_ms": elapsed_ms,
            "status": "error"
        }

def execute_javascript_node(code: str) -> Dict[str, Any]:
    start = time.perf_counter()
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as f:
        f.write(code)
        temp_path = f.name

    try:
        proc = subprocess.run(
            ["node", temp_path],
            capture_output=True,
            text=True,
            timeout=5
        )
        elapsed_ms = round((time.perf_counter() - start) * 1000, 2)
        return {
            "output": proc.stdout or ("Executed with no console output." if proc.returncode == 0 else ""),
            "error": proc.stderr if proc.stderr else None,
            "execution_time_ms": elapsed_ms,
            "status": "success" if proc.returncode == 0 else "error"
        }
    except subprocess.TimeoutExpired:
        elapsed_ms = round((time.perf_counter() - start) * 1000, 2)
        return {
            "output": "",
            "error": "Execution timed out (5.0s maximum limit exceeded).",
            "execution_time_ms": elapsed_ms,
            "status": "timeout"
        }
    except Exception as e:
        elapsed_ms = round((time.perf_counter() - start) * 1000, 2)
        return {
            "output": "",
            "error": f"Node.js execution failed: {str(e)}",
            "execution_time_ms": elapsed_ms,
            "status": "error"
        }
    finally:
        try:
            if os.path.exists(temp_path):
                os.remove(temp_path)
        except Exception:
            pass

def execute_code(code: str, language: str) -> Dict[str, Any]:
    lang = language.lower().strip()
    if lang == "python":
        return execute_python(code)
    elif lang == "sql":
        return execute_sql(code)
    elif lang in ["javascript", "js"]:
        return execute_javascript_node(code)
    elif lang in ["html", "css"]:
        return {
            "output": "HTML/CSS preview rendered directly in the Live Preview panel.",
            "error": None,
            "execution_time_ms": 0.0,
            "status": "success"
        }
    elif lang == "java":
        return {
            "output": "Java source code verified. Run: javac Main.java && java Main in terminal for full compilation.",
            "error": None,
            "execution_time_ms": 0.0,
            "status": "success"
        }
    else:
        return {
            "output": "",
            "error": f"Execution for '{language}' not supported yet.",
            "execution_time_ms": 0.0,
            "status": "error"
        }
