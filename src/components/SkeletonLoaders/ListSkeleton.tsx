import React from "react";

interface ListSkeletonProps {
  rows?: number;
  columns?: number;
  showAsTable?: boolean;
  showHeader?: boolean;
  firstColumnWithIcon?: boolean;
  className?: string;
}

const ListSkeleton: React.FC<ListSkeletonProps> = ({
  rows = 9,
  columns = 8,
  showAsTable = true,
  showHeader = true,
  firstColumnWithIcon = true,
  className = "",
}) => {
  const SkeletonRow = () => (
    <div className={`grid grid-cols-${columns} gap-4 p-4`}>
      {/* First Column - Optionally with Icon */}
      {firstColumnWithIcon ? (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded bg-gray-200 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-gray-200 animate-pulse"></div>
            <div className="h-3 w-16 rounded bg-gray-200 animate-pulse"></div>
          </div>
        </div>
      ) : (
        <div className="h-4 w-24 rounded bg-gray-200 animate-pulse my-auto"></div>
      )}

      {/* Other Columns */}
      {[...Array(firstColumnWithIcon ? columns - 1 : columns - 1)].map(
        (_, colIndex) => (
          <div
            key={colIndex}
            className="h-4 w-24 rounded bg-gray-200 animate-pulse my-auto"
          ></div>
        )
      )}
    </div>
  );

  if (!showAsTable) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(rows)].map((_, index) => (
          <SkeletonRow key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-5 ${className}`}>
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-md">
        <div className="min-w-full">
          {/* Table Header */}
          {showHeader && (
            <div
              className={`border-b h-[50px] border-gray-200 dark:border-gray-700 grid grid-cols-${columns} gap-4 px-4`}
            >
              {[...Array(columns)].map((_, index) => (
                <div
                  key={index}
                  className="h-4 w-24 rounded bg-gray-200 animate-pulse my-auto"
                ></div>
              ))}
            </div>
          )}

          {/* Table Body */}
          <div className="divide-y">
            {[...Array(rows)].map((_, rowIndex) => (
              <SkeletonRow key={rowIndex} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListSkeleton;
