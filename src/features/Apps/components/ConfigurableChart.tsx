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
import { ChartConfig } from "../../../interfaces";
import { useCurrency } from "../../../contexts/CurrencyContext";

interface ConfigurableChartProps {
  config: ChartConfig;
  data: any[];
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

    const formatValue = (value: any) => {
      if (typeof value === "number") {
        // Check if the value represents currency
        if (config.yAxis.some((axis) => axis.includes("revenue") || axis.includes("spend"))) {
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

      case "pie":
        const pieData = data.reduce((acc: any[], curr: any) => {
          config.yAxis.forEach((axis) => {
            acc.push({
              name: `${curr[config.xAxis]} - ${axis}`,
              value: curr[axis],
            });
          });
          return acc;
        }, []);

        return (
          <PieChart {...commonProps}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {pieData.map((entry: any, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={formatValue} />
            <Legend />
          </PieChart>
        );

      default:
        return null;
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