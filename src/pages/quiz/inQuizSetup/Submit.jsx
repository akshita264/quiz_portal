import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitAnswers } from "../../../services/api";

const Submit = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const submitQuiz = async () => {
      try {
        const sessionId = localStorage.getItem('sessionId');
        const progressData = localStorage.getItem('quiz-progress');
        
        if (!sessionId) {
          setError('No session found. Please start the quiz again.');
          setLoading(false);
          return;
        }

        if (!progressData) {
          setError('No quiz progress found. Please start the quiz again.');
          setLoading(false);
          return;
        }

        const { answers } = JSON.parse(progressData);
        
        // Convert answers to backend format
        const submissionAnswers = Object.entries(answers)
          .filter(([_, answer]) => answer !== null)
          .map(([questionIndex, selectedOption]) => {
            // Get question ID from questions array if available
            const questionId = localStorage.getItem(`question_${questionIndex}_id`) || `question_${questionIndex}`;
            return {
              questionId: questionId,
              selectedOption: selectedOption
            };
          });

        const response = await submitAnswers(sessionId, {
          answers: submissionAnswers
        });

        if (response.statusCode === 200) {
          setResults(response.data);
          setLoading(false);
        } else {
          setError('Failed to submit quiz. Please try again.');
          setLoading(false);
        }
      } catch (err) {
        console.error("Error submitting quiz:", err);
        setError('An error occurred while submitting the quiz.');
        setLoading(false);
      }
    };

    submitQuiz();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Submitting quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-10 border border-gray-200">
          <h1 className="text-2xl font-bold text-center text-red-600 mb-6">
            Submission Error
          </h1>
          <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
            <p className="text-lg text-gray-700 mb-3">
              ❌ {error}
            </p>
          </div>
          <div className="text-center mt-6">
            <button 
              onClick={() => navigate('/quiz/instructions')}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-10 border border-gray-200">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Quiz Submitted Successfully
        </h1>

        {results && (
          <div className="mb-6">
            <div className="bg-green-50 border border-green-200 rounded-md p-6 text-center">
              <p className="text-2xl font-bold text-green-600 mb-2">
                Score: {results.score}
              </p>
              <p className="text-lg text-gray-700 mb-3">
                🎉 Thank you for submitting the quiz!
              </p>
              <p className="text-gray-600">
                Your responses have been recorded successfully. <br/>Please stay tuned,
                results will be announced soon.
              </p>
            </div>
          </div>
        )}

        <div className="text-center mt-10 text-sm text-gray-500">
          You may now close this tab or return to the dashboard.
        </div>
      </div>
    </div>
  );
};

export default Submit;
