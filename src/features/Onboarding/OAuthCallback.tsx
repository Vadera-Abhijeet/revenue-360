import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, Spinner, Button } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { API_CONFIG } from "../../shared/constants";

const OAuthCallback: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const platform = searchParams.get("platform") as
        | "admob"
        | "googleads"
        | null;
      const error = searchParams.get("error");

      if (error) {
        setError(t("onboarding.oauthError"));
        return;
      }

      if (!code || !platform) {
        setError(t("onboarding.invalidCallback"));
        return;
      }

      try {
        const response = await fetch(
          `${API_CONFIG.path.oauth[platform].callback}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to process OAuth callback");
        }

        // Redirect back to onboarding flow
        navigate("/onboarding");
      } catch (error) {
        console.error("Error processing OAuth callback:", error);
        setError(t("onboarding.callbackError"));
      }
    };

    handleCallback();
  }, [searchParams, navigate, t]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        {error ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              {t("onboarding.error")}
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button color="indigo" onClick={() => navigate("/onboarding")}>
              {t("onboarding.backToOnboarding")}
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Spinner size="xl" className="mb-4" />
            <h2 className="text-2xl font-bold mb-4">
              {t("onboarding.processing")}
            </h2>
            <p className="text-gray-600">{t("onboarding.pleaseWait")}</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default OAuthCallback;
