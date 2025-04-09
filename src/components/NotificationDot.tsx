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
  "top-left": "top-1 left-1",
  "top-right": "top-1 right-1",
  "bottom-left": "bottom-1 left-1",
  "bottom-right": "bottom-1 right-1",
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
