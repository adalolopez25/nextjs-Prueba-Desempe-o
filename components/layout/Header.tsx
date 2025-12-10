"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header-container">
      <div className="header-logo">
        <div className="logo-icon">🛠️</div>
        <h1 className="logo-text">HelpDeskPro</h1>
      </div>
      <div className="header-right">
        {user && (
          <div className="user-info">
            <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
            <div className="user-details">
              <p className="user-name">{user.name}</p>
              <p className="user-role">{user.role}</p>
            </div>
          </div>
        )}
        <button className="logout-btn" onClick={logout}>
          Salir
        </button>
      </div>
    </header>
  );
}
