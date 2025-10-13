import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PermissionsPage = () => {
  const navigate = useNavigate();
  const [cameraGranted, setCameraGranted] = useState(false);
  const [micGranted, setMicGranted] = useState(false);
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

  useEffect(() => {
    requestPermissions();
  }, []);

  const handleContinue = () => {
    if (cameraGranted && micGranted) {
      navigate("/quiz/camera");
    } else {
      setError("Please enable both camera and microphone permissions.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">
        Camera & Microphone Permissions
      </h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 space-y-6">
        {/* Permissions Required */}
        <div>
          <h3 className="font-semibold text-base sm:text-lg mb-2 text-blue-900">
            Permissions Required:
          </h3>
          <ul className="list-disc pl-5 sm:pl-6 text-gray-700 space-y-1 text-sm sm:text-base">
            <li>
              Access to your <strong>camera</strong> is required for monitoring.
            </li>
            <li>
              Access to your <strong>microphone</strong> is required for verification.
            </li>
            <li>Ensure your browser has permission to use both devices.</li>
            <li>
              You can check permissions in your browser’s address bar (🔒 icon).
            </li>
          </ul>
        </div>

        {/* Current Status */}
        <div>
          <h3 className="font-semibold text-base sm:text-lg mb-2 text-blue-900">
            Current Status:
          </h3>
          <ul className="list-disc pl-5 sm:pl-6 text-gray-700 space-y-1 text-sm sm:text-base">
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
          </ul>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-600 text-center font-medium text-sm sm:text-base">
            {error}
          </p>
        )}

        {/* Continue Button */}
        <div className="flex justify-center pt-4 sm:pt-6">
          <button
            onClick={handleContinue}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 sm:px-6 py-2 sm:py-2.5 rounded-md shadow-md transition-all text-sm sm:text-base"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionsPage;
