export type UserRole = "admin" | "teacher" | "student" | "parent";

export type Language = "en" | "am";

export type ThemeMode = "light" | "dark";

export interface UserProfile {
  id: string;
  name: string;
  nameAm: string;
  role: UserRole;
  email: string;
  avatar: string;
  grade?: string;
  section?: string;
  childrenIds?: string[];
}

export interface Student {
  id: string;
  idNumber: string;
  fullName: string;
  fullNameAm: string;
  grade: string;
  section: string;
  gender: "Male" | "Female";
  dateOfBirth: string;
  parentName: string;
  parentPhone: string;
  status: "Active" | "Transferred" | "Graduated" | "Suspended";
  attendanceRate: number;
  gpa: number;
  feeStatus: "Paid" | "Partial" | "Pending";
  busRoute?: string;
  avatar: string;
}

export interface Staff {
  id: string;
  staffId: string;
  fullName: string;
  fullNameAm: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  assignedClasses: string[];
  qualification: string;
  status: "Active" | "On Leave";
  avatar: string;
}

export interface FeeItem {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  feeType: "Tuition" | "Transport" | "Lab & STEM" | "Registration" | "Uniform";
  amount: number; // in ETB
  paidAmount: number;
  dueDate: string;
  status: "Paid" | "Partial" | "Pending";
  invoiceNumber: string;
  paymentMethod?: "Telebirr" | "CBE Birr" | "Chapa" | "Bank Transfer" | "Cash";
  paidDate?: string;
  receiptNumber?: string;
}

export interface TimetableSlot {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  period: number;
  time: string;
  grade: string;
  section: string;
  subject: string;
  subjectAm: string;
  teacherName: string;
  room: string;
  color: string;
}

export interface BusRoute {
  id: string;
  routeNumber: string;
  routeName: string;
  routeNameAm: string;
  driverName: string;
  driverPhone: string;
  plateNumber: string;
  capacity: number;
  assignedStudentsCount: number;
  stops: string[];
  currentLocation: {
    lat: number;
    lng: number;
    speed: number;
    status: "On Route" | "At School" | "Completed" | "Delayed";
    nextStop: string;
  };
}

export interface TextbookUnit {
  unitNumber: number;
  title: string;
  titleAm: string;
  summary: string;
  summaryAm: string;
  keyTopics: string[];
}

export interface LibraryBook {
  id: string;
  isbn: string;
  title: string;
  titleAm: string;
  author: string;
  category: "Science" | "Mathematics" | "Literature" | "History" | "Language" | "Technology" | "Social Studies" | "General";
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
  isDigital: boolean;
  coverImage?: string;
  pdfUrl?: string;
  grade?: string;
  gradeNumber?: number;
  curriculum?: string;
  stream?: "General" | "Natural Science" | "Social Science";
  bookType?: "textbook" | "supplementary" | "teacher_guide" | "exam_prep";
  bookTypeAm?: string;
  publisher?: string;
  edition?: string;
  pages?: number;
  units?: TextbookUnit[];
  borrowedBy?: Array<{
    studentId: string;
    studentName: string;
    borrowDate: string;
    dueDate: string;
  }>;
}

export interface Assignment {
  id: string;
  title: string;
  titleAm: string;
  subject: string;
  grade: string;
  section: string;
  teacherName: string;
  description: string;
  dueDate: string;
  totalPoints: number;
  status: "Open" | "Closed";
  submissionsCount: number;
  totalStudents: number;
  submissions?: Array<{
    studentId: string;
    studentName: string;
    submittedAt: string;
    fileUrl?: string;
    grade?: number;
    feedback?: string;
    status: "Graded" | "Pending Review";
  }>;
}

export interface ExamQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  points: number;
}

export interface Exam {
  id: string;
  title: string;
  titleAm: string;
  subject: string;
  grade: string;
  durationMinutes: number;
  totalMarks: number;
  questions: ExamQuestion[];
  instructions: string;
  startDate: string;
  endDate: string;
  isPublished: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  titleAm: string;
  subject: string;
  grade: string;
  topic: string;
  duration: string;
  videoUrl: string;
  summary: string;
  keyPoints: string[];
  transcript: string;
  transcriptAm: string;
  pdfNotesUrl?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  titleAm: string;
  message: string;
  messageAm: string;
  category: "alert" | "exam" | "fee" | "announcement" | "academic";
  timestamp: string;
  read: boolean;
  priority: "low" | "medium" | "high";
  linkTab?: string;
}

export interface Announcement {
  id: string;
  title: string;
  titleAm: string;
  content: string;
  contentAm: string;
  date: string;
  author: string;
  category: "General" | "Academic" | "Event" | "Urgent";
  pinned: boolean;
}

export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  date: string;
  status: "Present" | "Absent" | "Late" | "Excused";
  remarks?: string;
}

export interface QuizQuestion {
  id?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
