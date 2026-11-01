import urllib.request
import json

BASE_URL = "http://127.0.0.1:8000/api"

def make_request(path, method="GET", data=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    body = json.dumps(data).encode("utf-8") if data is not None else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

def run_tests():
    print("Testing /api/health...")
    health = make_request("/health")
    print(" Health:", health)
    assert health["status"] == "healthy"

    print("\nTesting POST /api/generate (Python)...")
    gen_py = make_request("/generate", "POST", {
        "prompt": "Create a FastAPI REST API for item management",
        "language": "python"
    })
    print(" Generate status: OK, received code length:", len(gen_py["code"]), "description:", gen_py["description"][:60])
    assert "code" in gen_py and len(gen_py["code"]) > 0
    history_id = gen_py["history_id"]

    print("\nTesting POST /api/generate (JavaScript)...")
    gen_js = make_request("/generate", "POST", {
        "prompt": "Async task queue scheduler",
        "language": "javascript"
    })
    print(" Generate JS status: OK, code length:", len(gen_js["code"]))
    assert "code" in gen_js and len(gen_js["code"]) > 0

    print("\nTesting POST /api/fix...")
    fix_res = make_request("/fix", "POST", {
        "code": "if x == 5\n    print('hello')",
        "language": "python",
        "error_description": "SyntaxError: expected ':'"
    })
    print(" Fix status: OK, fixed code:\n", fix_res["code"])
    assert ":" in fix_res["code"]

    print("\nTesting POST /api/explain...")
    explain_res = make_request("/explain", "POST", {
        "code": "def fib(n):\n    return n if n <= 1 else fib(n-1) + fib(n-2)",
        "language": "python"
    })
    print(" Explain status: OK, steps count:", len(explain_res["explanation"]))
    assert len(explain_res["explanation"]) > 0

    print("\nTesting POST /api/optimize...")
    opt_res = make_request("/optimize", "POST", {
        "code": "result = []\nfor i in range(100):\n    result.append(i * 2)",
        "language": "python"
    })
    print(" Optimize status: OK, description:", opt_res["description"])
    assert "code" in opt_res

    print("\nTesting POST /api/convert...")
    conv_res = make_request("/convert", "POST", {
        "code": "console.log('hello world');",
        "source_language": "javascript",
        "target_language": "python"
    })
    print(" Convert status: OK, target language:", conv_res["language"])
    assert conv_res["language"] == "python"

    print("\nTesting GET /api/history...")
    history = make_request("/history")
    print(f" History count: {len(history)} items")
    assert len(history) >= 1

    print(f"\nTesting PUT /api/history/{history_id}/favorite...")
    fav = make_request(f"/history/{history_id}/favorite", "PUT", {"is_saved": True})
    print(" Favorite status:", fav["is_saved"])
    assert fav["is_saved"] == True

    print("\nTesting POST /api/save (new snippet)...")
    saved_snippet = make_request("/save", "POST", {
        "title": "Quick Sort Algorithm",
        "language": "python",
        "code": "def quicksort(arr): return arr",
        "description": "Standard sorting implementation"
    })
    print(" Saved snippet ID:", saved_snippet["id"], "Title:", saved_snippet["title"])
    assert saved_snippet["is_saved"] == True

    print(f"\nTesting DELETE /api/history/{saved_snippet['id']}...")
    del_res = make_request(f"/history/{saved_snippet['id']}", "DELETE")
    print(" Delete result:", del_res)

    print("\nTesting POST /api/execute (Python)...")
    exec_res = make_request("/execute", "POST", {
        "code": "print('CodeAI execution test successful')",
        "language": "python"
    })
    print(" Exec status:", exec_res["status"], "output:", exec_res["output"].strip())
    assert exec_res["status"] == "success"
    assert "CodeAI execution test successful" in exec_res["output"]

    print("\n All backend endpoint tests passed successfully!")

if __name__ == "__main__":
    run_tests()
