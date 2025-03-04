import React from 'react';
import { Card } from 'flowbite-react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';

interface StatCardProps {
  title: string;
  value: number;
  previousValue?: number;
  isCurrency?: boolean;
  isPercentage?: boolean;
  icon?: React.ReactNode;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  previousValue,
  isCurrency = false,
  isPercentage = false,
  icon,
  color = 'primary',
}) => {
  const { formatCurrency } = useCurrency();

  const percentChange = previousValue
    ? ((value - previousValue) / previousValue) * 100
    : 0;

  const isPositive = percentChange >= 0;

  const formatValue = () => {
    if (isCurrency) {
      return formatCurrency(value);
    }
    if (isPercentage) {
      return `${value.toFixed(2)}%`;
    }
    return value.toLocaleString();
  };

  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    secondary: 'bg-secondary-50 text-secondary-600',
    success: 'bg-green-50 text-green-600',
    danger: 'bg-red-50 text-red-600',
    warning: 'bg-yellow-50 text-yellow-600',
    info: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600'
  };

  const iconColorClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.primary;

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{formatValue()}</h3>

          {previousValue !== undefined && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? <ArrowUp size={16} className="inline" /> : <ArrowDown size={16} className="inline" />}
                {Math.abs(percentChange).toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs previous period</span>
            </div>
          )}
        </div>

        {icon && (
          <div className={`p-3 rounded-full ${iconColorClass}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;