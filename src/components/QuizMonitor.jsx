import React, { useRef, useEffect, useState } from 'react';
import useDetection from '../hooks/useDetection';
import { AlertTriangle, X } from 'lucide-react';

/**
 * QuizMonitor - Continuous face and object detection during quiz
 * Displays a small video preview and warnings
 */
export default function QuizMonitor({ onViolation }) {
  const videoRef = useRef(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  
  // Enable violation counting during quiz
  const { faceCount, faceBoxes, objectsDetected, warnings, isLoading } = useDetection(
    videoRef,
    true,  // Always enable detection
    true   // Count violations during quiz
  );

  // Enable camera
  useEffect(() => {
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 320 },
            height: { ideal: 240 }
          } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera for monitoring:", err);
      }
    };

    enableCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Track violations
  useEffect(() => {
    if (faceCount > 1 || (faceCount === 0 && !isLoading)) {
      setViolationCount(prev => prev + 1);
      onViolation?.({
        type: faceCount > 1 ? 'multi-face' : 'no-face',
        count: faceCount,
        timestamp: new Date().toISOString()
      });
    }
    
    if (objectsDetected.length > 0) {
      setViolationCount(prev => prev + 1);
      onViolation?.({
        type: 'object-detected',
        objects: objectsDetected.map(obj => obj.class),
        timestamp: new Date().toISOString()
      });
    }
  }, [faceCount, objectsDetected, isLoading, onViolation]);

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-[100]">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
        >
          <AlertTriangle size={18} />
          <span className="text-sm font-medium">Show Monitor</span>
          {violationCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {violationCount}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100] bg-white rounded-lg shadow-2xl border-2 border-gray-300 overflow-hidden w-80">
      {/* Header */}
      <div className="bg-gray-800 text-white px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            !isLoading && faceCount === 1 && objectsDetected.length === 0
              ? 'bg-green-400'
              : 'bg-red-400'
          } animate-pulse`} />
          <span className="text-sm font-medium">Proctoring Monitor</span>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Video Preview */}
      <div className="relative bg-black aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        {/* Face bounding boxes overlay */}
        {faceBoxes.length > 0 && (
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {faceBoxes.map((box, idx) => (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  border: '2px solid #22c55e',
                  borderRadius: '8px',
                  boxShadow: '0 0 8px 2px #22c55e88',
                  left: `${box.x * 100}%`,
                  top: `${box.y * 100}%`,
                  width: `${box.width * 100}%`,
                  height: `${box.height * 100}%`,
                  zIndex: 10,
                }}
              />
            ))}
          </div>
        )}
        {/* Status Indicators */}
        <div className="absolute top-2 left-2 right-2 flex flex-col gap-1.5">
          {isLoading ? (
            <div className="bg-yellow-500 bg-opacity-90 text-white px-2 py-1 rounded text-xs font-medium">
              Loading...
            </div>
          ) : (
            <>
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                faceCount === 1 
                  ? 'bg-green-500 bg-opacity-90 text-white' 
                  : 'bg-red-500 bg-opacity-90 text-white'
              }`}>
                Faces: {faceCount} {faceCount === 1 ? '✓' : '⚠️'}
              </div>
              {objectsDetected.length > 0 && (
                <div className="bg-red-500 bg-opacity-90 text-white px-2 py-1 rounded text-xs font-medium">
                  📱 {objectsDetected[0].class} detected!
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Recent Warnings */}
      {warnings.length > 0 && (
        <div className="p-2 bg-red-50 border-t border-red-200 max-h-24 overflow-y-auto">
          <p className="text-xs font-semibold text-red-800 mb-1">Recent Violations:</p>
          <div className="space-y-1">
            {warnings.slice(-2).map((warning) => (
              <div key={warning.id} className="text-xs text-red-700">
                • {warning.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 
      <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 flex justify-between text-xs">
        <span className="text-gray-600">Total Violations:</span>
        <span className="font-bold text-red-600">{violationCount}</span>
      </div> */}
    </div>
  );
}
