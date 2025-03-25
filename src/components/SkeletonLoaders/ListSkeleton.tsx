import React from 'react';

const ListSkeleton: React.FC = () => {
    return (
        <div className="space-y-5">
            {/* Table Skeleton */}
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-md">
                <div className="min-w-full">
                    {/* Table Header */}
                    <div className="border-b h-[50px] border-gray-200 dark:border-gray-700 grid grid-cols-8 gap-4 px-4">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className="h-4 w-24 rounded bg-gray-200 animate-pulse my-auto"></div>
                        ))}
                    </div>

                    {/* Table Body */}
                    <div className="divide-y">
                        {[...Array(9)].map((_, rowIndex) => (
                            <div key={rowIndex} className="grid grid-cols-8 gap-4 p-4">
                                {/* App Name and Platform */}
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded bg-gray-200 animate-pulse"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-32 rounded bg-gray-200 animate-pulse"></div>
                                        <div className="h-3 w-16 rounded bg-gray-200 animate-pulse"></div>
                                    </div>
                                </div>

                                {/* Other Columns */}
                                {[...Array(7)].map((_, colIndex) => (
                                    <div key={colIndex} className="h-4 w-24 rounded bg-gray-200 animate-pulse my-auto"></div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListSkeleton; 