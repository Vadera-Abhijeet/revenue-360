import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/lottie/loading.json";

const Loading: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={`flex justify-center items-center ${
        className?.includes("h-") ? "" : "h-screen"
      } ${className} `}
    >
      <Lottie
        animationData={loadingAnimation}
        loop={true}
        style={{ width: 100, height: 100 }}
      />
    </div>
  );
};

export default Loading;
