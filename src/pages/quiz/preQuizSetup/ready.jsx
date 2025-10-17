import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ReadyPage() {
  const navigate = useNavigate();
  const [serverStarted, setServerStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Example check: adjust the URL to your backend’s actual endpoint
    const checkServer = async () => {
      try {
        const res = await fetch(""); 
        const data = await res.json();

        if (data.status === "running") {
          setServerStarted(true);
        } else {
          setServerStarted(false);
        }
      } catch (error) {
        setServerStarted(false);
      } finally {
        setLoading(false);
      }
    };

    checkServer();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh] sm:h-[55vh] text-sm sm:text-base md:text-lg text-gray-600 px-3 sm:px-4 text-center">
        Checking server status...
      </div>
    );
  }

  if (!serverStarted) {
    return (
      <div className="flex justify-center items-center h-[50vh] sm:h-[55vh] text-center px-3 sm:px-4 md:px-6">
        <div className="max-w-sm sm:max-w-lg w-full bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl sm:rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">
            Please wait...
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed">
            The OWASP team hasn't started the quiz yet.
            <br className="hidden sm:block" />
            Please wait until the server is live.
          </p>
        </div>
      </div>
    );
  }

  // ✅ If server is started
  return (
    <div className="flex justify-center items-center h-[50vh] sm:h-[55vh] px-3 sm:px-4 md:px-6">
      <div className="max-w-sm sm:max-w-lg w-full bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl sm:rounded-2xl shadow-md border border-gray-100 text-center">
        {/* Checkmark */}
        <div className="flex flex-col items-center mb-4 sm:mb-5 md:mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            ✓
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 mb-1 sm:mb-2">
            You're Ready to Begin!
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed">
            Everything is set — you can now start your quiz with confidence.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 md:space-x-4">
          <button
            onClick={() => navigate("/quiz/camera")}
            className="w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200 text-xs sm:text-sm md:text-base"
          >
            Go Back
          </button>

          <button
            onClick={() => navigate("/start")}
            className="w-full sm:w-auto px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 shadow-sm font-medium text-xs sm:text-sm md:text-base"
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
