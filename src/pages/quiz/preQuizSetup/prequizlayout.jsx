import { Outlet, useLocation } from "react-router-dom";

const steps = [
  { id: 1, name: "Instructions", path: "/instructions.jsx" },
  { id: 2, name: "Permissions", path: "/permissions.jsx" },
  { id: 3, name: "Camera Setup", path: "/camerasetup.jsx" },
  { id: 4, name: "Ready", path: "/ready.jsx" },
];

export default function PreQuizLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-10 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <div className="bg-red-600 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center">O</div>
          <span>OWASP Quiz Portal</span>
        </div>
        <nav className="flex gap-6 text-gray-700 text-sm">
          <span>Dashboard</span>
          <span>Questions</span>
          <span>Attempts</span>
          <span className="font-medium">1024030970</span>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto mt-10 px-4">
        <h2 className="text-2xl font-semibold">Pre-Quiz Setup</h2>
        <p className="text-gray-500 mb-8">
          Let's make sure everything is working properly before you start the quiz.
        </p>

        {/* Progress bar */}
        <div className="flex justify-between mb-8">
          {steps.map((step) => {
            const active = location.pathname.includes(step.path.split("/").pop());
            return (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    active ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-400"
                  }`}
                >
                  {step.id}
                </div>
                <span
                  className={`mt-2 text-sm ${
                    active ? "text-blue-600 font-medium" : "text-gray-500"
                  }`}
                >
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>

        <Outlet />
      </main>
    </div>
  );
}
