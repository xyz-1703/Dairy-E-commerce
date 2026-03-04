#!/bin/bash
# Dairy Mart - Complete Startup Script
# Run this script to start both backend and frontend

echo \"🥛 Starting Dairy Mart Ecommerce Application...\"

# Check Python
echo \"Checking Python...\"
python --version

# Check Node
echo \"Checking Node...\"
node --version
npm --version

echo \"\"
echo \"========================================\"
echo \"BACKEND SETUP\"
echo \"========================================\"

cd backend

# Create venv if not exists
if [ ! -d \".venv\" ]; then
    echo \"Creating virtual environment...\"
    python -m venv .venv
fi

# Activate venv
echo \"Activating virtual environment...\"
source .venv/bin/activate 2>/dev/null || .venv\\Scripts\\activate.bat

# Install requirements
echo \"Installing requirements...\"
pip install -r requirements.txt -q

# Migrate database
echo \"Running migrations...\"
python manage.py migrate -q

# Seed data
echo \"Loading sample data...\"
python seed_data.py > /dev/null 2>&1

echo \"✅ Backend ready on http://localhost:8000\"

# Start backend in background
python manage.py runserver &
BACKEND_PID=$!
echo \"Backend PID: $BACKEND_PID\"

echo \"\"
echo \"========================================\"
echo \"FRONTEND SETUP\"
echo \"========================================\"

cd ../frontend

# Install npm packages
echo \"Installing npm packages...\"
npm install -q

echo \"✅ Frontend ready on http://localhost:3000\"

# Start frontend
echo \"\"
echo \"=========================================\"
echo \"🎉 DAIRY MART IS RUNNING!\"
echo \"=========================================\"
echo \"\"
echo \"Frontend: http://localhost:3000\"
echo \"Backend:  http://localhost:8000\"
echo \"Admin:    http://localhost:8000/admin\"
echo \"\"
echo \"Demo Customer: customer / customer123\"
echo \"Demo Staff:    staff / staff123\"
echo \"\"
echo \"Press Ctrl+C to stop\"
echo \"\"

npm start
