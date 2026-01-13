"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-[50] w-full border-b border-slate-800 bg-slate-950/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
            🛠️
          </div>
          <h1 className="text-xl font-black text-white tracking-tighter">
            HelpDesk<span className="text-indigo-500">Pro</span>
          </h1>
        </div>

        {/* User & Logout Section */}
        <div className="flex items-center gap-6">
          {user && (
            <div className="hidden sm:flex items-center gap-3 pr-6 border-r border-slate-800">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold border-2 border-slate-900 shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-bold text-white leading-none mb-1">{user.name}</p>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">
                  {user.role === 'agent' ? 'Agente de Soporte' : 'Cliente'}
                </p>
              </div>
            </div>
          )}

          <button 
            onClick={logout}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/50 text-slate-300 hover:text-red-500 text-xs font-bold rounded-xl transition-all active:scale-95"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}