"use client";

export const Button = ({ children, className = '', ...props }) => (
  <button 
    className={`px-4 py-2 rounded-lg transition-all duration-200 ${className}`} 
    {...props}
  >
    {children}
  </button>
);