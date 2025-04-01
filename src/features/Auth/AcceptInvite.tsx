import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Label, TextInput, Card } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { httpService } from "../../services/httpService";
import { API_CONFIG } from "../../shared/constants";
import Loading from "../../components/Loading";

interface InviteData {
  email: string;
  isDeveloper: boolean;
  token: string;
}

interface ApiResponse {
  data: InviteData;
}

const AcceptInvite: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [inviteData, setInviteData] = useState<InviteData | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      validateInviteToken(token);
    } else {
      setIsLoading(false);
    }
  }, [searchParams]);

  const validateInviteToken = async (token: string) => {
    try {
      const response = await httpService.get<ApiResponse>(
        `${API_CONFIG.path.validateInvite}/${token}`
      );
      setInviteData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error validating invite:", error);
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.firstName) {
      newErrors.firstName = t("auth.firstNameRequired");
    }

    if (!formData.lastName) {
      newErrors.lastName = t("auth.lastNameRequired");
    }

    if (!formData.password) {
      newErrors.password = t("auth.passwordRequired");
    } else if (formData.password.length < 8) {
      newErrors.password = t("auth.passwordMinLength");
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("auth.passwordsDoNotMatch");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !inviteData) return;

    try {
      await httpService.post(API_CONFIG.path.acceptInvite, {
        token: inviteData.token,
        ...formData,
      });

      if (inviteData.isDeveloper) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error accepting invite:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading className="h-72" />
      </div>
    );
  }

  if (!inviteData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-4">
            {t("auth.invalidInvite")}
          </h2>
          <p className="text-center text-gray-600">
            {t("auth.inviteExpiredOrInvalid")}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          {t("auth.completeProfile")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="firstName" value={t("auth.firstName")} />
            <TextInput
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              color={errors.firstName ? "failure" : undefined}
              helperText={errors.firstName}
            />
          </div>

          <div>
            <Label htmlFor="lastName" value={t("auth.lastName")} />
            <TextInput
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              color={errors.lastName ? "failure" : undefined}
              helperText={errors.lastName}
            />
          </div>

          <div>
            <Label htmlFor="password" value={t("auth.password")} />
            <TextInput
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              color={errors.password ? "failure" : undefined}
              helperText={errors.password}
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
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              color={errors.confirmPassword ? "failure" : undefined}
              helperText={errors.confirmPassword}
            />
          </div>

          <Button type="submit" color="indigo" className="w-full">
            {t("auth.completeProfile")}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AcceptInvite;
