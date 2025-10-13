import React from "react";

function InstructionsPage() {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Quiz Instructions</h1>
      <p className="text-gray-600 text-center max-w-md">
        Please read the following instructions carefully before starting your quiz.
        Ensure you are in a quiet environment and your camera and microphone are working.
      </p>
    </div>
  );
}

export default InstructionsPage;
