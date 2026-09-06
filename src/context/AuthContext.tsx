import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, UserRole } from "../types";
import { initialUsers } from "../data/mockData";

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    nameAm?: string;
    email: string;
    password: string;
    role: UserRole;
    grade?: string;
    section?: string;
    phone?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loginAsDemo: (role: UserRole) => void;
  isAuthModalOpen: boolean;
  authModalMode: "login" | "register";
  openLoginModal: () => void;
  openRegisterModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const savedUser = localStorage.getItem("nur_auth_user");
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (e) {
      console.error("Failed to load saved user", e);
    }
    // Default to admin for instant preview if no session exists, or null
    return initialUsers.admin;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("nur_auth_token") || "demo-admin-token";
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");

  // Synchronize token and user to localStorage
  useEffect(() => {
    if (user && token) {
      localStorage.setItem("nur_auth_user", JSON.stringify(user));
      localStorage.setItem("nur_auth_token", token);
    } else {
      localStorage.removeItem("nur_auth_user");
      localStorage.removeItem("nur_auth_token");
    }
  }, [user, token]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        setToken(data.token);
        setIsAuthModalOpen(false);
        setIsLoading(false);
        return { success: true };
      } else {
        // Check if demo fallback credentials match
        const lowerEmail = email.toLowerCase().trim();
        let fallbackRole: UserRole | null = null;
        if (lowerEmail.includes("admin")) fallbackRole = "admin";
        else if (lowerEmail.includes("teacher")) fallbackRole = "teacher";
        else if (lowerEmail.includes("student")) fallbackRole = "student";
        else if (lowerEmail.includes("parent")) fallbackRole = "parent";

        if (fallbackRole && (password === "password123" || password === "123456" || password === "admin123")) {
          const fallbackUser = initialUsers[fallbackRole];
          setUser(fallbackUser);
          setToken(`demo-${fallbackRole}-token`);
          setIsAuthModalOpen(false);
          setIsLoading(false);
          return { success: true };
        }

        setIsLoading(false);
        return { success: false, error: data.errorAm || data.error || "Authentication failed" };
      }
    } catch (err: any) {
      console.warn("API login failed, falling back to local verification:", err);
      // Local fallback for offline mode
      const lowerEmail = email.toLowerCase().trim();
      const matchedRole = (Object.keys(initialUsers) as UserRole[]).find(
        (r) => initialUsers[r].email.toLowerCase() === lowerEmail || lowerEmail.includes(r)
      );

      if (matchedRole) {
        setUser(initialUsers[matchedRole]);
        setToken(`demo-${matchedRole}-token`);
        setIsAuthModalOpen(false);
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, error: "Network error or invalid credentials" };
    }
  };

  const register = async (data: {
    name: string;
    nameAm?: string;
    email: string;
    password: string;
    role: UserRole;
    grade?: string;
    section?: string;
    phone?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        setUser(resData.user);
        setToken(resData.token);
        setIsAuthModalOpen(false);
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: resData.errorAm || resData.error || "Registration failed" };
      }
    } catch (err: any) {
      console.warn("API registration failed, falling back to client creation:", err);
      const newUser: UserProfile = {
        id: `usr-reg-${Date.now()}`,
        name: data.name,
        nameAm: data.nameAm || data.name,
        email: data.email,
        role: data.role,
        grade: data.grade || "Grade 10",
        section: data.section || "A",
        avatar: initialUsers[data.role]?.avatar || initialUsers.student.avatar,
      };
      setUser(newUser);
      setToken(`token-${newUser.id}`);
      setIsAuthModalOpen(false);
      setIsLoading(false);
      return { success: true };
    }
  };

  const logout = () => {
    if (token) {
      fetch("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem("nur_auth_user");
    localStorage.removeItem("nur_auth_token");
    setIsAuthModalOpen(true);
    setAuthModalMode("login");
  };

  const loginAsDemo = (role: UserRole) => {
    const demoUser = initialUsers[role];
    if (demoUser) {
      setUser(demoUser);
      setToken(`demo-${role}-token`);
      setIsAuthModalOpen(false);
    }
  };

  const openLoginModal = () => {
    setAuthModalMode("login");
    setIsAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthModalMode("register");
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    // Only allow closing if user is already authenticated
    if (user) {
      setIsAuthModalOpen(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        loginAsDemo,
        isAuthModalOpen,
        authModalMode,
        openLoginModal,
        openRegisterModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
