FROM python:3.9

USER root

# Install system dependencies for Jupyter and common scientific packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    fonts-dejavu \
    tzdata \
    gfortran \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user similar to jupyter images
RUN useradd -m -s /bin/bash -N -u 1000 jovyan
WORKDIR /home/jovyan
USER jovyan

# Install Python packages for Jupyter and scientific computing
USER root
RUN pip install --no-cache-dir \
    jupyter \
    jupyterlab \
    numpy \
    matplotlib \
    pandas \
    scikit-learn \
    seaborn
# Make sure jupyter is in PATH
ENV PATH="/usr/local/bin:${PATH}"
USER jovyan

# Install project-specific requirements
COPY docker/jupyterlab/requirements.txt /tmp/requirements.txt
USER root
RUN pip install --no-cache-dir -r /tmp/requirements.txt && \
    rm /tmp/requirements.txt
USER jovyan

WORKDIR /home/jovyan/work