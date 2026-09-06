import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  MessageSquare,
  Send,
  User,
  CheckCircle2,
  Clock,
  Phone,
  Video,
} from "lucide-react";

export const ParentTeacherChat: React.FC = () => {
  const { language, t, showToast } = useApp();

  const contacts = [
    {
      id: "cnt-1",
      name: "Dawit Bekele",
      role: "Physics & Science Lead",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      online: true,
      lastMsg: "Dawit scored 94% on the Mechanics lab report. Well done!",
    },
    {
      id: "cnt-2",
      name: "Tigist Alemu",
      role: "Grade 10 Homeroom & Math",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
      online: true,
      lastMsg: "Parent-teacher conference is scheduled for next Friday at 2 PM.",
    },
    {
      id: "cnt-3",
      name: "Dr. Asefa Mengesha",
      role: "Director of Academics",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      online: false,
      lastMsg: "All curriculum standards are updated in accordance with MoE guidelines.",
    },
  ];

  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [messages, setMessages] = useState([
    {
      id: "m1",
      sender: "teacher",
      text: "Hello Mr. Tadesse! I wanted to commend Dawit on his exceptional performance during the Physics lab this morning.",
      time: "09:30 AM",
    },
    {
      id: "m2",
      sender: "parent",
      text: "Thank you Teacher Dawit! We noticed he has been practicing thoroughly with the NUR School AI Tutor.",
      time: "09:35 AM",
    },
  ]);
  const [inputText, setInputText] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newM = {
      id: "m-" + Date.now(),
      sender: "parent",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newM]);
    setInputText("");

    // Simulate friendly teacher auto-reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: "m-reply-" + Date.now(),
          sender: "teacher",
          text: `Thank you for reaching out! I've noted your update regarding Dawit and will provide guidance accordingly in tomorrow's class.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1000);
  };

  return (
    <div id="parent-teacher-chat" className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {t.parent.teacherChatTitle}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {language === "am"
            ? "ከመምህራን እና ከትምህርት ቤት አመራሮች ጋር ቀጥተኛ የጽሁፍ ውይይት"
            : "Encrypted two-way correspondence between parents, homeroom staff, and faculty"}
        </p>
      </div>

      {/* 2-Column Chat Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[550px]">
        {/* Contact List */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-y-auto space-y-2">
          <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider px-2 py-1">
            Faculty Directory
          </h3>

          {contacts.map((c) => {
            const isSelected = c.id === selectedContact.id;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedContact(c)}
                className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center gap-3 ${
                  isSelected
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-400 dark:border-emerald-700"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <div className="relative">
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {c.online && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 absolute bottom-0 right-0" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {c.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate">{c.role}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Thread */}
        <div className="md:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between overflow-hidden">
          {/* Top Contact Bar */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={selectedContact.avatar}
                alt={selectedContact.name}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  {selectedContact.name}
                </h4>
                <p className="text-[10px] text-emerald-600 font-semibold">
                  {selectedContact.role} • Active
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast("Voice call initiated...", "info")}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              >
                <Phone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="p-4 overflow-y-auto space-y-3 flex-1">
            {messages.map((m) => {
              const isMe = m.sender === "parent";
              return (
                <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs sm:max-w-md p-3.5 rounded-2xl text-xs space-y-1 ${
                      isMe
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    <p>{m.text}</p>
                    <span
                      className={`text-[9px] block text-right font-mono ${
                        isMe ? "text-emerald-200" : "text-slate-400"
                      }`}
                    >
                      {m.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={
                language === "am"
                  ? "መልዕክትዎን እዚህ ይጻፉ..."
                  : "Type a message to instructor..."
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
            />
            <button
              type="submit"
              className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
