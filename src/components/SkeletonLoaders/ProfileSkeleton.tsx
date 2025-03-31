import React from "react";

const ProfileSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2 max-w-2xl">
        {/* Profile Picture Skeleton */}
        <div className="flex mb-6">
          <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse" />
        </div>

        {/* Name Input Skeleton */}
        <div>
          <div className="mb-2 block">
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Email Input Skeleton */}
        <div>
          <div className="mb-2 block">
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Company Input Skeleton */}
        <div>
          <div className="mb-2 block">
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Save Button Skeleton */}
        <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
};

export default ProfileSkeleton;
