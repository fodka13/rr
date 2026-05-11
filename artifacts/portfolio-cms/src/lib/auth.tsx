import React, { createContext, useContext, useEffect, useState } from "react";
import { useGetMe } from "@workspace/api-client-react";
import type { User } from "@workspace/api-client-react";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import { useLocation } from "wouter";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkPermission: (allowedRoles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [, setLocation] = useLocation();

  useEffect(() => {
    setAuthTokenGetter(() => localStorage.getItem("token"));
  }, []);

  const { data: user, isLoading: isUserLoading, error } = useGetMe({
    query: {
      enabled: !!token,
      retry: false,
    } as any,
  });

  useEffect(() => {
    if (error) {
      localStorage.removeItem("token");
      setToken(null);
    }
  }, [error]);

  const login = (newToken: string, _newUser: User) => {
    localStorage.setItem("token", newToken);
    setAuthTokenGetter(() => localStorage.getItem("token"));
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setLocation("/auth/login");
  };

  const checkPermission = (allowedRoles: string[]) => {
    if (!user) return false;
    if (user.role === "super_admin" || user.role === "admin") return true;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user: user || null, token, isLoading: isUserLoading, login, logout, checkPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
