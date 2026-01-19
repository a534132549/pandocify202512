import { ConvertResponse } from '../types';

// Use environment variable for production, or relative path (proxy) for dev
const API_URL = import.meta.env.VITE_API_BASE_URL || '';

const cleanMarkdownForExport = (text: string): string => {
  // Remove citation markers like [cite_start] and [cite: 123]
  return text.replace(/\[cite_start\]|\[cite:\s*\d+\]/g, '');
};


export const wakeUpBackend = async (): Promise<void> => {
  try {
    console.log("Pinging backend to wake up...");
    // Fire and forget - just to wake up the Render instance
    fetch(`${API_URL}/health`, { method: 'GET' }).catch(err => console.debug("Wake-up ping silent fail:", err));
  } catch (e) {
    // Ignore errors for wake-up ping
  }
};

export const convertMarkdownToDocx = async (markdown: string): Promise<ConvertResponse> => {
  try {
    const cleanedMarkdown = cleanMarkdownForExport(markdown);

    const response = await fetch(`${API_URL}/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ markdown: cleanedMarkdown }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    // Get the blob from response
    const blob = await response.blob();

    // Create a temporary URL to trigger download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `document_${Date.now()}.docx`);
    document.body.appendChild(link);
    link.click();

    // Cleanup
    link.remove();
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error('Conversion failed:', error);

    // Fallback for demo purposes (development only)
    if (process.env.NODE_ENV === 'development') {
      console.warn("Backend unreachable. Mocking success for UI demo.");
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        success: false,
        error: "Backend disconnected. Please run the Python server (backend/main.py)."
      };
    }

    return { success: false, error: "Connection failed. Is the Python backend running on port 8000?" };
  }
};