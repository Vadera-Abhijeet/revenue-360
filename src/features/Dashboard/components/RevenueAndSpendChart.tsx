import { Card } from "flowbite-react";
import { useTranslation } from "react-i18next";
import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  ComposedChart
} from "recharts";
import { useCurrency } from "../../../contexts/CurrencyContext";
import { IRevenueVsSpendEntity } from "../interface";

const RevenueAndSpendChart = ({
  data = [],
}: {
  data?: IRevenueVsSpendEntity[];
}) => {
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();

  return (
    <Card
      theme={{
        root: {
          base: "flex rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800",
        },
      }}
    >
      <h5 className="text-xl font-bold mb-2 text-gray-700">
        {t("dashboard.revenueVsSpend.title")}
      </h5>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#B6A6E9" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#B6A6E9" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3D2785" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3D2785" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fontFamily: 'var(--font-inter)' }}
              stroke="#6b7280"
            />
            <YAxis
              tick={{ fontSize: 12, fontFamily: 'var(--font-inter)' }}
              stroke="#6b7280"
            />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              labelFormatter={(label) => `Date: ${label}`}
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
                color: 'var(--text-color)'
              }}
            />
            <Legend
              wrapperStyle={{
                fontFamily: 'var(--font-inter)',
                fontSize: '14px',
                color: 'var(--text-color)'
              }}
            />
            <Area
              type="natural"
              connectNulls
              dataKey="revenue"
              fill="url(#colorRevenue)"
              stroke="#B6A6E9"
              strokeWidth={2}
              name={t("dashboard.revenueVsSpend.revenue")}
              dot={false}
              activeDot={{ r: 6, fill: "#B6A6E9" }}
            />
            <Area
              type="natural"
              connectNulls
              dataKey="adSpend"
              fill="url(#colorSpend)"
              stroke="#3D2785"
              strokeWidth={2}
              name={t("dashboard.revenueVsSpend.spend")}
              dot={false}
              activeDot={{ r: 6, fill: "#3D2785" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default RevenueAndSpendChart;
