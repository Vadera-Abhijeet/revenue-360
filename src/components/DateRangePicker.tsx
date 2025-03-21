import React, { useState } from "react";
import { Button, Popover, TextInput } from "flowbite-react";
import { Calendar, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  format,
  subDays,
  subMonths,
  subYears,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";

interface DateRangePickerProps {
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onDateRangeChange,
}) => {
  const { t } = useTranslation();
  const today = new Date();

  const [startDate, setStartDate] = useState<Date>(subDays(today, 30));
  const [endDate, setEndDate] = useState<Date>(today);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState("last30Days");

  const presets = [
    { id: "today", label: t("common.today"), getRange: () => [today, today] },
    {
      id: "yesterday",
      label: t("common.yesterday"),
      getRange: () => {
        const yesterday = subDays(today, 1);
        return [yesterday, yesterday];
      },
    },
    {
      id: "last7Days",
      label: t("common.last7Days"), // Corrected label
      getRange: () => [subDays(today, 6), today],
    },
    {
      id: "last30Days",
      label: t("common.last30Days"), // Corrected label
      getRange: () => [subDays(today, 29), today],
    },
    {
      id: "thisWeek",
      label: t("common.thisWeek"),
      getRange: () => [startOfWeek(today), endOfWeek(today)],
    },
    {
      id: "lastWeek",
      label: t("common.lastWeek"),
      getRange: () => {
        const lastWeekStart = startOfWeek(subDays(today, 7));
        const lastWeekEnd = endOfWeek(subDays(today, 7));
        return [lastWeekStart, lastWeekEnd];
      },
    },
    {
      id: "thisMonth",
      label: t("common.thisMonth"),
      getRange: () => [startOfMonth(today), endOfMonth(today)],
    },
    {
      id: "lastMonth",
      label: t("common.lastMonth"),
      getRange: () => {
        const lastMonth = subMonths(today, 1);
        return [startOfMonth(lastMonth), endOfMonth(lastMonth)];
      },
    },
    {
      id: "thisYear",
      label: t("common.thisYear"),
      getRange: () => [startOfYear(today), endOfYear(today)],
    },
    {
      id: "lastYear",
      label: t("common.lastYear"),
      getRange: () => {
        const lastYear = subYears(today, 1); // Fixed calculation
        return [startOfYear(lastYear), endOfYear(lastYear)];
      },
    },
    // {
    //   id: "custom",
    //   label: t("common.custom"),
    //   getRange: () => [startDate, endDate],
    // },
  ];

  const handlePresetSelect = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      const [newStartDate, newEndDate] = preset.getRange();
      setStartDate(newStartDate);
      setEndDate(newEndDate);
      setSelectedPreset(presetId);

      // if (presetId !== "custom") {
      //   onDateRangeChange(newStartDate, newEndDate);
      //   setIsOpen(false);
      // }
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      setStartDate(date);
      setSelectedPreset("custom");
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      setEndDate(date);
      setSelectedPreset("custom");
    }
  };

  const handleApply = () => {
    onDateRangeChange(startDate, endDate);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const formatDateForDisplay = (date: Date) => {
    return format(date, "MMM d, yyyy");
  };

  const formatDateForInput = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  return (
    <Popover
      aria-labelledby="area-popover"
      open={isOpen}
      onOpenChange={setIsOpen}
      content={
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {presets.map((preset) => (
              <Button
                key={preset.id}
                color={selectedPreset === preset.id ? "primary" : "light"}
                size="sm"
                onClick={() => handlePresetSelect(preset.id)}
                className="text-sm"
              >
                {preset.label}
              </Button>
            ))}
          </div>

          <div className="space-y-3 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("common.startDate")}
              </label>
              <TextInput
                type="date"
                value={formatDateForInput(startDate)}
                onChange={handleStartDateChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("common.endDate")}
              </label>
              <TextInput
                type="date"
                value={formatDateForInput(endDate)}
                onChange={handleEndDateChange}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button color="light" size="sm" onClick={() => setIsOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button color="indigo" size="sm" onClick={handleApply}>
              {t("common.apply")}
            </Button>
          </div>
        </div>
      }
      theme={{
        content: "z-10 overflow-hidden rounded-[7px] shadow-md",
      }}
    >
      <Button color="light" onClick={toggleDropdown}>
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>
            {formatDateForDisplay(startDate)} - {formatDateForDisplay(endDate)}
          </span>
          <ChevronDown size={16} />
        </div>
      </Button>
    </Popover>
  );
};

export default DateRangePicker;
