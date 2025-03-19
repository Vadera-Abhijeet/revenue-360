import { Card } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../../../contexts/CurrencyContext";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ITopAppsEntity } from "../interface";

function TopPerformingAppChart({ data = [] }: { data?: ITopAppsEntity[] }) {
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();
  return (
    <Card
      theme={{
        root: {
          base: "flex rounded-lg border border-gray-200 bg-white  dark:border-gray-700 dark:bg-gray-800",
        },
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-xl font-bold text-gray-700">
          {t("dashboard.topApps.title")}
        </h5>
        {/* <Button color="light" size="sm" className="flex items-center gap-1">
          View All <ArrowRight size={16} />
        </Button> */}
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => {
                if (name === "revenue") return formatCurrency(Number(value));
                return value;
              }}
            />
            <Legend />
            <Bar
              dataKey="revenue"
              name={t("dashboard.topApps.revenue")}
              fill="#b3b1ff"
            />
            <Bar
              dataKey="cost"
              name={t("dashboard.topApps.cost")}
              fill="#8b5cf6"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default TopPerformingAppChart;
