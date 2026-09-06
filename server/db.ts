export interface DbUser {
  id: string;
  name: string;
  nameAm: string;
  email: string;
  passwordHash: string;
  role: "admin" | "teacher" | "student" | "parent";
  avatar: string;
  phone?: string;
  grade?: string;
  section?: string;
  childrenIds?: string[];
  createdAt: string;
}

// In-memory persistent user collection with default seed accounts for NUR School
export const usersDatabase: DbUser[] = [
  {
    id: "usr-admin-01",
    name: "Dr. Kassahun Bekele",
    nameAm: "ዶ/ር ካሳሁን በቀለ",
    email: "admin@nurschool.et",
    passwordHash: "password123", // In a real production DB, this would be bcrypt hashed
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    phone: "+251 911 234 567",
    createdAt: "2024-01-01T08:00:00.000Z",
  },
  {
    id: "usr-teacher-01",
    name: "Tigist Haile",
    nameAm: "ትዕግስት ኃይሌ",
    email: "teacher@nurschool.et",
    passwordHash: "password123",
    role: "teacher",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    phone: "+251 912 345 678",
    createdAt: "2024-01-01T08:00:00.000Z",
  },
  {
    id: "usr-student-01",
    name: "Abebe Tadesse",
    nameAm: "አበበ ታደሰ",
    email: "student@nurschool.et",
    passwordHash: "password123",
    role: "student",
    grade: "Grade 10",
    section: "A",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
    phone: "+251 913 456 789",
    createdAt: "2024-01-01T08:00:00.000Z",
  },
  {
    id: "usr-parent-01",
    name: "Ato Dawit Mengistu",
    nameAm: "አቶ ዳዊት መንግስቱ",
    email: "parent@nurschool.et",
    passwordHash: "password123",
    role: "parent",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    phone: "+251 914 567 890",
    childrenIds: ["std-001", "std-002"],
    createdAt: "2024-01-01T08:00:00.000Z",
  },
];

export function findUserByEmail(email: string): DbUser | undefined {
  return usersDatabase.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
}

export function findUserById(id: string): DbUser | undefined {
  return usersDatabase.find((u) => u.id === id);
}

export function createUser(data: Omit<DbUser, "id" | "createdAt">): DbUser {
  const newUser: DbUser = {
    ...data,
    id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  usersDatabase.push(newUser);
  return newUser;
}

export function getAllUsers(): Omit<DbUser, "passwordHash">[] {
  return usersDatabase.map(({ passwordHash, ...userWithoutPassword }) => userWithoutPassword);
}
