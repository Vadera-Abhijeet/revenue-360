import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, Label, Spinner, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as yup from "yup";
import Loading from "../../../../components/Loading";
import { getFirstPathByRole } from "../../../../config/routes";
import { useAuth } from "../../../../hooks/useAuth";
import { ILoginResponse, Role } from "../../../../interfaces";
import { httpService } from "../../../../services/httpService";
import { API_CONFIG } from "../../../../shared/constants";

interface FormData {
  name: string;
  password: string;
  confirmPassword: string;
}

interface InviteData {
  uidb64: string;
  token: string;
}

const AcceptInvite: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [inviteData, setInviteData] = useState<InviteData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleBasedFirstPath = getFirstPathByRole();

  const schema = yup.object().shape({
    name: yup
      .string()
      .required(t("configurations.team.acceptInvite.nameRequired")),
    password: yup
      .string()
      .required(t("configurations.team.acceptInvite.passwordRequired"))
      .min(8, t("configurations.team.acceptInvite.passwordMinLength")),
    confirmPassword: yup
      .string()
      .required(t("configurations.team.acceptInvite.confirmPasswordRequired"))
      .oneOf(
        [yup.ref("password")],
        t("configurations.team.acceptInvite.passwordsDoNotMatch")
      ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver<FormData>(schema),
    mode: "onChange",
  });

  useEffect(() => {
    const uidb64 = searchParams.get("uidb64");
    const token = searchParams.get("token");

    if (!uidb64 || !token) {
      setError(t("auth.invalidInvite"));
      setIsLoading(false);
      return;
    }

    try {
      // Decode the uidb64 parameter
      setInviteData({ uidb64, token });
      setIsLoading(false);
    } catch (error) {
      console.error("Error decoding invite data:", error);
      setError(t("auth.invalidInvite"));
      setIsLoading(false);
    }
  }, [searchParams, t]);

  const onSubmit = async (data: FormData) => {
    try {
      const uidb64 = inviteData?.uidb64;
      const token = inviteData?.token;

      if (!uidb64 || !token) {
        setError(t("auth.invalidInvite"));
        return;
      }
      setIsSubmitting(true);
      httpService
        .post<ILoginResponse>(
          `${API_CONFIG.path.acceptInvite}/${uidb64}/${token}`,
          {
            name: data.name,
            password: data.password,
            confirmPassword: data.confirmPassword,
          }
        )
        .then((response) => {
          const { user, access, refresh } = response;

          // Store tokens and user data securely
          const userData = { ...user, role: "sub_admin" as Role };
          httpService.setTokens({ access, refresh });
          httpService.setUserData(userData);

          // Set user in state and navigate
          setUser(userData);
          setIsSubmitting(false);
          navigate(roleBasedFirstPath[userData.role] || "/dashboard");
        })
        .catch((error) => {
          setIsSubmitting(false);
          console.error(" error:", error);
          toast.error(error.message);
        });

      // Redirect to login page after successful acceptance
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(t("auth.acceptInviteError"));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading className="h-72" />
      </div>
    );
  }

  if (error || !inviteData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-4">
            {t("configurations.team.acceptInvite.invalidInvite")}
          </h2>
          <p className="text-center text-gray-600">
            {error ||
              t("configurations.team.acceptInvite.inviteExpiredOrInvalid")}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {t("configurations.team.acceptInvite.title")}
        </h2>
        <p className="text-center text-gray-600 mb-6">
          {t("configurations.team.acceptInvite.welcomeMessage")}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label
              htmlFor="name"
              value={t("configurations.team.acceptInvite.name")}
            />
            <TextInput
              id="name"
              type="text"
              {...register("name")}
              color={errors.name ? "failure" : undefined}
              helperText={errors.name?.message}
            />
          </div>

          <div>
            <Label
              htmlFor="password"
              value={t("configurations.team.acceptInvite.password")}
            />
            <TextInput
              id="password"
              type="password"
              {...register("password")}
              color={errors.password ? "failure" : undefined}
              helperText={errors.password?.message}
            />
          </div>

          <div>
            <Label
              htmlFor="confirmPassword"
              value={t("configurations.team.acceptInvite.confirmPassword")}
            />
            <TextInput
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              color={errors.confirmPassword ? "failure" : undefined}
              helperText={errors.confirmPassword?.message}
            />
          </div>

          <Button
            type="submit"
            color="indigo"
            className="w-full"
            disabled={isSubmitting}
          >
            <div className="flex items-center gap-2">
              {isSubmitting && <Spinner color={"purple"} size={"sm"} />}
              <p>
                {isSubmitting
                  ? t("configurations.team.acceptInvite.submitting")
                  : t("configurations.team.acceptInvite.submit")}
              </p>
            </div>
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AcceptInvite;
