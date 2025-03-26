import { Button } from "flowbite-react";
import { ArrowLeft, Home } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getFirstPathByRole } from "../config/routes";
import { useAuth } from "../hooks/useAuth";

const NotFound: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const roleBasedFirstPath = getFirstPathByRole()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">{t("notFound.title")}</h1>
        <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-6">
          {t("notFound.heading")}
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {t("notFound.description")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            color="primary"
            onClick={() => navigate(user ? roleBasedFirstPath[user.role] || '/' : '/')}
            className="flex items-center"
          >
            <Home className="mr-2 h-5 w-5" />
            {t("notFound.goHome")}
          </Button>
          <Button
            color="light"
            onClick={() => navigate(-1)}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            {t("notFound.goBack")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
