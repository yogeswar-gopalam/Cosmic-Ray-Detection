# Production Settings Template for PythonAnywhere
# Copy the relevant sections into Backend/cosmic_backend/settings.py

"""
IMPORTANT: This file contains the CHANGES you need to make to your settings.py
for PythonAnywhere production deployment.

Current settings.py location: Backend/cosmic_backend/settings.py
"""

# ============================================================================
# 1. SECURITY SETTINGS
# ============================================================================

# Set to False for production (CRITICAL!)
DEBUG = False

# Generate a new SECRET_KEY for production
# Run in Python: from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())
SECRET_KEY = 'your-new-production-secret-key-here'

# Add your PythonAnywhere domain (replace yourusername with your username)
ALLOWED_HOSTS = [
    'yourusername.pythonanywhere.com',
    'localhost',
    '127.0.0.1',
]

# ============================================================================
# 2. STATIC FILES & MEDIA CONFIGURATION
# ============================================================================

STATIC_URL = '/static/'

# Important: Change path to your PythonAnywhere directory
STATIC_ROOT = '/home/yourusername/mysite/Backend/static'

# For user uploads
MEDIA_URL = '/media/'
MEDIA_ROOT = '/home/yourusername/mysite/Backend/media'

# ============================================================================
# 3. HTTPS & SECURITY
# ============================================================================

# Force HTTPS redirect (PythonAnywhere provides SSL automatically)
SECURE_SSL_REDIRECT = True

# Secure cookies
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# Allow your domain for CSRF
CSRF_TRUSTED_ORIGINS = [
    'https://yourusername.pythonanywhere.com',
]

# ============================================================================
# 4. CORS CONFIGURATION (for frontend access)
# ============================================================================

CORS_ALLOWED_ORIGINS = [
    'https://yourusername.pythonanywhere.com',
    'http://yourusername.pythonanywhere.com',  # Rarely needed with HTTPS
    # Add frontend domain if deployed separately:
    # 'https://yourfrontend.netlify.app',
    # 'https://yourfrontend.vercel.app',
]

# ============================================================================
# 5. DATABASE CONFIGURATION
# ============================================================================

# SQLite (default, works fine on PythonAnywhere for small projects)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': '/home/yourusername/mysite/Backend/db.sqlite3',
    }
}

# Optional: Switch to PostgreSQL for production (if using paid plan)
# Install: pip install psycopg2-binary
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'yourusername$dbname',
#         'USER': 'yourusername',
#         'PASSWORD': 'your-db-password',
#         'HOST': 'yourusername.postgres.pythonanywhere-services.com',
#         'PORT': '5432',
#     }
# }

# ============================================================================
# 6. LOGGING (helps with debugging)
# ============================================================================

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/home/yourusername/mysite/Backend/error.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}

# ============================================================================
# 7. EMAIL CONFIGURATION (optional, for sending emails)
# ============================================================================

# Example using Gmail (less secure, not recommended)
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = 'smtp.gmail.com'
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = 'your-email@gmail.com'
# EMAIL_HOST_PASSWORD = 'your-app-password'  # Use app-specific password, not main password

# Or use a service like SendGrid (recommended)
# EMAIL_BACKEND = 'sendgrid_backend.SendgridBackend'
# SENDGRID_API_KEY = 'your-sendgrid-api-key'

# ============================================================================
# 8. ALLOWED HOSTS WITH ENVIRONMENT VARIABLE (optional but recommended)
# ============================================================================

import os
from pathlib import Path

# Load from .env file if it exists
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Allow using environment variables for dynamic configuration
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')
DEBUG = os.getenv('DEBUG', 'False') == 'True'
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-fallback-key')

# ============================================================================
# 9. SAMPLE .env FILE (Backend/.env)
# ============================================================================

"""
# Create Backend/.env with:

DEBUG=False
SECRET_KEY=your-production-secret-key-generated-above
ALLOWED_HOSTS=yourusername.pythonanywhere.com,localhost
CORS_ALLOWED_ORIGINS=https://yourusername.pythonanywhere.com
DATABASE_URL=sqlite:///db.sqlite3
"""

# ============================================================================
# 10. USEFUL DJANGO COMMANDS FOR PYTHONANYWHERE
# ============================================================================

"""
After uploading and configuring:

# Activate virtual environment
workon cosmic

# Create migrations (if you modified models)
python manage.py makemigrations

# Apply migrations to database
python manage.py migrate

# Collect all static files
python manage.py collectstatic --noinput

# Create superuser for admin
python manage.py createsuperuser

# Test the site locally (temporary)
python manage.py runserver

# Access Django shell
python manage.py shell

# Generate new SECRET_KEY
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
"""

# ============================================================================
# 11. MODEL LOADING (for .pth files)
# ============================================================================

"""
Your models are in:
- Backend/generator_model.pth
- Backend/generator_model_ol.pth

Load them in Backend/api/views.py like this:

import torch
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'generator_model.pth')

# Load model
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = torch.load(MODEL_PATH, map_location=device)
model.eval()

# NEVER use hardcoded paths like:
# model = torch.load('/home/user/generator_model.pth')  # DON'T DO THIS
"""
