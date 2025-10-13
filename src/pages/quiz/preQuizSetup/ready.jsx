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
      <div className="flex justify-center items-center h-[55vh] text-lg text-gray-600">
        Checking server status...
      </div>
    );
  }

  if (!serverStarted) {
    return (
      <div className="flex justify-center items-center h-[55vh] text-center px-6">
        <div className="max-w-lg w-full bg-white p-10 rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Please wait...
          </h2>
          <p className="text-gray-600 text-lg">
            The OWASP team hasn’t started the quiz yet.<br/>  
            Please wait until the server is live.
          </p>
        </div>
      </div>
    );
  }

  // If server is started, show your original content
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
            Everything is set — you can now start your quiz with confidence.
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
