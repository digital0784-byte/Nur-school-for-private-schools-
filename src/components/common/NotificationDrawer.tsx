import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { X, Bell, CheckCheck, AlertCircle, Calendar, CreditCard, BookOpen } from "lucide-react";

export const NotificationDrawer: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    setActiveTab,
    language,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<string>("all");

  if (!isNotificationDrawerOpen) return null;

  const filtered = notifications.filter((item) => {
    if (activeFilter === "all") return true;
    return item.category === activeFilter;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "alert":
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      case "exam":
        return <Calendar className="w-4 h-4 text-amber-500" />;
      case "fee":
        return <CreditCard className="w-4 h-4 text-emerald-500" />;
      default:
        return <BookOpen className="w-4 h-4 text-indigo-500" />;
    }
  };

  const handleNotificationClick = (item: (typeof notifications)[0]) => {
    markNotificationRead(item.id);
    if (item.linkTab) {
      setActiveTab(item.linkTab);
      setIsNotificationDrawerOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsNotificationDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              {language === "am" ? "ማሳወቂያዎች እና ማንቂያዎች" : "Notifications & Alerts"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>{language === "am" ? "ሁሉንም አንብብ" : "Mark all read"}</span>
            </button>
            <button
              onClick={() => setIsNotificationDrawerOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter tags */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
          {["all", "alert", "exam", "fee", "academic"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap capitalize transition-colors ${
                activeFilter === cat
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300"
              }`}
            >
              {cat === "all" ? (language === "am" ? "ሁሉም" : "All") : cat}
            </button>
          ))}
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">
                {language === "am" ? "ምንም አዲስ ማሳወቂያ የለም" : "No notifications in this category"}
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  item.read
                    ? "bg-white dark:bg-slate-850/40 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                    : "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {language === "am" ? item.titleAm : item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-xs mt-1 leading-relaxed text-slate-600 dark:text-slate-300">
                      {language === "am" ? item.messageAm : item.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
