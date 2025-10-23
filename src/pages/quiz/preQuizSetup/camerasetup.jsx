import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDetection from "../../../hooks/useDetection";

export default function CameraSetupPage() {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  // Start detection immediately upon component mount
  const [enableDetection] = useState(true);
  // Don't count violations on camera setup page, only show detection status
  const { faceCount, faceBoxes, objectsDetected, warnings, isLoading } = useDetection(
    videoRef,
    enableDetection,
    false  // Don't count violations during setup
  );

  useEffect(() => {
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 }
          } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Please allow camera access to continue.");
      }
    };

    enableCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const canProceed = !isLoading && faceCount === 1 && objectsDetected.length === 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-3 sm:px-4 py-4 sm:py-6 md:py-10">
      <div className="max-w-4xl w-full bg-white p-3 sm:p-4 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-md border border-gray-100">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-center text-gray-800 mb-4 sm:mb-6 md:mb-8">
          Camera Setup & AI Proctoring
        </h2>

        {/* Video Preview Box */}
        <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
          <div className="rounded-lg sm:rounded-xl overflow-hidden border-2 border-gray-300 shadow-sm w-full max-w-[320px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] aspect-video bg-black relative">
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
            {/* Detection Status Overlay */}
            <div className="absolute top-2 left-2 right-2 flex flex-col gap-2">
              {isLoading ? (
                <div className="bg-yellow-500 bg-opacity-90 text-white px-3 py-2 rounded-lg text-sm font-medium">
                  🔄 Loading detection models...
                </div>
              ) : (
                <>
                  <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    faceCount === 1 
                      ? 'bg-green-500 bg-opacity-90 text-white' 
                      : faceCount > 1
                      ? 'bg-red-500 bg-opacity-90 text-white'
                      : 'bg-orange-500 bg-opacity-90 text-white'
                  }`}>
                    👤 Faces Detected: {faceCount} {faceCount === 1 ? '✓' : faceCount > 1 ? '⚠️' : '❌'}
                  </div>
                  {objectsDetected.length > 0 && (
                    <div className="bg-red-500 bg-opacity-90 text-white px-3 py-2 rounded-lg text-sm font-medium">
                      📱 Objects: {objectsDetected.map(obj => obj.class).join(', ')} ⚠️
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Warnings Display */}
        {warnings.length > 0 && (
          <div className="mb-4 sm:mb-6 space-y-2">
            {warnings.slice(-3).map((warning) => (
              <div
                key={warning.id}
                className={`p-3 rounded-lg border-2 ${
                  warning.type === 'multi-face' || warning.type === 'phone-detected'
                    ? 'bg-red-50 border-red-300 text-red-800'
                    : warning.type === 'no-face'
                    ? 'bg-orange-50 border-orange-300 text-orange-800'
                    : 'bg-yellow-50 border-yellow-300 text-yellow-800'
                }`}
              >
                <p className="font-semibold text-sm">{warning.message}</p>
                <p className="text-xs mt-1 opacity-75">
                  {new Date(warning.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Detection Status */}
        {!isLoading && (
          <div className="mb-4 sm:mb-6">
            <div className={`p-4 rounded-lg border-2 ${
              canProceed
                ? 'bg-green-50 border-green-300'
                : 'bg-yellow-50 border-yellow-300'
            }`}>
              <p className={`font-semibold text-sm ${
                canProceed ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {canProceed 
                  ? '✓ All checks passed! You can proceed to the quiz.'
                  : '⚠️ Please ensure only one face is visible and no electronic devices are present.'}
              </p>
            </div>
          </div>
        )}

        {/* Camera Requirements Box */}
        <div className="bg-blue-50 border border-blue-200 text-blue-900 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl mb-4 sm:mb-6 md:mb-8">
          <p className="font-semibold text-sm sm:text-base md:text-lg mb-2 sm:mb-3">
            Camera Requirements:
          </p>
          <ul className="list-disc list-inside text-xs sm:text-sm md:text-base space-y-1 sm:space-y-2">
            <li>Position yourself in the center of the frame</li>
            <li>Ensure your face is clearly visible</li>
            <li>Make sure the lighting is good</li>
            <li>Please ensure that shoulders are visible</li>
            <li>Remove any hats or sunglasses</li>
            <li>Only ONE person should be visible in the frame</li>
            <li>Remove all electronic devices (phones, tablets, etc.)</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/quiz/ready")}
            disabled={!canProceed}
            className={`w-full sm:w-auto font-medium px-4 sm:px-5 md:px-6 py-2.5 sm:py-2 md:py-2.5 rounded-lg shadow-sm transition-all duration-200 text-sm sm:text-base ${
              canProceed
                ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Loading Detection Models...' : 'Continue to Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
}
