import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Megaphone,
  Pin,
  Search,
  Plus,
  Calendar,
  User,
  AlertCircle,
  Sparkles,
  Filter,
  CheckCircle2,
  X,
  Share2,
} from "lucide-react";
import { Announcement } from "../../types";

export const AnnouncementsBoard: React.FC = () => {
  const { announcements, addAnnouncement, userRole, language, t, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New announcement form state
  const [newTitle, setNewTitle] = useState("");
  const [newTitleAm, setNewTitleAm] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newContentAm, setNewContentAm] = useState("");
  const [newCategory, setNewCategory] = useState<"General" | "Academic" | "Event" | "Urgent">("General");
  const [isPinned, setIsPinned] = useState(false);

  const canPublish = userRole === "admin" || userRole === "teacher";

  const filteredAnnouncements = announcements.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      item.titleAm.includes(query) ||
      item.content.toLowerCase().includes(query) ||
      item.contentAm.includes(query) ||
      item.author.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  // Sort pinned items to the top
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() && !newTitleAm.trim()) {
      showToast(
        language === "am" ? "እባክዎ የማስታወቂያውን ርዕስ ያስገቡ" : "Please provide an announcement title",
        "error"
      );
      return;
    }
    if (!newContent.trim() && !newContentAm.trim()) {
      showToast(
        language === "am" ? "እባክዎ የማስታወቂያውን ዝርዝር መልእክት ያስገቡ" : "Please provide announcement content",
        "error"
      );
      return;
    }

    addAnnouncement({
      title: newTitle || newTitleAm,
      titleAm: newTitleAm || newTitle,
      content: newContent || newContentAm,
      contentAm: newContentAm || newContent,
      author: userRole === "admin" ? "Super Admin" : "Teacher Department",
      category: newCategory,
      pinned: isPinned,
    });

    setIsNewModalOpen(false);
    setNewTitle("");
    setNewTitleAm("");
    setNewContent("");
    setNewContentAm("");
    setNewCategory("General");
    setIsPinned(false);

    showToast(
      language === "am" ? "አዲስ ማስታወቂያ በተሳካ ሁኔታ ተለጥፏል!" : "New announcement broadcasted successfully!",
      "success"
    );
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "Urgent":
        return "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300/40";
      case "Academic":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300/40";
      case "Event":
        return "bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300/40";
      default:
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300/40";
    }
  };

  const getCategoryLabel = (category: string) => {
    if (language !== "am") return category;
    switch (category) {
      case "Urgent":
        return "አስቸኳይ";
      case "Academic":
        return "አካዳሚክ";
      case "Event":
        return "ዝግጅት / ክስተት";
      default:
        return "አጠቃላይ";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {language === "am" ? "የትምህርት ቤት ይፋዊ ማስታወቂያ ሰሌዳ" : "Official School Bulletin & Announcements"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {language === "am"
                  ? "ከትምህርት ቤቱ አስተዳደር እና መምህራን ለተማሪዎች፣ ወላጆችና ሰራተኞች የሚተላለፉ መረጃዎች"
                  : "Verified communications broadcasted from school administration and faculty."}
              </p>
            </div>
          </div>

          {canPublish && (
            <button
              id="btn-open-new-announcement"
              onClick={() => setIsNewModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{language === "am" ? "አዲስ ማስታወቂያ ለጥፍ" : "Post Announcement"}</span>
            </button>
          )}
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === "am" ? "ማስታወቂያዎችን በርዕስ ወይም በይዘት ፈልግ..." : "Search bulletins by keyword, author..."}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {["All", "Urgent", "Academic", "Event", "General"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {getCategoryLabel(cat)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {sortedAnnouncements.length === 0 ? (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Megaphone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              {language === "am" ? "ምንም ማስታወቂያ አልተገኘም" : "No bulletins found"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {language === "am" ? "የተለየ የፍለጋ ቃል በመጠቀም እንደገና ይሞክሩ" : "Try adjusting your search criteria or category filter."}
            </p>
          </div>
        ) : (
          sortedAnnouncements.map((item) => {
            const title = language === "am" ? item.titleAm || item.title : item.title;
            const content = language === "am" ? item.contentAm || item.content : item.content;

            return (
              <div
                key={item.id}
                id={`announcement-card-${item.id}`}
                className={`rounded-3xl bg-white dark:bg-slate-900 border p-6 transition-all duration-200 hover:shadow-md ${
                  item.pinned
                    ? "border-amber-300 dark:border-amber-700/60 shadow-amber-500/5 bg-gradient-to-r from-amber-500/[0.03] to-transparent"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {item.pinned && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[11px] font-extrabold border border-amber-300/40">
                        <Pin className="w-3 h-3" />
                        <span>{language === "am" ? "የተሰካ / ዋና" : "Pinned Bulletin"}</span>
                      </span>
                    )}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getCategoryBadgeClass(
                        item.category
                      )}`}
                    >
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.date}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {item.author}
                    </span>
                  </div>
                </div>

                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight mb-2">
                  {title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {content}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    {language === "am" ? "ይፋዊ የትምህርት ቤት ማህተም የተረጋገጠ" : "Verified School Notice"}
                  </span>

                  <button
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(`${title}\n\n${content}`);
                        showToast(
                          language === "am" ? "ማስታወቂያው ተገልብጧል" : "Announcement copied to clipboard",
                          "info"
                        );
                      }
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    title={language === "am" ? "መልእክቱን ገልብጥ" : "Copy notice"}
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Announcement Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Megaphone className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {language === "am" ? "አዲስ ማስታወቂያ ማዘጋጃ" : "Compose School Notice"}
                </h3>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublish} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "am" ? "ርዕስ (በአማርኛ)" : "Title (Amharic)"}
                </label>
                <input
                  type="text"
                  value={newTitleAm}
                  onChange={(e) => setNewTitleAm(e.target.value)}
                  placeholder="ምሳሌ፡ የ 1ኛ ወሰነ-ትምህርት የወላጆች ስብሰባ"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "am" ? "ርዕስ (በእንግሊዝኛ)" : "Title (English)"}
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Semester 1 General Parent-Teacher Conference"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === "am" ? "ምድብ" : "Category"}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="General">አጠቃላይ / General</option>
                    <option value="Academic">አካዳሚክ / Academic</option>
                    <option value="Event">ክስተት / Event</option>
                    <option value="Urgent">አስቸኳይ / Urgent</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPinned}
                      onChange={(e) => setIsPinned(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {language === "am" ? "ከላይ ይሰካ (Pin to top)" : "Pin to Top"}
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "am" ? "ዝርዝር ማብራሪያ (በአማርኛ)" : "Message Details (Amharic)"}
                </label>
                <textarea
                  rows={3}
                  value={newContentAm}
                  onChange={(e) => setNewContentAm(e.target.value)}
                  placeholder="የማስታወቂያውን ዝርዝር መልእክት እዚህ ያስገቡ..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "am" ? "ዝርዝር ማብራሪያ (በእንግሊዝኛ)" : "Message Details (English)"}
                </label>
                <textarea
                  rows={3}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Enter notice details in English..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  {language === "am" ? "ሰርዝ" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  {language === "am" ? "አሁን ለጥፍ" : "Publish Notice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
