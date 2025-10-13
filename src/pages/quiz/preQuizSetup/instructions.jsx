import React from "react";
import { useNavigate } from "react-router-dom";

const InstructionsPage = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/quiz/permissions");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">
        Quiz Instructions
      </h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 space-y-6">
        {/* Important Rules */}
        <div>
          <h3 className="font-semibold text-base sm:text-lg mb-2 text-blue-900">
            Important Rules:
          </h3>
          <ul className="list-disc pl-5 sm:pl-6 text-gray-700 space-y-1 text-sm sm:text-base">
            <li>You have 30 minutes to complete the quiz.</li>
            <li>Keep your camera and microphone active throughout.</li>
            <li>Do not switch tabs or minimize the browser.</li>
            <li>Keep your face visible to the camera at all times.</li>
            <li>No external resources or help is allowed.</li>
            <li>You can only attempt this quiz once.</li>
          </ul>
        </div>

        {/* Technical Requirements */}
        <div>
          <h3 className="font-semibold text-base sm:text-lg mb-2 text-blue-900">
            Technical Requirements:
          </h3>
          <ul className="list-disc pl-5 sm:pl-6 text-gray-700 space-y-1 text-sm sm:text-base">
            <li>Working camera and microphone.</li>
            <li>Stable internet connection.</li>
            <li>Modern browser (Chrome, Firefox, Safari).</li>
            <li>Well-lit environment.</li>
          </ul>
        </div>

        {/* Privacy Notice */}
        <div>
          <h3 className="font-semibold text-base sm:text-lg mb-2 text-blue-900">
            Privacy Notice:
          </h3>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            Your camera feed is processed locally in your browser using AI. No
            video or images are uploaded to our servers. Only violation events
            are logged for assessment purposes.
          </p>
        </div>

        {/* Button */}
        <div className="flex justify-center pt-4 sm:pt-6">
          <button
            onClick={handleContinue}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 sm:px-6 py-2 sm:py-2.5 rounded-md shadow-md transition-all text-sm sm:text-base"
          >
            I Understand 
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionsPage;
