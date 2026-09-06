import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Coffee,
  CheckCircle2,
  Flame,
} from "lucide-react";

export const FocusTimer: React.FC = () => {
  const { language, t, showToast } = useApp();

  const [mode, setMode] = useState<"focus" | "shortBreak" | "longBreak">("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(3);
  const [selectedAmbient, setSelectedAmbient] = useState<"None" | "Binaural" | "Rain">("None");

  // Web Audio synth for ambient sound
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    let timer: any;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const switchMode = (newMode: "focus" | "shortBreak" | "longBreak") => {
    setMode(newMode);
    setIsRunning(false);
    if (newMode === "focus") setTimeLeft(25 * 60);
    else if (newMode === "shortBreak") setTimeLeft(5 * 60);
    else setTimeLeft(15 * 60);
  };

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (mode === "focus") {
      setCompletedSessions((prev) => prev + 1);
      showToast(
        language === "am"
          ? "እንኳን ደስ አለዎት! የ25 ደቂቃ ጥናት ተጠናቋል! አሁን ለ5 ደቂቃ ያርፉ።"
          : "Focus sprint completed! Take a rejuvenating 5-minute break.",
        "success"
      );
      switchMode("shortBreak");
    } else {
      showToast(
        language === "am"
          ? "የእረፍት ጊዜ ተጠናቋል! አዲስ የጥናት ዙር ይጀምሩ።"
          : "Break complete! Ready for your next deep work session?",
        "info"
      );
      switchMode("focus");
    }
  };

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === "focus") setTimeLeft(25 * 60);
    else if (mode === "shortBreak") setTimeLeft(5 * 60);
    else setTimeLeft(15 * 60);
  };

  // Gentle Web Audio ambient synthesis
  const handleAmbientChange = (type: "None" | "Binaural" | "Rain") => {
    setSelectedAmbient(type);

    // Stop current audio if playing
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (e) {}
      oscillatorRef.current = null;
    }

    if (type === "None") return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === "Binaural") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(216, ctx.currentTime); // Gentle 216Hz study tone
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
      } else {
        // Rain / pink noise simulation
        osc.type = "triangle";
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
    } catch (err) {
      console.warn("Audio synthesis notice:", err);
    }
  };

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const formatMinutes = Math.floor(timeLeft / 60);
  const formatSeconds = timeLeft % 60;
  const progressPercent =
    mode === "focus"
      ? ((25 * 60 - timeLeft) / (25 * 60)) * 100
      : mode === "shortBreak"
      ? ((5 * 60 - timeLeft) / (5 * 60)) * 100
      : ((15 * 60 - timeLeft) / (15 * 60)) * 100;

  return (
    <div id="focus-timer-module" className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>Daily Focus Streak: 4 Days Active</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {t.student.focusTimerTitle}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {language === "am"
            ? "በሳይንሳዊ የፖሞዶሮ ዘዴ የአእምሮ ንቃተ-ህሊናን እና የማስታወስ አቅምን ያሳድጉ"
            : "Enhance cognitive retention and avoid study fatigue with evidence-based interval cycles"}
        </p>
      </div>

      {/* Main Timer Dial Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl text-center space-y-6">
        {/* Mode Buttons */}
        <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => switchMode("focus")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === "focus"
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            {t.student.pomodoro} (25m)
          </button>
          <button
            onClick={() => switchMode("shortBreak")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === "shortBreak"
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            {t.student.shortBreak} (5m)
          </button>
          <button
            onClick={() => switchMode("longBreak")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === "longBreak"
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            {t.student.longBreak} (15m)
          </button>
        </div>

        {/* Big Time Display */}
        <div className="relative py-4">
          <div className="text-6xl sm:text-7xl font-black font-mono tracking-tighter text-slate-900 dark:text-white">
            {formatMinutes.toString().padStart(2, "0")}:{formatSeconds.toString().padStart(2, "0")}
          </div>
          <p className="text-xs font-semibold text-slate-400 mt-2 uppercase tracking-widest">
            {mode === "focus"
              ? language === "am"
                ? "ጥልቅ የማተኮር ክፍለ-ጊዜ"
                : "Deep Work Sprint"
              : language === "am"
              ? "የእረፍት ጊዜ"
              : "Rejuvenation Interval"}
          </p>

          {/* Progress bar */}
          <div className="w-48 sm:w-64 mx-auto bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-6">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTimer}
            className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>{language === "am" ? "አፍታ አቁም" : "Pause Session"}</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>{language === "am" ? "ጀምር" : "Start Focus"}</span>
              </>
            )}
          </button>
        </div>

        {/* Ambient Sound Synthesizer Selector */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-semibold">
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span>{language === "am" ? "የጥናት ዳራ ድምፅ (Ambient)" : "Study Ambient Audio"}</span>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            {(["None", "Binaural", "Rain"] as const).map((sound) => (
              <button
                key={sound}
                onClick={() => handleAmbientChange(sound)}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                  selectedAmbient === sound
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                {sound}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Completed Sessions Tracker */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
            {language === "am" ? "የዛሬ የተጠናቀቁ የጥናት ዙሮች" : "Completed Study Blocks Today"}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            {completedSessions * 25} minutes of structured deep work achieved
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                s <= completedSessions
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400"
              }`}
            >
              ✓
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
