import React from "react";

interface LoaderProps {
  size?: "small" | "medium" | "large";
}

const DEFAULT_SIZE = "medium";

const Loader: React.FC<LoaderProps> = ({ size = DEFAULT_SIZE }) => {
  const getSizeClass = () => {
    switch (size) {
      case "small":
        return "w-6 h-6 border-2";
      case "medium":
        return "w-8 h-8 border-3";
      case "large":
        return "w-12 h-12 border-4";
      default:
        return "w-8 h-8 border-3";
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-t-2 border-blue-500 ${getSizeClass()}`}
      ></div>
    </div>
  );
};

export default Loader;
