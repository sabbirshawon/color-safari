"use client";

export const Alert = ({ children, className = '' }) => (
  <div className={`p-4 rounded-lg mb-4 ${className}`}>
    {children}
  </div>
);