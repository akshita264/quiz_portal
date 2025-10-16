import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PermissionsPage = () => {
  const navigate = useNavigate();
  const [cameraGranted, setCameraGranted] = useState(false);
  const [micGranted, setMicGranted] = useState(false);
  const [fullscreenGranted, setFullscreenGranted] = useState(false);
  const [error, setError] = useState("");

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (stream.getVideoTracks().length > 0) setCameraGranted(true);
      if (stream.getAudioTracks().length > 0) setMicGranted(true);
      setError("");
      stream.getTracks().forEach((track) => track.stop()); // stop streams after check
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

    // Add event listeners for fullscreen changes
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    // Cleanup event listeners
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
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
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6 lg:p-8">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-4 sm:mb-6 md:mb-8">
        Required Permissions
      </h2>

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
  );
};

export default PermissionsPage;
