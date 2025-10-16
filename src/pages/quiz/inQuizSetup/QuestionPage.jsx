"use client"

import { useState, useEffect, useRef } from "react"
import { Bookmark } from "lucide-react"
import axios from "axios"
import { useNavigate } from "react-router-dom";

const QuizQuestion = ({ userId }) => {
  const totalQuestions = 20
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [tabSwitchViolations, setTabSwitchViolations] = useState(0)
  const [tabSwitchWarning, setTabSwitchWarning] = useState(false)
  const [isQuizPaused, setIsQuizPaused] = useState(false)
  const [fullscreenExited, setFullscreenExited] = useState(false)
  const hiddenButtonRef = useRef(null)

  const [visited, setVisited] = useState(
    Object.fromEntries(Array.from({ length: totalQuestions }, (_, i) => [i + 1, false])),
  )
  const [answers, setAnswers] = useState(
    Object.fromEntries(Array.from({ length: totalQuestions }, (_, i) => [i + 1, null])),
  )
  const [bookmarked, setBookmarked] = useState(
    Object.fromEntries(Array.from({ length: totalQuestions }, (_, i) => [i + 1, false])),
  )
  const [timeLeft, setTimeLeft] = useState(1788)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const localData = localStorage.getItem(`quiz-progress-${userId}`)
        if (localData) {
          const parsed = JSON.parse(localData)
          setAnswers(parsed.answers || {})
          setBookmarked(parsed.bookmarked || {})
          setVisited(parsed.visited || {})
          setTimeLeft(parsed.timeLeft || 1800)
        }
      } catch (err) {
        console.error("Error fetching user quiz data:", err)
      }
    }
    fetchUserData()
  }, [userId])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const saveProgress = async (updatedAnswers, updatedBookmarks, updatedVisited, updatedTime) => {
    try {
      const progressData = {
        answers: updatedAnswers,
        bookmarked: updatedBookmarks,
        visited: updatedVisited,
        timeLeft: updatedTime,
      }
      localStorage.setItem(`quiz-progress-${userId}`, JSON.stringify(progressData))
      await axios.post(`/api/quiz/${userId}/save-progress`, progressData)
    } catch (err) {
      console.error("Error saving progress:", err)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      saveProgress(answers, bookmarked, visited, timeLeft)
    }, 5000)
    return () => clearInterval(interval)
  }, [answers, bookmarked, visited, timeLeft])

  const allOptions = [
    "To make websites load faster",
    "To encrypt data transmitted between client and server",
    "To prevent websites from being cached",
    "To improve SEO rankings",
    "To enable secure communication",
    "To verify website authenticity",
    "To manage server resources",
    "To reduce bandwidth usage",
  ]

  const getRandomOptions = (seed) => {
    const shuffled = [...allOptions].sort(() => {
      seed = (seed * 9301 + 49297) % 233280
      return seed - 0.5
    })
    return shuffled.slice(0, 4)
  }

  const questions = Object.fromEntries(
    Array.from({ length: totalQuestions }, (_, i) => [
      i + 1,
      {
        text: `This is question ${i + 1}`,
        options: getRandomOptions(i + 1),
      },
    ]),
  )

  const currentQ = questions[currentQuestion]
  const selected = answers[currentQuestion]

  const handleSelect = (option) => {
    const updated = { ...answers, [currentQuestion]: option }
    setAnswers(updated)
    saveProgress(updated, bookmarked, visited, timeLeft)
  }

  const handleBookmark = () => {
    const updated = { ...bookmarked, [currentQuestion]: !bookmarked[currentQuestion] }
    setBookmarked(updated)
    saveProgress(answers, updated, visited, timeLeft)
  }

  useEffect(() => {
    setVisited((prev) => ({ ...prev, [currentQuestion]: true }))
  }, [currentQuestion])

  const handleVisibilityChange = async () => {
    if (document.hidden) {
      console.warn("[SECURITY] User attempted to switch tabs - auto-entering fullscreen")
      setTabSwitchViolations((prev) => prev + 1)
      setIsQuizPaused(true)

      setTimeout(() => {
        setTabSwitchWarning(true)
      }, 1500)

      setTimeout(async () => {
        try {
          if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen().catch((err) => {
              console.warn("Auto-fullscreen on tab switch failed:", err)
            })
          }
        } catch (err) {
          console.warn("Auto-fullscreen on tab switch failed:", err)
        }
      }, 50)

      setTimeout(() => {
        setTabSwitchWarning(false)
      }, 6500)
    } else {
      console.log("[SECURITY] User returned to quiz tab")
      setIsQuizPaused(false)

      if (!document.fullscreenElement) {
        setTimeout(async () => {
          try {
            await document.documentElement.requestFullscreen().catch((err) => {
              console.warn("Fullscreen re-entry on tab return failed:", err)
            })
          } catch (err) {
            console.warn("Fullscreen re-entry on tab return failed:", err)
          }
        }, 100)
      }
    }
  }

  useEffect(() => {
    const handleRightClick = (e) => e.preventDefault()
    document.addEventListener("contextmenu", handleRightClick)

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        return
      }

      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
        (e.ctrlKey && (e.key === "U" || e.key === "C" || e.key === "V" || e.key === "S")) ||
        (e.metaKey && e.altKey && (e.key === "I" || e.key === "J"))
      ) {
        e.preventDefault()
      }
    }
    document.addEventListener("keydown", handleKeyDown, true)

    const disableCopyPaste = (e) => e.preventDefault()
    document.addEventListener("copy", disableCopyPaste)
    document.addEventListener("paste", disableCopyPaste)
    document.addEventListener("cut", disableCopyPaste)

    document.addEventListener("visibilitychange", handleVisibilityChange)

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        console.warn("[SECURITY] User exited fullscreen")
        setFullscreenExited(true)

        setTimeout(async () => {
          try {
            await document.documentElement.requestFullscreen().catch((err) => {
              console.warn("Fullscreen re-entry failed:", err)
            })
          } catch (err) {
            console.warn("Fullscreen re-entry failed:", err)
          }
        }, 100)
      } else {
        setFullscreenExited(false)
      }
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)

    const fullscreenCheckInterval = setInterval(async () => {
      if (!document.fullscreenElement) {
        setFullscreenExited(true)
        try {
          await document.documentElement.requestFullscreen().catch((err) => {
            console.warn("Continuous fullscreen check failed:", err)
          })
        } catch (err) {
          console.warn("Continuous fullscreen check failed:", err)
        }
      }
    }, 500)

    return () => {
      document.removeEventListener("contextmenu", handleRightClick)
      document.removeEventListener("keydown", handleKeyDown, true)
      document.removeEventListener("copy", disableCopyPaste)
      document.removeEventListener("paste", disableCopyPaste)
      document.removeEventListener("cut", disableCopyPaste)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      clearInterval(fullscreenCheckInterval)
    }
  }, [])

  useEffect(() => {
    const autoTriggerFullscreen = setTimeout(() => {
      if (hiddenButtonRef.current) {
        hiddenButtonRef.current.click()
      }
    }, 50)

    return () => clearTimeout(autoTriggerFullscreen)
  }, [])

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen()
    } catch (err) {
      console.warn("Fullscreen request failed:", err)
    }
  }
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 select-none pointer-events-auto">
      {/* Top Navbar */}
      <div className="bg-white border-b border-gray-300 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div>
            <img src="/owasp_logo.png" alt="Logo" className="h-10 mb-2" />
            <p className="text-sm text-gray-600">
              Question {currentQuestion} of {totalQuestions}
            </p>
            {tabSwitchViolations > 0 && (
              <p className="text-xs text-red-600 font-semibold mt-1">⚠️ Tab switches detected: {tabSwitchViolations}</p>
            )}
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-gray-700 bg-gray-200 py-1 px-3 rounded">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-lg font-semibold text-gray-700">{formatTime(timeLeft)}</span>
            </div>
            <button  onClick={() => navigate("/quiz/submit")}
 className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition-all">
              Submit Quiz
            </button>
          </div>
        </div>
      </div>

      {fullscreenExited && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md text-center ">
            <div className="text-orange-600 text-5xl mb-4">⛔</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Fullscreen Required</h2>
            <p className="text-gray-700 mb-6">
              You have exited fullscreen mode. Please click the button below to return to fullscreen to continue the
              quiz.
            </p>
            <button
              onClick={enterFullscreen}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              Enter Fullscreen
            </button>
          </div>
        </div>
      )}

      {tabSwitchWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9998] animate-pulse">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md text-center">
            <div className="text-red-600 text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tab Switch Detected!</h2>
            <p className="text-gray-700 mb-4">
              You switched tabs. This is violation #{tabSwitchViolations}. Please stay focused on the quiz.
            </p>
            <p className="text-sm text-gray-600">Returning to fullscreen automatically...</p>
          </div>
        </div>
      )}

      {isQuizPaused && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9997]">
          <div className="bg-yellow-50 border-4 border-yellow-400 rounded-lg p-6 text-center">
            <p className="text-xl font-bold text-yellow-800">Quiz Paused</p>
            <p className="text-sm text-yellow-700 mt-2">You are away from the quiz tab</p>
          </div>
        </div>
      )}

      {/* Hidden button for auto-triggering fullscreen */}
      <button ref={hiddenButtonRef} onClick={enterFullscreen} style={{ display: "none" }} aria-hidden="true" />

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
                    ? "text-yellow-600 bg-yellow-50"
                    : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <Bookmark size={18} fill={bookmarked[currentQuestion] ? "currentColor" : "none"} />
                <span className="text-sm font-medium">{bookmarked[currentQuestion] ? "Bookmarked" : "Bookmark"}</span>
              </button>
            </div>

            <div className="space-y-3">
              {currentQ.options.map((option, idx) => (
                <label
                  key={idx}
                  className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all"
                  style={{
                    borderColor: selected === option ? "#3b82f6" : "#e5e7eb",
                    backgroundColor: selected === option ? "#eff6ff" : "white",
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
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-gray-200"></div>
                <span className="text-gray-700">Not visited</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-blue-100 border-2 border-blue-300"></div>
                <span className="text-gray-700">Visited</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-green-100"></div>
                <span className="text-gray-700">Answered</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-yellow-100 border-2 border-yellow-400"></div>
                <span className="text-gray-700">Bookmarked</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-purple-100 border-2 border-purple-400"></div>
                <span className="text-gray-700">Bookmarked & Answered</span>
              </div>
            </div>
          </div>

          {/* Question Navigation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Questions</h3>
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((q) => {
                let bgClass = "bg-gray-100 text-gray-700 hover:bg-gray-200"
                if (answers[q] && bookmarked[q]) bgClass = "bg-purple-100 border-2 border-purple-400 text-purple-700"
                else if (answers[q]) bgClass = "bg-green-100 text-green-700"
                else if (bookmarked[q]) bgClass = "bg-yellow-100 border-2 border-yellow-400 text-yellow-700"
                else if (visited[q]) bgClass = "bg-blue-100 border-2 border-blue-300 text-blue-700"
                if (q === currentQuestion) bgClass += " ring-2 ring-blue-500"

                return (
                  <button
                    key={q}
                    onClick={() => setCurrentQuestion(q)}
                    className={`w-10 h-10 rounded font-medium transition-all ${bgClass}`}
                  >
                    {q}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizQuestion
