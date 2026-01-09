# Pandocify

A professional Markdown to Word converter with live LaTeX preview.

## Architecture

This project is split into two parts:
1. **Frontend**: React + Tailwind + TypeScript (The UI)
2. **Backend**: Python FastAPI + Pypandoc (The Logic)

## Prerequisites

- Node.js 18+
- Python 3.9+
- **Pandoc** (Critical System Dependency)

### How to Install Pandoc

The backend requires the `pandoc` binary to be installed on the system.

- **macOS**: `brew install pandoc`
- **Windows**: `winget install JohnMacFarlane.Pandoc` or download installer from [pandoc.org](https://pandoc.org)
- **Linux (Ubuntu/Debian)**: `sudo apt-get install pandoc`

## Running the Application

### 1. Start the Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```
The server will start at `http://localhost:8000`.

### 2. Start the Frontend

In a separate terminal root directory:

```bash
npm install
npm start
```
The UI will run at `http://localhost:3000`.

## Docker Usage

To run the backend without manually installing Pandoc:

```bash
cd backend
docker build -t pandoc-api .
docker run -p 8000:8000 pandoc-api
```
