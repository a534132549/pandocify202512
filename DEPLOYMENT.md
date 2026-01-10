# Deployment Guide / 部署指南

This project consists of a React Frontend and a Python/FastAPI Backend.
本项目由 React 前端和 Python/FastAPI 后端组成。

## 1. Backend Deployment (Render.com) / 后端部署
**Recommended for Free Tier / 推荐使用免费版**

The backend requires **Pandoc**, which makes standard serverless functions (like Vercel API) difficult to use. We recommend **Render**'s "Web Service" free tier which supports Docker.
后端依赖 **Pandoc** 工具，这使得普通的 Serverless 函数（如 Vercel API）难以支持。我们推荐使用 **Render** 的“Web Service”免费版，因为它完美支持 Docker。

### Steps / 步骤:
1.  **Push** your code to GitHub.
    先把您的代码推送到 GitHub。
2.  **Sign up** for [Render.com](https://render.com/).
    注册一个 Render.com 账号。
3.  Click **New +** -> **Web Service**.
    点击右上角的 **New +** 按钮，选择 **Web Service**。
4.  Connect your GitHub repository.
    连接并选择您的 GitHub 仓库。
5.  **Runtime**: Select **Docker**.
    **Runtime**（运行环境）一定要选择 **Docker**。
6.  **Region**: Choose one close to you (e.g., Singapore).
    **Region**（地区）选一个离您近的（例如 Singapore 新加坡）。
7.  **Instance Type**: Select "Free".
    **Instance Type** 选 **Free**（免费版）。
8.  **Environment Variables**: None strictly required, but you can set `PORT=4000`.
    **Environment Variables**（环境变量）不强制，但您可以设置 `PORT=4000`。
9.  **Deploy**.
    点击 **Deploy** 开始部署。

Render will build the Docker image (installing Python + Pandoc) and start the server.
Render 会自动构建 Docker 镜像（安装 Python 和 Pandoc）并启动服务器。

**⚠️ Important / 重要**:
Copy the **Service URL** (e.g., `https://pandocify-backend.onrender.com`) once it's live. You will need it for the frontend.
部署成功后，复制页面左上角的 **Service URL**（例如 `https://...onrender.com`）。配置前端时需要用到它。

---

## 2. Frontend Deployment (Vercel) / 前端部署

Vercel is the best for React/Vite apps.
Vercel 是部署 React/Vite 应用的最佳选择。

### Steps / 步骤:
1.  **Sign up** for [Vercel](https://vercel.com/).
    注册一个 Vercel 账号。
2.  **Add New Project** -> Import your GitHub repo.
    点击 **Add New Project**，导入您的 GitHub 仓库。
3.  **Build Settings**:
    **Build Settings**（构建设置）通常会自动识别，确认如下：
    *   **Framework Preset**: Vite
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
4.  **Environment Variables / 环境变量**:
    *   You need to tell the frontend where the backend is.
        您需要告诉前端后端服务器在哪里。
    *   **Name**: `VITE_API_BASE_URL`
    *   **Value**: `https://your-render-backend-url.onrender.com` (The URL you got from Render / 刚刚在 Render 获得的网址)
5.  **Deploy**.
    点击 **Deploy**。

### Minimal Code Change Required / 必要的代码修改
(Already implemented in the latest code / 最新代码已包含此功能)

Ensure your frontend uses the environment variable:
确保前端代码使用了配置的环境变量（ActionPanel.tsx / services/*.ts）：

```typescript
// services/pandoc.ts
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
```
