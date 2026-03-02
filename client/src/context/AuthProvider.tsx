import React, { useState, useEffect } from "react";
import { api } from "../lib/api";
import { AuthContext, type User } from "./AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (username: string, email: string, password: string) => {
    await api.post("/auth/signup", { username, email, password });
  };

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });

    const { accessToken, user: userData } = res.data;

    localStorage.setItem("accessToken", accessToken);
    setUser(userData);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const res = await api.get("/me");
          setUser(res.data);
        } catch {
          localStorage.removeItem("accessToken");
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // display loading indicator while authentication state is being resolved
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="relative h-8 w-8">
            <div className="absolute inset-0 rounded-full bg-indigo-500/70 blur-sm" />
            <div className="absolute inset-1 rounded-full bg-indigo-400 animate-ping" />
          </div>

          <p className="text-xs tracking-[0.2em] uppercase text-zinc-500">
            Loading session…
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
