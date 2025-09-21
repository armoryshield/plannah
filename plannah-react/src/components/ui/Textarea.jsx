import React from 'react';

/**
 * Textarea component
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.value - Textarea value
 * @param {function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {number} props.rows - Number of rows
 */
const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-gray-600 bg-gray-800 text-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

export default Textarea;