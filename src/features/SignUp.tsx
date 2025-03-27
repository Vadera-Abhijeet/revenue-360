import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, Label, Spinner, TextInput } from "flowbite-react";
import { Check } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import brandLogo from "../assets/images/Logo.png";
import { ISignUpPayload } from "../contexts/AuthContext";
import { useAuth } from "../hooks/useAuth";
import { IMerchant } from "../interfaces";

const SignUp: React.FC<{ handleSwap: () => void }> = ({ handleSwap }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoading, signup } = useAuth();

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .required(t("auth.signup.errors.emailRequired"))
      .email(t("auth.signup.errors.emailInvalid")),
    password: yup
      .string()
      .required(t("auth.signup.errors.passwordRequired"))
      .min(8, t("auth.signup.errors.passwordMin"))
      .matches(/[A-Z]/, t("auth.signup.errors.passwordUppercase"))
      .matches(/[a-z]/, t("auth.signup.errors.passwordLowercase"))
      .matches(/[0-9]/, t("auth.signup.errors.passwordNumber"))
      .matches(/[^A-Za-z0-9]/, t("auth.signup.errors.passwordSpecial")),
    confirmPassword: yup
      .string()
      .required(t("auth.signup.errors.confirmPasswordRequired"))
      .oneOf([yup.ref("password")], t("auth.signup.errors.passwordMatch")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ISignUpPayload>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ISignUpPayload) => {
    try {
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const existingUser = users.find(
        (user: IMerchant) => user.email === data.email
      );

      if (existingUser) {
        toast.error(t("auth.signup.errors.emailExists"));
        return;
      }

      const mockUser = {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };

      toast.promise(signup(mockUser), {
        loading: t("auth.signup.signingUp"),
        success: t("auth.signup.success"),
        error: t("auth.signup.error"),
      });
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(t("auth.signup.error"));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex">
        <div className="w-full flex flex-col items-center justify-center p-4 md:p-8 bg-gray-50 relative">
          <Card
            className="w-full max-w-xl min-h-[500px] flex flex-col items-center justify-center"
            theme={{
              root: {
                children: "flex h-full flex-col justify-between gap-4 p-12",
              },
            }}
          >
            <div className="flex w-full justify-center items-center z-20">
              <img
                src={brandLogo}
                alt="Logo"
                className="w-1/2 object-contain cursor-pointer"
                onClick={() => navigate("/")}
              />
            </div>
            <div className="text-center max-w-1000">
              <p className="text-gray-600 ">{t("auth.signup.subtitle")}</p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full"
              name="signup"
              autoComplete="on"
            >
              <div>
                <Label htmlFor="email" value={t("auth.signup.email")} />
                <TextInput
                  id="email"
                  type="email"
                  autoComplete="email"
                  color={errors.email ? "failure" : "indigo"}
                  placeholder={t("auth.signup.emailPlaceholder")}
                  {...register("email")}
                />
                <p className="text-red-500 text-xs mt-1 min-h-4">
                  {errors.email?.message || ""}
                </p>
              </div>
              <div>
                <Label htmlFor="password" value={t("auth.signup.password")} />
                <TextInput
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  color={errors.password ? "failure" : "indigo"}
                  placeholder={t("auth.signup.passwordPlaceholder")}
                  {...register("password")}
                />
                <p className="text-red-500 text-xs mt-1 min-h-4">
                  {errors.password?.message || ""}
                </p>
              </div>

              <div>
                <Label
                  htmlFor="confirmPassword"
                  value={t("auth.signup.confirmPassword")}
                />
                <TextInput
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  color={errors.confirmPassword ? "failure" : "indigo"}
                  placeholder={t("auth.signup.confirmPasswordPlaceholder")}
                  rightIcon={
                    watch("password") &&
                    watch("password") === watch("confirmPassword")
                      ? Check
                      : undefined
                  }
                  {...register("confirmPassword")}
                  theme={{
                    field: {
                      rightIcon: {
                        svg: "h-5 w-5 text-green-500 dark:text-green-400",
                      },
                    },
                  }}
                />
                <p className="text-red-500 text-xs mt-1 min-h-4">
                  {errors.confirmPassword?.message || ""}
                </p>
              </div>

              <Button
                type="submit"
                color="indigo"
                className="w-full mt-2"
                disabled={isLoading}
              >
                <div className="flex items-center gap-2">
                  {isLoading && <Spinner color={"purple"} size={"sm"} />}
                  <p>
                    {isLoading
                      ? t("auth.signup.signingUp")
                      : t("auth.signup.signupButton")}
                  </p>
                </div>
              </Button>
            </form>

            <div className=" text-center text-sm text-gray-600">
              <p>
                {t("auth.signup.terms")}{" "}
                <a href="#" className="text-primary-600 hover:underline">
                  {t("auth.signup.termsOfService")}
                </a>{" "}
                {t("auth.signup.and")}{" "}
                <a href="#" className="text-primary-600 hover:underline">
                  {t("auth.signup.privacyPolicy")}
                </a>
              </p>
            </div>
            <div className="text-center text-sm text-gray-600">
              <p>
                {t("auth.signup.alreadyHaveAccountTitle")}{" "}
                <span
                  onClick={handleSwap}
                  className="text-primary-600 hover:underline cursor-pointer"
                >
                  {t("auth.signup.alreadyHaveAccountSubtitle")}
                </span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
