import React from 'react';

/**
 * Badge component for displaying tags and status
 * @param {Object} props
 * @param {React.ReactNode} props.children - Badge content
 * @param {'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger'} props.variant - Badge variant
 * @param {string} props.className - Additional CSS classes
 */
const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    outline: "text-white border border-gray-500",
    success: "bg-green-600 text-white",
    warning: "bg-yellow-600 text-white",
    danger: "bg-red-600 text-white"
  };

  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default Badge;