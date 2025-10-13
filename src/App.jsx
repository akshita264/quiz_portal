import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Quiz from "./Quiz";

import PreQuizLayout from "./pages/quiz/preQuizSetup/prequizlayout";
import InstructionsPage from "./pages/quiz/preQuizSetup/instructions";
import PermissionsPage from "./pages/quiz/preQuizSetup/permissions";
import CameraSetupPage from "./pages/quiz/preQuizSetup/camerasetup";
import ReadyPage from "./pages/quiz/preQuizSetup/ready";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/quiz"
              element={
                <ProtectedRoute>
                  <Quiz />
                </ProtectedRoute>
              }
            />
            {/* Pre-Quiz Setup routes */}
          <Route path="/quiz" element={<PreQuizLayout />}>
            <Route path="/quiz/instructions" element={<InstructionsPage />} />
            <Route path="/quiz/permissions" element={<PermissionsPage />} />
            <Route path="/quiz/camera" element={<CameraSetupPage />} />
            <Route path="/quiz/ready" element={<ReadyPage />} />
             <Route index element={<InstructionsPage />} />
         </Route>

          </Routes>
          
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
