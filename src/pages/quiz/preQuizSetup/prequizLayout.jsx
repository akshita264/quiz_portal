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
      <header className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-white shadow-sm">
        {/* Left */}
        <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-0">
          <h1 className="font-semibold text-base sm:text-lg md:text-xl text-gray-800">
            OWASP Quiz Portal
          </h1>
        </div>

        {/* Right Nav */}
        <nav className="flex flex-wrap justify-center sm:justify-end space-x-3 sm:space-x-4 md:space-x-6 text-gray-700 font-medium text-xs sm:text-sm md:text-base">
          <Link to="#" className="hover:text-blue-600 transition-colors">Dashboard</Link>
          <Link to="#" className="hover:text-blue-600 transition-colors">Questions</Link>
          <Link to="#" className="hover:text-blue-600 transition-colors">Attempts</Link>
          <span className="font-semibold text-blue-600">Profile</span>
        </nav>
      </header>

      {/* Page Content */}
      <main className="max-w-5xl mx-auto py-4 sm:py-6 md:py-8 lg:py-10 px-3 sm:px-4">
        <Link to="/login" className="text-gray-600 text-xs sm:text-sm block mb-2 hover:text-blue-600 transition-colors">
          ← Back
        </Link>

        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mt-1 sm:mt-2">Pre-Quiz Setup</h2>
        <p className="text-gray-500 mb-4 sm:mb-6 md:mb-8 text-xs sm:text-sm md:text-base">
          Let's make sure everything is working properly before you start the quiz.
        </p>

        {/* Step Tracker */}
        <div className="w-full max-w-3xl mx-auto mb-6 sm:mb-8 md:mb-10">
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
                    className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      active
                        ? "border-blue-500 bg-blue-500 text-white"
                        : completed
                        ? "border-blue-400 bg-blue-400 text-white"
                        : "border-gray-300 bg-white text-gray-600"
                    }`}
                  >
                    <span className="text-sm sm:text-base">{index + 1}</span>
                  </div>
                  <p
                    className={`mt-1 sm:mt-2 text-xs sm:text-sm text-center ${
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

          {/* Mobile View — show only active step with progress indicator */}
          <div className="flex flex-col items-center sm:hidden">
            {currentStep && (
              <div className="flex flex-col items-center w-full">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white text-lg font-semibold mb-2">
                  {currentStepIndex + 1}
                </div>
                <p className="text-sm text-blue-600 font-semibold text-center mb-3">
                  {currentStep.label}
                </p>
                {/* Progress bar for mobile */}
                <div className="w-full max-w-xs bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Step {currentStepIndex + 1} of {steps.length}
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
