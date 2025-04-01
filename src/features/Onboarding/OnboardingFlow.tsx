import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Progress } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { AdMobIcon, GoogleAdsIcon } from "../../components/Icons";
import { API_CONFIG } from "../../shared/constants";

interface Platform {
  id: "admob" | "googleads";
  name: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
}

const OnboardingFlow: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: "admob",
      name: "AdMob",
      description: t("onboarding.admobDescription"),
      icon: <AdMobIcon className="w-12 h-12" />,
      connected: false,
    },
    {
      id: "googleads",
      name: "Google Ads",
      description: t("onboarding.googleAdsDescription"),
      icon: <GoogleAdsIcon className="w-12 h-12" />,
      connected: false,
    },
  ]);

  const handlePlatformConnect = async (platformId: "admob" | "googleads") => {
    try {
      const response = await fetch(
        `${API_CONFIG.path.oauth[platformId].authorize}`
      );
      const { authUrl } = await response.json();
      window.location.href = authUrl;
    } catch (error) {
      console.error(`Error initiating ${platformId} OAuth:`, error);
    }
  };

  const handleOAuthCallback = async (
    platformId: "admob" | "googleads",
    code: string
  ) => {
    try {
      await fetch(`${API_CONFIG.path.oauth}/${platformId}/callback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      setPlatforms((prev) =>
        prev.map((platform) =>
          platform.id === platformId
            ? { ...platform, connected: true }
            : platform
        )
      );

      if (platforms.every((p) => p.connected)) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(`Error handling ${platformId} OAuth callback:`, error);
    }
  };

  const renderPlatformSelection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">
        {t("onboarding.connectPlatforms")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platforms.map((platform) => (
          <Card key={platform.id} className="hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center space-y-4">
              {platform.icon}
              <h3 className="text-xl font-semibold">{platform.name}</h3>
              <p className="text-gray-600">{platform.description}</p>
              <Button
                color={platform.connected ? "success" : "indigo"}
                disabled={platform.connected}
                onClick={() => handlePlatformConnect(platform.id)}
              >
                {platform.connected
                  ? t("onboarding.connected")
                  : t("onboarding.connect")}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Progress
            progress={Math.round(
              (platforms.filter((p) => p.connected).length / platforms.length) *
                100
            )}
            color="indigo"
            size="lg"
          />
        </div>
        {renderPlatformSelection()}
      </div>
    </div>
  );
};

export default OnboardingFlow;
