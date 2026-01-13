"use client";
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface User { 
  id: string; 
  name: string; 
  email: string; 
  role: string; 
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: "client" | "agent") => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // 1. PERSISTENCIA: Recuperar sesión al cargar la página
  useEffect(() => {
    const session = Cookies.get("session");
    const storedUser = localStorage.getItem("user");
    
    if (session && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error al parsear usuario del localStorage", error);
      }
    }
  }, []);

  // 2. LOGIN
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (data.success && data.data) {
        const userData = data.data.user;
        const userToken = data.data.token;

        setUser(userData);
        setToken(userToken);

        // --- CLAVE PARA EL MIDDLEWARE ---
        // Guardamos la sesión y el ROL en cookies
        Cookies.set("session", "true", { expires: 1, path: "/" });
        Cookies.set("userRole", userData.role, { expires: 1, path: "/" });
        
        // Guardamos para el frontend
        localStorage.setItem("user", JSON.stringify(userData));
        
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login Error:", err);
      return false;
    }
  };

  // 3. REGISTER
  const register = async (name: string, email: string, password: string, role: "client" | "agent") => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      
      const data = await res.json();
      
      if (data.success && data.data) {
        const userData = data.data.user;
        setUser(userData);
        setToken(data.data.token);

        // Guardamos sesión automáticamente tras registro
        Cookies.set("session", "true", { expires: 1, path: "/" });
        Cookies.set("userRole", userData.role, { expires: 1, path: "/" });
        localStorage.setItem("user", JSON.stringify(userData));
        
        return true;
      }
      return false;
    } catch (err) {
      console.error("Register Error:", err);
      return false;
    }
  };

  // 4. LOGOUT
  const logout = () => {
    // Limpiar estado de React
    setUser(null);
    setToken(null);
    
    // Limpiar Cookies (Vital para que el Middleware bloquee el acceso)
    Cookies.remove("session", { path: "/" });
    Cookies.remove("userRole", { path: "/" });
    
    // Limpiar LocalStorage
    localStorage.removeItem("user");
    localStorage.removeItem("authenticated");

    // Redirigir al inicio (Login) y forzar refresco
    router.push("/");
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};