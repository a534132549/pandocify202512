# Deployment Guide

This project consists of a React Frontend and a Python/FastAPI Backend.

## 1. Backend Deployment (Render.com - **Recommended for Free Tier**)

The backend requires **Pandoc**, which makes standard serverless functions (like Vercel API) difficult to use. We recommend **Render**'s "Web Service" free tier which supports Docker.

### Steps:
1.  **Push** your code to GitHub.
2.  **Sign up** for [Render.com](https://render.com/).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Runtime**: Select **Docker**.
6.  **Region**: Choose one close to you (e.g., Singapore/Oregon).
7.  **Free Tier**: Select "Free".
8.  **Environment Variables**: None strictly required, but you can set `PORT=4000`.
9.  **Deploy**.

Render will build the Docker image (installing Python + Pandoc) and start the server. Copy the **Service URL** (e.g., `https://pandocify-backend.onrender.com`).

---

## 2. Frontend Deployment (Vercel)

Vercel is the best for React/Vite apps.

### Steps:
1.  **Sign up** for [Vercel](https://vercel.com/).
2.  **Add New Project** -> Import your GitHub repo.
3.  **Build Settings**:
    *   **Framework Preset**: Vite
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
4.  **Environment Variables**:
    *   You need to tell the frontend where the backend is.
    *   Add `VITE_API_BASE_URL` = `https://your-render-backend-url.onrender.com` (The URL you got from Step 1).
5.  **Deploy**.

### Minimal Code Change Required
You need to ensure your frontend `App.tsx` or API calls use this environment variable instead of hardcoded `http://localhost:4000`.

**Update `App.tsx` or `api.ts`:**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

// Use API_BASE_URL in your fetch calls
await fetch(`${API_BASE_URL}/convert`, ...);
```
