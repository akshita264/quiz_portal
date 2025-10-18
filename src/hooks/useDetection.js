import { useEffect, useRef, useState } from 'react';
import { FaceDetection } from '@mediapipe/face_detection';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

// useDetection hook: runs face and object detection on a video stream
export default function useDetection(videoRef, enableDetection = true, countViolations = false) {
  const [faceCount, setFaceCount] = useState(0);
  const [faceBoxes, setFaceBoxes] = useState([]); // bounding boxes
  const [objectsDetected, setObjectsDetected] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const faceDetectorRef = useRef(null);
  const objectModelRef = useRef(null);
  const animationFrameId = useRef(null);
  const objectIntervalId = useRef(null);
  const countViolationsRef = useRef(countViolations);

  // Update ref when countViolations changes
  useEffect(() => {
    countViolationsRef.current = countViolations;
  }, [countViolations]);

  // Load models once
  useEffect(() => {
    let isMounted = true;
    let detector;
    setIsLoading(true);
    async function setup() {
      detector = new FaceDetection({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`
      });
      detector.setOptions({
        model: 'short',
        minDetectionConfidence: 0.5,
      });
      detector.onResults((results) => {
        if (!isMounted) return;
        const detections = results.detections || [];
        setFaceCount(detections.length);
        const boxes = detections.map(det => {
          const box = det.locationData?.relativeBoundingBox;
          if (!box) return null;
          return {
            x: box.xMin,
            y: box.yMin,
            width: box.width,
            height: box.height,
          };
        }).filter(Boolean);
        setFaceBoxes(boxes);
        if (countViolationsRef.current) {
          if (detections.length === 0) {
            setWarnings(w => [...w, {
              id: Date.now(),
              type: 'no-face',
              message: 'No face detected',
              timestamp: Date.now()
            }]);
          } else if (detections.length > 1) {
            setWarnings(w => [...w, {
              id: Date.now(),
              type: 'multi-face',
              message: 'Multiple faces detected',
              timestamp: Date.now()
            }]);
          }
        }
      });
      faceDetectorRef.current = detector;
      await tf.ready();
      objectModelRef.current = await cocoSsd.load();
      setIsLoading(false);
    }
    setup();
    return () => {
      isMounted = false;
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (objectIntervalId.current) clearInterval(objectIntervalId.current);
    };
  }, []);

  // Face detection loop
  useEffect(() => {
    if (!enableDetection) return;
    const video = videoRef.current;
    if (!video) return;
    let stopped = false;
    async function processFrame() {
      if (stopped) return;
      if (faceDetectorRef.current && video.readyState === 4) {
        await faceDetectorRef.current.send({ image: video });
      }
      animationFrameId.current = requestAnimationFrame(processFrame);
    }
    animationFrameId.current = requestAnimationFrame(processFrame);
    return () => {
      stopped = true;
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [videoRef, enableDetection]);

  // Object detection loop
  useEffect(() => {
    if (!enableDetection) return;
    const video = videoRef.current;
    if (!video) return;
    objectIntervalId.current = setInterval(async () => {
      if (objectModelRef.current && video.readyState === 4) {
        const predictions = await objectModelRef.current.detect(video);
        // Only show not allowed objects in UI and warnings
        const notAllowedClasses = [
          'cell phone', 'laptop', 'tablet', 'remote', 'keyboard', 'mouse', 'book', 'tv', 'monitor', 'screen', 'computer'
        ];
        const notAllowed = predictions.filter(p => notAllowedClasses.includes(p.class));
        setObjectsDetected(notAllowed); // Only show not allowed objects
        if (countViolations) {
          if (notAllowed.length > 0) {
            setWarnings(w => [...w, {
              id: Date.now(),
              type: 'device-detected',
              message: `Not allowed device detected: ${notAllowed.map(p => p.class).join(', ')}`,
              timestamp: Date.now()
            }]);
          }
        }
        // Do NOT warn for 'person' class
      }
    }, 2000); // every 2 seconds
    return () => {
      if (objectIntervalId.current) clearInterval(objectIntervalId.current);
    };
  }, [videoRef, enableDetection, countViolations]);

  return { faceCount, faceBoxes, objectsDetected, warnings, isLoading };
}
