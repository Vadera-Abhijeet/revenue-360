import React from 'react';

const DashboardSkeleton: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 3xl:grid-cols-5 gap-4">
                {[...Array(5)].map((_, index) => (
                    <div key={index} className="p-4 rounded-lg border border-gray-200">
                        <div className="w-32 h-4 rounded bg-gray-200 animate-pulse mb-4"></div>
                        <div className="space-y-2 mb-9">
                            <div className="w-24 h-6 rounded bg-gray-200 animate-pulse"></div>
                            <div className="w-16 h-4 rounded bg-gray-200 animate-pulse"></div>
                        </div>
                        <div className="w-32 h-4 rounded bg-gray-200 animate-pulse my-2"></div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="p-4 rounded-lg border border-gray-200">
                <div className="h-8 w-48 rounded bg-gray-200 animate-pulse mb-4"></div>
                <div className="h-[338px] rounded bg-gray-200 animate-pulse"></div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Performing Apps Chart */}
                <div className="p-4 rounded-lg border border-gray-200">
                    <div className="h-8 w-48 rounded bg-gray-200 animate-pulse mb-4"></div>
                    <div className="h-64 rounded bg-gray-200 animate-pulse"></div>
                </div>

                {/* Recent Campaigns */}
                <div className="p-4 rounded-lg border border-gray-200">
                    <div className="h-8 w-48 rounded bg-gray-200 animate-pulse mb-4"></div>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded bg-gray-200 animate-pulse"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="w-3/4 h-4 rounded bg-gray-200 animate-pulse"></div>
                                    <div className="w-1/2 h-3 rounded bg-gray-200 animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton; 