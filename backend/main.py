from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import pypandoc
import os
import uuid
import re

app = FastAPI()

# Check and install pandoc if missing
try:
    pypandoc.get_pandoc_version()
except OSError:
    print("Pandoc not found. Downloading pandoc binary...")
    pypandoc.download_pandoc()
    print("Pandoc downloaded successfully.")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MarkdownRequest(BaseModel):
    markdown: str

def remove_file(path: str):
    try:
        os.remove(path)
    except Exception:
        pass

@app.post("/convert")
async def convert_markdown(request: MarkdownRequest, background_tasks: BackgroundTasks):
    unique_id = uuid.uuid4()
    input_filename = f"temp_input_{unique_id}.md"
    output_filename = f"temp_output_{unique_id}.docx"
    
    # Preprocess markdown to fix "tight list" issues
    # If a list starts immediately after a paragraph without a newline, Pandoc treats it as text.
    # We insert a blank line if we detect a transition from "Non-List Line" to "List Item Line".
    # Regex Explanation:
    # 1. Look for a non-empty line that does NOT look like a list item.
    #    ^(\s*(?![\*\+\-] |\d+\. ).+)$
    # 2. Followed by a newline.
    # 3. Followed by a line that DOES look like a list item.
    #    ^(\s*([\*\+\-] |\d+\. ).+)$
    
    md_content = request.markdown
    try:
        # Regex to insert \n before lists if missing.
        # Note: We use a simpler approach to catch the boundary:
        # Match a line that doesn't start with a list marker, followed by \n, followed by a list marker.
        # Checks for `* `, `+ `, `- `, `1. `
        
        # Pattern: (Line ending with non-newline)\n(List Marker)
        # But we need to check the START of the first line to ensure it's not a list item itself.
        # It is safer/easier to just replace `\n` with `\n\n` before ANY list item, 
        # but that breaks loose/tight lists preference.
        # Let's try the targeted regex.
        
        pattern = r'(?m)^([ \t]*(?![\*\+\-] |\d+\. ).+)\n([ \t]*(?:[\*\+\-] |\d+\. ).+)'
        # Replace with group1 + \n\n + group2
        md_content = re.sub(pattern, r'\1\n\n\2', md_content)
        
    except Exception as e:
        print(f"Warning: Regex preprocessing failed: {e}")
        # Continue with original content if regex fails unexpectedly
        pass

    try:
        with open(input_filename, "w", encoding="utf-8") as f:
            f.write(md_content)

        # Convert using pypandoc
        # Ensure we use the 'docx' format. 
        # 'markdown+tex_math_dollars' enables $...$ math syntax.
        pypandoc.convert_file(
            input_filename,
            'docx',
            outputfile=output_filename,
            format='markdown+tex_math_dollars+hard_line_breaks',
            extra_args=['--reference-doc=reference.docx'] if os.path.exists('reference.docx') else []
        )
        
        # Clean up input file immediately
        os.remove(input_filename)
        
        # Schedule output file cleanup after response
        background_tasks.add_task(remove_file, output_filename)

        return FileResponse(
            output_filename,
            media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            filename="document.docx"
        )
        
    except Exception as e:
        # Cleanup if error occurs
        if os.path.exists(input_filename):
            os.remove(input_filename)
        if 'output_filename' in locals() and os.path.exists(output_filename):
            os.remove(output_filename)
            
        print(f"Error during conversion: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=4000)
