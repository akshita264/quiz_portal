import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RequireInstructionsComplete from "./components/RequireInstructionsComplete";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Quiz from "./Quiz";

import PreQuizLayout from "./pages/quiz/preQuizSetup/prequizLayout";
import InstructionsPage from "./pages/quiz/preQuizSetup/instructions";
import PermissionsPage from "./pages/quiz/preQuizSetup/permissions";
import CameraSetupPage from "./pages/quiz/preQuizSetup/camerasetup";
import ReadyPage from "./pages/quiz/preQuizSetup/ready";
import QuestionPage from "./pages/quiz/inQuizSetup/QuestionPage";
import Submit from "./pages/quiz/inQuizSetup/Submit";
import StartPage from "./pages/quiz/StartPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Instruction flow */}
            <Route
              path="/quiz"
              element={
                <ProtectedRoute>
                  <PreQuizLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<InstructionsPage />} />
              <Route path="/quiz/instructions" element={<InstructionsPage />} />
              <Route path="/quiz/permissions" element={<PermissionsPage />} />
              <Route path="/quiz/camera" element={<CameraSetupPage />} />
              <Route path="/quiz/ready" element={<ReadyPage />} />
            </Route>

            {/* Aliases to match required paths */}
            <Route path="/instructions" element={<Navigate to="/quiz/instructions" replace />} />

            {/* Backend-gated start and questions */}
            <Route
              path="/start"
              element={
                <RequireInstructionsComplete>
                  <StartPage />
                </RequireInstructionsComplete>
              }
            />
            <Route
              path="/questions"
              element={
                <RequireInstructionsComplete>
                  <QuestionPage />
                </RequireInstructionsComplete>
              }
            />
            <Route path="/submit" element={<Submit />} />
          </Routes>
          
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
