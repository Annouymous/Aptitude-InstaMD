"use client";
import { Questions } from "@/Question";
import { useState, useEffect } from "react";

export default function AptitudeTest() {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [score, setScore] = useState<number>(0);
  const [timer, setTimer] = useState<number>(45 * 60); // Default 45 minutes
  const [isTestFinished, setIsTestFinished] = useState<boolean>(false);

  // Load from localStorage only on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedQuestion = localStorage.getItem("currentQuestion");
      const savedScore = localStorage.getItem("score");
      const savedTimer = localStorage.getItem("timer");

      if (savedQuestion) setCurrentQuestion(parseInt(savedQuestion));
      if (savedScore) setScore(parseInt(savedScore));
      if (savedTimer) setTimer(parseInt(savedTimer));
    }
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (timer === 0) {
      setIsTestFinished(true);
      return;
    }

    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer((prevTimer) => {
          const newTimer = prevTimer - 1;
          if (typeof window !== "undefined") {
            localStorage.setItem("timer", String(newTimer)); // Save updated timer to localStorage
          }
          return newTimer;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Save current question and score to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("currentQuestion", String(currentQuestion));
      localStorage.setItem("score", String(score));
    }
  }, [currentQuestion, score]);

  const handleAnswerClick = (option: any) => {
    setSelectedAnswer(option);
  };

  const handleNextClick = () => {
    if (!selectedAnswer) {
      alert("Please select an answer before proceeding.");
      return;
    }

    if (selectedAnswer === Questions[currentQuestion].correctOption) {
      setScore(score + 1); // Correct answer, increment score
    }

    if (currentQuestion + 1 < Questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null); // Reset selected answer for next question
    } else {
      setIsTestFinished(true); // End test if it's the last question
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const handleTestCompletion = () => {
    if (score / Questions.length < 0.5) {
      alert("You have failed the test. Better luck next time.");
    } else {
      alert("Congratulations! You have passed the test.");
    }
  };

  useEffect(() => {
    if (isTestFinished) {
      handleTestCompletion();
    }
  }, [isTestFinished]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-8 px-4">
      {isTestFinished ? (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg text-center">
          <h1 className="text-2xl font-semibold mb-4">Test Completed</h1>
          <p className="text-lg">
            Your Score: {score} / {Questions.length}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white mb-5 text-center p-8 rounded-lg shadow-lg w-full max-w-lg">
            <div className="text-xl font-bold uppercase">
              Time Left :{" "}
              <span className="font-extrabold">{formatTime(timer)}</span>
            </div>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h1 className="text-2xl font-semibold text-center mb-6">
              Qs {currentQuestion + 1}: {Questions[currentQuestion].question}
            </h1>
            <div className="space-y-4">
              {Questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(option)}
                  className={`w-full cursor-pointer p-4 text-lg rounded-lg border-2 ${
                    selectedAnswer === option
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  } transition`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between w-full max-w-lg">
            <button
              onClick={handleNextClick}
              disabled={!selectedAnswer} // Disable button if no answer is selected
              className={`w-full bg-blue-500 text-white p-4 rounded-lg font-semibold hover:bg-blue-600 transition ${
                !selectedAnswer ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
