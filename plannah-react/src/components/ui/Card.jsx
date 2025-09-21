import React from 'react';

/**
 * Card container component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 */
const Card = ({ children, className = "" }) => (
  <div className={`rounded-lg border border-gray-600 bg-gray-800 text-white shadow-sm ${className}`}>
    {children}
  </div>
);

/**
 * Card header component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Header content
 * @param {string} props.className - Additional CSS classes
 */
const CardHeader = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 p-4 ${className}`}>
    {children}
  </div>
);

/**
 * Card content component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content
 * @param {string} props.className - Additional CSS classes
 */
const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 pt-0 ${className}`}>
    {children}
  </div>
);

export { Card, CardHeader, CardContent };