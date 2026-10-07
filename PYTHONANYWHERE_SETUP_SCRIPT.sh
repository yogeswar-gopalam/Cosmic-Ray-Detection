#!/bin/bash
# PythonAnywhere Setup Script for Cosmic Ray Detection Project
# Run this in PythonAnywhere Bash console after cloning the repo
# Usage: bash PYTHONANYWHERE_SETUP_SCRIPT.sh

set -e  # Exit on any error

echo "================================"
echo "PythonAnywhere Setup Script"
echo "================================"

# Variables - UPDATE THESE
REPO_URL="https://github.com/kavyasrikasani/cosmic-ray-detection.git"
PROJECT_DIR="$HOME/mysite"
VENV_NAME="cosmic"
PYTHON_VERSION="python3.10"

echo ""
echo "Step 1: Clone Repository"
echo "================================"
if [ -d "$PROJECT_DIR" ]; then
    echo "Project directory exists. Pulling latest changes..."
    cd "$PROJECT_DIR"
    git pull origin main
else
    echo "Cloning repository..."
    git clone "$REPO_URL" "$PROJECT_DIR"
    cd "$PROJECT_DIR"
fi

echo ""
echo "Step 2: Create Virtual Environment"
echo "================================"
cd "$PROJECT_DIR/Backend"
mkvirtualenv --python=/usr/bin/$PYTHON_VERSION $VENV_NAME

echo ""
echo "Step 3: Install Dependencies"
echo "================================"
workon $VENV_NAME
pip install --upgrade pip
pip install -r requirements.txt

echo ""
echo "Step 4: Django Database Setup"
echo "================================"
python manage.py migrate
echo "✓ Database migrated"

echo ""
echo "Step 5: Collect Static Files"
echo "================================"
python manage.py collectstatic --noinput --clear
echo "✓ Static files collected"

echo ""
echo "Step 6: Create Superuser (Admin)"
echo "================================"
echo "You will be prompted to create a Django admin user"
echo "Enter username, email, and password:"
python manage.py createsuperuser

echo ""
echo "Step 7: Build React Frontend"
echo "================================"
cd "$PROJECT_DIR/Fontend"
npm install
npm run build
echo "✓ Frontend built"

echo ""
echo "Step 8: Copy Frontend to Django Static"
echo "================================"
cp -r dist/* "$PROJECT_DIR/Backend/static/"
echo "✓ Frontend copied to static files"

echo ""
echo "================================"
echo "✓ Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Edit /var/www/yourusername_pythonanywhere_com_wsgi.py"
echo "2. Update Backend/cosmic_backend/settings.py:"
echo "   - Change ALLOWED_HOSTS to include your domain"
echo "   - Set DEBUG = False"
echo "   - Update SECRET_KEY"
echo "3. Reload your web app in PythonAnywhere"
echo ""
echo "Visit your domain to test: https://yourusername.pythonanywhere.com"
