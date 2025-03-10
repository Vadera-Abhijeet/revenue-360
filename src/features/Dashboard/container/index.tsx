import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  DollarSign,
  TrendingUp,
  BarChart2,
  Smartphone,
  Calculator,
} from "lucide-react";
import { fetchDashboardData } from "../../../services/api";
import DateRangePicker from "../../../components/DateRangePicker";
import StatCard from "../../../components/StatCard";
import { IDashboard } from "../interface";
import { useNavigate } from "react-router-dom";
import RevenueAndSpendChart from "../components/RevenueAndSpendChart";
import TopPerformingAppChart from "../components/TopPerformingAppChart";
import RecentCampaigns from "../components/RecentCampaigns";
import { useCurrency } from "../../../contexts/CurrencyContext";

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currency, convertCurrency } = useCurrency();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<IDashboard | undefined>();
  const [startDate, setStartDate] = useState<Date>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data: IDashboard = await fetchDashboardData(startDate, endDate);
        setDashboardData(data);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [startDate, endDate]);

  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Calculate profit amount (revenue - adSpend)
  const convertToINR = (value: number) => {
    return convertCurrency(value, currency, "INR");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-indigo-700">
          {t("dashboard.title")}
        </h1>
        <DateRangePicker onDateRangeChange={handleDateRangeChange} />
      </div>
      {isLoading || !dashboardData ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-4">
            <StatCard
              title={t("dashboard.summary.estimatedRevenue")}
              value={dashboardData.summary.estimatedRevenue}
              previousValue={dashboardData.summary.previousEstimatedRevenue}
              isCurrency={true}
              valueInINR={convertToINR(dashboardData.summary.estimatedRevenue)}
              icon={<Calculator size={24} />}
              color="info"
            />
            <StatCard
              title={t("dashboard.summary.revenue")}
              value={dashboardData.summary.revenue}
              previousValue={dashboardData.summary.previousRevenue}
              isCurrency={true}
              valueInINR={convertToINR(dashboardData.summary.revenue)}
              icon={<DollarSign size={24} />}
              color="success"
            />
            <StatCard
              title={t("dashboard.summary.spend")}
              value={dashboardData.summary.adSpend}
              previousValue={dashboardData.summary.previousAdSpend}
              isCurrency={true}
              valueInINR={convertToINR(dashboardData.summary.adSpend)}
              icon={<TrendingUp size={24} />}
              color="danger"
            />
            <StatCard
              title={t("dashboard.summary.totalNet")}
              value={
                dashboardData.summary.revenue - dashboardData.summary.adSpend
              }
              previousValue={
                dashboardData.summary.previousRevenue -
                dashboardData.summary.previousAdSpend
              }
              isCurrency={true}
              valueInINR={convertToINR(
                dashboardData.summary.revenue - dashboardData.summary.adSpend
              )}
              icon={<BarChart2 size={24} />}
              color="primary"
            />
            <StatCard
              title={t("dashboard.summary.apps")}
              value={dashboardData.summary.activeApps}
              previousValue={dashboardData.summary.previousActiveApps}
              icon={<Smartphone size={24} />}
              color="secondary"
              onClick={() => handleNavigation("/apps")}
            />
          </div>

          <RevenueAndSpendChart data={dashboardData?.revenueVsSpend} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopPerformingAppChart data={dashboardData.topApps} />
            <RecentCampaigns data={dashboardData.recentCampaigns} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
