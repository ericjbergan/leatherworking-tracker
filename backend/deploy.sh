#!/bin/bash

# Build the application
echo "Building the application..."
npm run build

# Create a temporary directory for deployment
echo "Creating deployment package..."
mkdir -p deploy

# Copy necessary files
cp -r dist deploy/
cp package.json deploy/
cp package-lock.json deploy/
cp -r .ebextensions deploy/

# Create ZIP file
echo "Creating ZIP file..."
cd deploy
zip -r ../leatherworking-tracker-backend.zip .

# Clean up
echo "Cleaning up..."
cd ..
rm -rf deploy

echo "Deployment package created: leatherworking-tracker-backend.zip"

# Build the Docker image
docker build -t leatherworking-tracker-backend .

# Tag the image for ECR
docker tag leatherworking-tracker-backend:latest 800145641946.dkr.ecr.us-east-2.amazonaws.com/leatherworking-tracker-backend:latest

# Login to ECR
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 800145641946.dkr.ecr.us-east-2.amazonaws.com

# Push the image to ECR
docker push 800145641946.dkr.ecr.us-east-2.amazonaws.com/leatherworking-tracker-backend:latest

# Deploy to Elastic Beanstalk
eb deploy leatherworking-tracker-env 