import React, { ReactNode } from 'react';

// --- Button ---
// FIX: Add a 'size' prop to support different button sizes and fix type error.
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger';
  fullWidth?: boolean;
  icon?: ReactNode;
  size?: 'sm' | 'md';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', fullWidth = false, icon, size = 'md', className = '', ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const sizeStyles = {
    md: "text-sm md:text-base py-3 px-6",
    sm: "text-xs py-1.5 px-4 rounded-lg",
  };

  const variants = {
    primary: "bg-primary text-white hover:bg-[#5b2ee0] shadow-lg shadow-primary/30 border border-transparent",
    secondary: "bg-transparent border border-gray-200 dark:border-surfaceLight text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-surfaceLight",
    accent: "bg-accent text-secondary hover:bg-[#40e0a0] shadow-[0_0_15px_rgba(82,255,184,0.4)]",
    ghost: "bg-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
    danger: "bg-red-600 text-white hover:bg-red-700 border border-transparent shadow-[0_0_15px_rgba(220,38,38,0.4)]",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${widthStyle} ${className}`} 
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

// --- Card ---
interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, action }) => {
  return (
    <div className={`bg-white dark:bg-surface border border-gray-200 dark:border-surfaceLight rounded-2xl p-5 md:p-6 shadow-lg dark:shadow-xl transition-colors duration-300 ${className}`}>
      {(title || action) && (
        <div className="flex justify-between items-center mb-4">
          {title && <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">{label}</label>}
      <input 
        className={`w-full bg-gray-50 dark:bg-secondary border border-gray-200 dark:border-surfaceLight rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors ${className}`}
        {...props}
      />
    </div>
  );
};

// --- Select ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select: React.FC<SelectProps> = ({ label, className = '', children, ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">{label}</label>}
      <select
        className={`w-full bg-gray-50 dark:bg-secondary border border-gray-200 dark:border-surfaceLight rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

// --- Badge ---
export const Badge: React.FC<{ children: ReactNode, color?: 'green' | 'purple' | 'yellow' }> = ({ children, color = 'green' }) => {
  const colors = {
    green: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-accent border-green-200 dark:border-green-800",
    purple: "bg-purple-100 dark:bg-primary/20 text-primary border-purple-200 dark:border-indigo-900",
    yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-highlight border-yellow-200 dark:border-yellow-800",
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[color]}`}>
      {children}
    </span>
  );
};

// --- Modal ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative bg-white dark:bg-surface border border-gray-200 dark:border-surfaceLight rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        {title && (
          <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
        )}
        <div className="text-gray-600 dark:text-gray-300">
          {children}
        </div>
      </div>
    </div>
  );
};