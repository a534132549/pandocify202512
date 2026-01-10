# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Install system dependencies including Pandoc
# We install pandoc directly from apt to ensure stability, or download a specific version if needed.
# Debian slim images need update before install.
RUN apt-get update && apt-get install -y \
    pandoc \
    texlive-latex-base \
    texlive-fonts-recommended \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the backend requirements file first to leverage Docker cache
COPY backend/requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code
COPY backend/ ./backend/
# Copy the generated reference doc if it exists (or generate it in build)
COPY reference.docx .

# Make port 4000 available to the world outside this container
EXPOSE 4000

# Define environment variable
ENV PORT=4000

# Run main.py when the container launches
CMD ["python", "backend/main.py"]
