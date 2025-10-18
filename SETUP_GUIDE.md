# Quick Setup Guide - Face & Object Detection

## ✅ Installation Complete!

Your quiz portal now has **privacy-first face detection and object detection** running entirely on the client-side!

## 🚀 What Was Added

### 1. **Dependencies Installed**
```json
{
  "@mediapipe/face_detection": "Face detection ML model",
  "@mediapipe/camera_utils": "Camera utilities for MediaPipe",
  "@tensorflow/tfjs": "TensorFlow.js framework",
  "@tensorflow-models/coco-ssd": "Object detection model"
}
```

### 2. **New Files Created**

#### `src/hooks/useDetection.js`
- Custom React hook for detection logic
- Manages face detection (MediaPipe)
- Manages object detection (COCO-SSD)
- Handles warnings and violations
- 100% client-side processing

#### `src/components/QuizMonitor.jsx`
- Floating monitor component
- Shows during quiz
- Real-time violation tracking
- Minimizable interface
- Privacy-preserving

#### `DETECTION_README.md`
- Complete technical documentation
- Privacy guarantees
- Configuration guide
- Troubleshooting tips

### 3. **Updated Files**

#### `src/pages/quiz/preQuizSetup/camerasetup.jsx`
- Integrated face detection
- Added object detection
- Warning display system
- Conditional "Continue" button
- Privacy notice

#### `src/pages/quiz/inQuizSetup/QuestionPage.jsx`
- Added QuizMonitor component
- Proctoring violation tracking
- Enhanced violation display

## 🎯 How to Use

### For Students:

1. **Login to the quiz portal**
   ```
   Navigate to: http://localhost:5173
   ```

2. **Proceed to Camera Setup**
   - Camera access will be requested
   - Grant permission when prompted

3. **Start Face Detection**
   - Click "Start Face Detection" button
   - Wait 5-10 seconds for models to load
   - Position yourself properly:
     - Center of frame
     - Face clearly visible
     - Good lighting
     - **Only ONE person**
     - **No phones or devices**

4. **Check Status**
   - Green indicator = Ready ✓
   - Red indicator = Issues detected ⚠️
   - Fix any warnings before continuing

5. **Continue to Quiz**
   - Button enables only when:
     - Exactly 1 face detected
     - No objects detected
   - Monitor appears during quiz

6. **During Quiz**
   - Small monitor in bottom-right
   - Shows real-time status
   - Violations are logged
   - Can minimize but stays active

### For Developers:

#### Test the Detection:
```bash
# Server is already running at http://localhost:5173
# Navigate to camera setup page
# Try these scenarios:

1. One person (should show green ✓)
2. Two people (should show warning ⚠️)
3. Hold up phone (should detect "cell phone")
4. Show a book (should detect "book")
5. Hide your face (should show no face warning)
```

#### Customize Detection:

**Adjust confidence threshold:**
```javascript
// In src/hooks/useDetection.js
minDetectionConfidence: 0.5  // Lower = more sensitive
```

**Change detection frequency:**
```javascript
// In src/hooks/useDetection.js
setInterval(detectObjects, 2000)  // Milliseconds
```

**Add more objects to detect:**
```javascript
// In src/hooks/useDetection.js
const suspiciousObjects = predictions.filter(pred => 
  pred.class === 'cell phone' || 
  pred.class === 'book' || 
  pred.class === 'laptop' ||
  pred.class === 'tablet'  // Add new item
);
```

## 🔒 Privacy Guarantees

### What Happens to Your Data?
**NOTHING!** 

```
Camera Stream → Browser Memory → ML Model → Detection Result → Display
                                                                 ↓
                                                      Garbage Collected
```

- ❌ No images saved
- ❌ No videos recorded
- ❌ No upload to servers
- ❌ No facial recognition
- ❌ No biometric storage
- ✅ Only counts and warnings (temporary)

## 📊 Features Implemented

### ✅ Camera Setup Page
- Real-time video preview
- Face count indicator
- Object detection alerts
- Warning history display
- Conditional proceed button
- Privacy notice

### ✅ Quiz Monitoring
- Floating video monitor
- Minimizable interface
- Violation counter
- Status indicators
- Warning logs

### ✅ Violation Tracking
- Tab switches (existing)
- Multi-face detection (new)
- No face detection (new)
- Phone detection (new)
- Other object detection (new)

### ✅ User Experience
- Clear status indicators
- Color-coded warnings
- Real-time feedback
- Non-intrusive monitoring
- Minimizable interface

## 🧪 Testing Checklist

- [ ] Camera access works
- [ ] Models load successfully (5-10 seconds)
- [ ] Single face detection works (green indicator)
- [ ] Multi-face warning appears
- [ ] No face warning appears
- [ ] Phone detection works
- [ ] Continue button enables/disables correctly
- [ ] Monitor appears during quiz
- [ ] Violations are logged
- [ ] Monitor can be minimized
- [ ] No console errors

## 🐛 Troubleshooting

### Models not loading?
- Check internet connection (CDN download)
- Clear browser cache
- Wait 10-15 seconds

### Camera not working?
- Check browser permissions
- Close other apps using camera
- Try different browser

### False detections?
- Adjust confidence threshold
- Improve lighting
- Remove reflective surfaces

### Performance issues?
- Use Chrome/Edge (best performance)
- Close unnecessary tabs
- Update graphics drivers

## 📝 Next Steps

### Optional Enhancements:

1. **Backend Logging**
   ```javascript
   // In QuestionPage.jsx handleProctoringViolation
   await axios.post('/api/quiz/violations', violation);
   ```

2. **Auto-Submit on Violations**
   ```javascript
   if (proctoringViolations >= 5) {
     navigate('/submit');
   }
   ```

3. **Email Notifications**
   - Send alerts to instructors
   - Log to admin dashboard

4. **Advanced Analytics**
   - Violation heatmaps
   - Time-series analysis
   - Student behavior patterns

## 🎉 Success!

Your quiz portal now has:
- ✅ Face detection (MediaPipe)
- ✅ Object detection (COCO-SSD)
- ✅ Privacy-first implementation
- ✅ Real-time monitoring
- ✅ Violation tracking
- ✅ Professional UI

## 📚 Resources

- **Full Documentation**: `DETECTION_README.md`
- **MediaPipe Docs**: https://google.github.io/mediapipe/
- **COCO-SSD Docs**: https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd
- **TensorFlow.js**: https://www.tensorflow.org/js

---

**Questions or Issues?** Check the `DETECTION_README.md` for detailed technical information and troubleshooting.

**Remember**: All detection runs locally in the browser. No data is ever stored or transmitted! 🔒
