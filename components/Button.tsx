import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const base = 'font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2';
  const variants = {
    primary: 'bg-linear-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/50 btn-glow focus:ring-blue-400',
    secondary: 'bg-linear-to-r from-slate-600 to-slate-700 text-white hover:from-slate-500 hover:to-slate-600 shadow-lg shadow-slate-500/30 focus:ring-slate-400',
    danger: 'bg-linear-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 shadow-lg shadow-red-500/50 btn-glow focus:ring-red-400',
    success: 'bg-linear-to-r from-green-600 to-green-700 text-white hover:from-green-500 hover:to-green-600 shadow-lg shadow-green-500/50 btn-glow focus:ring-green-400',
    warning: 'bg-linear-to-r from-yellow-600 to-yellow-700 text-white hover:from-yellow-500 hover:to-yellow-600 shadow-lg shadow-yellow-500/50 focus:ring-yellow-400',
    outline: 'border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 focus:ring-blue-400',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <button 
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'} ${className}`} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
