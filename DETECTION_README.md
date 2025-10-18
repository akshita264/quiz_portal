# Face Detection & Object Detection - Privacy-First Proctoring

## Overview

This quiz portal includes **client-side face detection and object detection** to ensure exam integrity. All processing happens **locally in the browser** - no images, videos, or personal data are ever stored, uploaded, or transmitted to any server.

## Technologies Used

- **MediaPipe Face Detection**: Google's ML-powered face detection running entirely in the browser
- **COCO-SSD**: TensorFlow.js object detection model for identifying phones and other objects
- **TensorFlow.js**: Machine learning framework for browser-based inference

## Features

### 🎯 Face Detection
- Detects the number of faces in the camera frame
- Raises warnings if:
  - **Multiple faces detected** (more than one person present)
  - **No face detected** (student not visible)
- Only allows quiz to proceed when exactly **one face** is detected

### 📱 Object Detection
- Scans for suspicious objects including:
  - **Mobile phones** (cell phone)
  - **Books**
  - **Laptops**
- Raises immediate warnings when any prohibited items are detected
- Prevents quiz start if objects are present

### 🔒 Privacy Guarantees
- ✅ **100% Client-Side Processing**: All ML models run in your browser
- ✅ **Zero Storage**: No images or videos are saved anywhere
- ✅ **No Upload**: Nothing is transmitted to servers
- ✅ **No Recording**: Video stream is processed in real-time only
- ✅ **Memory Only**: Detections happen in RAM and are immediately discarded

### 📊 Continuous Monitoring
- Small video monitor during quiz (bottom-right corner)
- Real-time violation tracking
- Minimizable interface
- Displays:
  - Current face count
  - Detected objects
  - Violation history
  - Total violation count

## How It Works

### Camera Setup Page
1. User enables camera access
2. Clicks "Start Face Detection" button
3. Models load (takes 5-10 seconds)
4. Real-time detection begins
5. Status indicators show:
   - Face count (green = 1 face ✓, red = multiple/none ⚠️)
   - Object detections (red alert if found)
6. "Continue to Quiz" button only enabled when:
   - Exactly 1 face detected
   - No prohibited objects present

### During Quiz
1. Small monitoring window appears in bottom-right
2. Continuous detection every 2 seconds
3. Violations automatically logged:
   - Multi-face detection
   - No face detection
   - Phone/object detection
4. Violation counts displayed in quiz header
5. Monitor can be minimized but continues running

## Technical Implementation

### File Structure
```
src/
├── hooks/
│   └── useDetection.js          # Custom hook for face & object detection
├── components/
│   └── QuizMonitor.jsx          # Floating monitor component
└── pages/
    └── quiz/
        └── preQuizSetup/
            └── camerasetup.jsx  # Initial detection setup
```

### Key Components

#### useDetection Hook
```javascript
const { 
  faceCount,           // Number of faces detected
  objectsDetected,     // Array of detected objects
  warnings,            // Warning messages array
  isLoading,           // Models loading state
  clearWarnings        // Function to clear warnings
} = useDetection(videoRef, enableDetection);
```

#### Detection Flow
1. **Initialization**:
   - MediaPipe Face Detection model loads from CDN
   - COCO-SSD model loads from TensorFlow Hub
   - Camera stream initiated

2. **Face Detection** (Continuous):
   - MediaPipe processes each video frame
   - Counts faces using bounding boxes
   - Triggers warnings on violations

3. **Object Detection** (Every 2 seconds):
   - COCO-SSD analyzes video frame
   - Filters for: cell phone, book, laptop
   - Raises alerts on matches

4. **Cleanup**:
   - Camera stream stopped on unmount
   - Models disposed
   - All references cleared

## Configuration

### Detection Thresholds
In `src/hooks/useDetection.js`:

```javascript
// Face detection confidence (0.0 - 1.0)
minDetectionConfidence: 0.5

// Object detection runs every N milliseconds
setInterval(detectObjects, 2000)  // 2 seconds

// Objects to detect
['cell phone', 'book', 'laptop']
```

### Warnings Retention
```javascript
// Keep last N warnings
return [...prev.slice(-4), newWarning]; // Keeps 5 warnings
```

## Performance

- **Initial Load**: 5-10 seconds (model downloads)
- **Face Detection**: Real-time (~30-60 FPS)
- **Object Detection**: Every 2 seconds
- **Memory Usage**: ~100-150MB
- **CPU Usage**: Moderate (optimized for client-side)

## Browser Compatibility

| Browser | Face Detection | Object Detection | Notes |
|---------|---------------|------------------|-------|
| Chrome 90+ | ✅ | ✅ | Recommended |
| Firefox 88+ | ✅ | ✅ | Fully supported |
| Safari 14+ | ✅ | ⚠️ | May be slower |
| Edge 90+ | ✅ | ✅ | Chromium-based |

## Privacy & Security

### What is NOT collected:
- ❌ No images captured
- ❌ No videos recorded
- ❌ No facial recognition data
- ❌ No biometric identifiers
- ❌ No personal identifiable information

### What IS processed (locally only):
- ✅ Number of faces (count only)
- ✅ Object categories (labels only)
- ✅ Bounding box coordinates (discarded immediately)
- ✅ Violation timestamps (for logging)

### Data Flow
```
Camera → Browser Memory → ML Models → Detections → UI Display → Garbage Collected
        (No storage, no upload, no persistence)
```

## Troubleshooting

### Models Not Loading
- Check internet connection (models download from CDN)
- Clear browser cache
- Try different browser
- Check console for errors

### Camera Not Working
- Grant camera permissions
- Close other apps using camera
- Check browser settings
- Try incognito mode

### False Positives
- Adjust `minDetectionConfidence` in useDetection.js
- Improve lighting conditions
- Ensure clear view of face
- Remove reflective surfaces

### Performance Issues
- Close unnecessary browser tabs
- Update graphics drivers
- Use recommended browsers (Chrome/Edge)
- Reduce video quality if needed

## Development

### Adding New Detection Types
To detect additional objects, modify the filter in `useDetection.js`:

```javascript
const suspiciousObjects = predictions.filter(pred => 
  pred.class === 'cell phone' || 
  pred.class === 'book' || 
  pred.class === 'laptop' ||
  pred.class === 'YOUR_NEW_OBJECT'  // Add here
);
```

Available COCO-SSD classes: person, bicycle, car, motorcycle, airplane, bus, train, truck, boat, traffic light, fire hydrant, stop sign, parking meter, bench, bird, cat, dog, horse, sheep, cow, elephant, bear, zebra, giraffe, backpack, umbrella, handbag, tie, suitcase, frisbee, skis, snowboard, sports ball, kite, baseball bat, baseball glove, skateboard, surfboard, tennis racket, bottle, wine glass, cup, fork, knife, spoon, bowl, banana, apple, sandwich, orange, broccoli, carrot, hot dog, pizza, donut, cake, chair, couch, potted plant, bed, dining table, toilet, tv, laptop, mouse, remote, keyboard, cell phone, microwave, oven, toaster, sink, refrigerator, book, clock, vase, scissors, teddy bear, hair drier, toothbrush

### Adjusting Detection Frequency
In `useDetection.js`:

```javascript
// Change interval (milliseconds)
detectionIntervalRef.current = setInterval(detectObjects, 3000); // 3 seconds
```

## License

This implementation uses open-source ML models:
- MediaPipe: Apache License 2.0
- COCO-SSD: Apache License 2.0
- TensorFlow.js: Apache License 2.0

## Credits

- **MediaPipe** by Google Research
- **COCO-SSD** by TensorFlow team
- **TensorFlow.js** by Google Brain team

---

**Remember**: This is a privacy-first implementation. All processing happens in the browser, ensuring student privacy while maintaining exam integrity.
