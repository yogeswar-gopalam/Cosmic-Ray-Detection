# PythonAnywhere Deployment Guide

This guide covers deploying your Cosmic Ray Detection project (Django backend + React frontend) to PythonAnywhere.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [PythonAnywhere Setup](#pythonanywhere-setup)
3. [Project Preparation](#project-preparation)
4. [Upload Project](#upload-project)
5. [Configure Django](#configure-django)
6. [Deploy Frontend](#deploy-frontend)
7. [Testing & Troubleshooting](#testing--troubleshooting)

---

## Prerequisites

- **PythonAnywhere Account**: Free or paid account at [pythonanywhere.com](https://www.pythonanywhere.com)
- **Python 3.10+**: Your backend uses Django 6.0.3 (requires Python 3.10+)
- **Git** (optional but recommended) or PythonAnywhere's web upload
- **Command line access** via PythonAnywhere's Bash console

---

## PythonAnywhere Setup

### 1. Create & Log Into Account
- Go to [pythonanywhere.com](https://www.pythonanywhere.com) and sign up (free tier available)
- Log in to your account

### 2. Create Web App
1. Click **"Web"** in the top menu
2. Click **"Add a new web app"**
3. Select **"Manual configuration"** (not a framework template)
4. Choose **Python 3.10** or higher
5. Complete the setup (confirms your domain: `yourusername.pythonanywhere.com`)

> **Note**: Free tier supports only one web app. Paid accounts support multiple.

### 3. Note Your Directories
After setup, PythonAnywhere shows you:
- **Source code directory**: `/home/yourusername/mysite`
- **Web app configuration**: `/var/www/yourusername_pythonanywhere_com_wsgi.py`

---

## Project Preparation

### 1. Create `requirements.txt`

In your `Backend/` directory, create a `requirements.txt` file:

```bash
cd Backend
pip freeze > requirements.txt
```

**Expected dependencies** (your project should include):
```
Django==6.0.3
djangorestframework
django-cors-headers
torch
torchvision
opencv-python
Pillow
numpy
astropy
```

### 2. Update Django Settings

Edit `Backend/cosmic_backend/settings.py`:

```python
# settings.py changes:

# 1. Set DEBUG = False for production
DEBUG = False

# 2. Add your PythonAnywhere domain to ALLOWED_HOSTS
ALLOWED_HOSTS = ['yourusername.pythonanywhere.com', 'localhost', '127.0.0.1']

# 3. Configure static files (IMPORTANT)
STATIC_URL = '/static/'
STATIC_ROOT = '/home/yourusername/mysite/Backend/static'

# 4. Configure media files (for uploads)
MEDIA_URL = '/media/'
MEDIA_ROOT = '/home/yourusername/mysite/Backend/media'

# 5. Set secure settings for production
CSRF_TRUSTED_ORIGINS = ['https://yourusername.pythonanywhere.com']
SECURE_SSL_REDIRECT = True  # Redirect HTTP to HTTPS
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# 6. Configure CORS for your frontend domain
CORS_ALLOWED_ORIGINS = [
    'https://yourusername.pythonanywhere.com',
    'http://yourusername.pythonanywhere.com',
]

# 7. Update SECRET_KEY (generate new key for production)
SECRET_KEY = 'your-new-secure-random-key-here'
# Generate one: python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

### 3. Create `.env` File (Optional but Recommended)

Create `Backend/.env`:
```
SECRET_KEY=your-production-secret-key
DEBUG=False
ALLOWED_HOSTS=yourusername.pythonanywhere.com,localhost
CORS_ALLOWED_ORIGINS=https://yourusername.pythonanywhere.com
```

Then install `python-dotenv` and update settings.py to load it.

### 4. Create `.gitignore` (if using Git)

```
.venv/
*.pyc
__pycache__/
.env
db.sqlite3
/media/
/static/
*.pth
/converted_images/
/results/
/detections/
*.log
```

---

## Upload Project

### Option A: Using Git (Recommended)

1. **Push to GitHub** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/cosmic-ray-detection.git
   git push -u origin main
   ```

2. **Clone in PythonAnywhere Bash Console**:
   - Go to **Consoles** → **Bash**
   - Run:
     ```bash
     cd ~
     git clone https://github.com/yourusername/cosmic-ray-detection.git mysite
     cd mysite/Backend
     ```

### Option B: Using PythonAnywhere Web Upload

1. Go to **Files** → **Upload a file**
2. Upload a `.zip` of your project
3. Extract it:
   ```bash
   unzip cosmic-ray-detection.zip
   mv cosmic-ray-detection ~/mysite
   ```

---

## Configure Django

### 1. Set Up Virtual Environment

In PythonAnywhere Bash:

```bash
cd ~/mysite/Backend
mkvirtualenv --python=/usr/bin/python3.10 cosmic
pip install -r requirements.txt
```

> Note: Replace `cosmic` with your desired venv name

### 2. Collect Static Files

```bash
cd ~/mysite/Backend
python manage.py collectstatic --noinput
```

### 3. Create/Migrate Database

```bash
python manage.py migrate
python manage.py createsuperuser  # Create admin user
```

### 4. Load Models (if needed)

Your project has trained models (`generator_model.pth`, etc.). Ensure these are:
- In the correct location: `Backend/` directory
- Loaded in your API views without absolute paths

---

## Configure WSGI File

Edit `/var/www/yourusername_pythonanywhere_com_wsgi.py`:

```python
import sys
import os

# Add your project to Python path
path = '/home/yourusername/mysite/Backend'
if path not in sys.path:
    sys.path.append(path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'cosmic_backend.settings'

from django.wsgi import get_wsgi_application
application = get_wsgi_application()
```

---

## Deploy Frontend

### Option 1: Serve React from Django (Recommended for Simple Projects)

1. **Build React**:
   ```bash
   cd ~/mysite/Fontend
   npm install
   npm run build
   ```

2. **Copy to Django Static Files**:
   ```bash
   cp -r ~/mysite/Fontend/dist/* ~/mysite/Backend/static/
   ```

3. **Create Django View** for root path (`Backend/api/views.py`):
   ```python
   from django.views.generic import TemplateView
   from django.conf import settings
   import os

   class IndexView(TemplateView):
       template_name = 'index.html'
       
       def get_template_names(self):
           dist_path = os.path.join(settings.BASE_DIR, 'static', 'index.html')
           if os.path.exists(dist_path):
               return ['../static/index.html']
           return ['index.html']
   ```

4. **Update URLs** (`Backend/cosmic_backend/urls.py`):
   ```python
   from django.contrib import admin
   from django.urls import path, include
   from django.views.generic import TemplateView
   from django.conf import settings
   from django.conf.urls.static import static

   urlpatterns = [
       path('admin/', admin.site.urls),
       path('api/', include('api.urls')),
       path('', TemplateView.as_view(template_name='../static/index.html')),
   ]

   if settings.DEBUG:
       urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
   ```

### Option 2: Separate Frontend Hosting

Deploy your React app to:
- **Netlify** (free, supports continuous deployment from GitHub)
- **Vercel** (free, optimized for React)
- **Another PythonAnywhere Account** (if paid)

Update API endpoint in frontend to point to Django:
```typescript
// src/api/config.ts or similar
const API_BASE = 'https://yourusername.pythonanywhere.com/api'
```

---

## Reload Web App

1. Go to **Web** tab in PythonAnywhere
2. Click **"Reload yourusername.pythonanywhere.com"** button
3. Wait 30-60 seconds for reload

---

## Testing & Troubleshooting

### Test Django Backend

```bash
# In PythonAnywhere Bash
cd ~/mysite/Backend
workon cosmic  # Activate venv
python manage.py shell
# Test imports, models, etc.
exit()
```

### View Error Logs

1. **Web App Error Log**: `Web` tab → **Error log** button
2. **Web App Access Log**: `Web` tab → **Access log** button
3. **Bash Console Output**: Usually shows runtime errors

### Common Issues

| Issue | Solution |
|-------|----------|
| **ModuleNotFoundError** | Ensure all dependencies in `requirements.txt` and virtual env activated |
| **Static files 404** | Run `collectstatic` and check `STATIC_ROOT` path |
| **Database locked** | Delete `db.sqlite3`, recreate, migrate |
| **Model not found (`.pth` files)** | Check file paths are relative, not absolute |
| **CORS errors** | Update `CORS_ALLOWED_ORIGINS` in settings |
| **Image upload fails** | Ensure `/media/` directory exists and is writable |

### Enable Debug Mode (Temporary)

In `settings.py`:
```python
DEBUG = True  # Only for debugging
```

Check error logs. Remember to set `DEBUG = False` before production.

---

## File Paths Reference

After setup on PythonAnywhere:

```
/home/yourusername/
├── mysite/                          # Your project root
│   ├── Backend/
│   │   ├── cosmic_backend/
│   │   ├── api/
│   │   ├── static/                  # Collected static files
│   │   ├── media/                   # User uploads
│   │   ├── generator_model.pth
│   │   ├── manage.py
│   │   └── requirements.txt
│   └── Fontend/
│       ├── src/
│       ├── dist/                    # Built React app
│       └── package.json
└── .virtualenvs/
    └── cosmic/                      # Virtual environment
```

---

## Maintenance

### Update Code

```bash
cd ~/mysite
git pull origin main
cd Backend
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
```

Then reload the web app.

### Backup Database

```bash
cd ~/mysite/Backend
cp db.sqlite3 db.sqlite3.backup.$(date +%Y%m%d)
```

### Monitor Usage

Check **Web** tab → **Usage** for CPU, disk, and request limits.

---

## Production Checklist

- [ ] `DEBUG = False` in settings
- [ ] `SECRET_KEY` changed to new random value
- [ ] `ALLOWED_HOSTS` includes your domain
- [ ] `CORS_ALLOWED_ORIGINS` configured
- [ ] Static files collected (`collectstatic`)
- [ ] Database migrated
- [ ] Superuser created
- [ ] `.env` secrets not in repo
- [ ] Model files (`.pth`) exist and accessible
- [ ] Frontend built and deployed
- [ ] Error logs checked
- [ ] HTTPS enabled (automatic on PythonAnywhere)
- [ ] Backups configured

---

## Next Steps

1. **Set up cron jobs** (PythonAnywhere **Tasks**) for:
   - Periodic backups
   - Cleanup of old uploads
   - Model retraining (if needed)

2. **Monitor logs regularly** in the Web app dashboard

3. **Keep dependencies updated**:
   ```bash
   pip list --outdated
   pip install --upgrade <package>
   ```

4. **Use paid tier** if you need:
   - Multiple web apps
   - Custom domains
   - Higher resource limits
   - More concurrency

---

## Resources

- [PythonAnywhere Django Docs](https://help.pythonanywhere.com/pages/Django)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/6.0/deployment/checklist/)
- [PythonAnywhere Help Center](https://help.pythonanywhere.com/)

---

## Support

For PythonAnywhere-specific issues, contact support via the Help menu in your account.
For Django issues, check [Stack Overflow](https://stackoverflow.com/questions/tagged/django) or [Django Discord](https://discord.gg/xcRH6mN4EK).
