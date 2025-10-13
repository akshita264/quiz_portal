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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-4xl w-full bg-white p-8 rounded-2xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">
          Camera Setup
        </h2>

        {/* Video Preview Box */}
        <div className="flex justify-center mb-8">
          <div className="rounded-xl overflow-hidden border border-gray-300 shadow-sm">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-[600px] h-[400px] object-cover bg-black"
            />
          </div>
        </div>

        {/* Camera Requirements Box */}
        <div className="bg-blue-50 border border-blue-200 text-blue-900 p-6 rounded-xl mb-8">
          <p className="font-semibold text-lg mb-2">Camera Requirements:</p>
          <ul className="list-disc list-inside text-base space-y-1">
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
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow-sm transition-all duration-200"
          >
            Start Face Detection
          </button>
        </div>
      </div>
    </div>
  );
}
