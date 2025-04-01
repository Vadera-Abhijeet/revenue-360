import React, { useState } from "react";
import { Button, Card, Label, Spinner, TextInput } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { httpService } from "../../../services/httpService";
import { API_CONFIG } from "../../../shared/constants";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export interface IForgotPasswordResponse {
  message: string;
  uidb64: string;
  token: string;
  reset_url: string;
}

const ForgotPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError(t("auth.login.emailRequired"));
      return;
    }

    if (!validateEmail(email)) {
      setError(t("auth.invalidEmail"));
      return;
    }

    setIsLoading(true);
    try {
      const data: IForgotPasswordResponse = await httpService.post(
        API_CONFIG.path.forgotPassword,
        {
          email,
        }
      );
      if (data) {
        navigate(`/reset-password?uidb64=${data.uidb64}&token=${data.token}`);
      }
      setIsSubmitted(true);
    } catch (error) {
      console.log(" handleSubmit error:", error);
      toast.error(t("auth.forgotPasswordError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {t("auth.forgotPassword")}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSubmitted
              ? t("auth.resetPasswordEmailSent")
              : t("auth.forgotPasswordDescription")}
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <Label htmlFor="email" value={t("common.email")} />
              <TextInput
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(undefined);
                }}
                placeholder="name@company.com"
                color={error ? "failure" : undefined}
                helperText={error}
              />
            </div>

            <Button
              type="submit"
              color="indigo"
              className="w-full"
              disabled={isLoading}
            >
              <div className="flex items-center gap-2">
                {isLoading && <Spinner color={"purple"} size={"sm"} />}
                {isLoading
                  ? t("common.processing")
                  : t("auth.sendResetPasswordLink")}
              </div>
            </Button>
          </form>
        ) : (
          <div className="mt-6">
            <Button as={Link} to="/auth" color="light" className="w-full">
              {t("auth.backToLogin")}
            </Button>
          </div>
        )}

        {!isSubmitted && (
          <div className="mt-4 text-center">
            <Link
              to="/auth"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              {t("auth.rememberPassword")}
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
