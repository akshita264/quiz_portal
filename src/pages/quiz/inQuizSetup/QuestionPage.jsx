// "use client"

// import { useState, useEffect, useRef } from "react"
// import { Bookmark } from "lucide-react"
// import { useNavigate } from "react-router-dom";
// import { getQuestions } from "../../../services/api"
// import QuizMonitor from "../../../components/QuizMonitor";

// const QuizQuestion = () => {
//   const [questions, setQuestions] = useState([])
//   const [sessionId, setSessionId] = useState(null)
//   const [quizDuration, setQuizDuration] = useState(1800) // 30 minutes default
//   const [currentQuestion, setCurrentQuestion] = useState(0)
//   const [tabSwitchViolations, setTabSwitchViolations] = useState(0)
//   const [proctoringViolations, setProctoringViolations] = useState(0)
//   const [tabSwitchWarning, setTabSwitchWarning] = useState(false)
//   const [isQuizPaused, setIsQuizPaused] = useState(false) 
//   const [fullscreenExited, setFullscreenExited] = useState(false)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const hiddenButtonRef = useRef(null)

//   const [visited, setVisited] = useState({})
//   const [answers, setAnswers] = useState({})
//   const [bookmarked, setBookmarked] = useState({})
//   const [timeLeft, setTimeLeft] = useState(1800)

//   const navigate = useNavigate();

//   // ✅ Fisher–Yates shuffle function
//   const shuffleArray = (array) => {
//     const shuffled = [...array];
//     for (let i = shuffled.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//     }
//     return shuffled;
//   };

//   useEffect(() => {
//     const startQuiz = async () => {
//       try {
//         const quizId = localStorage.getItem('quizId')
//         if (!quizId) {
//           setError('No quiz ID found. Please start from instructions.')
//           setLoading(false)
//           return
//         }

//         const response = await getQuestions(quizId)
        
//         if (response.statusCode === 200) {
//           const { sessionId: newSessionId, questions: quizQuestions } = response.data
//           setSessionId(newSessionId)
//           const randomizedQuestions = shuffleArray(quizQuestions);

//           setQuestions(randomizedQuestions)
//           setTimeLeft(randomizedQuestions.length > 0 ? randomizedQuestions[0].durationSec || 1800 : 1800)

          
//           const initialVisited = {}
//           const initialAnswers = {}
//           const initialBookmarked = {}
          
//          randomizedQuestions.forEach((q, index) => {
//             initialVisited[index] = false
//             initialAnswers[index] = null
//             initialBookmarked[index] = false
//             localStorage.setItem(`question_${index}_id`, q._id)
//           })

          
//           setVisited(initialVisited)
//           setAnswers(initialAnswers)
//           setBookmarked(initialBookmarked)
          
//           setLoading(false)
//         } else {
//           setError('Failed to start quiz. Please try again.')
//           setLoading(false)
//         }
//       } catch (err) {
//         console.error("Error starting quiz:", err)
//         setError('An error occurred while starting the quiz.')
//         setLoading(false)
//       }
//     }
    
//     startQuiz()
//   }, [])

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
//     }, 1000)
//     return () => clearInterval(timer)
//   }, [])

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60)
//     const secs = seconds % 60
//     return `${mins}:${secs.toString().padStart(2, "0")}`
//   }

//   const saveProgress = async (updatedAnswers, updatedBookmarks, updatedVisited, updatedTime) => {
//     try {
//       const progressData = {
//         answers: updatedAnswers,
//         bookmarked: updatedBookmarks,
//         visited: updatedVisited,
//         timeLeft: updatedTime,
//       }
//       localStorage.setItem('quiz-progress', JSON.stringify(progressData))
//     } catch (err) {
//       console.error("Error saving progress:", err)
//     }
//   }

//   useEffect(() => {
//     const interval = setInterval(() => {
//       saveProgress(answers, bookmarked, visited, timeLeft)
//     }, 5000)
//     return () => clearInterval(interval)
//   }, [answers, bookmarked, visited, timeLeft])

//   const currentQ = questions[currentQuestion]
//   const selected = answers[currentQuestion]

//   const handleSelect = (option) => {
//     const updated = { ...answers, [currentQuestion]: option }
//     setAnswers(updated)
//     saveProgress(updated, bookmarked, visited, timeLeft)
//   }

//   const handleBookmark = () => {
//     const updated = { ...bookmarked, [currentQuestion]: !bookmarked[currentQuestion] }
//     setBookmarked(updated)
//     saveProgress(answers, updated, visited, timeLeft)
//   }

//   useEffect(() => {
//     setVisited((prev) => ({ ...prev, [currentQuestion]: true }))
//   }, [currentQuestion])

//   const handleVisibilityChange = async () => {
//     if (document.hidden) {
//       console.warn("[SECURITY] User attempted to switch tabs - auto-entering fullscreen")
//       setTabSwitchViolations((prev) => prev + 1)
//       setIsQuizPaused(true)

//       setTimeout(() => {
//         setTabSwitchWarning(true)
//       }, 1500)

//       setTimeout(async () => {
//         try {
//           if (!document.fullscreenElement) {
//             await document.documentElement.requestFullscreen().catch((err) => {
//               console.warn("Auto-fullscreen on tab switch failed:", err)
//             })
//           }
//         } catch (err) {
//           console.warn("Auto-fullscreen on tab switch failed:", err)
//         }
//       }, 50)

//       setTimeout(() => {
//         setTabSwitchWarning(false)
//       }, 6500)
//     } else {
//       console.log("[SECURITY] User returned to quiz tab")
//       setIsQuizPaused(false)

//       if (!document.fullscreenElement) {
//         setTimeout(async () => {
//           try {
//             await document.documentElement.requestFullscreen().catch((err) => {
//               console.warn("Fullscreen re-entry on tab return failed:", err)
//             })
//           } catch (err) {
//             console.warn("Fullscreen re-entry on tab return failed:", err)
//           }
//         }, 100)
//       }
//     }
//   }

//   useEffect(() => {
//     const handleRightClick = (e) => e.preventDefault()
//     document.addEventListener("contextmenu", handleRightClick)

//     const handleKeyDown = (e) => {
//       if (e.key === "Escape" || e.key === "Tab") {
//         e.preventDefault()
//         e.stopPropagation()
//         e.stopImmediatePropagation()
//         return
//       }

//       if (
//         e.key === "F12" ||
//         (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
//         (e.ctrlKey && (e.key === "U" || e.key === "C" || e.key === "V" || e.key === "S")) ||
//         (e.metaKey && e.altKey && (e.key === "I" || e.key === "J"))
//       ) {
//         e.preventDefault()
//       }
//     }
//     document.addEventListener("keydown", handleKeyDown, true)

//     const disableCopyPaste = (e) => e.preventDefault()
//     document.addEventListener("copy", disableCopyPaste)
//     document.addEventListener("paste", disableCopyPaste)
//     document.addEventListener("cut", disableCopyPaste)

//     document.addEventListener("visibilitychange", handleVisibilityChange)

//     const handleFullscreenChange = () => {
//       if (!document.fullscreenElement) {
//         console.warn("[SECURITY] User exited fullscreen")
//         setFullscreenExited(true)

//         setTimeout(async () => {
//           try {
//             await document.documentElement.requestFullscreen().catch((err) => {
//               console.warn("Fullscreen re-entry failed:", err)
//             })
//           } catch (err) {
//             console.warn("Fullscreen re-entry failed:", err)
//           }
//         }, 100)
//       } else {
//         setFullscreenExited(false)
//       }
//     }
//     document.addEventListener("fullscreenchange", handleFullscreenChange)

//     const fullscreenCheckInterval = setInterval(async () => {
//       if (!document.fullscreenElement) {
//         setFullscreenExited(true)
//         try {
//           await document.documentElement.requestFullscreen().catch((err) => {
//             console.warn("Continuous fullscreen check failed:", err)
//           })
//         } catch (err) {
//           console.warn("Continuous fullscreen check failed:", err)
//         }
//       }
//     }, 500)

//     return () => {
//       document.removeEventListener("contextmenu", handleRightClick)
//       document.removeEventListener("keydown", handleKeyDown, true)
//       document.removeEventListener("copy", disableCopyPaste)
//       document.removeEventListener("paste", disableCopyPaste)
//       document.removeEventListener("cut", disableCopyPaste)
//       document.removeEventListener("visibilitychange", handleVisibilityChange)
//       document.removeEventListener("fullscreenchange", handleFullscreenChange)
//       clearInterval(fullscreenCheckInterval)
//     }
//   }, [])

//   useEffect(() => {
//     const autoTriggerFullscreen = setTimeout(() => {
//       if (hiddenButtonRef.current) {
//         hiddenButtonRef.current.click()
//       }
//     }, 50)

//     return () => clearTimeout(autoTriggerFullscreen)
//   }, [])

//   const enterFullscreen = async () => {
//     try {
//       await document.documentElement.requestFullscreen()
//     } catch (err) {
//       console.warn("Fullscreen request failed:", err)
//     }
//   }
  
//   const handleProctoringViolation = (violation) => {
//     setProctoringViolations(prev => prev + 1);
//   };

//   // ✅ When proctoringViolations hits 4k, 8k, or 12k → add 1 tab-switch violation
//   useEffect(() => {
//     if ([4000, 8000, 12000].includes(proctoringViolations)) {
//       setTabSwitchViolations(prev => prev + 1)
//     }
//   }, [proctoringViolations])

//   // ✅ Auto-submit when tabSwitchViolations reaches 3
//   useEffect(() => {
//     if (tabSwitchViolations >= 3) {
//       console.warn("[SECURITY] Too many tab switch violations - auto submitting quiz")
//       navigate("/submit")
//     }
//   }, [tabSwitchViolations, navigate])

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading quiz...</p>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
//           <h2 className="text-2xl font-bold mb-2 text-red-600">Error</h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button 
//             onClick={() => navigate('/quiz/instructions')} 
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Return to Instructions
//           </button>
//         </div>
//       </div>
//     )
//   }

//   if (!questions || questions.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
//           <h2 className="text-2xl font-bold mb-2">No Questions Available</h2>
//           <p className="text-gray-600">There are no questions for this quiz.</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 select-none pointer-events-auto">
//       <QuizMonitor onViolation={handleProctoringViolation} />
      
//       <div className="bg-white border-b border-gray-300 sticky top-0 z-50 shadow-sm">
//         <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
//           <div>
//             <img src="/owasp_logo.png" alt="Logo" className="h-10 mb-2" />
//             <p className="text-sm text-gray-600">
//               Question {currentQuestion + 1} of {questions.length}
//             </p>
//             {(tabSwitchViolations > 0 || proctoringViolations > 0) && (
//               <div className="mt-1 space-y-0.5">
//                 {tabSwitchViolations > 0 && (
//                   <p className="text-xs text-red-600 font-semibold">
//                     ⚠️ warning count : {tabSwitchViolations}
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>

//           <div className="flex items-center gap-8">
//             <div className="flex items-center gap-2 text-gray-700 bg-gray-200 py-1 px-3 rounded">
//               <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               <span className="text-lg font-semibold text-gray-700">{formatTime(timeLeft)}</span>
//             </div>
//             <button  
//               onClick={() => navigate("/submit")}
//               className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition-all"
//             >
//               Submit Quiz
//             </button>
//           </div>
//         </div>
//       </div>

//       {fullscreenExited && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999]">
//           <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md text-center ">
//             <div className="text-orange-600 text-5xl mb-4">⛔</div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-3">Fullscreen Required</h2>
//             <p className="text-gray-700 mb-6">
//               You have exited fullscreen mode. Please click the button below to return to fullscreen to continue the
//               quiz.
//             </p>
//             <button
//               onClick={enterFullscreen}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
//             >
//               Enter Fullscreen
//             </button>
//           </div>
//         </div>
//       )}

//       {tabSwitchWarning && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9998] animate-pulse">
//           <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md text-center">
//             <div className="text-red-600 text-4xl mb-4">⚠️</div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">Tab Switch Detected!</h2>
//             <p className="text-gray-700 mb-4">
//               You switched tabs. This is violation #{tabSwitchViolations}. Please stay focused on the quiz.
//             </p>
//             <p className="text-sm text-gray-600">Returning to fullscreen automatically...</p>
//           </div>
//         </div>
//       )}

//       {isQuizPaused && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9997]">
//           <div className="bg-yellow-50 border-4 border-yellow-400 rounded-lg p-6 text-center">
//             <p className="text-xl font-bold text-yellow-800">Quiz Paused</p>
//             <p className="text-sm text-yellow-700 mt-2">You are away from the quiz tab</p>
//           </div>
//         </div>
//       )}

//       <button ref={hiddenButtonRef} onClick={enterFullscreen} style={{ display: "none" }} aria-hidden="true" />

//       <div className="max-w-6xl mx-auto p-8 grid grid-cols-3 gap-8">
//         <div className="col-span-2">
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
//             <div className="flex items-start justify-between mb-6">
//               <div>
//                 <div className="flex items-center gap-3 mb-2">
//                   <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded">Single Choice</span>
//                   <span className="text-sm font-medium text-gray-700">{currentQ.marks} points</span>
//                 </div>
//                 <h2 className="text-lg font-semibold text-gray-900">{currentQ.questionText}</h2>
//               </div>
//               <button
//                 onClick={handleBookmark}
//                 className={`flex items-center gap-2 px-3 py-2 rounded transition-all ${
//                   bookmarked[currentQuestion]
//                     ? "text-yellow-600 bg-yellow-50"
//                     : "text-gray-600 bg-gray-100 hover:bg-gray-200"
//                 }`}
//               >
//                 <Bookmark size={18} fill={bookmarked[currentQuestion] ? "currentColor" : "none"} />
//                 <span className="text-sm font-medium">{bookmarked[currentQuestion] ? "Bookmarked" : "Bookmark"}</span>
//               </button>
//             </div>

//             <div className="space-y-3">
//               {currentQ.options.map((option, idx) => (
//                 <label
//                   key={idx}
//                   className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all"
//                   style={{
//                     borderColor: selected === option.optionText ? "#3b82f6" : "#e5e7eb",
//                     backgroundColor: selected === option.optionText ? "#eff6ff" : "white",
//                   }}
//                 >
//                   <input
//                     type="radio"
//                     name={`question-${currentQuestion}`}
//                     value={option.optionText}
//                     checked={selected === option.optionText}
//                     onChange={(e) => handleSelect(e.target.value)}
//                     className="w-4 h-4 cursor-pointer"
//                   />
//                   <span className="ml-3 text-gray-700">{option.optionText}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div className="flex justify-between mt-8">
//             <button
//               onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
//               disabled={currentQuestion === 0}
//               className="px-6 py-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
//             >
//               Previous
//             </button>
//             <button
//               onClick={() => setCurrentQuestion((prev) => Math.min(questions.length - 1, prev + 1))}
//               disabled={currentQuestion === questions.length - 1}
//               className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </div>

//         <div className="col-span-1">
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Navigator</h3>
//             <div className="grid grid-cols-5 gap-2">
//               {questions.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setCurrentQuestion(index)}
//                   className={`w-10 h-10 rounded-lg font-medium text-sm border transition-all ${
//                     currentQuestion === index
//                       ? "bg-blue-600 text-white border-blue-600"
//                       : visited[index]
//                       ? "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
//                       : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
//                   }`}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//             </div>

//             <div className="mt-6 space-y-2 text-sm text-gray-600">
//               <div className="flex items-center gap-2">
//                 <span className="w-4 h-4 bg-blue-600 rounded"></span>
//                 <span>Current</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="w-4 h-4 bg-gray-200 border border-gray-300 rounded"></span>
//                 <span>Visited</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default QuizQuestion

"use client"

import { useState, useEffect, useRef } from "react"
import { Bookmark } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { getQuestions } from "../../../services/api"
import QuizMonitor from "../../../components/QuizMonitor";

const QuizQuestion = () => {
  const [questions, setQuestions] = useState([])
  const [sessionId, setSessionId] = useState(null)
  const [quizDuration, setQuizDuration] = useState(1800) // 30 minutes default
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [tabSwitchViolations, setTabSwitchViolations] = useState(0)
  const [proctoringViolations, setProctoringViolations] = useState(0)
  const [tabSwitchWarning, setTabSwitchWarning] = useState(false)
  const [isQuizPaused, setIsQuizPaused] = useState(false) 
  const [fullscreenExited, setFullscreenExited] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const hiddenButtonRef = useRef(null)

  const [visited, setVisited] = useState({})
  const [answers, setAnswers] = useState({})
  const [bookmarked, setBookmarked] = useState({})
  const [timeLeft, setTimeLeft] = useState(1800)

  const navigate = useNavigate();

  // ✅ Fisher–Yates shuffle function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const startQuiz = async () => {
      try {
        const quizId = localStorage.getItem('quizId')
        if (!quizId) {
          setError('No quiz ID found. Please start from instructions.')
          setLoading(false)
          return
        }

        const response = await getQuestions(quizId)
        
        if (response.statusCode === 200) {
          const { sessionId: newSessionId, questions: quizQuestions } = response.data
          setSessionId(newSessionId)
          const randomizedQuestions = shuffleArray(quizQuestions);

          setQuestions(randomizedQuestions)
          setTimeLeft(randomizedQuestions.length > 0 ? randomizedQuestions[0].durationSec || 1800 : 1800)

          
          const initialVisited = {}
          const initialAnswers = {}
          const initialBookmarked = {}
          
         randomizedQuestions.forEach((q, index) => {
            initialVisited[index] = false
            initialAnswers[index] = null
            initialBookmarked[index] = false
            localStorage.setItem(`question_${index}_id`, q._id)
          })

          
          setVisited(initialVisited)
          setAnswers(initialAnswers)
          setBookmarked(initialBookmarked)
          
          setLoading(false)
        } else {
          setError('Failed to start quiz. Please try again.')
          setLoading(false)
        }
      } catch (err) {
        console.error("Error starting quiz:", err)
        setError('An error occurred while starting the quiz.')
        setLoading(false)
      }
    }
    
    startQuiz()
  }, [])

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
      localStorage.setItem('quiz-progress', JSON.stringify(progressData))
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
    if (questions.length > 0) {
      setVisited((prev) => ({ ...prev, [currentQuestion]: true }))
    }
  }, [currentQuestion, questions.length])


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
      if (e.key === "Escape" || e.key === "Tab") {
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
  
  const handleProctoringViolation = (violation) => {
    setProctoringViolations(prev => prev + 1);
  };

  // ✅ When proctoringViolations hits 4k, 8k, or 12k → add 1 tab-switch violation
  useEffect(() => {
    if ([4000, 8000, 12000].includes(proctoringViolations)) {
      setTabSwitchViolations(prev => prev + 1)
    }
  }, [proctoringViolations])

  // ✅ Auto-submit when tabSwitchViolations reaches 3
  useEffect(() => {
    if (tabSwitchViolations >= 3) {
      console.warn("[SECURITY] Too many tab switch violations - auto submitting quiz")
      navigate("/submit")
    }
  }, [tabSwitchViolations, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-2 text-red-600">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/quiz/instructions')} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Instructions
          </button>
        </div>
      </div>
    )
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-2">No Questions Available</h2>
          <p className="text-gray-600">There are no questions for this quiz.</p>
        </div>
      </div>
    )
  }


  const getQuestionStatusClass = (index) => {
    if (index === currentQuestion) {
      return "bg-blue-600 text-white border-blue-700 font-bold";
    }

    const isAnswered = answers[index] !== null;
    const isBookmarked = bookmarked[index];

    // 2. Bookmarked & Answered (Purple)
    if (isBookmarked && isAnswered) {
      return "bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200"; 
    }

    // 3. Bookmarked (Yellow)
    if (isBookmarked) {
      return "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200";
    }

    // 4. Answered (Green)
    if (isAnswered) {
      return "bg-green-100 text-green-800 border-green-300 hover:bg-green-200";
    }
    
    // 5. Visited (Light Blue)
    if (visited[index]) {
      return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
    }

    // 6. Not Visited (White/Gray)
    return "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";
  };

  return (
    <div className="min-h-screen bg-gray-50 select-none pointer-events-auto">
      <QuizMonitor onViolation={handleProctoringViolation} />
      
      <div className="bg-white border-b border-gray-300 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div>
            <img src="/owasp_logo.png" alt="Logo" className="h-10 mb-2" />
            <p className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </p>
            {(tabSwitchViolations > 0 || proctoringViolations > 0) && (
              <div className="mt-1 space-y-0.5">
                {tabSwitchViolations > 0 && (
                  <p className="text-xs text-red-600 font-semibold">
                    ⚠️ warning count : {tabSwitchViolations}
                  </p>
                )}
              </div>
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
            <button  
              onClick={() => navigate("/submit")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition-all"
            >
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

      <button ref={hiddenButtonRef} onClick={enterFullscreen} style={{ display: "none" }} aria-hidden="true" />

      <div className="max-w-6xl mx-auto p-8 grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded">Single Choice</span>
                  <span className="text-sm font-medium text-gray-700">{currentQ.marks} points</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{currentQ.questionText}</h2>
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
                    borderColor: selected === option.optionText ? "#3b82f6" : "#e5e7eb",
                    backgroundColor: selected === option.optionText ? "#eff6ff" : "white",
                  }}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={option.optionText}
                    checked={selected === option.optionText}
                    onChange={(e) => handleSelect(e.target.value)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="ml-3 text-gray-700">{option.optionText}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentQuestion((prev) => Math.min(questions.length - 1, prev + 1))}
              disabled={currentQuestion === questions.length - 1}
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Navigator</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-lg font-medium text-sm border transition-all ${getQuestionStatusClass(index)}`}>
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <div className="space-y-2 text-sm text-gray-700">
                
                {/* Not Visited (White) */}
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-white border border-gray-300"></span>
                  <span>Not visited</span>
                </div>

                {/* Visited (Light Blue) */}
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-50 border border-blue-200"></span>
                  <span>Visited</span>
                </div>

                {/* Answered (Green) */}
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-green-100 border border-green-300"></span>
                  <span>Answered</span>
                </div>
                
                {/* Bookmarked (Yellow) */}
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-yellow-100 border border-yellow-300"></span>
                  <span>Bookmarked</span>
                </div>

                {/* Bookmarked & Answered (Purple) */}
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-purple-100 border border-purple-300"></span>
                  <span>Bookmarked & Answered</span>
                </div>

              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizQuestion

