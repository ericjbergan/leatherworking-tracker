FROM node:18-alpine

# Install system dependencies
RUN apk add --no-cache \
    git \
    openssh-client \
    python3 \
    make \
    g++

# Install global npm packages
RUN npm install -g npm@latest

# Create app directory
WORKDIR /workspace

# Set environment variables
ENV NODE_ENV=development
ENV PATH /workspace/node_modules/.bin:$PATH

# Expose ports
EXPOSE 3000 5173

# Start the container
CMD ["sleep", "infinity"] 