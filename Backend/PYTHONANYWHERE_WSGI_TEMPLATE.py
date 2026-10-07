# Sample WSGI Configuration for PythonAnywhere
# 
# This is a TEMPLATE for the WSGI file that PythonAnywhere creates
# Location on PythonAnywhere: /var/www/yourusername_pythonanywhere_com_wsgi.py
#
# IMPORTANT: Replace ALL instances of "yourusername" with your actual PythonAnywhere username

import sys
import os

# ============================================================================
# Virtual Environment & Path Setup
# ============================================================================

# Path to your virtual environment on PythonAnywhere
virtualenv_path = '/home/yourusername/.virtualenvs/cosmic/lib/python3.10/site-packages'
if virtualenv_path not in sys.path:
    sys.path.insert(0, virtualenv_path)

# Path to your Django project
project_path = '/home/yourusername/mysite/Backend'
if project_path not in sys.path:
    sys.path.insert(0, project_path)

# ============================================================================
# Django Setup
# ============================================================================

# Set Django settings module
os.environ['DJANGO_SETTINGS_MODULE'] = 'cosmic_backend.settings'

# Set up Django
import django
from django.conf import settings
from django.core.wsgi import get_wsgi_application

# Configure Django with settings
django.setup()

# Get WSGI application
application = get_wsgi_application()

# ============================================================================
# Optional: Add debugging middleware (remove in production)
# ============================================================================

# Uncomment for debugging (shows more detailed errors)
# import logging
# logging.basicConfig(filename='/home/yourusername/mysite/Backend/wsgi.log',
#                     level=logging.DEBUG)

# ============================================================================
# Optional: Custom error handler
# ============================================================================

def application_with_error_handling(environ, start_response):
    """
    Wrapper around WSGI application for custom error handling.
    Uncomment and use if you need custom error pages.
    """
    try:
        return application(environ, start_response)
    except Exception as e:
        # Log error
        print(f"Error: {e}", file=sys.stderr)
        
        # Return 500 error
        status = '500 Internal Server Error'
        headers = [('Content-Type', 'text/plain')]
        start_response(status, headers)
        return [b'Internal Server Error. Check logs.']

# Uncomment to use error handling:
# application = application_with_error_handling

# ============================================================================
# Testing (remove after verification)
# ============================================================================

# Uncomment to test WSGI configuration
# def test_application(environ, start_response):
#     status = '200 OK'
#     response_headers = [('Content-Type', 'text/html')]
#     start_response(status, response_headers)
#     return [b'<h1>WSGI Configuration Test</h1><p>If you see this, WSGI is working!</p>']
#
# application = test_application
