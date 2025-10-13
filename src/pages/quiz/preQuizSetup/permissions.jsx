import React from "react";

function PermissionsPage() {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Permissions Setup</h1>
      <p className="text-gray-600 text-center max-w-md">
        We need access to your camera and microphone to proceed with the quiz.
        Please grant the necessary permissions when prompted.
      </p>
    </div>
  );
}

export default PermissionsPage;
