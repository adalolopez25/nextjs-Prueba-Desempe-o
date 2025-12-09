"use client"
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log('AuthProvider: Checking localStorage for user');
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        console.log('AuthProvider: Found saved user', savedUser);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('AuthProvider: Error parsing saved user', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('AuthContext: Login attempt started', { email, password });
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      console.log('AuthContext: Login response status', response.status);
      console.log('AuthContext: Login response ok', response.ok);
      
      if (response.ok) {
        const result = await response.json();
        console.log('AuthContext: Login response data', result);
        
        if (result.success && result.data) {
          console.log('AuthContext: Login successful, setting user', result.data);
          setUser(result.data);
          localStorage.setItem('user', JSON.stringify(result.data));
          return true;
        } else {
          console.log('AuthContext: Login failed - result not successful', result);
        }
      } else {
        console.log('AuthContext: Login failed - response not ok', response.status);
        const errorText = await response.text();
        console.log('AuthContext: Error response text', errorText);
      }
      return false;
    } catch (error) {
      console.error('AuthContext: Login fetch error:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('AuthContext: Logout called');
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};