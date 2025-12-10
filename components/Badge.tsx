import React from "react";

interface BadgeProps {
  type?: "info" | "warning" | "success" | "danger" | "default";
  children: React.ReactNode;
}

export default function Badge({ type = "info", children }: BadgeProps) {
  const colors = {
    default: "bg-linear-to-r from-slate-700 to-slate-600 text-slate-100 shadow-lg shadow-slate-700/50",
    info: "bg-linear-to-r from-blue-600 to-blue-500 text-blue-50 shadow-lg shadow-blue-500/50",
    warning: "bg-linear-to-r from-yellow-600 to-yellow-500 text-yellow-50 shadow-lg shadow-yellow-500/50",
    success: "bg-linear-to-r from-green-600 to-green-500 text-green-50 shadow-lg shadow-green-500/50",
    danger: "bg-linear-to-r from-red-600 to-red-500 text-red-50 shadow-lg shadow-red-500/50",
  };

  return (
    <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${colors[type]} inline-block hover:scale-105 transition-transform duration-300`}>
      {children}
    </span>
  );
}
