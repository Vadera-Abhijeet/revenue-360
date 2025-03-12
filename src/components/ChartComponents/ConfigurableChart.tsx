import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartConfig } from "../../interfaces";
import { useCurrency } from "../../contexts/CurrencyContext";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";
import {
  ICampaignsDataEntity,
  ICountryDataEntity,
  IRetentionDataEntity,
  IRevenueDataEntity,
  IUserDataEntity,
  IVersionDataEntity,
} from "../../features/Campaigns/interface";

interface ConfigurableChartProps {
  config: ChartConfig;
  data:
    | IRevenueDataEntity[]
    | IUserDataEntity[]
    | IRetentionDataEntity[]
    | ICountryDataEntity[]
    | IVersionDataEntity[]
    | ICampaignsDataEntity[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const ConfigurableChart: React.FC<ConfigurableChartProps> = ({
  config,
  data,
}) => {
  const { formatCurrency } = useCurrency();

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    const formatValue = (value: ValueType) => {
      if (typeof value === "number") {
        // Check if the value represents currency
        if (
          config.yAxis.some(
            (axis) => axis.includes("revenue") || axis.includes("spend")
          )
        ) {
          return formatCurrency(value);
        }
        return value.toLocaleString();
      }
      return value;
    };

    switch (config.type) {
      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xAxis} />
            <YAxis />
            <Tooltip formatter={formatValue} />
            <Legend />
            {config.yAxis.map((axis, index) => (
              <Line
                key={axis}
                type="monotone"
                dataKey={axis}
                stroke={COLORS[index % COLORS.length]}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        );

      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xAxis} />
            <YAxis />
            <Tooltip formatter={formatValue} />
            <Legend />
            {config.yAxis.map((axis, index) => (
              <Bar
                key={axis}
                dataKey={axis}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </BarChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xAxis} />
            <YAxis />
            <Tooltip formatter={formatValue} />
            <Legend />
            {config.yAxis.map((axis, index) => (
              <Area
                key={axis}
                type="monotone"
                dataKey={axis}
                fill={COLORS[index % COLORS.length]}
                stroke={COLORS[index % COLORS.length]}
              />
            ))}
          </AreaChart>
        );
      case "pie": {
        // Generate pie data by summing up each yAxis category
        const pieData = config.yAxis.map((axis) => ({
          name: axis,
          value: data.reduce(
            (sum, curr) =>
              sum + ((curr[axis as keyof typeof curr] as number) || 0),
            0
          ),
        }));

        return (
          <PieChart width={400} height={400}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(1)}%`
              }
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]} // Ensure colors cycle properly
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${formatValue(value)}`} // Ensure formatted values
            />
            <Legend />
          </PieChart>
        );
      }

      default:
        return <></>;
    }
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default ConfigurableChart;
