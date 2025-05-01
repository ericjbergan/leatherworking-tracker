# Leatherworking Tracker

A full-stack application for tracking leatherworking projects, orders, and inventory.

## Project Status

### Current Status
- Frontend: ✅ Ready for deployment
- Backend: ✅ Ready for deployment
- Database: ✅ Connected to MongoDB Atlas
- AWS Deployment: ⚠️ Pending IAM user setup
  - Need to create IAM admin user for deployment
  - Root user access restricted for security

### Known Issues
- AWS IAM user needed for EC2 instance deployment
- Root user access restricted for security reasons

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- AWS account with IAM admin user (not root user)

### AWS IAM Setup
1. Create IAM Admin User:
   - Log in to AWS Console as root user
   - Go to IAM service
   - Click "Users" > "Add user"
   - Set user details:
     - User name: `leatherworking-tracker-admin`
     - Select both:
       - "Access key - Programmatic access" (for CLI/API)
       - "Password - AWS Management Console access" (for web console)
   - Click "Next: Permissions"

2. Set permissions:
   - Choose "Attach existing policies directly"
   - Search for and select `AdministratorAccess`
   - Click "Next: Tags"

3. Add tags (optional):
   - Key: `Project`
   - Value: `Leatherworking Tracker`
   - Click "Next: Review"

4. Review and create:
   - Verify the details
   - Click "Create user"

5. Save credentials:
   - Download the .csv file with access keys
   - Save the Access key ID and Secret access key securely
   - Note the console sign-in URL and password
   - These will be needed for AWS CLI and console access

6. Configure AWS CLI:
   ```bash
   aws configure
   # Enter the new IAM user credentials when prompted
   ```

### Local Development

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
   - Backend: Create `.env` file in `backend` directory
   - Frontend: Create `.env` file in `frontend` directory

4. Start development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd frontend
   npm run dev
   ```

## Deployment

### Backend (Elastic Beanstalk)
1. Build the application:
   ```bash
   cd backend
   npm run build
   ```

2. Create deployment package:
   ```bash
   # Windows
   powershell -ExecutionPolicy Bypass -File deploy.ps1
   ```

3. Deploy to Elastic Beanstalk:
   - Upload `leatherworking-tracker-backend.zip` to Elastic Beanstalk
   - Configure environment variables
   - Deploy application

### Frontend (S3 + CloudFront)
1. Build the application:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy to S3:
   - Upload contents of `dist` directory to S3 bucket
   - Configure CloudFront distribution
   - Set up custom domain (optional)

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_uri
PORT=3000
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
```

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License. 