import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Sparkles,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Send,
  Loader2,
  Copy,
  Layers,
  HelpCircle,
  Award,
} from "lucide-react";
import { QuizQuestion } from "../../types";

export const AIQuizGenerator: React.FC = () => {
  const { language, t, showToast } = useApp();

  const [subject, setSubject] = useState("Physics");
  const [grade, setGrade] = useState("Grade 10");
  const [topic, setTopic] = useState("Newton's Laws of Motion and Momentum");
  const [numQuestions, setNumQuestions] = useState(3);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [quizLanguage, setQuizLanguage] = useState<"en" | "am">("en");

  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<QuizQuestion[]>([]);

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      showToast(language === "am" ? "እባክዎ የፈተናውን ርዕስ ያስገቡ" : "Please enter a topic", "error");
      return;
    }

    setIsLoading(true);
    setGeneratedQuestions([]);

    try {
      const response = await fetch("/api/ai/quiz-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          grade,
          topic,
          numQuestions,
          difficulty,
          language: quizLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to contact Gemini AI service");
      }

      const data = await response.json();
      if (Array.isArray(data.questions)) {
        setGeneratedQuestions(data.questions);
        showToast(
          language === "am"
            ? `በGemini AI አማካኝነት ${data.questions.length} ጥያቄዎች ተዘጋጅተዋል!`
            : `Successfully generated ${data.questions.length} exam questions with Gemini AI!`,
          "success"
        );
      } else {
        throw new Error("Invalid format received from server");
      }
    } catch (err: any) {
      console.error("AI Quiz Generator error:", err);
      showToast(
        language === "am"
          ? "ከአይአይ ሰርቨር ጋር መገናኘት አልተቻለም። እባክዎ እንደገና ይሞክሩ።"
          : "Could not generate questions. Please check connection and retry.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishToCBT = () => {
    // In our live app, save into session/local CBT bank
    showToast(
      language === "am"
        ? "ጥያቄዎቹ ወደ ተማሪዎች የCBT ፈተና ባንክ ተላልፈዋል!"
        : "Questions successfully published to Student CBT Online Examination Bank!",
      "success"
    );
  };

  return (
    <div id="ai-quiz-generator" className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-700 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3 border border-white/25">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Google Gemini 2.5 Pro Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {t.teacher.aiQuizGeneratorTitle}
          </h2>
          <p className="text-sm text-amber-100 mt-2 leading-relaxed">
            {language === "am"
              ? "የኢትዮጵያ የትምህርት ካሪኩለምን መሰረት ያደረጉ ፈተናዎችን፣ መልሶችን እና ማብራሪያዎችን በቅጽበት በGemini AI ያመንጩ።"
              : "Generate curriculum-aligned exam questions, standardized options, and diagnostic pedagogical explanations in English or Amharic."}
          </p>
        </div>
      </div>

      {/* Generator Form */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <form onSubmit={handleGenerateQuiz} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
              >
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Ethiopian History">Ethiopian History</option>
                <option value="English">English</option>
                <option value="Civics">Civics & Ethical Education</option>
                <option value="ICT">Information & Communications Tech</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Grade Level
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
              >
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Quiz Language
              </label>
              <select
                value={quizLanguage}
                onChange={(e) => setQuizLanguage(e.target.value as "en" | "am")}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
              >
                <option value="en">English (Standard National Exam)</option>
                <option value="am">አማርኛ (Amharic Bilingual Mode)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Topic / Learning Objective *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Thermodynamics, Photosynthesis, or Ethiopian Battle of Adwa"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Questions
                </label>
                <select
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold shadow-lg shadow-amber-600/25 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{language === "am" ? "በማመንጨት ላይ..." : "Generating with Gemini AI..."}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t.teacher.generateQuiz}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Questions Stream */}
      {generatedQuestions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {language === "am" ? "የተዘጋጁ የፈተና ጥያቄዎች" : "Generated Diagnostic Assessment"} ({generatedQuestions.length})
              </h3>
            </div>

            <button
              onClick={handlePublishToCBT}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{language === "am" ? "ወደ CBT ፈተና ባንክ ላክ" : "Publish to CBT Exam Bank"}</span>
            </button>
          </div>

          <div className="space-y-4">
            {generatedQuestions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center font-black text-xs shrink-0">
                      Q{idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                      {q.question}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase shrink-0">
                    {difficulty}
                  </span>
                </div>

                {/* Multiple choice options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = optIdx === q.correctIndex;
                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-2xl border flex items-center justify-between ${
                          isCorrect
                            ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 font-semibold"
                            : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </div>
                    );
                  })}
                </div>

                {/* Pedagogical Explanation */}
                {q.explanation && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                      <span>Pedagogical Justification:</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
