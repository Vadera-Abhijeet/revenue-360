import React, { useState } from "react";
import { TextInput, Button, Checkbox, Label } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { IIntegrations } from "../../../../interfaces";
import AnimatedModal from "../../../../components/AnimatedModal";

interface InviteTeamMemberModalProps {
  open: boolean;
  onClose: () => void;
  onInvite: (email: string, permissions: string[]) => void;
  integrations: IIntegrations[];
}

const InviteTeamMemberModal: React.FC<InviteTeamMemberModalProps> = ({
  open,
  onClose,
  onInvite,
  integrations,
}) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<{
    [key: string]: { [key: string]: boolean };
  }>({});

  const handlePermissionChange = (
    integrationIndex: number,
    direction: "inward" | "outward",
    checked: boolean
  ) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [integrationIndex]: {
        ...prev[integrationIndex],
        [`${direction}_${integrationIndex}`]: checked,
      },
    }));
  };

  const handleSubmit = () => {
    const permissions: string[] = [];
    Object.entries(selectedPermissions).forEach(([integrationIndex, perms]) => {
      Object.entries(perms).forEach(([key, value]) => {
        if (value) {
          const [direction, index] = key.split("_");
          const integration = integrations[parseInt(index)];
          const account =
            direction === "inward" ? integration.inward : integration.outward;
          permissions.push(`${account.platform}_${account.accountId}`);
        }
      });
    });
    onInvite(email, permissions);
    onClose();
  };

  const modalFooter = (
    <div className="flex justify-end gap-3">
      <Button color="light" onClick={onClose}>
        {t("common.cancel")}
      </Button>
      <Button color="primary" onClick={handleSubmit} disabled={!email}>
        {t("configurations.team.invite")}
      </Button>
    </div>
  );

  return (
    <AnimatedModal
      show={open}
      onClose={onClose}
      title={t("configurations.team.invite")}
      size="xl"
      footer={modalFooter}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="email" value={t("configurations.team.email")} />
          <TextInput
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="team.member@example.com"
            required
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            {t("configurations.team.permissions")}
          </h3>
          {integrations.map((integration, index) => (
            <div key={index} className="space-y-2 border rounded-lg p-4">
              <h4 className="font-medium text-gray-700">
                {t(
                  `configurations.integrations.${integration.inward.platform}`
                )}
              </h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox
                    id={`inward_${index}`}
                    checked={
                      selectedPermissions[index]?.[`inward_${index}`] || false
                    }
                    onChange={(e) =>
                      handlePermissionChange(index, "inward", e.target.checked)
                    }
                  />
                  <Label htmlFor={`inward_${index}`} className="ml-2">
                    {t("configurations.integrations.inward")} -{" "}
                    {integration.inward.accountEmail}
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id={`outward_${index}`}
                    checked={
                      selectedPermissions[index]?.[`outward_${index}`] || false
                    }
                    onChange={(e) =>
                      handlePermissionChange(index, "outward", e.target.checked)
                    }
                  />
                  <Label htmlFor={`outward_${index}`} className="ml-2">
                    {t("configurations.integrations.outward")} -{" "}
                    {integration.outward.accountEmail}
                  </Label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedModal>
  );
};

export default InviteTeamMemberModal;
