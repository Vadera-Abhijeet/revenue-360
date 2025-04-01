import React, { useState } from "react";
import { Button, Card, Label, Spinner, TextInput } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { httpService } from "../../../services/httpService";
import { API_CONFIG } from "../../../shared/constants";
import { toast } from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const ResetPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const uidb64 = searchParams.get("uidb64");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: {
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!newPassword) {
      newErrors.newPassword = t("auth.newPasswordRequired");
    } else if (newPassword.length < 8) {
      newErrors.newPassword = t("auth.passwordMinLength");
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t("auth.confirmPasswordRequired");
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = t("auth.passwordsDoNotMatch");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error(t("auth.invalidResetToken"));
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const data: { message: string } = await httpService.post(
        `${API_CONFIG.path.resetPassword}/${uidb64}/${token}`,
        {
          newPassword: newPassword,
          newConfirmPassword: confirmPassword,
        }
      );

      toast.success(data?.message || "");
      navigate("/auth");
    } catch (error) {
      console.log(" handleSubmit error:", error);
      toast.error(t("auth.passwordResetError"));
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !uidb64) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              {t("auth.invalidResetToken")}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t("auth.resetTokenExpired")}
            </p>
          </div>
          <div className="mt-6">
            <Button
              as={Link}
              to="/forgot-password"
              color="indigo"
              className="w-full"
            >
              {t("auth.requestNewResetLink")}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {t("auth.resetPassword")}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t("auth.resetPasswordDescription")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <Label htmlFor="newPassword" value={t("auth.newPassword")} />
            <TextInput
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setErrors((prev) => ({ ...prev, newPassword: undefined }));
              }}
              color={errors.newPassword ? "failure" : undefined}
              helperText={errors.newPassword}
            />
          </div>

          <div>
            <Label
              htmlFor="confirmPassword"
              value={t("auth.confirmPassword")}
            />
            <TextInput
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              color={errors.confirmPassword ? "failure" : undefined}
              helperText={errors.confirmPassword}
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
              {isLoading ? t("common.processing") : t("auth.resetPassword")}
            </div>
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Link
            to="/login"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            {t("auth.backToLogin")}
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
