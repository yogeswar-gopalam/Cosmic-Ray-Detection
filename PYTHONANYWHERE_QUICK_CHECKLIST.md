# Quick PythonAnywhere Deployment Checklist

## Phase 1: Pre-Deployment (Local)
- [ ] Create `requirements.txt`: `pip freeze > Backend/requirements.txt`
- [ ] Update `Backend/cosmic_backend/settings.py`:
  - [ ] `DEBUG = False`
  - [ ] Update `ALLOWED_HOSTS = ['yourusername.pythonanywhere.com']`
  - [ ] Set `SECRET_KEY` to new random value
  - [ ] Configure `STATIC_ROOT` and `MEDIA_ROOT`
  - [ ] Update `CORS_ALLOWED_ORIGINS`
- [ ] Test locally: `python manage.py runserver`
- [ ] Commit to GitHub (if using Git)

## Phase 2: PythonAnywhere Account Setup
- [ ] Sign up at pythonanywhere.com
- [ ] Create new web app: **Web** → **Add a new web app**
- [ ] Choose: Manual configuration + Python 3.10+
- [ ] Note your domain: `yourusername.pythonanywhere.com`

## Phase 3: Upload Project
**Using Git:**
- [ ] Log into PythonAnywhere Bash console
- [ ] Clone repo: `git clone https://github.com/yourname/repo.git ~/mysite`

**Using Web Upload:**
- [ ] Zip your project
- [ ] Upload via **Files**
- [ ] Extract: `unzip cosmic-ray-detection.zip`

## Phase 4: Configure Backend
- [ ] Navigate: `cd ~/mysite/Backend`
- [ ] Create virtualenv: `mkvirtualenv --python=/usr/bin/python3.10 cosmic`
- [ ] Install deps: `pip install -r requirements.txt`
- [ ] Collect statics: `python manage.py collectstatic --noinput`
- [ ] Migrate DB: `python manage.py migrate`
- [ ] Create superuser: `python manage.py createsuperuser`

## Phase 5: Configure WSGI
- [ ] Edit `/var/www/yourusername_pythonanywhere_com_wsgi.py`
- [ ] Set `path = '/home/yourusername/mysite/Backend'`
- [ ] Verify import paths correct

## Phase 6: Deploy Frontend
**Option A - Serve from Django:**
- [ ] `cd ~/mysite/Fontend && npm install && npm run build`
- [ ] Copy dist to static: `cp -r dist/* ../Backend/static/`
- [ ] Update Django `urls.py` to serve index.html

**Option B - Deploy Separately:**
- [ ] Build: `npm run build`
- [ ] Deploy to Netlify/Vercel
- [ ] Update API endpoints to point to Django backend

## Phase 7: Activate & Test
- [ ] **Reload** web app in PythonAnywhere
- [ ] Visit: `https://yourusername.pythonanywhere.com`
- [ ] Check **Error log** if issues
- [ ] Test API: `/api/detect/`
- [ ] Test admin: `/admin/`

## Phase 8: Production Setup
- [ ] Verify `DEBUG = False`
- [ ] Test HTTPS redirect
- [ ] Configure backups
- [ ] Monitor error logs
- [ ] Set up cron jobs (if needed)

---

## Emergency Commands (in Bash)

```bash
# Activate virtual environment
workon cosmic

# Reload web app from bash
touch /var/www/yourusername_pythonanywhere_com_wsgi.py

# View error log
tail -f ~/mysite/Backend/error.log

# Restart from scratch
rm ~/mysite/db.sqlite3
python manage.py migrate
python manage.py createsuperuser

# View logs
tail -50 /var/log/yourusername.pythonanywhere.com.error.log
```

---

## Common Paths to Remember

```
/home/yourusername/mysite/         # Project root
/home/yourusername/mysite/Backend/  # Django app
~/.virtualenvs/cosmic/              # Virtual environment
/var/www/yourusername_pythonanywhere_com_wsgi.py  # WSGI config
```

---

## Still Stuck?

1. Check **Error log** in Web tab
2. Check **Access log** in Web tab  
3. Read full guide: `PYTHONANYWHERE_DEPLOYMENT_GUIDE.md`
4. Visit: help.pythonanywhere.com
