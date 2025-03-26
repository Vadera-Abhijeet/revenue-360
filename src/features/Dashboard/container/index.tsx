import { Button, ListGroup, Popover } from "flowbite-react";
import { BarChart2, Calculator, ChevronDown, DollarSign, Smartphone, TrendingUp, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import DateRangePicker from "../../../components/DateRangePicker";
import StatCard from "../../../components/StatCard";
import { useCurrency } from "../../../contexts/CurrencyContext";
import { fetchDashboardData } from "../../../services/api";
import DashboardSkeleton from "../../../components/SkeletonLoaders/DashboardSkeleton";
import RecentCampaigns from "../components/RecentCampaigns";
import RevenueAndSpendChart from "../components/RevenueAndSpendChart";
import TopPerformingAppChart from "../components/TopPerformingAppChart";
import { IDashboard } from "../interface";
import { motion } from "motion/react";

const accounts = [
  { label: "All", value: "" },
  ...Array.from({ length: 10 }, (_, i) => ({
    label: `Account-${i + 1}`,
    value: `account-${i + 1}`,
  })),
];

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currency, convertCurrency } = useCurrency();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<IDashboard | undefined>();
  const [selectedAccounts, setSelectedAccounts] = useState([accounts[0].value]);
  const [openAccountDropdown, setOpenAccountDropdown] = useState(false);
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
  }, [startDate, endDate, selectedAccounts]);

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

  const handleAccountChange = useCallback((value: string) => {
    setSelectedAccounts((prev) => {
      if (prev.includes(value)) {
        return prev.filter((account) => account !== value);
      } else {
        return [...prev, value];
      }
    });
    setOpenAccountDropdown(false)
  }, [])


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Users size={20} className="text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-700">
            {t("common.account")}
          </h1>
          <Popover
            color="light"
            placement="right-start"
            open={openAccountDropdown}
            onOpenChange={setOpenAccountDropdown}
            content={
              <ListGroup className="w-48" color="light">
                {accounts.map((account) => (
                  <motion.div
                    key={account.value}
                    initial={{ opacity: 0, scale: 0.9 }} // Initial state for animation
                    animate={{ opacity: 1, scale: 1 }} // Final state for animation
                    exit={{ opacity: 0, scale: 0.9 }} // Exit state for animation
                    transition={{ duration: 0.2 }} // Animation duration
                  >
                    <motion.div
                      onClick={() => handleAccountChange(account.value)}
                      initial={{ backgroundColor: 'transparent' }}
                      animate={{
                        backgroundColor: selectedAccounts.includes(account.value) ? '#d1fae5' : 'transparent', // Change color when selected
                        scale: selectedAccounts.includes(account.value) ? 1.05 : 1, // Scale up when selected
                      }}
                      transition={{ duration: 0.2 }} // Animation duration for color and scale
                    >
                      <ListGroup.Item
                        active={selectedAccounts.includes(account.value)} // Check if account is selected
                      >
                        {account.label}
                      </ListGroup.Item>
                    </motion.div>
                  </motion.div>
                ))}
              </ListGroup>
            }
            theme={{
              content: "z-10 overflow-hidden rounded-[7px] shadow-md ",
            }}
          >
            <Button
              color="light"
              type="button"
              className="min-w-[150px]"
              theme={{
                inner: {
                  base: "flex items-stretch w-full transition-all duration-200"
                }
              }}
            >
              <div className="flex items-center gap-2 w-full justify-between">
                {selectedAccounts.length > 0
                  ? selectedAccounts.map((acc) => accounts.find(a => a.value === acc)?.label).join(', ')
                  : "Select Account"}
                <ChevronDown size={16} />
              </div>
            </Button>
          </Popover>
        </div>
        <DateRangePicker onDateRangeChange={handleDateRangeChange} />
      </div>
      {isLoading || !dashboardData ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 3xl:grid-cols-5 gap-4">
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
              color="primary"
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
              color="warning"
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
