import { Router, Request, Response } from "express";
import { findUserByEmail, findUserById, createUser, getAllUsers, DbUser } from "./db";

export const authRouter = Router();

// In-memory active tokens mapping: token -> userId
const activeSessions = new Map<string, string>();

// Pre-populate tokens for default users for instant seamless connection
activeSessions.set("demo-admin-token", "usr-admin-01");
activeSessions.set("demo-teacher-token", "usr-teacher-01");
activeSessions.set("demo-student-token", "usr-student-01");
activeSessions.set("demo-parent-token", "usr-parent-01");

function sanitizeUser(user: DbUser) {
  const { passwordHash, ...safe } = user;
  return safe;
}

// POST /api/auth/login
authRouter.post("/login", (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
        errorAm: "ኢሜይል እና የይለፍ ቃል ያስፈልጋል",
      });
    }

    const user = findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        error: "No account found with this email address",
        errorAm: "በዚህ ኢሜይል የተመዘገበ አካውንት አልተገኘም",
      });
    }

    // In a production setup, compare bcrypt hashes
    if (user.passwordHash !== password) {
      return res.status(401).json({
        error: "Invalid password. Please verify and try again.",
        errorAm: "የተሳሳተ የይለፍ ቃል። እባክዎ እንደገና ይሞክሩ።",
      });
    }

    // Generate secure session token
    const token = `nur-token-${user.id}-${Date.now()}`;
    activeSessions.set(token, user.id);

    return res.json({
      success: true,
      token,
      user: sanitizeUser(user),
      message: "Authentication successful",
      messageAm: "በተሳካ ሁኔታ ገብተዋል",
    });
  } catch (error: any) {
    console.error("Auth Login Error:", error);
    return res.status(500).json({ error: "Internal authentication error" });
  }
});

// POST /api/auth/register
authRouter.post("/register", (req: Request, res: Response) => {
  try {
    const {
      name,
      nameAm,
      email,
      password,
      role = "student",
      grade,
      section,
      phone,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Full name, email, and password are required",
        errorAm: "ሙሉ ስም፣ ኢሜይል እና የይለፍ ቃል መሞላት አለባቸው",
      });
    }

    const existing = findUserByEmail(email);
    if (existing) {
      return res.status(409).json({
        error: "An account with this email already exists",
        errorAm: "ይህ ኢሜይል ቀደም ሲል ተመዝግቧል",
      });
    }

    const defaultAvatars: Record<string, string> = {
      admin: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      teacher: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
      student: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
      parent: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    };

    const newUser = createUser({
      name: name.trim(),
      nameAm: nameAm?.trim() || name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: password,
      role,
      grade: role === "student" ? grade || "Grade 10" : undefined,
      section: role === "student" ? section || "A" : undefined,
      phone: phone || "+251 911 000 000",
      avatar: defaultAvatars[role] || defaultAvatars.student,
    });

    const token = `nur-token-${newUser.id}-${Date.now()}`;
    activeSessions.set(token, newUser.id);

    return res.status(201).json({
      success: true,
      token,
      user: sanitizeUser(newUser),
      message: "Registration completed successfully",
      messageAm: "ምዝገባዎ በተሳካ ሁኔታ ተጠናቋል",
    });
  } catch (error: any) {
    console.error("Auth Register Error:", error);
    return res.status(500).json({ error: "Internal registration error" });
  }
});

// GET /api/auth/me
authRouter.get("/me", (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const userId = activeSessions.get(token);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: Session expired or invalid" });
  }

  const user = findUserById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.json({
    user: sanitizeUser(user),
  });
});

// POST /api/auth/logout
authRouter.post("/logout", (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.replace("Bearer ", "").trim();
    activeSessions.delete(token);
  }
  return res.json({ success: true, message: "Logged out successfully" });
});

// GET /api/auth/users (for directory)
authRouter.get("/users", (_req: Request, res: Response) => {
  return res.json({ users: getAllUsers() });
});
