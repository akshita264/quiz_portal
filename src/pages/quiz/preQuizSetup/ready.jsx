import React from "react";
import { useNavigate } from "react-router-dom";

export default function ReadyPage() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center h-[55vh] px-4">
      <div className="max-w-lg w-full bg-white p-10 rounded-2xl shadow-md border border-gray-100 text-center">
        {/* Checkmark */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-4xl font-bold mb-4">
            ✓
          </div>
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            You’re Ready to Begin!
          </h2>
          <p className="text-gray-600 text-lg">
            Everything is set , you can now start your quiz with confidence.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate("/quiz/camera")}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200"
          >
            Go Back
          </button>

          <button
            onClick={() => navigate("/quiz/start")}
            className="px-8 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 shadow-sm font-medium"
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
