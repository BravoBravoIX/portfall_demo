FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt* ./

# Install Python dependencies
RUN pip install --no-cache-dir paho-mqtt PyYAML

# Copy agent source code
COPY . .

# Run agent.py when container starts
CMD ["python", "agent.py"]