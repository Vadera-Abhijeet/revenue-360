import { TFunction } from "i18next";
import { IIntegrationsSet } from "../../../../interfaces";
import { PLATFORM_ICON_MAP } from "../../../../shared/constants";
import { Badge, Dropdown } from "flowbite-react";
import { MoreHorizontal, Pencil, XCircle } from "lucide-react";
import { ArrowClockwise } from "@phosphor-icons/react";

const IntegrationBlock = ({
  integration,
  t,
  onEditEmail,
  onToggleConnection,
}: {
  integration: IIntegrationsSet;
  t: TFunction<"translation", undefined>;
  onEditEmail: (email: string) => void;
  onToggleConnection: () => void;
}) => {
  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={PLATFORM_ICON_MAP[integration.platform] || ""}
            alt={integration.platform}
            className="w-10 h-10"
          />
          <span className="font-semibold text-lg capitalize">
            {t(`configurations.integrations.${integration.platform}`)}
          </span>
          <Badge color={integration.connected ? "green" : "red"}>
            {integration.connected
              ? t("configurations.integrations.connected")
              : t("configurations.integrations.disconnected")}
          </Badge>
        </div>
        <Dropdown
          label={<MoreHorizontal size={18} />}
          inline
          arrowIcon={false}
          placement="left-start"
        >
          <Dropdown.Item
            icon={Pencil}
            onClick={() => onEditEmail(integration.accountEmail)}
          >
            {t("configurations.integrations.editEmail")}
          </Dropdown.Item>
          <Dropdown.Item
            icon={integration.connected ? XCircle : ArrowClockwise}
            className={
              integration.connected ? "text-red-600" : "text-green-600"
            }
            onClick={() => onToggleConnection()}
          >
            {integration.connected
              ? t("configurations.integrations.disconnect")
              : t("configurations.integrations.reconnect")}
          </Dropdown.Item>
        </Dropdown>
      </div>
      <div>
        <p className="text-gray-600 text-sm">
          {t("configurations.integrations.accountEmail")}
        </p>
        <p className="font-medium">{integration.accountEmail || "N/A"}</p>
      </div>
      <div>
        <p className="text-gray-600 text-sm">
          {t("configurations.integrations.accountId")}
        </p>
        <p className="font-medium">{integration.accountId || "N/A"}</p>
      </div>
    </div>
  );
};
export default IntegrationBlock;
