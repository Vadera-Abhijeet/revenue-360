import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Tabs } from "flowbite-react";
import { User, RefreshCw } from "lucide-react";
import { ISettings } from "../../../../interfaces";
import { fetchUserSettings } from "../../../../services/api";
import Integration, { TDirection } from "../components/Integration";
import TeamManagement from "../../TeamManagement/TeamManagement";

const Configurations: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<ISettings | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const data = await fetchUserSettings();
        setSettings(data);
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleUpdateIntegration = (
    index: number,
    direction: "inward" | "outward" | null,
    newEmail: string
  ) => {
    if (settings?.integrations && direction !== null) {
      const updatedIntegrations = [...settings.integrations];
      const selectedSet = updatedIntegrations[index][direction];
      updatedIntegrations[index] = {
        ...updatedIntegrations[index],
        [direction]: {
          ...selectedSet,
          accountEmail: newEmail,
        },
      };
      setSettings({ ...settings, integrations: updatedIntegrations });
    }
  };

  const handleToggleIntegrationConnection = (
    index: number,
    direction: TDirection
  ) => {
    if (settings?.integrations && direction !== null) {
      const updatedIntegrations = [...settings.integrations];
      const selectedSet = updatedIntegrations[index][direction];
      updatedIntegrations[index] = {
        ...updatedIntegrations[index],
        [direction]: {
          ...selectedSet,
          connected: !selectedSet.connected,
        },
      };
      setSettings({ ...settings, integrations: updatedIntegrations });
    }
  };

  const handleDeleteIntegration = (selectedIndex: number) => {
    if (selectedIndex > -1 && settings?.integrations) {
      const clonedIntegrations = [...settings.integrations];
      setSettings({
        ...settings,
        integrations: clonedIntegrations.filter(
          (dt, index) => index !== selectedIndex
        ),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 min-h-[42px]">
        <h1 className="text-2xl font-bold text-gray-700">
          {t("configurations.title")}
        </h1>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <Tabs aria-label="Settings tabs" style="pills">
          <Tabs.Item
            active
            title={t("configurations.integrations.title")}
            icon={RefreshCw}
          >
            <Integration
              integrations={settings?.integrations}
              onUpdateIntegration={handleUpdateIntegration}
              onToggleConnection={handleToggleIntegrationConnection}
              onDeleteIntegration={handleDeleteIntegration}
              onAddNewIntegrations={(payload) => {
                setSettings(
                  (prevState) =>
                    ({
                      ...prevState,
                      integrations: [
                        payload,
                        ...(prevState?.integrations || []),
                      ],
                    } as ISettings)
                );
              }}
            />
          </Tabs.Item>

          <Tabs.Item title={t("configurations.team.title")} icon={User}>
            <TeamManagement team={settings?.team} />
          </Tabs.Item>
        </Tabs>
      )}
    </div>
  );
};

export default Configurations;
