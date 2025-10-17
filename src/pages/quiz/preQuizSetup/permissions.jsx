import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useDetection from "../../../hooks/useDetection";

const PermissionsPage = () => {
  const navigate = useNavigate();
  const [cameraGranted, setCameraGranted] = useState(false);
  const [micGranted, setMicGranted] = useState(false);
  const [fullscreenGranted, setFullscreenGranted] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef(null);
  const [enableDetection] = useState(true);
  // Show detection status but don't count violations on permissions page
  const { faceCount, faceBoxes, objectsDetected, warnings, isLoading } = useDetection(
    videoRef,
    enableDetection,
    false
  );

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
        audio: true,
      });
      if (stream.getVideoTracks().length > 0) setCameraGranted(true);
      if (stream.getAudioTracks().length > 0) setMicGranted(true);
      setError("");
      // Attach stream to video preview for detection
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Please allow camera and microphone access to continue.");
      console.error("Permission error:", err);
    }
  };

  const requestFullscreenPermission = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        setFullscreenGranted(true);
        setError("");
      } else if (document.documentElement.webkitRequestFullscreen) {
        await document.documentElement.webkitRequestFullscreen();
        setFullscreenGranted(true);
        setError("");
      } else if (document.documentElement.msRequestFullscreen) {
        await document.documentElement.msRequestFullscreen();
        setFullscreenGranted(true);
        setError("");
      } else {
        setError("Fullscreen is not supported by this browser.");
      }
    } catch (err) {
      setError("Please allow fullscreen access to continue.");
      console.error("Fullscreen permission error:", err);
    }
  };

  useEffect(() => {
    requestPermissions();
    // Listen for fullscreen change events
    const handleFullscreenChange = () => {
      const isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setFullscreenGranted(isFullscreen);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
      // Stop camera stream on unmount
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleContinue = () => {
    if (cameraGranted && micGranted && fullscreenGranted) {
      navigate("/quiz/camera");
    } else {
      setError("Please enable camera, microphone, and fullscreen permissions.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-3 sm:px-4 py-4 sm:py-6 md:py-10">
      <div className="max-w-4xl w-full bg-white p-3 sm:p-4 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-md border border-gray-100">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-4 sm:mb-6 md:mb-8">
          Required Permissions
        </h2>
        {/* --- Face Detection Preview --- */}
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
        {/* --- End Face Detection Preview --- */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
          {/* Permissions Required */}
          <div>
            <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-2 sm:mb-3 text-blue-900">
              Permissions Required:
            </h3>
            <ul className="list-disc pl-4 sm:pl-5 md:pl-6 text-gray-700 space-y-1 sm:space-y-2 text-xs sm:text-sm md:text-base">
              <li>
                Access to your <strong>camera</strong> is required for monitoring.
              </li>
              <li>
                Access to your <strong>microphone</strong> is required for verification.
              </li>
              <li>
                <strong>Fullscreen mode</strong> is required to prevent cheating and ensure focus.
              </li>
              <li>Ensure your browser has permission to use all required features.</li>
              <li>
                You can check permissions in your browser's address bar (🔒 icon).
              </li>
            </ul>
          </div>

          {/* Current Status */}
          <div>
            <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-2 sm:mb-3 text-blue-900">
              Current Status:
            </h3>
            <ul className="list-disc pl-4 sm:pl-5 md:pl-6 text-gray-700 space-y-1 sm:space-y-2 text-xs sm:text-sm md:text-base">
              <li>
                Camera Access:{" "}
                <span
                  className={`font-semibold ${
                    cameraGranted ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {cameraGranted ? "Granted ✅" : "Not Granted ❌"}
                </span>
              </li>
              <li>
                Microphone Access:{" "}
                <span
                  className={`font-semibold ${
                    micGranted ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {micGranted ? "Granted ✅" : "Not Granted ❌"}
                </span>
              </li>
              <li>
                Fullscreen Access:{" "}
                <span
                  className={`font-semibold ${
                    fullscreenGranted ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {fullscreenGranted ? "Granted ✅" : "Not Granted ❌"}
                </span>
              </li>
            </ul>
          </div>

          {/* Fullscreen Permission Button */}
          {!fullscreenGranted && (
            <div className="flex justify-center">
              <button
                onClick={requestFullscreenPermission}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-4 sm:px-5 md:px-6 py-2.5 sm:py-2 md:py-2.5 rounded-md shadow-md transition-all text-xs sm:text-sm md:text-base"
              >
                Enable Fullscreen Mode
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <p className="text-red-600 text-center font-medium text-xs sm:text-sm md:text-base">
              {error}
            </p>
          )}

          {/* Continue Button */}
          <div className="flex justify-center pt-3 sm:pt-4 md:pt-6">
            <button
              onClick={handleContinue}
              disabled={!cameraGranted || !micGranted || !fullscreenGranted}
              className={`w-full sm:w-auto font-semibold px-4 sm:px-5 md:px-6 py-2.5 sm:py-2 md:py-2.5 rounded-md shadow-md transition-all text-xs sm:text-sm md:text-base ${
                cameraGranted && micGranted && fullscreenGranted
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionsPage;
