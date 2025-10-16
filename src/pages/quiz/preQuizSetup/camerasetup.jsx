import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CameraSetupPage() {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-3 sm:px-4 py-4 sm:py-6 md:py-10">
      <div className="max-w-4xl w-full bg-white p-3 sm:p-4 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-md border border-gray-100">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-center text-gray-800 mb-4 sm:mb-6 md:mb-8">
          Camera Setup
        </h2>

        {/* Video Preview Box */}
        <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
          <div className="rounded-lg sm:rounded-xl overflow-hidden border border-gray-300 shadow-sm w-full max-w-[320px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] aspect-video bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Camera Requirements Box */}
        <div className="bg-blue-50 border border-blue-200 text-blue-900 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl mb-4 sm:mb-6 md:mb-8">
          <p className="font-semibold text-sm sm:text-base md:text-lg mb-2 sm:mb-3">
            Camera Requirements:
          </p>
          <ul className="list-disc list-inside text-xs sm:text-sm md:text-base space-y-1 sm:space-y-2">
            <li>Position yourself in the center of the frame</li>
            <li>Ensure your face is clearly visible</li>
            <li>Make sure the lighting is good</li>
            <li>Remove any hats or sunglasses</li>
          </ul>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/quiz/ready")}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 sm:px-5 md:px-6 py-2.5 sm:py-2 md:py-2.5 rounded-lg shadow-sm transition-all duration-200 text-sm sm:text-base"
          >
            Start Face Detection
          </button>
        </div>
      </div>
    </div>
  );
}
