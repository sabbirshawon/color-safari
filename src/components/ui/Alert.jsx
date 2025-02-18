"use client";

export const Alert = ({ children, className = '' }) => (
  <div className={`p-4 rounded-lg ${className}`}>{children}</div>
);