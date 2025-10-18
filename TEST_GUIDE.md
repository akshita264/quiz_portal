# 🧪 Quick Test Guide - Face & Object Detection

## 🚀 Your Server is Running!

**URL**: http://localhost:5173

---

## 📝 Quick Test Steps

### Step 1: Navigate to Camera Setup
1. Open browser: `http://localhost:5173`
2. Login (use any credentials for demo)
3. Navigate through quiz setup to camera setup page

### Step 2: Test Face Detection

#### Test Case 1: Normal (Should Pass ✅)
```
Action: Sit normally in front of camera
Expected: Green "Faces: 1 ✓" indicator
Result: "Continue" button enabled
```

#### Test Case 2: Multiple Faces (Should Warn ⚠️)
```
Action: Have another person appear in frame
Expected: Red "Faces: 2 ⚠️" indicator
Result: Warning message appears, "Continue" disabled
```

#### Test Case 3: No Face (Should Warn ⚠️)
```
Action: Move out of camera view
Expected: Orange "Faces: 0 ❌" indicator
Result: Warning message appears, "Continue" disabled
```

### Step 3: Test Object Detection

#### Test Case 4: Phone Detection (Should Warn ⚠️)
```
Action: Hold a phone up to camera
Expected: Red "Objects: cell phone ⚠️" indicator
Result: Warning message appears, "Continue" disabled
```

#### Test Case 5: Book Detection (Should Warn ⚠️)
```
Action: Hold a book up to camera
Expected: Detection alert appears
Result: Warning logged
```

#### Test Case 6: Laptop Detection (Should Warn ⚠️)
```
Action: Position laptop in frame
Expected: Detection alert appears
Result: Warning logged
```

---

## 🎯 Expected Behaviors

### Camera Setup Page

**When Starting:**
```
1. Camera permission popup → Grant access
2. Video preview appears → See yourself
3. Click "Start Face Detection" → Models loading...
4. Wait 5-10 seconds → Models loaded!
5. Status indicators appear → Real-time feedback
```

**Status Indicators:**

| Condition | Face Indicator | Object Indicator | Button State |
|-----------|----------------|------------------|--------------|
| Perfect (1 face, no objects) | 🟢 "Faces: 1 ✓" | None | ✅ Enabled |
| Multiple faces | 🔴 "Faces: 2+ ⚠️" | None | ❌ Disabled |
| No face | 🟠 "Faces: 0 ❌" | None | ❌ Disabled |
| Phone detected | 🟢/🟠 Face status | 🔴 "Objects: cell phone" | ❌ Disabled |
| Other object | 🟢/🟠 Face status | 🟡 Object name | ❌ Disabled |

**Warnings Display:**

Each warning shows:
- ⚠️ Icon and message
- Timestamp
- Color-coded by severity (red/orange/yellow)
- Auto-scrolls to latest

---

### Quiz Page

**Monitor Appearance:**
```
Location: Bottom-right corner
Size: 320px width
State: Can be minimized
Updates: Real-time
```

**Monitor States:**

**Minimized:**
```
┌────────────────────┐
│ 🚨 Show Monitor [3]│  ← Badge shows violations
└────────────────────┘
```

**Expanded:**
```
┌─────────────────────────┐
│ 🟢 Proctoring Monitor   │
│─────────────────────────│
│ [Video Preview]         │
│ Faces: 1 ✓             │
│─────────────────────────│
│ Recent Violations:      │
│ • Warning 1            │
│ • Warning 2            │
│─────────────────────────│
│ Total Violations: 3     │
└─────────────────────────┘
```

---

## 📊 Console Logs to Watch

Open browser DevTools (F12) and watch for:

### Successful Detection:
```javascript
[DETECTION] Face count: 1
[DETECTION] Objects: []
[DETECTION] All clear ✓
```

### Violation Detection:
```javascript
[PROCTORING] Violation detected: { type: 'multi-face', count: 2 }
[PROCTORING] Violation detected: { type: 'phone-detected', objects: ['cell phone'] }
```

### Model Loading:
```javascript
[INFO] Loading MediaPipe Face Detection...
[INFO] Loading COCO-SSD Object Detection...
[SUCCESS] Models loaded successfully
```

---

## ⚡ Performance Checklist

### Initial Load (First Time):
- [ ] Camera permission requested
- [ ] Video preview appears immediately
- [ ] Models start loading (progress indicator)
- [ ] Models load in 5-10 seconds
- [ ] Detection starts automatically
- [ ] UI responsive throughout

### Detection Running:
- [ ] Face count updates in real-time
- [ ] Object detection every ~2 seconds
- [ ] No lag or freezing
- [ ] Smooth video playback
- [ ] Warnings appear promptly

### During Quiz:
- [ ] Monitor appears automatically
- [ ] Violations tracked correctly
- [ ] Can minimize/maximize smoothly
- [ ] No impact on quiz performance

---

## 🐛 Troubleshooting Quick Fixes

### Problem: Models Not Loading

**Check:**
```
1. Internet connection active?
2. Console shows errors?
3. Try refreshing page
4. Clear cache (Ctrl+Shift+Del)
5. Try incognito mode
```

**Expected Time:**
- First load: 5-10 seconds (downloading)
- Subsequent: 1-2 seconds (cached)

---

### Problem: Camera Not Working

**Check:**
```
1. Permission granted? (check browser icon)
2. Other apps using camera? (close them)
3. Try different browser
4. Restart browser
5. Check browser settings → Privacy → Camera
```

---

### Problem: False Detections

**Common Causes:**
```
1. Poor lighting → Improve lighting
2. Shadows → Remove/reposition light sources
3. Reflections → Remove mirrors/glass
4. Background clutter → Clean background
5. Camera quality → Use better camera
```

**Adjust Sensitivity:**
```javascript
// In src/hooks/useDetection.js
minDetectionConfidence: 0.6  // Increase for fewer false positives
```

---

### Problem: High CPU Usage

**Solutions:**
```
1. Close other tabs
2. Close other applications
3. Update browser
4. Update graphics drivers
5. Reduce detection frequency:
   setInterval(detectObjects, 3000)  // 3 seconds instead of 2
```

---

## 🎨 Visual Test Checklist

### Camera Setup Page:

```
┌─────────────────────────────────────┐
│     Camera Setup & Verification      │
│─────────────────────────────────────│
│                                     │
│  ┌─────────────────────────────┐  │
│  │                             │  │
│  │    [Video Preview]          │  │ ✅ Shows live video
│  │                             │  │
│  │  Faces: 1 ✓                │  │ ✅ Shows face count
│  │                             │  │
│  └─────────────────────────────┘  │
│                                     │
│  ⚠️ Warning: No face detected      │ ✅ Shows warnings
│                                     │
│  ✓ All checks passed! You can      │ ✅ Shows status
│    proceed to the quiz.             │
│                                     │
│  Requirements:                      │
│  • Only ONE person visible          │ ✅ Clear instructions
│  • Remove all electronic devices    │
│                                     │
│  [Continue to Quiz]                 │ ✅ Button state correct
│                                     │
│  🔒 Privacy: All detection runs     │ ✅ Privacy notice
│     locally in your browser.        │
└─────────────────────────────────────┘
```

---

### Quiz Page:

```
Main Quiz Interface
┌────────────────────────────────────────┐
│ Logo        Question 5 of 20    Timer  │
│             ⚠️ Tab switches: 1          │ ✅ Tab violations
│             👁️ Proctoring: 2           │ ✅ Proctoring violations
│────────────────────────────────────────│
│                                        │
│  [Question Content]                    │
│  [Answer Options]                      │
│                                        │
└────────────────────────────────────────┘

Monitor (Bottom-Right)
┌─────────────────────┐
│ 🟢 Proctoring      │ ✅ Status light
│─────────────────────│
│ [Video Preview]     │ ✅ Small video
│ Faces: 1 ✓         │ ✅ Face count
│─────────────────────│
│ Recent Violations:  │ ✅ Warning list
│ • Multi-face: 1    │
│─────────────────────│
│ Total: 2           │ ✅ Counter
└─────────────────────┘
```

---

## 🎯 Acceptance Criteria

Your implementation passes if:

### ✅ Functionality (All Must Pass)
- [ ] Face detection counts faces correctly
- [ ] Object detection identifies phones
- [ ] Warnings appear on violations
- [ ] Continue button enables/disables properly
- [ ] Monitor appears during quiz
- [ ] Violations are tracked and displayed
- [ ] Can minimize/maximize monitor

### ✅ Privacy (All Must Pass)
- [ ] No network uploads (check Network tab)
- [ ] No localStorage/sessionStorage (check Application tab)
- [ ] No IndexedDB entries (check Application tab)
- [ ] Privacy notice displayed
- [ ] Only counts/warnings stored (temporary)

### ✅ Performance (Should Pass)
- [ ] Models load within 10 seconds
- [ ] Face detection real-time (no lag)
- [ ] Object detection smooth (every 2s)
- [ ] No browser freezing
- [ ] CPU usage reasonable (<50%)

### ✅ User Experience (Should Pass)
- [ ] Clear status indicators
- [ ] Intuitive interface
- [ ] Helpful warnings
- [ ] Responsive design
- [ ] Professional appearance

---

## 📈 Test Results Template

Copy and fill out:

```
TEST RESULTS - Face & Object Detection
=====================================

Date: _______________
Tester: _______________
Browser: _______________

CAMERA SETUP PAGE
─────────────────
Face Detection:
  ☐ Single face: _______________
  ☐ Multiple faces: _______________
  ☐ No face: _______________

Object Detection:
  ☐ Phone: _______________
  ☐ Book: _______________
  ☐ Laptop: _______________

UI/UX:
  ☐ Status indicators: _______________
  ☐ Warnings display: _______________
  ☐ Continue button: _______________
  ☐ Privacy notice: _______________

QUIZ PAGE
─────────
Monitor:
  ☐ Appears correctly: _______________
  ☐ Can minimize: _______________
  ☐ Shows violations: _______________
  ☐ Counts accurate: _______________

PERFORMANCE
───────────
  ☐ Load time: _______________ sec
  ☐ FPS estimate: _______________
  ☐ CPU usage: _______________ %
  ☐ Memory: _______________ MB

ISSUES FOUND
────────────
1. _______________
2. _______________
3. _______________

OVERALL RATING: _____ / 10

NOTES:
_______________
_______________
_______________
```

---

## 🎉 Success Indicators

You'll know it's working when:

1. ✅ **Green light when alone** - Face count shows 1 with ✓
2. ✅ **Red alert with multiple people** - Warning appears immediately
3. ✅ **Phone detected** - Alert shows "cell phone detected"
4. ✅ **Continue only when valid** - Button disabled during violations
5. ✅ **Monitor during quiz** - Small window appears bottom-right
6. ✅ **Violations counted** - Numbers increase on violations
7. ✅ **No errors in console** - Clean console logs
8. ✅ **Privacy maintained** - No network activity (check Network tab)

---

## 🚀 Quick Start Command

```bash
# Server already running at:
http://localhost:5173

# To restart if needed:
npm run dev

# To stop:
Ctrl + C
```

---

## 📞 Need Help?

Check these in order:

1. **Browser Console (F12)** - Error messages
2. **Network Tab** - Model loading status
3. **DETECTION_README.md** - Technical details
4. **SETUP_GUIDE.md** - Setup instructions
5. **ARCHITECTURE.md** - System design

---

**Ready to test? Open http://localhost:5173 now!** 🚀

**Remember**: First load takes 5-10 seconds for models to download. Subsequent loads are much faster (cached)! 

**Tip**: Keep browser console open (F12) to see detection logs in real-time!
