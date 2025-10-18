# Detection System Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        QUIZ PORTAL                               │
│                     (Client-Side Only)                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  CAMERA SETUP PAGE                                               │
│  (/quiz/camera-setup)                                            │
│                                                                   │
│  ┌─────────────┐       ┌──────────────────┐                    │
│  │   Camera    │──────▶│  Video Stream    │                    │
│  │   Access    │       │  (Live Preview)  │                    │
│  └─────────────┘       └──────────────────┘                    │
│                                │                                 │
│                                ▼                                 │
│                   ┌────────────────────────┐                    │
│                   │   useDetection Hook    │                    │
│                   └────────────────────────┘                    │
│                        │              │                          │
│                        ▼              ▼                          │
│              ┌──────────────┐  ┌──────────────┐                │
│              │  MediaPipe   │  │  COCO-SSD    │                │
│              │Face Detection│  │   Object     │                │
│              │   (Real-time)│  │ Detection    │                │
│              │              │  │ (Every 2s)   │                │
│              └──────────────┘  └──────────────┘                │
│                        │              │                          │
│                        ▼              ▼                          │
│              ┌─────────────────────────────┐                   │
│              │    Detection Results        │                   │
│              │  • Face Count: 0-N          │                   │
│              │  • Objects: Array           │                   │
│              │  • Warnings: Array          │                   │
│              └─────────────────────────────┘                   │
│                              │                                   │
│                              ▼                                   │
│              ┌─────────────────────────────┐                   │
│              │      UI Display             │                   │
│              │  ✓ Green (1 face, no obj)  │                   │
│              │  ⚠️ Red (multi/no face)     │                   │
│              │  ⚠️ Red (phone detected)    │                   │
│              └─────────────────────────────┘                   │
│                              │                                   │
│                              ▼                                   │
│              ┌─────────────────────────────┐                   │
│              │   Continue Button           │                   │
│              │   (Enabled when valid)      │                   │
│              └─────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  QUIZ PAGE                                                        │
│  (/quiz/questions)                                               │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Main Quiz Interface                                      │  │
│  │  • Questions                                              │  │
│  │  • Timer                                                  │  │
│  │  • Navigation                                             │  │
│  │  • Tab Switch Detection (existing)                       │  │
│  │  • Fullscreen Enforcement (existing)                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  QuizMonitor Component (Bottom-Right)                    │  │
│  │                                                            │  │
│  │  ┌──────────────┐       ┌────────────────┐              │  │
│  │  │   Camera     │──────▶│  Video Preview │              │  │
│  │  │   (Small)    │       │   (320x240)    │              │  │
│  │  └──────────────┘       └────────────────┘              │  │
│  │                                │                          │  │
│  │                                ▼                          │  │
│  │                   ┌────────────────────┐                 │  │
│  │                   │  useDetection Hook │                 │  │
│  │                   │  (Continuous Mode) │                 │  │
│  │                   └────────────────────┘                 │  │
│  │                          │         │                      │  │
│  │              ┌───────────┘         └─────────┐           │  │
│  │              ▼                               ▼           │  │
│  │    ┌──────────────┐              ┌──────────────┐       │  │
│  │    │  Face Check  │              │ Object Check │       │  │
│  │    │  Real-time   │              │  Every 2s    │       │  │
│  │    └──────────────┘              └──────────────┘       │  │
│  │              │                               │           │  │
│  │              └───────────┬───────────────────┘           │  │
│  │                          ▼                               │  │
│  │              ┌────────────────────┐                      │  │
│  │              │  Violation Handler │                      │  │
│  │              │  • Log violation   │                      │  │
│  │              │  • Update counter  │                      │  │
│  │              │  • Display warning │                      │  │
│  │              └────────────────────┘                      │  │
│  │                          │                               │  │
│  │                          ▼                               │  │
│  │              ┌────────────────────┐                      │  │
│  │              │  Minimizable UI    │                      │  │
│  │              │  • Status lights   │                      │  │
│  │              │  • Warning list    │                      │  │
│  │              │  • Violation count │                      │  │
│  │              └────────────────────┘                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌──────────────┐
│  Camera API  │
└──────┬───────┘
       │ Video Stream
       ▼
┌──────────────────┐
│  Video Element   │ ◄─── Reference (videoRef)
└──────┬───────────┘
       │
       ├──────────────────────────────────┐
       │                                   │
       ▼                                   ▼
┌─────────────────┐            ┌──────────────────┐
│   MediaPipe     │            │    COCO-SSD      │
│ Face Detection  │            │ Object Detection │
│                 │            │                  │
│ • Model: short  │            │ • Model: lite    │
│ • Conf: 0.5     │            │ • Interval: 2s   │
└─────────┬───────┘            └────────┬─────────┘
          │                             │
          │ Face Count                  │ Objects Array
          │                             │
          └──────────┬──────────────────┘
                     ▼
          ┌─────────────────────┐
          │  Detection Results  │
          │                     │
          │ {                   │
          │   faceCount: 1,     │
          │   objects: [],      │
          │   warnings: []      │
          │ }                   │
          └──────────┬──────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │   React State       │
          │   (useState)        │
          └──────────┬──────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │    UI Update        │
          │    (Re-render)      │
          └─────────────────────┘
```

## Privacy Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER (CLIENT)                      │
│                                                           │
│  ┌──────────────┐         ┌───────────────┐            │
│  │    Camera    │────────▶│     RAM       │            │
│  │              │         │   (Volatile)  │            │
│  └──────────────┘         └───────┬───────┘            │
│                                    │                     │
│                         ┌──────────▼─────────┐          │
│                         │   ML Models        │          │
│                         │   (In Memory)      │          │
│                         └──────────┬─────────┘          │
│                                    │                     │
│                         ┌──────────▼─────────┐          │
│                         │   Detections       │          │
│                         │   (Temporary)      │          │
│                         └──────────┬─────────┘          │
│                                    │                     │
│                         ┌──────────▼─────────┐          │
│                         │   Display Only     │          │
│                         │   (UI Render)      │          │
│                         └────────────────────┘          │
│                                    │                     │
│                         ┌──────────▼─────────┐          │
│                         │ Garbage Collection │          │
│                         │   (Automatic)      │          │
│                         └────────────────────┘          │
│                                                           │
│  ❌ NO STORAGE                                           │
│  ❌ NO DISK WRITE                                        │
│  ❌ NO NETWORK UPLOAD                                    │
│  ❌ NO PERSISTENCE                                       │
│  ✅ MEMORY ONLY                                          │
│  ✅ AUTO-CLEARED                                         │
└─────────────────────────────────────────────────────────┘

                     ╱╲
                    ╱  ╲
                   ╱ NO ╲
                  ╱ DATA ╲
                 ╱ LEAVES ╲
                ╱  DEVICE  ╲
               ╱────────────╲
```

## Component Hierarchy

```
App.jsx
│
├── Routes
│   │
│   ├── /login
│   │
│   ├── /signup
│   │
│   └── /quiz
│       │
│       ├── /camera-setup ──────┐
│       │   │                    │
│       │   └── CameraSetupPage  │
│       │       │                │
│       │       └── useDetection │◄─── Custom Hook
│       │                        │
│       ├── /ready               │
│       │                        │
│       └── /questions           │
│           │                    │
│           └── QuestionPage     │
│               │                │
│               └── QuizMonitor  │
│                   │            │
│                   └── useDetection ◄─── Reused Hook
│
└── Shared
    │
    ├── useDetection (hook) ──────────┐
    │   │                             │
    │   ├── MediaPipe Integration     │
    │   ├── COCO-SSD Integration      │
    │   ├── Warning Management        │
    │   └── State Management          │
    │                                 │
    └── QuizMonitor (component)       │
        │                             │
        ├── Video Preview             │
        ├── Status Indicators         │
        ├── Violation Display         │
        └── Minimize/Maximize         │
```

## State Management

```
┌─────────────────────────────────────┐
│        useDetection Hook             │
│                                      │
│  State Variables:                   │
│  ┌────────────────────────────┐    │
│  │ faceCount: number          │    │
│  │ objectsDetected: Object[]  │    │
│  │ warnings: Warning[]        │    │
│  │ isLoading: boolean         │    │
│  └────────────────────────────┘    │
│                                      │
│  Refs:                              │
│  ┌────────────────────────────┐    │
│  │ faceDetectionRef           │    │
│  │ cocoModelRef               │    │
│  │ cameraRef                  │    │
│  │ detectionIntervalRef       │    │
│  └────────────────────────────┘    │
│                                      │
│  Returns:                           │
│  ┌────────────────────────────┐    │
│  │ { faceCount,               │    │
│  │   objectsDetected,         │    │
│  │   warnings,                │    │
│  │   isLoading,               │    │
│  │   clearWarnings }          │    │
│  └────────────────────────────┘    │
└─────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│     Component Using Hook             │
│                                      │
│  const {                            │
│    faceCount,                       │
│    objectsDetected,                 │
│    warnings,                        │
│    isLoading                        │
│  } = useDetection(                  │
│    videoRef,                        │
│    enableDetection                  │
│  );                                 │
│                                      │
│  // Render based on state           │
│  {faceCount === 1 ? ✓ : ⚠️}        │
└─────────────────────────────────────┘
```

## Violation Flow

```
┌─────────────┐
│  Detection  │
│   Running   │
└──────┬──────┘
       │
       ▼
┌──────────────────┐     YES    ┌─────────────────┐
│ faceCount > 1?   │────────────▶│ Multi-face      │
└──────┬───────────┘             │ Warning         │
       │ NO                      └─────────┬───────┘
       ▼                                   │
┌──────────────────┐     YES    ┌─────────▼───────┐
│ faceCount === 0? │────────────▶│ No-face         │
└──────┬───────────┘             │ Warning         │
       │ NO                      └─────────┬───────┘
       ▼                                   │
┌──────────────────┐     YES    ┌─────────▼───────┐
│ Phone detected?  │────────────▶│ Phone           │
└──────┬───────────┘             │ Warning         │
       │ NO                      └─────────┬───────┘
       ▼                                   │
┌──────────────────┐     YES    ┌─────────▼───────┐
│ Object detected? │────────────▶│ Object          │
└──────┬───────────┘             │ Warning         │
       │ NO                      └─────────┬───────┘
       ▼                                   │
┌──────────────────┐                      │
│ All Clear ✓      │                      │
└──────────────────┘                      │
                                          │
       ┌──────────────────────────────────┘
       │
       ▼
┌──────────────────┐
│ Add to warnings  │
│ array (max 5)    │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Increment        │
│ violation count  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Trigger callback │
│ (onViolation)    │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Update UI        │
│ (display warning)│
└──────────────────┘
```

## Performance Optimization

```
┌─────────────────────────────────────┐
│         Optimization Strategy        │
│                                      │
│  1. Model Loading                   │
│     • CDN cached                    │
│     • Load once per session         │
│     • Parallel initialization       │
│                                      │
│  2. Detection Frequency             │
│     • Face: Real-time (30-60 FPS)  │
│     • Objects: Every 2 seconds      │
│     • Adjustable intervals          │
│                                      │
│  3. Memory Management               │
│     • Limited warning history       │
│     • Automatic cleanup on unmount  │
│     • No data persistence           │
│                                      │
│  4. UI Updates                      │
│     • React state batching          │
│     • Conditional rendering         │
│     • Minimizable monitor           │
│                                      │
│  5. Browser Optimization            │
│     • WebGL acceleration            │
│     • Web Workers (future)          │
│     • RequestAnimationFrame         │
└─────────────────────────────────────┘
```

---

This architecture ensures:
- ✅ **Privacy**: No data leaves the browser
- ✅ **Performance**: Optimized detection frequencies
- ✅ **Scalability**: Reusable hook pattern
- ✅ **Maintainability**: Clear separation of concerns
- ✅ **Security**: Client-side only processing
