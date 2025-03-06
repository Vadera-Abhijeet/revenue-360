import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, Card, Button, Badge } from "flowbite-react";
import { User, RefreshCw, UserPlus, Trash2 } from "lucide-react";
import { fetchUserSettings } from "../services/api";
import { ISettings, ITeamEntity } from "../interfaces";

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-indigo-700">
        {t("configurations.title")}
      </h1>

      <Tabs aria-label="Settings tabs" style="pills">
        <Tabs.Item
          active
          title={t("configurations.integrations.title")}
          icon={RefreshCw}
        >
          <Card>
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">
              {t("configurations.integrations.title")}
            </h2>
            <div className="space-y-6">
              {Object.entries(settings?.integrations || []).map(
                ([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-4">
                        {key === "googleAds" && (
                          <img
                            src="https://www.gstatic.com/images/branding/product/2x/ads_48dp.png"
                            alt="Google Ads"
                            className="w-8 h-8"
                          />
                        )}
                        {key === "adMob" && (
                          <img
                            src="https://cdn.worldvectorlogo.com/logos/google-admob.svg"
                            alt="AdMob"
                            className="w-8 h-8"
                          />
                        )}
                        {key === "facebook" && (
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png"
                            alt="AdMob"
                            className="w-8 h-8"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {t(`configurations.integrations.${key}`)}
                        </p>
                        <Badge color={value ? "success" : "failure"}>
                          {value
                            ? t("configurations.integrations.connected")
                            : t("configurations.integrations.notConnected")}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      color={value ? "failure" : "primary"}
                      size="xs"
                      className="w-[100px]"
                    >
                      {value
                        ? t("configurations.integrations.disconnect")
                        : t("configurations.integrations.connect")}
                    </Button>
                  </div>
                )
              )}
            </div>
          </Card>
        </Tabs.Item>

        <Tabs.Item title={t("configurations.team.title")} icon={User}>
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-indigo-700">
                {t("configurations.team.title")}
              </h2>
              <Button size="sm" color="indigo">
                <UserPlus className="mr-2 h-4 w-4" />
                {t("configurations.team.invite")}
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      {t("configurations.team.name")}
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {t("configurations.team.email")}
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {t("configurations.team.role")}
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {t("configurations.team.status")}
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {t("configurations.team.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(settings?.team || []).map((member: ITeamEntity) => (
                    <tr key={member.id} className="bg-white border-b">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {member.name}
                      </td>
                      <td className="px-6 py-4">{member.email}</td>
                      <td className="px-6 py-4">{member.role}</td>
                      <td className="px-6 py-4">
                        <Badge
                          color={
                            member.status === "active" ? "success" : "warning"
                          }
                          className="w-max capitalize"
                        >
                          {member.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Button size="xs" color="light">
                            {t("common.edit")}
                          </Button>
                          {member.id !== "user1" && (
                            <Button size="xs" color="failure">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Tabs.Item>
      </Tabs>
    </div>
  );
};

export default Configurations;
