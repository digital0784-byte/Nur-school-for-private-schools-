import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import {
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  Flag,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { initialQuizQuestions } from "../../data/mockData";
import { QuizQuestion } from "../../types";

export const CBTExamEngine: React.FC = () => {
  const { language, t, showToast } = useApp();

  const [questions, setQuestions] = useState<QuizQuestion[]>(initialQuizQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});

  // Countdown timer in seconds (15 minutes)
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  useEffect(() => {
    let timer: any;
    if (!isExamSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isExamSubmitted, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (optIndex: number) => {
    if (isExamSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optIndex,
    }));
  };

  const toggleFlagCurrent = () => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQuestionIndex]: !prev[currentQuestionIndex],
    }));
  };

  const handleSubmitExam = () => {
    setIsExamSubmitted(true);
    setShowConfirmSubmit(false);
    showToast(
      language === "am"
        ? "የCBT ፈተና በተሳካ ሁኔታ ተጠናቋል! ውጤትዎን ይመልከቱ።"
        : "CBT Examination submitted! Calculating diagnostic score...",
      "success"
    );
  };

  const handleRetakeExam = () => {
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setCurrentQuestionIndex(0);
    setTimeLeft(15 * 60);
    setIsExamSubmitted(false);
  };

  // Calculate score
  const correctCount = questions.reduce((acc, q, idx) => {
    return acc + (selectedAnswers[idx] === q.correctIndex ? 1 : 0);
  }, 0);
  const scorePercent = Math.round((correctCount / (questions.length || 1)) * 100);
  const isPassed = scorePercent >= 60;

  const currentQ = questions[currentQuestionIndex];

  return (
    <div id="cbt-exam-engine" className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header with Timer and Status */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-extrabold uppercase tracking-wide">
              {language === "am" ? "ብሔራዊ የCBT ፈተና ማስመሰያ" : "National Standard CBT"}
            </span>
            <span className="text-xs font-bold text-slate-500">Grade 10 Physics & STEM</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
            {t.student.cbtExamTitle}
          </h2>
        </div>

        {/* Timer Box */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl border font-mono font-bold text-sm ${
              timeLeft < 180 && !isExamSubmitted
                ? "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-400 animate-pulse"
                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            }`}
          >
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{isExamSubmitted ? "00:00" : formatTime(timeLeft)}</span>
          </div>

          {!isExamSubmitted && (
            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-colors"
            >
              {language === "am" ? "ፈተናውን ጨርስ" : "Submit Exam"}
            </button>
          )}

          {isExamSubmitted && (
            <button
              onClick={handleRetakeExam}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === "am" ? "እንደገና ፈትን" : "Retake"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Examination Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 cols: Active Question View */}
        <div className="lg:col-span-3 space-y-4">
          {/* Question Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>

              {!isExamSubmitted && (
                <button
                  onClick={toggleFlagCurrent}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                    flaggedQuestions[currentQuestionIndex]
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>
                    {flaggedQuestions[currentQuestionIndex]
                      ? language === "am"
                        ? "ተጠቁሟል"
                        : "Flagged"
                      : language === "am"
                      ? "ጠቁም"
                      : "Flag for Review"}
                  </span>
                </button>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h3>

            {/* Multiple Choice Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === oIdx;
                const isCorrect = isExamSubmitted && oIdx === currentQ.correctIndex;
                const isWrong = isExamSubmitted && isSelected && !isCorrect;

                return (
                  <div
                    key={oIdx}
                    onClick={() => handleSelectOption(oIdx)}
                    className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                      isExamSubmitted
                        ? isCorrect
                          ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-600 text-emerald-900 dark:text-emerald-100"
                          : isWrong
                          ? "bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-600 text-rose-900 dark:text-rose-100"
                          : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 opacity-60"
                        : isSelected
                        ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20"
                        : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-300 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isSelected
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isExamSubmitted && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    )}
                    {isExamSubmitted && isWrong && (
                      <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Explanation box on review */}
            {isExamSubmitted && currentQ.explanation && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-200">
                  <HelpCircle className="w-4 h-4 text-emerald-600" />
                  <span>Pedagogical Analysis & Correct Logic:</span>
                </div>
                <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Question Navigation Controls */}
          <div className="flex items-center justify-between p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold disabled:opacity-40"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === "am" ? "ያለፈው ጥያቄ" : "Previous"}</span>
            </button>

            <span className="text-xs font-mono font-bold text-slate-500">
              {currentQuestionIndex + 1} / {questions.length}
            </span>

            <button
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))
              }
              disabled={currentQuestionIndex === questions.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold disabled:opacity-40"
            >
              <span>{language === "am" ? "ቀጣይ ጥያቄ" : "Next"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right 1 col: Question Grid & Live Results */}
        <div className="space-y-4">
          {/* Post-submit Diagnostic Score card */}
          {isExamSubmitted && (
            <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-indigo-700 text-white shadow-xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-extrabold text-base">
                {isPassed ? "Exam Passed!" : "Needs Review"}
              </h4>
              <p className="text-3xl font-black font-mono">{scorePercent}%</p>
              <p className="text-xs text-emerald-100">
                You answered {correctCount} out of {questions.length} questions correctly.
              </p>
            </div>
          )}

          {/* Question Grid Navigator */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              {language === "am" ? "የጥያቄዎች ሰሌዳ" : "Question Palette"}
            </h4>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {questions.map((_, idx) => {
                const isAnswered = selectedAnswers[idx] !== undefined;
                const isCurrent = idx === currentQuestionIndex;
                const isFlagged = flaggedQuestions[idx];

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-9 rounded-xl font-bold text-xs flex items-center justify-center relative transition-all ${
                      isCurrent
                        ? "ring-2 ring-emerald-500 font-black scale-105"
                        : ""
                    } ${
                      isExamSubmitted
                        ? selectedAnswers[idx] === questions[idx].correctIndex
                          ? "bg-emerald-600 text-white"
                          : "bg-rose-600 text-white"
                        : isAnswered
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && !isExamSubmitted && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1 right-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-[10px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-100 dark:bg-emerald-950 border border-emerald-400" />
                <span>Answered ({Object.keys(selectedAnswers).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-100 dark:bg-slate-800 border" />
                <span>Unanswered ({questions.length - Object.keys(selectedAnswers).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Flagged for Review</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Submit Dialog */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {language === "am" ? "ፈተናውን ማስገባት ይፈልጋሉ?" : "Ready to Submit Examination?"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              You have answered {Object.keys(selectedAnswers).length} out of {questions.length} questions. Once submitted, answers cannot be amended.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={handleSubmitExam}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
              >
                {language === "am" ? "አዎ አስገባ" : "Yes, Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
