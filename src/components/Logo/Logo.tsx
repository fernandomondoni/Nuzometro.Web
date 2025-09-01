import NuzometroSvg from "../../assets/nuzometro.svg"; // Make sure this path is correct

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
      className={`${sizeClasses[size]} ${className} flex items-center justify-center transition-colors duration-300`}
    >
      <img
        src={NuzometroSvg}
        alt="Nuzometro Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
}
