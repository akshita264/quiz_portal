import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const PreQuizLayout = () => {
  const location = useLocation();

  const steps = [
    { label: "Instructions", path: "/quiz/instructions" },
    { label: "Permissions", path: "/quiz/permissions" },
    { label: "Camera Setup", path: "/quiz/camera" },
    { label: "Ready", path: "/quiz/ready" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.path === location.pathname);
  const currentStep = steps[currentStepIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-4 bg-white shadow-sm">
        {/* Left */}
        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
          <h1 className="font-semibold text-lg sm:text-xl text-gray-800">
            OWASP Quiz Portal
          </h1>
        </div>

        {/* Right Nav */}
        <nav className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6 text-gray-700 font-medium text-sm sm:text-base">
          <Link to="#">Dashboard</Link>
          <Link to="#">Questions</Link>
          <Link to="#">Attempts</Link>
          <span className="font-semibold">Profile</span>
        </nav>
      </header>

      {/* Page Content */}
      <main className="max-w-5xl mx-auto py-8 sm:py-10 px-4">
        <Link to="/login" className="text-gray-600 text-sm block mb-2">
          ← Back
        </Link>

        <h2 className="text-xl sm:text-2xl font-bold mt-2">Pre-Quiz Setup</h2>
        <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base">
          Let's make sure everything is working properly before you start the quiz.
        </p>

        {/* Step Tracker */}
        <div className="w-full max-w-3xl mx-auto mb-8 sm:mb-10">
          {/* Desktop & Tablet View — show all steps */}
          <div className="hidden sm:flex relative justify-between items-center">
            {/* Background line */}
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-200 -z-10"></div>

            {steps.map((step, index) => {
              const active = location.pathname === step.path;
              const completed = currentStepIndex > index;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center w-1/4"
                >
                  <div
                    className={`w-9 h-9 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      active
                        ? "border-blue-500 bg-blue-500 text-white"
                        : completed
                        ? "border-blue-400 bg-blue-400 text-white"
                        : "border-gray-300 bg-white text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <p
                    className={`mt-2 text-sm text-center ${
                      active
                        ? "text-blue-600 font-semibold"
                        : completed
                        ? "text-blue-500"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Mobile View — show only active step */}
          <div className="flex flex-col items-center sm:hidden">
            {currentStep && (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white text-lg font-semibold">
                  {currentStepIndex + 1}
                </div>
                <p className="mt-2 text-sm text-blue-600 font-semibold text-center">
                  {currentStep.label}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Page-specific content */}
        <Outlet />
      </main>
    </div>
  );
};

export default PreQuizLayout;
