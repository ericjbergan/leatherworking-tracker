# Leatherworking Tracker

A full-stack application for tracking leatherworking projects, orders, and inventory.

## Project Status

### Current Status
- Frontend: ✅ Ready and running
- Backend: ✅ Ready and running
- Database: ✅ Connected to MongoDB Atlas
- AWS Deployment: ⚠️ Pending IAM user setup
  - Need to create IAM admin user for deployment
  - Root user access restricted for security
- Development Environment: ✅ Containerized with VS Code Dev Containers

### Known Issues
- AWS IAM user needed for EC2 instance deployment
- Root user access restricted for security reasons

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- AWS account with IAM admin user (not root user)
- Docker Desktop
- VS Code with Dev Containers extension

### Development Container Setup
1. Install Docker Desktop
2. Install VS Code Dev Containers extension
3. Clone the repository
4. Open the project in VS Code
5. Click the green "><" icon in the bottom-left corner
6. Select "Reopen in Container"
7. Wait for the container to build and set up

The development container provides:
- Consistent development environment
- Pre-configured Node.js v18
- Required VS Code extensions
- Automatic port forwarding (3000 for backend, 5173 for frontend)
- Isolated development environment

### Local Development (Alternative to Dev Container)

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   - Backend: Create `.env` file in `backend` directory with:
     ```
     PORT=3000
     MONGODB_URI=your_mongodb_connection_string
     NODE_ENV=development
     ```
   - Frontend: Create `.env` file in `frontend` directory

4. Start development servers:
   ```bash
   # Start backend server
   cd backend
   npm start

   # Start frontend server
   cd frontend
   npm run dev
   ```

## AWS Hosting Instructions

### Prerequisites
- AWS account already set up
- AWS CLI installed and configured

### Backend Deployment (Elastic Beanstalk)
1. Build the application:
   ```bash
   cd backend
   npm run build
   ```

2. Create deployment bundle:
   ```bash
   # On Windows (PowerShell)
   Compress-Archive -Path dist/*, package.json, package-lock.json, .ebextensions/* -DestinationPath eb-bundle.zip -Force

   # On Unix/Linux/Mac
   zip -r eb-bundle.zip dist/* package.json package-lock.json .ebextensions/*
   ```

3. Deploy to Elastic Beanstalk:
   - Go to AWS Elastic Beanstalk console
   - Select your environment
   - Click "Upload and deploy"
   - Choose the `eb-bundle.zip` file
   - Click "Deploy"
   - Wait for deployment to complete

4. Verify deployment:
   - Check the Elastic Beanstalk environment health
   - The health check should show "OK" status
   - If health shows "No Data", check the logs for any issues

### Frontend Deployment (S3 + CloudFront)
1. Build the application:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy to S3:
   - Upload contents of `dist` directory to S3 bucket
   - Configure CloudFront distribution
   - Set up custom domain (optional)

### Additional AWS Configuration
- Ensure your AWS IAM user has the necessary permissions for Elastic Beanstalk and S3/CloudFront.
- Configure environment variables in AWS Elastic Beanstalk for the backend.
- Set up CORS if your frontend and backend are on different domains.

## Environment Variables

### Backend (.env)
```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
```