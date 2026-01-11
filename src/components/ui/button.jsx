import * as React from "react";

export const Button = React.forwardRef(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none disabled:opacity-50";

    const variants = {
      default:
        "bg-blue-600 text-white hover:bg-blue-700",

      outline:
        "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 " +
        "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
    };

    const sizes = {
      default: "px-4 py-2",
      sm: "px-3 py-1 text-sm",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
