import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import {
  BrainCircuit,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  BookOpen,
  Loader2,
  HelpCircle,
  Copy,
  Check,
} from "lucide-react";
import { ChatMessage } from "../../types";

export const AITutorChat: React.FC = () => {
  const { language, t, showToast } = useApp();

  const [subject, setSubject] = useState("Physics");
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      role: "assistant",
      content:
        language === "am"
          ? "ሰላም! እኔ የኑር ትምህርት ቤት የGemini AI የግል አስተማሪ ነኝ። በፊዚክስ፣ ሂሳብ፣ ኬሚስትሪ፣ ባዮሎጂ ወይም ታሪክ ማንኛውንም የቤት ስራ ጥያቄ ለመረዳት እንድትችል አግዝሃለሁ። ዛሬ በምን ርዕስ ላይ እንወያይ?"
          : "Hello! I am your NUR School Gemini AI Socratic Tutor. I'm here to help you deconstruct complex concepts in Physics, Mathematics, Sciences, and History. Ask me any question or paste a problem you'd like to work through step-by-step!",
      timestamp: "Just now",
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickPrompts = [
    {
      labelEn: "Newton's 3rd Law in everyday life",
      labelAm: "የኒውተን ሶስተኛ ህግ በእለት ተእለት ኑሮ",
      prompt: "Explain Newton's third law of motion with a real-life example I can observe in Ethiopia.",
    },
    {
      labelEn: "How to factor Quadratic equations",
      labelAm: "ባለ ሁለትዮሽ እኩልዮሽ አሰራር",
      prompt: "Can you guide me step-by-step through solving quadratic equations using factorization?",
    },
    {
      labelEn: "Battle of Adwa significance",
      labelAm: "የአድዋ ድል ታሪካዊ ፋይዳ",
      prompt: "Explain the historical and global geopolitical significance of the Battle of Adwa (1896).",
    },
    {
      labelEn: "Cellular respiration vs Photosynthesis",
      labelAm: "ፎቶሲንተሲስ እና ሴሉላር ሬስፒሬሽን",
      prompt: "Compare and contrast photosynthesis and cellular respiration with chemical equations.",
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Build conversation history payload
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/ai/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          subject,
          language,
          conversationHistory: historyPayload,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reach Gemini Tutor service");
      }

      const data = await response.json();

      const aiReply: ChatMessage = {
        id: "msg-ai-" + Date.now(),
        role: "assistant",
        content: data.reply || "I apologize, but I could not generate a response.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err: any) {
      console.error("AI Tutor chat error:", err);
      showToast(
        language === "am"
          ? "ከአይአይ መምህር ጋር መገናኘት አልተቻለም። እባክዎ እንደገና ይሞክሩ።"
          : "Could not connect to AI Tutor. Please retry.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextToSpeech = (text: string) => {
    if ("speechSynthesis" in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      showToast("Text-to-speech is not supported in this browser environment.", "info");
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast(language === "am" ? "ተገልብጧል" : "Copied to clipboard", "success");
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "msg-init",
        role: "assistant",
        content:
          language === "am"
            ? "ውይይቱ በአዲስ ተጀምሯል! ምን ልርዳህ?"
            : "Conversation reset! What subject or problem shall we tackle next?",
        timestamp: "Just now",
      },
    ]);
  };

  return (
    <div id="ai-tutor-chat" className="space-y-4 max-w-5xl mx-auto">
      {/* Top Banner with Subject & Reset */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                {t.student.aiTutorTitle}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300/40">
                Gemini 2.5 Pro
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === "am" ? "የሶቅራጥስ ዘዴን የሚከተል የአይአይ የግል መምህር" : "Socratic guidance for deep conceptual mastery"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="Physics">Physics</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Ethiopian History">Ethiopian History</option>
              <option value="English">English</option>
              <option value="ICT & Coding">ICT & Coding</option>
            </select>
          </div>

          <button
            onClick={handleResetChat}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
            title="Reset Conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Prompts Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(qp.prompt)}
            className="px-3.5 py-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-sm text-xs font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{language === "am" ? qp.labelAm : qp.labelEn}</span>
          </button>
        ))}
      </div>

      {/* Main Chat Thread */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 sm:p-6 min-h-[460px] max-h-[600px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isAi = msg.role === "assistant";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isAi ? "justify-start" : "justify-end"}`}
            >
              {isAi && (
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
                  <BrainCircuit className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-xl rounded-2xl p-4 text-xs leading-relaxed space-y-2 shadow-sm ${
                  isAi
                    ? "bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700/60"
                    : "bg-emerald-600 text-white font-medium"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                <div
                  className={`flex items-center justify-between text-[10px] pt-2 border-t ${
                    isAi
                      ? "border-slate-200 dark:border-slate-700 text-slate-400"
                      : "border-emerald-500 text-emerald-100"
                  }`}
                >
                  <span>{msg.timestamp}</span>

                  {isAi && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleTextToSpeech(msg.content)}
                        className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
                        title="Read Aloud / Text-to-Speech"
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
                        title="Copy Response"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {!isAi && (
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 font-bold text-xs">
                  Me
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 animate-pulse">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 flex items-center gap-2 text-xs text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>
                {language === "am"
                  ? "የGemini AI አስተማሪ በማሰብ ላይ ነው..."
                  : "Gemini AI Tutor is synthesizing Socratic breakdown..."}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-2"
      >
        <input
          type="text"
          placeholder={
            language === "am"
              ? `በ${subject} ላይ ጥያቄዎን በአማርኛ ወይም በእንግሊዝኛ ይጠይቁ...`
              : `Ask a question in ${subject} (English or አማርኛ)...`
          }
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 rounded-2xl bg-transparent text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
        />

        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 disabled:opacity-40 transition-all flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
