import React from 'react';

/**
 * Button component with multiple variants and sizes
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {'default' | 'outline' | 'ghost' | 'destructive'} props.variant - Button variant
 * @param {'default' | 'sm' | 'lg' | 'icon'} props.size - Button size
 * @param {string} props.className - Additional CSS classes
 * @param {function} props.onClick - Click handler
 * @param {boolean} props.disabled - Whether button is disabled
 */
const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  onClick,
  disabled = false,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-dark disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "bg-white text-black hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
    outline: "border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white",
    ghost: "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white",
    destructive: "bg-red-600 text-white hover:bg-red-700"
  };

  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-8 px-3 text-sm",
    lg: "h-11 px-8",
    icon: "h-10 w-10"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;