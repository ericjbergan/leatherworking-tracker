# Build the application
Write-Host "Building the application..."
npm run build

# Create a temporary directory for deployment
Write-Host "Creating deployment package..."
New-Item -ItemType Directory -Force -Path deploy

# Copy necessary files
Copy-Item -Path dist -Destination deploy -Recurse
Copy-Item -Path package.json -Destination deploy
Copy-Item -Path package-lock.json -Destination deploy
Copy-Item -Path .ebextensions -Destination deploy -Recurse

# Create ZIP file
Write-Host "Creating ZIP file..."
Compress-Archive -Path deploy\* -DestinationPath leatherworking-tracker-backend.zip -Force

# Clean up
Write-Host "Cleaning up..."
Remove-Item -Path deploy -Recurse -Force

Write-Host "Deployment package created: leatherworking-tracker-backend.zip" 