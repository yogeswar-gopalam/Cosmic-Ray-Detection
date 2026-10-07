# Cosmic Ray Detection Project

A full-stack web application for detecting cosmic rays in astronomical images using GAN (Generative Adversarial Network) technology.

## 🚀 Quick Start

### Option 1: PowerShell Script (Recommended)
Run the PowerShell script to start both servers automatically:

```powershell
.\start-project.ps1
```

This will:
- Start the Django backend server on `http://127.0.0.1:8000/`
- Start the Vite frontend on `http://localhost:8081/`
- Monitor both servers and restart them if they fail
- Keep running until you press Ctrl+C

### Option 2: Batch File
For a simpler approach, use the batch file:

```cmd
start-project.bat
```

This opens separate command windows for backend and frontend.

### Option 3: Manual Start
If you prefer to start servers manually:

**Backend:**
```bash
cd Backend
python manage.py runserver
```

**Frontend:**
```bash
cd Fontend
npm run dev
```

## 🏗️ Project Structure

```
final_project/
├── Backend/                 # Django REST API
│   ├── cosmic_backend/      # Django settings
│   ├── api/                 # API endpoints
│   ├── generator_model.pth  # Trained GAN model
│   └── results/             # Processed images
├── Fontend/                 # React + Vite frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── Training_Package/        # Model training scripts
├── start-project.ps1        # PowerShell startup script
└── start-project.bat        # Batch startup script
```

## 🔧 Technologies Used

- **Backend:** Django 6.0.3, PyTorch, OpenCV
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **AI/ML:** GAN for cosmic ray detection
- **Data:** Astronomical FITS images, cosmic ray datasets

## 📡 API Endpoints

- `POST /api/detect/` - Upload image for cosmic ray detection
  - Returns: particle count, accuracy metrics, processed image with bounding boxes

## 🌐 Access Points

- **Frontend:** http://localhost:8081/
- **Backend API:** http://127.0.0.1:8000/api/detect/

## 📊 Features

- Image upload and processing
- Real-time cosmic ray detection
- GAN-based image denoising
- Accuracy metrics and visualization
- Responsive web interface

## 🛑 Stopping the Project

- **PowerShell:** Press Ctrl+C in the terminal
- **Batch:** Close the command windows
- **Manual:** Press Ctrl+C in each server terminal

## 🔍 Troubleshooting

1. **Port conflicts:** Ensure ports 8000 and 8081 are available
2. **Python dependencies:** Backend requires PyTorch, OpenCV, Django
3. **Node dependencies:** Run `npm install` in Fontend directory
4. **Model loading:** Ensure `generator_model.pth` exists in Backend directory

## 📈 Model Performance

- Accuracy: 86-95% depending on particle count
- Precision: 0.81-0.92
- Recall: 0.78-0.89
- Handles various astronomical image formats