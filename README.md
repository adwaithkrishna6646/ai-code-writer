# CodeAI – AI-Powered Code Generator & Developer Studio

CodeAI is a full-stack, responsive AI Code Generator web application designed as an intelligent coding assistant. It converts natural language instructions into functional, production-grade code using Large Language Models (LLMs) and provides professional developer tools including an integrated Monaco Editor, step-by-step logic explanations, dependency tracking, code optimization, conversion, bug fixing, and persistent SQLite history.

---

## 🌟 Key Features

### 1. 🤖 5 AI Coding Tools
- **Generate Code**: Convert natural language descriptions into complete, functional, type-annotated code.
- **Fix Code**: Automatically detect syntax errors, runtime issues, and edge cases, applying precise fixes.
- **Explain Code**: Break down complicated algorithms into step-by-step logic explanations and complexity insights.
- **Optimize Code**: Improve algorithmic efficiency, eliminate redundant loops, and enhance readability.
- **Convert Code**: Translate code seamlessly between supported programming languages while adapting to native language paradigms.

### 2. 💻 Advanced Monaco Code Editor
- **Full VS Code Experience**: Real-time syntax highlighting for all supported languages.
- **Developer Features**: Line numbers, automatic indentation, bracket matching, and auto-formatting.
- **Action Toolbar**: Instant one-click copy, download with correct file extension (e.g., `.py`, `.js`, `.html`, `.css`, `.java`, `.sql`), fullscreen toggle, and regeneration.

### 3. 🔍 Deep Code Insights & Execution Guidance
- **Description & Architecture**: Summary of design choices and modules used.
- **Step-by-Step Breakdown**: Numbered steps explaining internal logic flow.
- **Dependencies & Packages**: Exact required libraries (e.g., `fastapi`, `lucide-react`).
- **How to Run**: Ready-to-copy terminal commands and execution instructions.

### 4. 🗄️ Code Management & History
- **SQLite Database with SQLAlchemy ORM**: Automatically saves all generations and conversions.
- **Search & Filters**: Search previous queries and code snippets by keyword, language, or tool type.
- **Bookmarking**: Star and favorite snippets to access them anytime.
- **Restore & Edit**: Load any past snippet back into Monaco editor with one click.

### 5. 🎨 Modern Developer UI
- **VS Code Aesthetic**: Dark theme by default with seamless toggle to light mode.
- **Vibrant Accents**: Purple and blue gradient highlights with glassmorphic cards.
- **Responsive Studio**: Two-column layout on desktops, stacked on tablets and phones.
- **Smart AI Engine & Fallback**: Works immediately out-of-the-box with built-in intelligent code generators even before an OpenAI key is set, and connects directly to OpenAI models (`gpt-4o-mini`, `gpt-4o`, `gpt-3.5-turbo`) when an API key is provided.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Monaco Editor (`@monaco-editor/react`), Lucide React |
| **Backend** | Python 3.10+, FastAPI, Pydantic v2, Uvicorn, SQLAlchemy |
| **Artificial Intelligence** | OpenAI API (`gpt-4o-mini`, `gpt-4o`, `gpt-3.5-turbo`), Prompt Engineering, Structured JSON Mode |
| **Database & Storage** | SQLite (`codeai.db`), LocalStorage (user preferences & custom key override) |

---

## 🌐 Supported Programming Languages

| Language | Monaco Identifier | File Extension | Default File |
|---|---|---|---|
| **Python** | `python` | `.py` | `main.py` |
| **JavaScript** | `javascript` | `.js` | `index.js` |
| **HTML** | `html` | `.html` | `index.html` |
| **CSS** | `css` | `.css` | `styles.css` |
| **Java** | `java` | `.java` | `Main.java` |
| **SQL** | `sql` | `.sql` | `query.sql` |

---

## 📁 Project Structure

```
ai-chatbot/
├── backend/
│   ├── app/
│   │   ├── config.py             # Environment settings & Pydantic config
│   │   ├── database.py           # SQLite SQLAlchemy engine & session factory
│   │   ├── models.py             # CodeHistoryItem database model
│   │   ├── schemas.py            # Pydantic request & response schemas
│   │   ├── services/
│   │   │   ├── openai_service.py # OpenAI prompt engineering & smart fallback
│   │   │   └── history_service.py# Database CRUD operations
│   │   ├── routers/
│   │   │   ├── ai.py             # AI endpoints (generate, fix, explain, optimize, convert)
│   │   │   └── history.py        # History, save, favorite, and delete endpoints
│   │   └── main.py               # FastAPI application setup & CORS
│   ├── requirements.txt
│   ├── .env.example
│   └── run.py                    # Server startup script
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx        # Navigation, theme toggle, and status badges
│   │   │   ├── ToolSelector.tsx  # 5 AI tools tab selector
│   │   │   ├── PromptSection.tsx # Language selector & prompt input box
│   │   │   ├── CodeEditorSection.tsx # Monaco editor & toolbar actions
│   │   │   ├── ExplanationPanel.tsx  # Breakdown, dependencies & run instructions
│   │   │   ├── HistoryDrawer.tsx     # Past generation history drawer
│   │   │   ├── SavedSnippetsModal.tsx# Bookmarked snippets modal
│   │   │   └── SettingsModal.tsx     # Model selection & API key config
│   │   ├── context/
│   │   │   └── ThemeContext.tsx  # Dark / Light theme provider
│   │   ├── services/
│   │   │   └── api.ts            # REST client for backend API
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript interfaces
│   │   ├── App.tsx               # Studio main application component
│   │   └── main.tsx              # React DOM entry point
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18 or higher (v20+ recommended)
- **Python**: v3.10 or higher
- **npm** (included with Node.js)

---

### Step 1: Set Up Backend

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. (Optional but recommended) Create a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Linux / macOS:
   source venv/bin/activate
   ```

3. Install required dependencies:
   ```bash
   python -m pip install -r requirements.txt
   ```

4. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your OpenAI API key to `.env` (optional; if left blank, CodeAI operates in smart offline engine mode):
   ```env
   OPENAI_API_KEY=sk-your-openai-api-key-here
   OPENAI_MODEL=gpt-4o-mini
   DATABASE_URL=sqlite:///./codeai.db
   ```

5. Launch the FastAPI server:
   ```bash
   python run.py
   ```
   *The backend will be running at:* `http://127.0.0.1:8000`  
   *Interactive Swagger API documentation:* `http://127.0.0.1:8000/docs`

---

### Step 2: Set Up Frontend

1. In a new terminal window, navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend dashboard will be available at:* `http://localhost:5173`

---

## 📡 Backend API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/generate` | Generates functional code from natural language prompt |
| `POST` | `/api/fix` | Detects syntax and logical errors in provided code and applies fixes |
| `POST` | `/api/explain` | Analyzes code structure and returns step-by-step breakdown |
| `POST` | `/api/optimize` | Optimizes code for performance, memory, and readability |
| `POST` | `/api/convert` | Translates code from source language to target language |
| `GET` | `/api/history` | Fetches generation history with text search and language filters |
| `POST` | `/api/save` | Saves or bookmarks a code snippet |
| `PUT` | `/api/history/{id}/favorite` | Toggles favorite status of a snippet |
| `DELETE` | `/api/history/{id}` | Deletes a snippet from history |
| `GET` | `/api/health` | Service health status and OpenAI configuration status |

---

## 🔒 Security & Best Practices

- **API Key Security**: The backend never exposes the OpenAI API key to client browsers.
- **Client Key Override**: Users can optionally supply a custom API key via the Settings modal; this key is kept exclusively in browser memory and passed directly via secure request headers/payload.
- **No Code Execution on Server**: Generated code is parsed and highlighted safely; arbitrary code execution on the server is prohibited.
- **Input Validation**: All requests are validated using strict Pydantic v2 schemas.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
