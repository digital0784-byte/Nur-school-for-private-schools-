import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserRole,
  Language,
  ThemeMode,
  UserProfile,
  Student,
  Staff,
  FeeItem,
  BusRoute,
  LibraryBook,
  Assignment,
  Exam,
  Lesson,
  NotificationItem,
  Announcement,
} from "../types";
import {
  initialUsers,
  initialStudents,
  initialStaff,
  initialFees,
  initialBuses,
  initialBooks,
  initialAssignments,
  initialExams,
  initialLessons,
  initialAnnouncements,
  initialNotifications,
} from "../data/mockData";
import { translations } from "../i18n/translations";

interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "error";
}

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentUser: UserProfile;
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  t: typeof translations["en"];

  // Entity states
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  staffList: Staff[];
  setStaffList: React.Dispatch<React.SetStateAction<Staff[]>>;
  fees: FeeItem[];
  payFee: (feeId: string, method: "Telebirr" | "CBE Birr" | "Chapa" | "Bank Transfer" | "Cash", paidAmount: number) => FeeItem | null;
  busRoutes: BusRoute[];
  simulateBusStep: () => void;
  libraryBooks: LibraryBook[];
  borrowBook: (bookId: string, studentName: string) => void;
  returnBook: (bookId: string, studentId: string) => void;
  assignments: Assignment[];
  createAssignment: (assignment: Omit<Assignment, "id" | "submissionsCount">) => void;
  gradeSubmission: (assignmentId: string, studentId: string, grade: number, feedback: string) => void;
  exams: Exam[];
  createExam: (exam: Omit<Exam, "id">) => Exam;
  lessons: Lesson[];
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, "id" | "date">) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadNotificationsCount: number;

  // Modals & UI helpers
  activeReceipt: FeeItem | null;
  setActiveReceipt: (fee: FeeItem | null) => void;
  selectedChildId: string;
  setSelectedChildId: (id: string) => void;
  toasts: Toast[];
  showToast: (message: string, type?: "success" | "info" | "error") => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;

  // Modern Layout & Ergonomics
  layoutStyle: "sidebar" | "topbar" | "mini";
  setLayoutStyle: (style: "sidebar" | "topbar" | "mini") => void;
  contentWidth: "contained" | "full";
  setContentWidth: (width: "contained" | "full") => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRoleState] = useState<UserRole>("admin");
  const [language, setLanguage] = useState<Language>("am");
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [staffList, setStaffList] = useState<Staff[]>(initialStaff);
  const [fees, setFees] = useState<FeeItem[]>(initialFees);
  const [busRoutes, setBusRoutes] = useState<BusRoute[]>(initialBuses);
  const [libraryBooks, setLibraryBooks] = useState<LibraryBook[]>(initialBooks);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [lessons] = useState<Lesson[]>(initialLessons);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const [activeReceipt, setActiveReceipt] = useState<FeeItem | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<string>("std-001");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState<boolean>(false);
  const [layoutStyle, setLayoutStyle] = useState<"sidebar" | "topbar" | "mini">("sidebar");
  const [contentWidth, setContentWidth] = useState<"contained" | "full">("contained");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Sync role to default active tabs
  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    if (role === "admin") setActiveTab("dashboard");
    else if (role === "teacher") setActiveTab("classes");
    else if (role === "student") setActiveTab("learning-hub");
    else if (role === "parent") setActiveTab("parent-child");
    showToast(
      language === "am"
        ? `ወደ ${translations.am.roles[role]} ተቀይሯል`
        : `Switched to ${translations.en.roles[role]} view`,
      "info"
    );
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "am" : "en"));
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  };

  // Toast utility
  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    const id = "toast-" + Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Pay fee and generate receipt
  const payFee = (
    feeId: string,
    method: "Telebirr" | "CBE Birr" | "Chapa" | "Bank Transfer" | "Cash",
    paidAmount: number
  ): FeeItem | null => {
    let updatedItem: FeeItem | null = null;
    setFees((prev) =>
      prev.map((item) => {
        if (item.id === feeId) {
          const newPaid = item.paidAmount + paidAmount;
          const status = newPaid >= item.amount ? "Paid" : "Partial";
          const receiptNumber = `REC-${method.substring(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
          updatedItem = {
            ...item,
            paidAmount: newPaid,
            status,
            paymentMethod: method,
            paidDate: new Date().toISOString().split("T")[0],
            receiptNumber,
          };
          return updatedItem;
        }
        return item;
      })
    );

    if (updatedItem) {
      // Update student feeStatus if needed
      setStudents((prev) =>
        prev.map((s) => {
          if (s.id === updatedItem?.studentId) {
            return { ...s, feeStatus: updatedItem.status };
          }
          return s;
        })
      );
      showToast(
        language === "am"
          ? `ክፍያ ተሳክቷል! ደረሰኝ ቁጥር፡ ${updatedItem.receiptNumber}`
          : `Payment successful! Receipt: ${updatedItem.receiptNumber}`,
        "success"
      );
    }
    return updatedItem;
  };

  // Simulate bus movement
  const simulateBusStep = () => {
    setBusRoutes((prev) =>
      prev.map((bus) => {
        const speedDelta = Math.floor(Math.random() * 10) - 5;
        const newSpeed = Math.max(20, Math.min(60, bus.currentLocation.speed + speedDelta));
        const nextIdx = Math.floor(Math.random() * bus.stops.length);
        return {
          ...bus,
          currentLocation: {
            ...bus.currentLocation,
            speed: newSpeed,
            nextStop: bus.stops[nextIdx],
            lat: bus.currentLocation.lat + (Math.random() - 0.5) * 0.002,
            lng: bus.currentLocation.lng + (Math.random() - 0.5) * 0.002,
          },
        };
      })
    );
    showToast(
      language === "am" ? "የትራንስፖርት ጂፒኤስ መረጃዎች ታድሰዋል" : "Bus GPS coordinates and telemetry refreshed",
      "info"
    );
  };

  // Library actions
  const borrowBook = (bookId: string, studentName: string) => {
    setLibraryBooks((prev) =>
      prev.map((book) => {
        if (book.id === bookId && book.availableCopies > 0) {
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + 14);
          const newBorrowRecord = {
            studentId: "std-" + Date.now(),
            studentName,
            borrowDate: new Date().toISOString().split("T")[0],
            dueDate: dueDate.toISOString().split("T")[0],
          };
          return {
            ...book,
            availableCopies: book.availableCopies - 1,
            borrowedBy: [...(book.borrowedBy || []), newBorrowRecord],
          };
        }
        return book;
      })
    );
    showToast(
      language === "am" ? "መጽሐፉ በተሳካ ሁኔታ ተውሷል" : "Book successfully checked out",
      "success"
    );
  };

  const returnBook = (bookId: string, studentId: string) => {
    setLibraryBooks((prev) =>
      prev.map((book) => {
        if (book.id === bookId) {
          return {
            ...book,
            availableCopies: Math.min(book.totalCopies, book.availableCopies + 1),
            borrowedBy: (book.borrowedBy || []).filter((b) => b.studentId !== studentId),
          };
        }
        return book;
      })
    );
    showToast(
      language === "am" ? "መጽሐፉ ወደ ቤተ-መጻሕፍት ተመልሷል" : "Book returned to library shelf",
      "info"
    );
  };

  // Teacher assignment actions
  const createAssignment = (assignmentData: Omit<Assignment, "id" | "submissionsCount">) => {
    const newAsg: Assignment = {
      ...assignmentData,
      id: "asg-" + Date.now(),
      submissionsCount: 0,
      submissions: [],
    };
    setAssignments((prev) => [newAsg, ...prev]);
    showToast(
      language === "am" ? "አዲስ የቤት ስራ ለተማሪዎች ተልኳል" : "New homework assignment published to students",
      "success"
    );
  };

  const gradeSubmission = (assignmentId: string, studentId: string, grade: number, feedback: string) => {
    setAssignments((prev) =>
      prev.map((asg) => {
        if (asg.id === assignmentId) {
          const subs = (asg.submissions || []).map((sub) => {
            if (sub.studentId === studentId) {
              return { ...sub, grade, feedback, status: "Graded" as const };
            }
            return sub;
          });
          return { ...asg, submissions: subs };
        }
        return asg;
      })
    );
    showToast(
      language === "am" ? "የተማሪው ውጤት እና አስተያየት ተመዝግቧል" : "Grade and student feedback saved",
      "success"
    );
  };

  // Exams
  const createExam = (examData: Omit<Exam, "id">): Exam => {
    const newExam: Exam = {
      ...examData,
      id: "exam-" + Date.now(),
    };
    setExams((prev) => [newExam, ...prev]);
    showToast(
      language === "am" ? "አዲሱ ፈተና በተሳካ ሁኔታ ተዘጋጅቷል" : "Exam successfully created and published",
      "success"
    );
    return newExam;
  };

  // Announcements
  const addAnnouncement = (annData: Omit<Announcement, "id" | "date">) => {
    const newAnn: Announcement = {
      ...annData,
      id: "ann-" + Date.now(),
      date: new Date().toISOString().split("T")[0],
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    showToast(
      language === "am" ? "ማስታወቂያው ለትምህርት ቤቱ ተለጥፏል" : "Announcement published to school bulletin",
      "success"
    );
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast(language === "am" ? "ሁሉም ማሳወቂያዎች ተነበዋል" : "All notifications marked as read", "info");
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const currentUser = initialUsers[userRole] || initialUsers.admin;
  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        currentUser,
        language,
        setLanguage,
        toggleLanguage,
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        t,
        students,
        setStudents,
        staffList,
        setStaffList,
        fees,
        payFee,
        busRoutes,
        simulateBusStep,
        libraryBooks,
        borrowBook,
        returnBook,
        assignments,
        createAssignment,
        gradeSubmission,
        exams,
        createExam,
        lessons,
        announcements,
        addAnnouncement,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        unreadNotificationsCount,
        activeReceipt,
        setActiveReceipt,
        selectedChildId,
        setSelectedChildId,
        toasts,
        showToast,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        layoutStyle,
        setLayoutStyle,
        contentWidth,
        setContentWidth,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
