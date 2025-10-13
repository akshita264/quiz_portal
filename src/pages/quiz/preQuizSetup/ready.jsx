import React from "react";

function ReadyPage() {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Ready to Start</h1>
      <p className="text-gray-600 text-center max-w-md mb-6">
        All set! Click the button below when you're ready to begin your quiz.
      </p>
      <button className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
        Start Quiz
      </button>
    </div>
  );
}

export default ReadyPage;
