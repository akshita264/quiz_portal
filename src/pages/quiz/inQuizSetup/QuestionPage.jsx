import React, { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import axios from 'axios';

export default function Quizquestion({ userId }) {
  const totalQuestions = 20;
  const [currentQuestion, setCurrentQuestion] = useState(1);

  const [visited, setVisited] = useState(
    Object.fromEntries(Array.from({ length: totalQuestions }, (_, i) => [i + 1, false]))
  );
  const [answers, setAnswers] = useState(
    Object.fromEntries(Array.from({ length: totalQuestions }, (_, i) => [i + 1, null]))
  );
  const [bookmarked, setBookmarked] = useState(
    Object.fromEntries(Array.from({ length: totalQuestions }, (_, i) => [i + 1, false]))
  );
  const [timeLeft, setTimeLeft] = useState(1788);

  // ✅ Restore saved progress 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 1️⃣ Try localStorage first
        const localData = localStorage.getItem(`quiz-progress-${userId}`);
        if (localData) {
          const parsed = JSON.parse(localData);
          setAnswers(parsed.answers || {});
          setBookmarked(parsed.bookmarked || {});
          setVisited(parsed.visited || {});
          setTimeLeft(parsed.timeLeft || 1800);
        }

         // 2️⃣ Fetch from backend to sync
      //   const res = await axios.get(`/api/quiz/${userId}/progress`);
      //   if (res.data) {
      //     setAnswers(res.data.answers || {});
      //     setBookmarked(res.data.bookmarked || {});
      //     setVisited(res.data.visited || {});
      //     setTimeLeft(res.data.timeLeft || 1800);
      //   }
      } catch (err){
        console.error('Error fetching user quiz data:', err);
      }
    };
    fetchUserData();
  }, [userId]);

  // ✅ Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ✅ Auto-Save Progress (backend + localStorage)
  const saveProgress = async (updatedAnswers, updatedBookmarks, updatedVisited, updatedTime) => {
    try {
      const progressData = {
        answers: updatedAnswers,
        bookmarked: updatedBookmarks,
        visited: updatedVisited,
        timeLeft: updatedTime
      };
      localStorage.setItem(`quiz-progress-${userId}`, JSON.stringify(progressData));
      await axios.post(`/api/quiz/${userId}/save-progress`, progressData);
    } catch (err) {
      console.error('Error saving progress:', err);
    }
  };

  // ✅ Auto-save every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      saveProgress(answers, bookmarked, visited, timeLeft);
    }, 5000);
    return () => clearInterval(interval);
  }, [answers, bookmarked, visited, timeLeft]);

  // --- Question Data (temporary placeholder until backend provides real data)
  const allOptions = [
    'To make websites load faster',
    'To encrypt data transmitted between client and server',
    'To prevent websites from being cached',
    'To improve SEO rankings',
    'To enable secure communication',
    'To verify website authenticity',
    'To manage server resources',
    'To reduce bandwidth usage'
  ];

  const getRandomOptions = (seed) => {
    const shuffled = [...allOptions].sort(() => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed - 0.5;
    });
    return shuffled.slice(0, 4);
  };

  const questions = Object.fromEntries(
    Array.from({ length: totalQuestions }, (_, i) => [
      i + 1,
      {
        text: `This is question ${i + 1}`,
        options: getRandomOptions(i + 1)
      }
    ])
  );

  const currentQ = questions[currentQuestion];
  const selected = answers[currentQuestion];

  // --- Handle answer/bookmark selection ---
  const handleSelect = (option) => {
    const updated = { ...answers, [currentQuestion]: option };
    setAnswers(updated);
    saveProgress(updated, bookmarked, visited, timeLeft);
  };

  const handleBookmark = () => {
    const updated = { ...bookmarked, [currentQuestion]: !bookmarked[currentQuestion] };
    setBookmarked(updated);
    saveProgress(answers, updated, visited, timeLeft);
  };

  useEffect(() => {
    setVisited(prev => ({ ...prev, [currentQuestion]: true }));
  }, [currentQuestion]);

  // 🧠 ------------------- SECURITY SECTION -------------------
  useEffect(() => {
    // Disable Right Click
    const handleRightClick = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleRightClick);

    // Disable Certain Keys
    const handleKeyDown = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
        (e.ctrlKey && (e.key === "U" || e.key === "C" || e.key === "V" || e.key === "S"))
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    // Disable Copy/Paste
    const disableCopyPaste = (e) => e.preventDefault();
    document.addEventListener("copy", disableCopyPaste);
    document.addEventListener("paste", disableCopyPaste);
    document.addEventListener("cut", disableCopyPaste);

    // Optional: Warn if user leaves tab or minimizes
    // const handleBlur = () => {
    //   alert("⚠️ You switched tabs or minimized! Please stay on the quiz page.");
    // };
    // window.addEventListener("blur", handleBlur);

    // Optional: Force fullscreen
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("contextmenu", handleRightClick);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("copy", disableCopyPaste);
      document.removeEventListener("paste", disableCopyPaste);
      document.removeEventListener("cut", disableCopyPaste);
      // window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 select-none pointer-events-auto">
      {/* Top Navbar */}
      <div className="bg-white border-b border-gray-300 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div>
            <img src="/owasp_logo.png" alt="Logo" className="h-10 mb-2" />
            {/* <h1 className="text-lg font-bold text-gray-900">OWASP Recruitment Quiz</h1> */}
            <p className="text-sm text-gray-600">Question {currentQuestion} of {totalQuestions}</p>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-gray-700 bg-gray-200 py-1 px-3 rounded">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-lg font-semibold text-gray-700">{formatTime(timeLeft)}</span>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition-all">
              Submit Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-8 grid grid-cols-3 gap-8">
        {/* Question Content */}
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded">Single Choice</span>
                  <span className="text-sm font-medium text-gray-700">1 point</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{currentQ.text}</h2>
              </div>
              <button
                onClick={handleBookmark}
                className={`flex items-center gap-2 px-3 py-2 rounded transition-all ${
                  bookmarked[currentQuestion]
                    ? 'text-yellow-600 bg-yellow-50'
                    : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <Bookmark size={18} fill={bookmarked[currentQuestion] ? 'currentColor' : 'none'} />
                <span className="text-sm font-medium">
                  {bookmarked[currentQuestion] ? 'Bookmarked' : 'Bookmark'}
                </span>
              </button>
            </div>

            <div className="space-y-3">
              {currentQ.options.map((option, idx) => (
                <label
                  key={idx}
                  className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all"
                  style={{
                    borderColor: selected === option ? '#3b82f6' : '#e5e7eb',
                    backgroundColor: selected === option ? '#eff6ff' : 'white'
                  }}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={option}
                    checked={selected === option}
                    onChange={(e) => handleSelect(e.target.value)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="ml-3 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar (Legend + Navigation) */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Legend</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3"><div className="w-6 h-6 rounded bg-gray-200"></div><span className="text-gray-700">Not visited</span></div>
              <div className="flex items-center gap-3"><div className="w-6 h-6 rounded bg-blue-100 border-2 border-blue-300"></div><span className="text-gray-700">Visited</span></div>
              <div className="flex items-center gap-3"><div className="w-6 h-6 rounded bg-green-100"></div><span className="text-gray-700">Answered</span></div>
              <div className="flex items-center gap-3"><div className="w-6 h-6 rounded bg-yellow-100 border-2 border-yellow-400"></div><span className="text-gray-700">Bookmarked</span></div>
              <div className="flex items-center gap-3"><div className="w-6 h-6 rounded bg-purple-100 border-2 border-purple-400"></div><span className="text-gray-700">Bookmarked & Answered</span></div>
            </div>
          </div>

          {/* Question Navigation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Questions</h3>
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: totalQuestions }, (_, i) => i + 1).map(q => {
                let bgClass = 'bg-gray-100 text-gray-700 hover:bg-gray-200';
                if (answers[q] && bookmarked[q]) bgClass = 'bg-purple-100 border-2 border-purple-400 text-purple-700';
                else if (answers[q]) bgClass = 'bg-green-100 text-green-700';
                else if (bookmarked[q]) bgClass = 'bg-yellow-100 border-2 border-yellow-400 text-yellow-700';
                else if (visited[q]) bgClass = 'bg-blue-100 border-2 border-blue-300 text-blue-700';
                if (q === currentQuestion) bgClass += ' ring-2 ring-blue-500';

                return (
                  <button
                    key={q}
                    onClick={() => setCurrentQuestion(q)}
                    className={`w-10 h-10 rounded font-medium transition-all ${bgClass}`}
                  >
                    {q}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
