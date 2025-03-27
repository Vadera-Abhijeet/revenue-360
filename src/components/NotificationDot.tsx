import React from "react";

interface NotificationDotProps {
  children: React.ReactNode;
  show?: boolean;
  dotColor?: string;
  className?: string;
  dotSize?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

const positionClasses = {
  "top-left": "top-0 left-0",
  "top-right": "top-0 right-0",
  "bottom-left": "bottom-0 left-0",
  "bottom-right": "bottom-0 right-0",
};

const NotificationDot: React.FC<NotificationDotProps> = ({
  children,
  show = true,
  dotColor = "bg-red-500",
  dotSize = "w-3 h-3",
  position = "top-right",
  className,
}) => {
  return (
    <div className={`relative inline-flex ${className}`}>
      {children}
      {show && (
        <span
          className={`absolute ${positionClasses[position]} ${dotColor} ${dotSize} rounded-full ring-2 ring-white`}
        />
      )}
    </div>
  );
};

export default NotificationDot;
