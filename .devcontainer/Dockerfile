# Use Node.js 20 LTS as the base image
FROM node:20-bullseye

# Install additional system dependencies
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
        git \
        curl \
        ca-certificates \
    && apt-get autoremove -y && apt-get clean -y

# Set up the workspace directory
WORKDIR /workspace

# Create a non-root user (node user already exists in the base image)
USER node

# Keep the container running
CMD ["sleep", "infinity"]
