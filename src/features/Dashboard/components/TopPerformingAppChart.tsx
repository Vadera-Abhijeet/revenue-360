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
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fontFamily: 'var(--font-inter)' }}
              stroke="#6b7280"
            />
            <YAxis
              tick={{ fontSize: 12, fontFamily: 'var(--font-inter)' }}
              stroke="#6b7280"
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === "revenue") return formatCurrency(Number(value));
                return value;
              }}
              contentStyle={{
                fontFamily: 'var(--font-inter)',
                fontSize: '12px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e5e7eb',
                backgroundColor: 'white',
                padding: '12px',
                color: 'var(--text-color)'
              }}
              labelStyle={{
                fontFamily: 'var(--font-inter)',
                fontSize: '12px',
                color: 'var(--text-color)',
                marginBottom: '4px'
              }}
              cursor={{ fill: 'transparent' }}
            />
            <Legend
              wrapperStyle={{
                fontFamily: 'var(--font-inter)',
                fontSize: '14px',
                color: 'var(--text-color)'
              }}
            />
            <Bar
              dataKey="revenue"
              name={t("dashboard.topApps.revenue")}
              fill="#B6A6E9"
              radius={[8, 8, 0, 0]}
              maxBarSize={50}
            />
            <Bar
              dataKey="cost"
              name={t("dashboard.topApps.cost")}
              fill="#3D2785"
              radius={[8, 8, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default TopPerformingAppChart;
