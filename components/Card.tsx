import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "default" | "glass" | "gradient";
}

export default function Card({ 
  children, 
  className = "", 
  onClick,
  variant = "default"
}: CardProps) {
  const variants = {
    default: "bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl smooth-shadow hover-lift",
    glass: "glass-effect",
    gradient: "bg-linear-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl backdrop-blur-xl smooth-shadow hover-lift"
  };
  
  return (
    <div
      onClick={onClick}
      className={`p-6 transition-all duration-300 ${variants[variant]} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
