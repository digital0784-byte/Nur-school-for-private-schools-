import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Video,
  Play,
  Pause,
  Sparkles,
  Volume2,
  VolumeX,
  BookOpen,
  CheckCircle2,
  Clock,
  Loader2,
  Share2,
} from "lucide-react";

export const InteractiveLessons: React.FC = () => {
  const { language, t, showToast } = useApp();

  const lessons = [
    {
      id: "les-1",
      title: "Newton's Third Law & Universal Gravitation",
      titleAm: "የኒውተን ሦስተኛው ሕግ እና ሁለንተናዊ የስበት ኃይል",
      subject: "Physics",
      grade: "Grade 10",
      duration: "18:40",
      instructor: "Dawit Bekele",
      videoThumbnail: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&auto=format&fit=crop&q=80",
      description:
        "An in-depth exploration of mutual interaction forces, impulse-momentum theorem, and planetary gravitational acceleration.",
    },
    {
      id: "les-2",
      title: "Cellular Respiration & ATP Production Cycle",
      titleAm: "የሴሉላር አተነፋፈስ እና የኤቲፒ (ATP) ዑደት",
      subject: "Biology",
      grade: "Grade 10",
      duration: "22:15",
      instructor: "Dr. Asefa Mengesha",
      videoThumbnail: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&auto=format&fit=crop&q=80",
      description:
        "Glycolysis, the Krebs cycle, and electron transport chain mechanics in eukaryotic mitochondria.",
    },
    {
      id: "les-3",
      title: "The Battle of Adwa (1896): Tactics & Geopolitics",
      titleAm: "የአድዋ ድል (1888 ዓ.ም)፡ ወታደራዊ ታክቲክ እና ዲፕሎማሲ",
      subject: "Ethiopian History",
      grade: "Grade 10",
      duration: "25:30",
      instructor: "Solomon Desta",
      videoThumbnail: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80",
      description:
        "Strategic mobilization of Emperor Menelik II and Empress Taytu Betul leading to sovereign triumph.",
    },
  ];

  const [selectedLesson, setSelectedLesson] = useState(lessons[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleGenerateSummary = async () => {
    setIsLoadingSummary(true);
    try {
      const response = await fetch("/api/ai/lesson-summarizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonTitle: selectedLesson.title,
          subject: selectedLesson.subject,
          grade: selectedLesson.grade,
          lessonContent: selectedLesson.description,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to contact summarizer service");
      }

      const data = await response.json();
      setAiSummary(data.summary);
      showToast(
        language === "am"
          ? "የትምህርቱ ማጠቃለያ በGemini AI ተዘጋጅቷል!"
          : "Lesson summary synthesized by Gemini AI!",
        "success"
      );
    } catch (err: any) {
      console.error("Summary error:", err);
      showToast(
        language === "am"
          ? "ማጠቃለያ ማመንጨት አልተቻለም።"
          : "Could not generate summary. Please retry.",
        "error"
      );
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleSpeech = (text: string) => {
    if ("speechSynthesis" in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div id="interactive-lessons" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.student.lessonsTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === "am"
              ? "የዲጂታል ቪዲዮ ትምህርቶች፣ የድምፅ ትረካ እና የአይአይ ማጠቃለያዎች"
              : "Synchronized lecture streams, audio narration, and Gemini automated concept synthesis"}
          </p>
        </div>
      </div>

      {/* Main Video & AI Summary Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Video Player & Controls */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 shadow-2xl aspect-video border border-slate-800 flex items-center justify-center group">
            <img
              src={selectedLesson.videoThumbnail}
              alt={selectedLesson.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isPlaying ? "opacity-30" : "opacity-75"
              }`}
            />

            {/* Play/Pause Overlay */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-xl shadow-emerald-600/30 group-hover:scale-110 transition-transform z-10"
            >
              {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
            </button>

            {/* Bottom Controls Bar */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent flex items-center justify-between text-white text-xs z-10">
              <div className="flex items-center gap-3">
                <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-emerald-400">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <span className="font-mono text-[11px]">
                  {isPlaying ? "04:12" : "00:00"} / {selectedLesson.duration}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-white/20 text-[10px] font-bold">1080p HD</span>
              </div>
            </div>
          </div>

          {/* Lesson Details Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                    {selectedLesson.subject}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Instructor: {selectedLesson.instructor}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {language === "am" ? selectedLesson.titleAm : selectedLesson.title}
                </h3>
              </div>

              <button
                onClick={handleGenerateSummary}
                disabled={isLoadingSummary}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all shrink-0"
              >
                {isLoadingSummary ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{language === "am" ? "በማጠቃለል ላይ..." : "Synthesizing..."}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{language === "am" ? "የአይአይ ማጠቃለያ አውጣ" : "Summarize with Gemini"}</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedLesson.description}
            </p>

            {/* Generated AI Summary Panel */}
            {aiSummary && (
              <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/25 border border-emerald-200 dark:border-emerald-800/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs text-emerald-900 dark:text-emerald-200">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Gemini AI Key Concept Synthesis</span>
                  </div>
                  <button
                    onClick={() => handleSpeech(aiSummary)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 hover:underline"
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isSpeaking ? "Stop Audio" : "Listen Aloud"}</span>
                  </button>
                </div>

                <div className="text-xs text-emerald-900 dark:text-emerald-200 whitespace-pre-line leading-relaxed">
                  {aiSummary}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 col: Lesson Playlist */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
            {language === "am" ? "የትምህርት ክፍሎች ዝርዝር" : "Curriculum Courseware"}
          </h4>

          <div className="space-y-2">
            {lessons.map((les) => {
              const isSelected = les.id === selectedLesson.id;
              return (
                <div
                  key={les.id}
                  onClick={() => {
                    setSelectedLesson(les);
                    setAiSummary(null);
                    setIsPlaying(false);
                  }}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex gap-3 ${
                    isSelected
                      ? "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 ring-2 ring-emerald-500/20"
                      : "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                  }`}
                >
                  <div className="relative w-20 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-900">
                    <img
                      src={les.videoThumbnail}
                      alt={les.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 px-1 rounded bg-slate-950/80 text-[8px] font-mono text-white">
                      {les.duration}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2">
                      {language === "am" ? les.titleAm : les.title}
                    </h5>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {les.subject} • {les.instructor}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
