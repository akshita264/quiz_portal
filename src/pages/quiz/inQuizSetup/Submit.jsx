import React from "react";

const Submit = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-10 border border-gray-200">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Quiz Submitted Successfully
        </h1>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-6 text-center">
          <p className="text-lg text-gray-700 mb-3">
            🎉 Thank you for submitting the quiz!
          </p>
          <p className="text-gray-600">
            Your responses have been recorded successfully. <br/>Please stay tuned ,
            results will be announced soon.
          </p>
        </div>

        <div className="text-center mt-10 text-sm text-gray-500">
          You may now close this tab or return to the dashboard.
        </div>
      </div>
    </div>
  );
};

export default Submit;
