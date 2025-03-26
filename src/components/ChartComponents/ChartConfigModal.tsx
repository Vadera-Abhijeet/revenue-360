import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Label,
  TextInput,
  Select,
  Checkbox,
} from "flowbite-react";
import { useTranslation } from "react-i18next";
import { ChartConfig, ChartType } from "../../interfaces";
import { TDataKeyTypes } from "../../features/Campaigns/interface";

const availableDataKeys = [
  { value: "revenueData", label: "Revenue Data" },
  { value: "userData", label: "User Data" },
  { value: "retentionData", label: "Retention Data" },
  { value: "countryData", label: "Country Data" },
  { value: "versionData", label: "Version Data" },
];

interface ChartConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: ChartConfig) => void;
  onEdit: (config: ChartConfig) => void;
  availableAxes: { value: string; label: string }[];
  initialConfig?: ChartConfig | null; // Optional: Used for updating an existing chart
}

const ChartConfigModal: React.FC<ChartConfigModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onEdit,
  availableAxes,
  initialConfig,
}) => {
  const { t } = useTranslation();

  // State to manage form data
  const [config, setConfig] = useState<ChartConfig>({
    id: crypto.randomUUID(), // Default to new ID for new charts
    name: "",
    type: "line",
    xAxis: "",
    yAxis: [],
    groupId: "",
    dataKey: "retentionData",
    order: 0,
  });

  // Populate state when editing an existing chart
  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    } else {
      setConfig({
        id: crypto.randomUUID(),
        name: "",
        type: "line",
        xAxis: "",
        yAxis: [],
        groupId: "",
        dataKey: "retentionData",
        order: 0,
      });
    }
  }, [initialConfig, isOpen]);

  const handleCheckboxChange = (value: string) => {
    setConfig((prev) => ({
      ...prev,
      yAxis: prev.yAxis.includes(value)
        ? prev.yAxis.filter((y) => y !== value)
        : [...prev.yAxis, value],
    }));
  };

  const chartTypes: { value: ChartType; label: string }[] = [
    { value: "line", label: t("charts.types.line") },
    { value: "bar", label: t("charts.types.bar") },
    { value: "pie", label: t("charts.types.pie") },
    { value: "area", label: t("charts.types.area") },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialConfig) {
      onEdit(config);
    } else {
      onSave(config); // Pass updated or new config to parent
    }
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={onClose} initialFocus={undefined}>
      <Modal.Header>
        {initialConfig ? t("charts.editChart") : t("charts.addChart")}
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Chart Name */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value={t("charts.chartName")} />
            </div>
            <TextInput
              id="name"
              value={config.name}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>

          {/* Data Key Dropdown */}
          <div>
            <Label htmlFor="dataKey" value="Data Key" />
            <Select
              id="dataKey"
              value={config.dataKey}
              onChange={(e) =>
                setConfig({
                  ...config,
                  dataKey: e.target.value as TDataKeyTypes,
                })
              }
              required
            >
              <option value="">Select a Data Key</option>
              {availableDataKeys.map((key) => (
                <option key={key.value} value={key.value}>
                  {key.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Chart Type */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="type" value={t("charts.chartType")} />
            </div>
            <Select
              id="type"
              value={config.type}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  type: e.target.value as ChartType,
                }))
              }
              required
            >
              {chartTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </div>

          {/* X-Axis Selection */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="xAxis" value={t("charts.xAxis")} />
            </div>
            <Select
              id="xAxis"
              value={config.xAxis}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, xAxis: e.target.value }))
              }
              required
            >
              <option value="">{t("common.select")}</option>
              {availableAxes.map((axis) => (
                <option key={axis.value} value={axis.value}>
                  {axis.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Y-Axis Selection (Multiple) */}
          <div className="space-y-3">
            <Label value={t("charts.yAxis")} />
            <div className="flex items-center gap-2 flex-wrap">
              {availableAxes.map((axis) => (
                <div key={axis.value} className="flex items-center gap-2">
                  <Checkbox
                    color={"indigo"}
                    id={axis.value}
                    checked={config.yAxis.includes(axis.value)}
                    onChange={() => handleCheckboxChange(axis.value)}
                  />
                  <Label htmlFor={axis.value}>{axis.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button color="light" onClick={onClose}>
          {t("common.cancel")}
        </Button>
        <Button color="indigo" onClick={handleSubmit}>
          {t("common.save")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChartConfigModal;
