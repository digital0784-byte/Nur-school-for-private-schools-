import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  BookOpen,
  Search,
  BookMarked,
  Download,
  Eye,
  CheckCircle2,
  Calendar,
  Layers,
  X,
  Sparkles,
  GraduationCap,
  FileText,
  Bookmark,
  Share2,
  ExternalLink,
  ChevronRight,
  Filter,
  Flame,
  Award,
} from "lucide-react";
import { LibraryBook, TextbookUnit } from "../../types";

export const LibraryManagement: React.FC = () => {
  const { language, t, showToast, libraryBooks, borrowBook, setActiveTab } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string>("All");
  const [selectedStream, setSelectedStream] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBookType, setSelectedBookType] = useState<string>("All");
  const [onlyCurriculum, setOnlyCurriculum] = useState(true);
  const [activeReadingBook, setActiveReadingBook] = useState<LibraryBook | null>(null);
  const [activeUnitIndex, setActiveUnitIndex] = useState<number>(0);

  const gradeOptions = [
    { label: language === "am" ? "ሁሉም ክፍሎች" : "All Grades", value: "All" },
    { label: language === "am" ? "5ኛ ክፍል" : "Grade 5", value: "Grade 5" },
    { label: language === "am" ? "6ኛ ክፍል" : "Grade 6", value: "Grade 6" },
    { label: language === "am" ? "7ኛ ክፍል" : "Grade 7", value: "Grade 7" },
    { label: language === "am" ? "8ኛ ክፍል" : "Grade 8", value: "Grade 8" },
    { label: language === "am" ? "9ኛ ክፍል" : "Grade 9", value: "Grade 9" },
    { label: language === "am" ? "10ኛ ክፍል" : "Grade 10", value: "Grade 10" },
    { label: language === "am" ? "11ኛ ክፍል" : "Grade 11", value: "Grade 11" },
    { label: language === "am" ? "12ኛ ክፍል" : "Grade 12", value: "Grade 12" },
  ];

  const bookTypeOptions = [
    { label: language === "am" ? "ሁሉም (All Types)" : "All Types", value: "All" },
    {
      label: language === "am" ? "📘 የመማሪያ መጽሐፍ (Textbooks)" : "📘 MoE Textbooks",
      value: "textbook",
    },
    {
      label:
        language === "am"
          ? "📙 ረዳት መጻሕፍት (Extreme & Master)"
          : "📙 Supplementary (Extreme Series)",
      value: "supplementary",
    },
    {
      label:
        language === "am"
          ? "📝 የፈተና ዝግጅት እና የጥያቄ ባንክ"
          : "📝 National Exam Prep & Q-Bank",
      value: "exam_prep",
    },
    {
      label: language === "am" ? "🧑‍🏫 የመምህሩ መምሪያ" : "🧑‍🏫 Teacher's Guides",
      value: "teacher_guide",
    },
  ];

  const categories = [
    "All",
    "Mathematics",
    "Science",
    "Language",
    "Social Studies",
    "History",
    "Technology",
    "General",
  ];

  const filteredBooks = libraryBooks.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.titleAm.includes(searchQuery) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.publisher && b.publisher.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.isbn && b.isbn.includes(searchQuery)) ||
      (b.grade && b.grade.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesGrade = selectedGrade === "All" || b.grade === selectedGrade;
    const matchesCategory = selectedCategory === "All" || b.category === selectedCategory;
    const matchesStream =
      selectedStream === "All" || !b.stream || b.stream === "General" || b.stream === selectedStream;
    const matchesCurriculum = !onlyCurriculum || Boolean(b.curriculum);

    const matchesBookType =
      selectedBookType === "All" ||
      (selectedBookType === "textbook" && (!b.bookType || b.bookType === "textbook")) ||
      b.bookType === selectedBookType;

    return (
      matchesSearch &&
      matchesGrade &&
      matchesCategory &&
      matchesStream &&
      matchesCurriculum &&
      matchesBookType
    );
  });

  const handleBorrow = (book: LibraryBook) => {
    if (book.availableCopies <= 0) {
      showToast(
        language === "am"
          ? "ይቅርታ፣ በአሁኑ ሰዓት ሁሉም የታተሙ ቅጂዎች ተውሰዋል!"
          : "Sorry, all physical copies are currently borrowed!",
        "error"
      );
      return;
    }
    borrowBook(book.id, language === "am" ? "ተማሪ አበበ ታደሰ" : "Student Abebe Tadesse");
    showToast(
      language === "am"
        ? `"${book.titleAm}" በተሳካ ሁኔታ ተውሷል! የመመለሻ ጊዜ 14 ቀናት ነው።`
        : `"${book.title}" borrowed successfully! Return due in 14 days.`,
      "success"
    );
  };

  const handleDownloadOffline = (book: LibraryBook) => {
    showToast(
      language === "am"
        ? `"${book.titleAm}" የዲጂታል PDF ቅጂ ወደ መሳሪያዎ እየወረደ ነው...`
        : `Downloading offline digital PDF for "${book.title}"...`,
      "info"
    );
  };

  const getBookTypeBadge = (book: LibraryBook) => {
    if (book.bookType === "supplementary") {
      return (
        <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-white text-[9px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm">
          {language === "am" ? "📙 ረዳት መጽሐፍ" : "📙 Supplementary"}
        </span>
      );
    }
    if (book.bookType === "exam_prep") {
      return (
        <span className="px-2 py-0.5 rounded-md bg-rose-600/90 text-white text-[9px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm">
          {language === "am" ? "📝 የፈተና ዝግጅት" : "📝 Exam Prep"}
        </span>
      );
    }
    if (book.bookType === "teacher_guide") {
      return (
        <span className="px-2 py-0.5 rounded-md bg-blue-600/90 text-white text-[9px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm">
          {language === "am" ? "🧑‍🏫 የመምህሩ መምሪያ" : "🧑‍🏫 Teacher Guide"}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md bg-emerald-600/90 text-white text-[9px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm">
        {language === "am" ? "📘 የተማሪ መጽሐፍ" : "📘 MoE Textbook"}
      </span>
    );
  };

  return (
    <div id="library-management" className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-3 border border-white/20">
            <span className="text-amber-300">🇪🇹</span>
            <span>
              {language === "am"
                ? "አዲሱ የኢትዮጵያ ሥርዓተ-ትምህርት የመማሪያ እና ረዳት መጻሕፍት (Grades 5 - 12)"
                : "New Ethiopian Curriculum Textbooks, Supplementary Guides & Exam Prep (Grades 5 - 12)"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {language === "am"
              ? "የመማሪያ እና የረዳት መጻሕፍት ዲጂታል ማዕከል"
              : "National Textbook, Supplementary Guides & Exam Repository"}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-2 leading-relaxed">
            {language === "am"
              ? "ከ 5ኛ እስከ 12ኛ ክፍል ያሉትን ሁሉንም የትምህርት ሚኒስቴር የተማሪ መማሪያ መጻሕፍት፣ የታወቁትን የኤክስትሪም እና ማስተር (Extreme & Master Series) ረዳት መጻሕፍት፣ የደረጃ በደረጃ ምሳሌዎች፣ የክልል እና ብሔራዊ የፈተና ጥያቄዎች ባንክ በነፃ ያንብቡ።"
              : "Access the full spectrum of authorized Ethiopian curriculum textbooks alongside premier Extreme Series & Master Series supplementary study guides, step-by-step problem solvers, and national university entrance exam (UEE) question banks."}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 font-bold">
              📚 {libraryBooks.length} {language === "am" ? "የተመዘገቡ መጻሕፍት" : "Total Books"}
            </span>
            <span className="px-3 py-1 rounded-xl bg-amber-400/20 text-amber-200 border border-amber-300/30 font-bold">
              📙 {libraryBooks.filter((b) => b.bookType === "supplementary" || b.bookType === "exam_prep").length}{" "}
              {language === "am" ? "ረዳት እና የፈተና መጻሕፍት" : "Supplementary & Exam Guides"}
            </span>
            <span className="px-3 py-1 rounded-xl bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 font-bold">
              ⚡ {language === "am" ? "ነፃ ኦንላይን ንባብ እና ፒዲኤፍ" : "Free e-Reader & Offline PDF"}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Filtering Controls */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        {/* Top search & Curriculum Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                language === "am"
                  ? "በመጽሐፍ ርዕስ፣ ረዳት መጽሐፍ (Extreme/Master)፣ ክፍል (5-12) ወይም ፀሐፊ ፈልግ..."
                  : "Search by title, series (Extreme, Master), grade (5-12), or author..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyCurriculum(!onlyCurriculum)}
              className={`px-3 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                onlyCurriculum
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              <span>🇪🇹</span>
              <span>
                {language === "am"
                  ? "አዲሱ የኢትዮጵያ ካሪኩለም ብቻ"
                  : "New Ethiopian Curriculum Only"}
              </span>
            </button>
          </div>
        </div>

        {/* Book Type Filter Tabs (Textbook vs Supplementary vs Exam Prep) */}
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
            {language === "am" ? "የመጽሐፍ አይነት (Book Category):" : "Filter by Book Type:"}
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {bookTypeOptions.map((bt) => (
              <button
                key={bt.value}
                onClick={() => setSelectedBookType(bt.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedBookType === bt.value
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {bt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grade Level Selector Tabs (Grade 5 to Grade 12) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              {language === "am" ? "የክፍል ደረጃ ይምረጡ (Grades 5 - 12)" : "Filter by Grade Level"}
            </span>
            <span className="text-xs text-slate-400">
              {filteredBooks.length} {language === "am" ? "መጻሕፍት ተገኝተዋል" : "books found"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {gradeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedGrade(opt.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedGrade === opt.value
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Stream & Subject Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {(selectedGrade === "Grade 11" || selectedGrade === "Grade 12" || selectedGrade === "All") && (
            <div className="flex items-center gap-1 mr-3">
              <span className="text-[11px] font-bold text-slate-400 mr-1">
                {language === "am" ? "የትምህርት ዘርፍ፡" : "Stream:"}
              </span>
              {["All", "Natural Science", "Social Science"].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStream(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                    selectedStream === st
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  {st === "All"
                    ? language === "am"
                      ? "ሁሉም"
                      : "All"
                    : st === "Natural Science"
                    ? language === "am"
                      ? "የተፈጥሮ ሳይንስ"
                      : "Natural Sci"
                    : language === "am"
                    ? "ማህበራዊ ሳይንስ"
                    : "Social Sci"}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1 overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-400 mr-1">
              {language === "am" ? "የትምህርት አይነት፡" : "Subject:"}
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Cover Banner */}
              <div className="relative h-48 rounded-2xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Badges on Cover */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                  {book.grade && (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-extrabold shadow-sm">
                      {book.grade}
                    </span>
                  )}
                  {getBookTypeBadge(book)}
                  {book.stream && book.stream !== "General" && (
                    <span
                      className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wide backdrop-blur-md text-white ${
                        book.stream === "Natural Science" ? "bg-emerald-600/90" : "bg-indigo-600/90"
                      }`}
                    >
                      {book.stream === "Natural Science"
                        ? language === "am"
                          ? "የተፈጥሮ ሳይንስ"
                          : "Natural Sci"
                        : language === "am"
                        ? "ማህበራዊ ሳይንስ"
                        : "Social Sci"}
                    </span>
                  )}
                </div>

                <div className="absolute top-2.5 right-2.5">
                  <span className="px-2 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-[10px] font-extrabold text-white flex items-center gap-1 shadow-sm">
                    <span>🇪🇹</span>
                    <span>{language === "am" ? "አዲሱ ካሪኩለም" : "Curriculum"}</span>
                  </span>
                </div>

                {book.units && book.units.length > 0 && (
                  <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1">
                    <Layers className="w-3 h-3 text-amber-400" />
                    <span>
                      {book.units.length} {language === "am" ? "ምዕራፎች" : "Units"}
                    </span>
                    {book.pages && <span>• {book.pages} pgs</span>}
                  </span>
                )}
              </div>

              {/* Title & Info */}
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2">
                  {language === "am" ? book.titleAm || book.title : book.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {book.publisher ? `${book.publisher} • ` : ""}
                  {book.author}
                </p>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                  <span>ISBN: {book.isbn}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px]">
                    {book.category}
                  </span>
                </div>
              </div>

              {/* Units / Highlights Preview snippet */}
              {book.units && book.units.length > 0 && (
                <div className="mt-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {book.bookType === "supplementary" || book.bookType === "exam_prep"
                      ? language === "am"
                        ? "ዋና ዋና የተብራሩ ምዕራፎች (Solved Units):"
                        : "Key Solved Units & Guides:"
                      : language === "am"
                      ? "የይዘት ምዕራፎች (Syllabus Units):"
                      : "Curriculum Units:"}
                  </span>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1">
                    •{" "}
                    {language === "am"
                      ? book.units[0].titleAm || book.units[0].title
                      : book.units[0].title}
                  </div>
                  {book.units[1] && (
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1">
                      •{" "}
                      {language === "am"
                        ? book.units[1].titleAm || book.units[1].title
                        : book.units[1].title}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">
                  {language === "am" ? "የታተሙ ቅጂዎች" : "Physical Copies"}
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {book.availableCopies} / {book.totalCopies} {language === "am" ? "ነፃ" : "Available"}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setActiveReadingBook(book);
                    setActiveUnitIndex(0);
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm ${
                    book.bookType === "supplementary"
                      ? "bg-amber-600 hover:bg-amber-700"
                      : book.bookType === "exam_prep"
                      ? "bg-rose-600 hover:bg-rose-700"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>
                    {book.bookType === "supplementary"
                      ? language === "am"
                        ? "ረዳት መጽሐፉን አንብብ"
                        : "Read Study Guide"
                      : book.bookType === "exam_prep"
                      ? language === "am"
                        ? "ፈተናዎችን ተለማመድ"
                        : "Practice Exam"
                      : language === "am"
                      ? "መጽሐፉን አንብብ"
                      : "Read e-Book"}
                  </span>
                </button>

                <button
                  onClick={() => handleDownloadOffline(book)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  title={language === "am" ? "PDF አውርድ" : "Download PDF"}
                >
                  <Download className="w-4 h-4 text-emerald-600" />
                </button>

                <button
                  onClick={() => handleBorrow(book)}
                  disabled={book.availableCopies === 0}
                  className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold disabled:opacity-40 transition-colors"
                  title={language === "am" ? "የታተመ ቅጂ ተበደር" : "Borrow Physical Copy"}
                >
                  {language === "am" ? "ተበደር" : "Borrow"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            {language === "am" ? "ምንም መጽሐፍ አልተገኘም" : "No textbooks or study guides match your criteria"}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {language === "am"
              ? "እባክዎ የፍለጋ ቃሉን፣ የመጽሐፍ አይነቱን ወይም የክፍል ደረጃ ማጣሪያውን ይቀይሩ።"
              : "Try clearing filters or selecting a different category or grade level."}
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedGrade("All");
              setSelectedCategory("All");
              setSelectedStream("All");
              setSelectedBookType("All");
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
          >
            {language === "am" ? "ማጣሪያዎችን አጽዳ" : "Clear All Filters"}
          </button>
        </div>
      )}

      {/* Interactive e-Reader Modal with Units, Problem Walkthrough & AI Tutor */}
      {activeReadingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-2xl text-white ${
                    activeReadingBook.bookType === "supplementary"
                      ? "bg-amber-600"
                      : activeReadingBook.bookType === "exam_prep"
                      ? "bg-rose-600"
                      : "bg-emerald-600"
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      {activeReadingBook.grade || "Ethiopian Curriculum"}
                    </span>
                    {getBookTypeBadge(activeReadingBook)}
                    <span className="text-[10px] font-mono text-slate-400">
                      ISBN: {activeReadingBook.isbn}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-1">
                    {language === "am"
                      ? activeReadingBook.titleAm || activeReadingBook.title
                      : activeReadingBook.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveTab("ai-tutor");
                  }}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === "am" ? "የ AI መምህሩን ጠይቅ" : "Ask AI Tutor"}</span>
                </button>

                <button
                  onClick={() => setActiveReadingBook(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Two columns if units present */}
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
              {/* Unit Table of Contents Sidebar */}
              {activeReadingBook.units && activeReadingBook.units.length > 0 && (
                <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-3 sm:p-4 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
                    {language === "am" ? "የመጽሐፉ ምዕራፎች (Units):" : "Table of Contents:"}
                  </span>
                  <div className="space-y-1.5">
                    {activeReadingBook.units.map((unit, idx) => (
                      <button
                        key={unit.unitNumber}
                        onClick={() => setActiveUnitIndex(idx)}
                        className={`w-full text-left p-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                          activeUnitIndex === idx
                            ? activeReadingBook.bookType === "supplementary"
                              ? "bg-amber-600 text-white shadow-sm"
                              : activeReadingBook.bookType === "exam_prep"
                              ? "bg-rose-600 text-white shadow-sm"
                              : "bg-emerald-600 text-white shadow-sm"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                        }`}
                      >
                        <div className="truncate mr-2">
                          <span className="text-[10px] opacity-80 block">
                            Unit {unit.unitNumber}
                          </span>
                          <span className="truncate">
                            {language === "am" ? unit.titleAm || unit.title : unit.title}
                          </span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Unit Content & Reading View */}
              <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeReadingBook.units && activeReadingBook.units[activeUnitIndex] ? (
                  (() => {
                    const currentUnit = activeReadingBook.units[activeUnitIndex];
                    return (
                      <div className="space-y-5">
                        <div
                          className={`p-4 rounded-2xl border ${
                            activeReadingBook.bookType === "supplementary"
                              ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40"
                              : activeReadingBook.bookType === "exam_prep"
                              ? "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/40"
                              : "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40"
                          }`}
                        >
                          <span
                            className={`text-[10px] font-extrabold uppercase tracking-wider block ${
                              activeReadingBook.bookType === "supplementary"
                                ? "text-amber-800 dark:text-amber-300"
                                : activeReadingBook.bookType === "exam_prep"
                                ? "text-rose-800 dark:text-rose-300"
                                : "text-emerald-800 dark:text-emerald-300"
                            }`}
                          >
                            Unit {currentUnit.unitNumber} •{" "}
                            {activeReadingBook.bookType === "supplementary"
                              ? "Extreme & Master Series Solved Unit"
                              : activeReadingBook.bookType === "exam_prep"
                              ? "National Exam Solved Bank"
                              : "MoE Official Syllabus"}
                          </span>
                          <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                            {language === "am"
                              ? currentUnit.titleAm || currentUnit.title
                              : currentUnit.title}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5">
                            {language === "am"
                              ? currentUnit.summaryAm || currentUnit.summary
                              : currentUnit.summary}
                          </p>
                        </div>

                        {/* Key Competencies & Syllabus Concepts */}
                        <div>
                          <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-2">
                            {activeReadingBook.bookType === "supplementary" ||
                            activeReadingBook.bookType === "exam_prep"
                              ? language === "am"
                                ? "ዋና ዋና የተሰሩ ምሳሌዎች እና የቀመር ስልቶች (Solved Key Concepts):"
                                : "Key Solved Problem Types & Exam Techniques:"
                              : language === "am"
                              ? "ዋና ዋና የትምህርት ፅንሰ-ሀሳቦች (Core Competencies):"
                              : "Core Learning Competencies & Concepts:"}
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {currentUnit.keyTopics.map((topic, tidx) => (
                              <span
                                key={tidx}
                                className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700"
                              >
                                ✓ {topic}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Sample Curriculum Reading Text */}
                        <div className="space-y-3 pt-2">
                          <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                            {activeReadingBook.bookType === "supplementary" ||
                            activeReadingBook.bookType === "exam_prep"
                              ? language === "am"
                                ? "የረዳት መጽሐፉ ዝርዝር አሰራር እና ምክሮች (Worked Solutions & Exam Notes):"
                                : "Supplementary Breakdown & Model Solution Key:"
                              : language === "am"
                              ? "የትምህርት መግቢያ እና ይዘት (Introduction & Explanatory Text):"
                              : "Curriculum Lecture Notes & Problem Formulations:"}
                          </h5>
                          <p className="leading-relaxed">
                            {language === "am"
                              ? `በዚህ ምዕራፍ ተማሪዎች ስለ ${currentUnit.titleAm || currentUnit.title} መሰረታዊ ህጎች፣ የቀመር አሰራሮች እና ተግባራዊ ምሳሌዎችን ይማራሉ። የኢትዮጵያ ትምህርት ሚኒስቴር ባወጣው አዲሱ ካሪኩለም መሰረት ተማሪዎች በንድፈ-ሀሳብ ብቻ ሳይሆን በተግባራዊ ሙከራዎች እና የቡድን ውይይቶች ይዘቱን ይረዳሉ።`
                              : `In this unit, students master the foundational laws, analytical frameworks, and empirical derivations of ${currentUnit.title}. Developed under the Federal Democratic Republic of Ethiopia Ministry of Education modern roadmap, the curriculum emphasizes inquiry-based exploration and practical applications.`}
                          </p>
                          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 font-mono text-xs text-slate-700 dark:text-slate-300 space-y-1">
                            <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                              // {activeReadingBook.bookType === "supplementary"
                                ? "Extreme Supplementary Study Note:"
                                : activeReadingBook.bookType === "exam_prep"
                                ? "National Examination Bank Solution Note:"
                                : "Official Curriculum Note:"}
                            </div>
                            <div>Unit: {currentUnit.unitNumber} | Grade: {activeReadingBook.grade}</div>
                            <div>Focus Topics: {currentUnit.keyTopics.join(" • ")}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="space-y-4">
                    <p>
                      Official Student Textbook / Supplementary Reference Guide sanctioned for academic instruction across secondary and middle schools.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/50">
              <div className="text-xs text-slate-500">
                {activeReadingBook.publisher
                  ? activeReadingBook.publisher
                  : language === "am"
                  ? "የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር ህጋዊ የትምህርት መጽሐፍ"
                  : "Authorized Federal Ministry of Education Educational Resource"}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadOffline(activeReadingBook)}
                  className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{language === "am" ? "PDF አውርድ" : "Download PDF"}</span>
                </button>
                <button
                  onClick={() => setActiveReadingBook(null)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                >
                  {t.common.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
