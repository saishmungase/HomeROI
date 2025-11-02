FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy all project files
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 7860 (Hugging Face Spaces default)
EXPOSE 7860

# Run the application with gunicorn
CMD ["gunicorn", "--workers", "1", "--timeout", "300", "-k", "uvicorn.workers.UvicornWorker", "main:app", "--bind", "0.0.0.0:7860"]