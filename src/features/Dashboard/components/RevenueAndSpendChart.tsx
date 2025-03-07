import { Card } from "flowbite-react";
import { useTranslation } from "react-i18next";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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
    <Card>
      <h5 className="text-xl font-bold mb-2 text-gray-900">
        {t("dashboard.revenueVsSpend.title")}
      </h5>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              name={t("dashboard.revenueVsSpend.revenue")}
              stroke="#10b981"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="adSpend"
              name={t("dashboard.revenueVsSpend.spend")}
              stroke="#ef4444"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default RevenueAndSpendChart;
