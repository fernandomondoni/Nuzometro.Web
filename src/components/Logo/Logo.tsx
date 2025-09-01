import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  return (
    <div
      className={`${sizeClasses[size]} ${className} flex items-center justify-center bg-primary rounded-full transition-colors duration-300`}
    >
      <div className="text-primary-foreground font-bold text-lg transition-colors duration-300">
        LOGO
      </div>
    </div>
  );
}
