import React, { ReactNode } from 'react';

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger';
  fullWidth?: boolean;
  icon?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', fullWidth = false, icon, className = '', ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-sm md:text-base py-3 px-6";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-[#5b2ee0] shadow-[0_0_15px_rgba(112,64,255,0.4)] border border-transparent",
    secondary: "bg-transparent border border-surfaceLight text-white hover:bg-surfaceLight",
    accent: "bg-accent text-secondary hover:bg-[#40e0a0] shadow-[0_0_15px_rgba(82,255,184,0.4)]",
    ghost: "bg-transparent text-gray-400 hover:text-white",
    danger: "bg-red-600 text-white hover:bg-red-700 border border-transparent shadow-[0_0_15px_rgba(220,38,38,0.4)]",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`} 
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
    <div className={`bg-surface border border-surfaceLight rounded-2xl p-5 md:p-6 shadow-xl ${className}`}>
      {(title || action) && (
        <div className="flex justify-between items-center mb-4">
          {title && <h3 className="text-lg font-heading font-semibold text-white">{title}</h3>}
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
      {label && <label className="block text-sm text-gray-400 mb-2 font-medium">{label}</label>}
      <input 
        className={`w-full bg-secondary border border-surfaceLight rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors ${className}`}
        {...props}
      />
    </div>
  );
};

// --- Badge ---
export const Badge: React.FC<{ children: ReactNode, color?: 'green' | 'purple' | 'yellow' }> = ({ children, color = 'green' }) => {
  const colors = {
    green: "bg-green-900/30 text-accent border-green-800",
    purple: "bg-primary/20 text-primary border-indigo-900",
    yellow: "bg-yellow-900/30 text-highlight border-yellow-800",
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
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative bg-surface border border-surfaceLight rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        {title && (
          <h3 className="text-xl font-heading font-bold text-white mb-4">{title}</h3>
        )}
        <div className="text-gray-300">
          {children}
        </div>
      </div>
    </div>
  );
};