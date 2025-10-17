# OWASP Quiz Portal

A modern React + TailwindCSS frontend for an OWASP Quiz Portal with **privacy-first AI-powered proctoring**.

## ✨ Key Features

### 🔐 Authentication System
- Login and Signup pages with form validation
- Protected routes with authentication checks
- Demo mode for testing

### 🎥 **NEW: Privacy-First Proctoring**
- **Face Detection**: Real-time face counting using MediaPipe
- **Object Detection**: Phone and device detection using COCO-SSD
- **100% Client-Side**: All processing happens in browser
- **Zero Storage**: No images or data stored/uploaded
- **Real-Time Monitoring**: Continuous detection during quiz
- **Violation Tracking**: Comprehensive logging system

### 🎯 Quiz Features
- Tab switch detection with auto-fullscreen
- Fullscreen enforcement throughout quiz
- Question navigation and bookmarking
- Progress auto-saving
- Timer with countdown
- Copy/paste prevention
- Right-click disabling

### 🎨 Modern UI/UX
- Clean, responsive design with TailwindCSS
- Real-time status indicators
- Color-coded warnings
- Minimizable monitoring interface
- Professional appearance

## 🚀 Tech Stack

### Core
- React 18
- Vite
- TailwindCSS
- React Router DOM
- Context API for state management

### AI/ML (Privacy-First)
- **MediaPipe Face Detection**: Real-time face detection
- **TensorFlow.js**: Browser-based ML framework
- **COCO-SSD**: Object detection model
- All running **100% client-side**

## 📁 Project Structure

```
src/
├── auth/
│   ├── Login.jsx
│   └── Signup.jsx
├── components/
│   ├── ProtectedRoute.jsx
│   ├── RequireInstructionsComplete.jsx
│   └── QuizMonitor.jsx          ← NEW: Proctoring monitor
├── hooks/
│   └── useDetection.js          ← NEW: Detection logic
├── contexts/
│   └── AuthContext.jsx
├── pages/
│   └── quiz/
│       ├── StartPage.jsx
│       ├── inQuizSetup/
│       │   ├── QuestionPage.jsx
│       │   └── Submit.jsx
│       └── preQuizSetup/
│           ├── camerasetup.jsx   ← ENHANCED: Detection integrated
│           ├── instructions.jsx
│           ├── permissions.jsx
│           ├── prequizLayout.jsx
│           └── ready.jsx
├── services/
│   └── api.js
├── App.jsx
├── main.jsx
└── index.css
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

This will install all dependencies including:
- Core packages (React, Vite, TailwindCSS)
- AI/ML packages (MediaPipe, TensorFlow.js, COCO-SSD)

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to `http://localhost:5173`

### 4. Test the Proctoring System
1. Login with any credentials
2. Navigate to camera setup
3. Grant camera permissions
4. Click "Start Face Detection"
5. Wait for models to load (5-10 seconds first time)
6. Test different scenarios (see TEST_GUIDE.md)

## 📖 Documentation

| Document | Description |
|----------|-------------|
| **[DETECTION_README.md](DETECTION_README.md)** | Complete technical documentation for face & object detection |
| **[SETUP_GUIDE.md](SETUP_GUIDE.md)** | Quick setup and configuration guide |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | System architecture and data flow diagrams |
| **[TEST_GUIDE.md](TEST_GUIDE.md)** | Testing checklist and scenarios |
| **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** | Implementation overview and success criteria |

## 🎯 Pages & Routes

- **`/login`** - Login page with roll number and password
- **`/signup`** - Signup page with registration form
- **`/quiz/camera-setup`** - **NEW**: Camera verification with face/object detection
- **`/quiz/permissions`** - Permissions setup
- **`/quiz/instructions`** - Quiz instructions
- **`/quiz/ready`** - Final ready check
- **`/quiz/questions`** - Protected quiz with continuous monitoring
- **`/submit`** - Quiz submission page

## 🔐 Demo Credentials

- **Roll Number**: 102403070
- **Password**: admin123

Or use any credentials (demo mode accepts all inputs)

## ✨ Features Overview

### 🎥 Proctoring Features (NEW)
- ✅ **Face Detection**: Counts faces in real-time (MediaPipe)
- ✅ **Multi-Face Warning**: Alerts when multiple people detected
- ✅ **No-Face Warning**: Alerts when student not visible
- ✅ **Phone Detection**: Identifies mobile phones (COCO-SSD)
- ✅ **Object Detection**: Detects books, laptops, etc.
- ✅ **Real-Time Monitoring**: Continuous detection during quiz
- ✅ **Violation Tracking**: Comprehensive logging system
- ✅ **Privacy-First**: 100% client-side, no storage/upload

### 🔒 Security Features
- Tab switch detection with auto-fullscreen
- Fullscreen enforcement
- Copy/paste prevention
- Right-click disabling
- Protected routes
- Session management

### 📝 Quiz Features
- Question navigation
- Bookmarking
- Auto-save progress
- Timer with countdown
- Multiple choice questions
- Progress tracking

### 🎨 UI/UX Features
- Responsive design
- Real-time status indicators
- Color-coded warnings
- Minimizable monitoring interface
- Professional appearance
- Smooth transitions

## 🔒 Privacy Guarantees

### What is NOT collected:
- ❌ No images captured
- ❌ No videos recorded
- ❌ No facial recognition data
- ❌ No biometric identifiers
- ❌ No uploads to servers

### What IS processed (locally only):
- ✅ Face count (number only)
- ✅ Object categories (labels only)
- ✅ Violation timestamps (temporary)

**All processing happens in your browser. Nothing leaves your device!** 🔒

## 🧪 Testing

### Quick Test
```bash
npm run dev
# Navigate to http://localhost:5173
# Follow TEST_GUIDE.md for test scenarios
```

### Test Scenarios
1. ✅ One person visible → Should show green ✓
2. ⚠️ Multiple people → Should show red warning
3. ⚠️ No face visible → Should show orange warning
4. ⚠️ Phone in frame → Should detect and warn
5. ⚠️ Book/laptop → Should detect and log

See **[TEST_GUIDE.md](TEST_GUIDE.md)** for comprehensive testing instructions.

## 📊 Performance

- **Initial Load**: 5-10 seconds (model download, cached after)
- **Face Detection**: Real-time (30-60 FPS)
- **Object Detection**: Every 2 seconds (configurable)
- **Memory Usage**: ~100-150MB
- **Browser Support**: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+

## 🛠️ Configuration

### Adjust Detection Sensitivity
Edit `src/hooks/useDetection.js`:
```javascript
// Face detection confidence (0.0 - 1.0)
minDetectionConfidence: 0.5

// Object detection frequency (milliseconds)
setInterval(detectObjects, 2000)
```

### Add More Objects to Detect
```javascript
const suspiciousObjects = predictions.filter(pred => 
  pred.class === 'cell phone' || 
  pred.class === 'book' || 
  pred.class === 'laptop' ||
  pred.class === 'tablet'  // Add new item
);
```

## 🐛 Troubleshooting

### Models Not Loading
- Check internet connection
- Wait 10-15 seconds
- Clear browser cache
- Try incognito mode

### Camera Not Working
- Grant camera permissions
- Close other apps using camera
- Try different browser

### False Detections
- Improve lighting
- Remove reflective surfaces
- Adjust confidence threshold

See **[DETECTION_README.md](DETECTION_README.md)** for detailed troubleshooting.

## 🚀 Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📦 Dependencies

### Production
- `react` & `react-dom`: UI framework
- `react-router-dom`: Routing
- `axios`: HTTP client
- `lucide-react`: Icons
- `@mediapipe/face_detection`: Face detection
- `@mediapipe/camera_utils`: Camera utilities
- `@tensorflow/tfjs`: ML framework
- `@tensorflow-models/coco-ssd`: Object detection

### Development
- `vite`: Build tool
- `tailwindcss`: CSS framework
- `eslint`: Code linting
- `postcss` & `autoprefixer`: CSS processing

## 🎓 Learn More

- [MediaPipe Documentation](https://google.github.io/mediapipe/)
- [TensorFlow.js Guide](https://www.tensorflow.org/js)
- [COCO-SSD Model](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

## 🎉 What's New

### Latest Update: Privacy-First AI Proctoring

We've added a complete **face detection and object detection system** that runs entirely in your browser!

**Key Highlights:**
- 🔒 **100% Privacy**: No images stored or uploaded
- 🎯 **Real-Time Detection**: Face counting and object identification
- 📱 **Phone Detection**: Alerts on mobile phone presence
- 👥 **Multi-Face Warning**: Ensures only one person present
- 🖥️ **Client-Side Only**: All ML processing in browser
- 📊 **Violation Tracking**: Comprehensive logging system

**See it in action:**
1. Navigate to camera setup
2. Click "Start Face Detection"
3. Models load automatically (5-10s first time)
4. Real-time monitoring begins!

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is for educational purposes.

---

**Built with ❤️ using privacy-first principles.**

**All AI/ML processing happens locally in your browser. Your privacy is guaranteed!** 🔒

- Demo credentials display

## API Integration

The app includes placeholder API calls to `https://example.com/api/login` and `https://example.com/api/signup`. For demo purposes, all requests are accepted regardless of credentials.

## Responsive Design

The application is fully responsive and works well on:
- Desktop screens (1024px+)
- Tablet screens (768px - 1023px)
- Mobile screens (320px - 767px)

## Customization

You can easily customize the app by:
- Modifying colors in `tailwind.config.js`
- Updating form validation rules
- Changing API endpoints in `AuthContext.jsx`
- Adding new pages and routes in `App.jsx`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## License

This project is for educational purposes and demo use.
