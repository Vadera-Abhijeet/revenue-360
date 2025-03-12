import React, { useState } from "react";
import { Modal, Button, Label, TextInput, Select } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { ChartConfig, ChartType } from "../../../interfaces";

interface ChartConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: ChartConfig) => void;
  availableAxes: { value: string; label: string }[];
}

const ChartConfigModal: React.FC<ChartConfigModalProps> = ({
  isOpen,
  onClose,
  onSave,
  availableAxes,
}) => {
  const { t } = useTranslation();
  const [config, setConfig] = useState<ChartConfig>({
    id: crypto.randomUUID(),
    name: "",
    type: "line",
    xAxis: "",
    yAxis: [],
    groupId: "",
    order: 0,
  });

  const chartTypes: { value: ChartType; label: string }[] = [
    { value: "line", label: t("charts.types.line") },
    { value: "bar", label: t("charts.types.bar") },
    { value: "pie", label: t("charts.types.pie") },
    { value: "area", label: t("charts.types.area") },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(config);
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={onClose}>
      <Modal.Header>
        {t("charts.createChart")}
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <div className="mb-2 block">
              <Label htmlFor="yAxis" value={t("charts.yAxis")} />
            </div>
            <Select
              id="yAxis"
              multiple
              value={config.yAxis}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  yAxis: Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  ),
                }))
              }
              required
            >
              {availableAxes.map((axis) => (
                <option key={axis.value} value={axis.value}>
                  {axis.label}
                </option>
              ))}
            </Select>
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