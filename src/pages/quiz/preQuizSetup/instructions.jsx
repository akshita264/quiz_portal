import React from "react";
import { useNavigate } from "react-router-dom";

const InstructionsPage = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    localStorage.setItem('instructionsComplete', 'true');
    navigate("/quiz/permissions");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6 lg:p-8">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-4 sm:mb-6 md:mb-8">
        Quiz Instructions
      </h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
        {/* Important Rules */}
        <div>
          <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-2 sm:mb-3 text-blue-900">
            Important Rules:
          </h3>
          <ul className="list-disc pl-4 sm:pl-5 md:pl-6 text-gray-700 space-y-1 sm:space-y-2 text-xs sm:text-sm md:text-base">
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
          <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-2 sm:mb-3 text-blue-900">
            Technical Requirements:
          </h3>
          <ul className="list-disc pl-4 sm:pl-5 md:pl-6 text-gray-700 space-y-1 sm:space-y-2 text-xs sm:text-sm md:text-base">
            <li>Working camera and microphone.</li>
            <li>Stable internet connection.</li>
            <li>Modern browser (Chrome, Firefox, Safari).</li>
            <li>Well-lit environment.</li>
          </ul>
        </div>

        {/* Privacy Notice */}
        <div>
          <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-2 sm:mb-3 text-blue-900">
            Privacy Notice:
          </h3>
          <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed">
            Your camera feed is processed locally in your browser using AI. No
            video or images are uploaded to our servers. Only violation events
            are logged for assessment purposes.
          </p>
        </div>

        {/* Button */}
        <div className="flex justify-center pt-3 sm:pt-4 md:pt-6">
          <button
            onClick={handleContinue}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 sm:px-5 md:px-6 py-2.5 sm:py-2 md:py-2.5 rounded-md shadow-md transition-all text-sm sm:text-base"
          >
            I Understand 
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionsPage;
