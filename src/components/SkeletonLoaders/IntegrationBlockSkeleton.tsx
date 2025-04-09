import React from "react";

interface IntegrationBlockSkeletonProps {
  count?: number;
  className?: string;
}

const IntegrationBlockSkeleton: React.FC<IntegrationBlockSkeletonProps> = ({
  count = 1,
  className = "",
}) => {
  const SkeletonBlock = () => (
    <div className="flex flex-col space-y-3 relative p-4 border border-gray-200 rounded-lg">
      {/* Header with platform icon, name, and badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Platform icon skeleton */}
          <div className="w-10 h-10 rounded bg-gray-200 animate-pulse"></div>

          {/* Platform name skeleton */}
          <div className="h-6 w-32 rounded bg-gray-200 animate-pulse"></div>

          {/* Badge skeleton */}
          <div className="h-6 w-24 rounded bg-gray-200 animate-pulse"></div>
        </div>

        {/* Dropdown menu skeleton */}
        <div className="w-8 h-8 rounded bg-gray-200 animate-pulse"></div>
      </div>

      {/* Account email section */}
      <div>
        <div className="h-4 w-24 rounded bg-gray-200 animate-pulse mb-2"></div>
        <div className="h-5 w-48 rounded bg-gray-200 animate-pulse"></div>
      </div>

      {/* Account ID section */}
      <div>
        <div className="h-4 w-24 rounded bg-gray-200 animate-pulse mb-2"></div>
        <div className="h-5 w-48 rounded bg-gray-200 animate-pulse"></div>
      </div>
    </div>
  );

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-2 gap-6 ${className}`}
    >
      {[...Array(count)].map((_, index) => (
        <div key={index} className="grid grid-cols-2 gap-4">
          {/* Inward integration skeleton */}
          <div className="border-r pr-4">
            <SkeletonBlock />
          </div>

          {/* Outward integration skeleton */}
          <div>
            <SkeletonBlock />
          </div>
        </div>
      ))}
    </div>
  );
};

export default IntegrationBlockSkeleton;
