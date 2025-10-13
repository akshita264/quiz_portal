import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const PreQuizLayout = () => {
  const location = useLocation();

  // Determine which step is active
  const steps = [
    { label: "Instructions", path: "/quiz/instructions" },
    { label: "Permissions", path: "/quiz/permissions" },
    { label: "Camera Setup", path: "/quiz/camera" },
    { label: "Ready", path: "/quiz/ready" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center space-x-3">
         
          <h1 className="font-semibold text-lg">OWASP Quiz Portal</h1>
        </div>

        <nav className="flex space-x-6 text-gray-700 font-medium">
          <Link to="#">Dashboard</Link>
          <Link to="#">Questions</Link>
          <Link to="#">Attempts</Link>
          <span className="font-semibold">Profile</span>
        </nav>
      </header>

      {/* Page Content */}
      <main className="max-w-5xl mx-auto py-10 px-4">
        <Link to="/login" className="text-gray-600 text-sm">
          ← Back 
        </Link>

        <h2 className="text-2xl font-bold mt-2">Pre-Quiz Setup</h2>
        <p className="text-gray-500 mb-8">
          Let's make sure everything is working properly before you start the quiz.
        </p>

        {/* Step Tracker */}
        <div className="flex justify-between items-center mb-10">
          {steps.map((step, index) => {
            const active = location.pathname === step.path;
            return (
              <div key={index} className="flex-1 text-center">
                <div
                  className={`mx-auto w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                    active
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-300 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                <p
                  className={`mt-2 text-sm ${
                    active ? "text-blue-600 font-semibold" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Page-specific content */}
        <Outlet />
      </main>
    </div>
  );
};

export default PreQuizLayout;
