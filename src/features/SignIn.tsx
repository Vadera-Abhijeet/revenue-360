import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import brandLogo from "../assets/images/Logo.png";
import { useAuth } from "../hooks/useAuth";
import { ILoginPayload } from "../contexts/AuthContext";

const SignIn: React.FC<{ handleSwap: () => void }> = ({ handleSwap }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Add Yup Schema
  const schema = yup
    .object({
      email: yup
        .string()
        .email(t("auth.login.invalidEmail"))
        .required(t("auth.login.emailRequired")),
      password: yup
        .string()
        .min(6, t("auth.login.passwordMinLength"))
        .required(t("auth.login.passwordRequired")),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginPayload>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ILoginPayload) => {
    try {
      setIsLoading(true);
      login(data)
        .then(() => {
          setIsLoading(false);
          toast.success(t("auth.login.success"));
        })
        .catch((err) => {
          setIsLoading(false);
          toast.error(err.message);
        });
    } catch (error) {
      setIsLoading(false);
      console.error("Login error:", error);
      toast.error(t("auth.login.error"));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex">
        <div className="w-full  flex flex-col items-center justify-center p-4 md:p-8 bg-gray-50 relative">
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
            <div className="text-center  max-w-1000">
              {/* <h2 className="text-2xl font-bold text-gray-900">
                {t("auth.login.title")}
              </h2> */}
              <p className="text-gray-600 ">{t("auth.login.subtitle")}</p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full "
              name="login"
              autoComplete="on"
            >
              <div>
                <Label htmlFor="email" value={t("auth.login.email")} />
                <TextInput
                  color={errors.email ? "failure" : "indigo"}
                  id="email"
                  type="email"
                  autoComplete="username"
                  placeholder={t("auth.login.emailPlaceholder")}
                  {...register("email")}
                />
                <p className="text-red-500 text-xs mt-1 min-h-4">
                  {errors.email?.message || ""}
                </p>
              </div>
              <div>
                <Label htmlFor="password" value={t("auth.login.password")} />
                <TextInput
                  id="password"
                  color={errors.password ? "failure" : "indigo"}
                  type="password"
                  autoComplete="current-password"
                  placeholder={t("auth.login.passwordPlaceholder")}
                  {...register("password")}
                />
                <p className="text-red-500 text-xs mt-1 min-h-4">
                  {errors.password?.message || ""}
                </p>
              </div>
              {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
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
                      ? t("auth.login.loggingIn")
                      : t("auth.login.loginButton")}
                  </p>
                </div>
              </Button>
            </form>

            {/* <div className="mt-4 text-center text-sm text-gray-600">
              <p>
                {t("auth.login.terms")}{" "}
                <a href="#" className="text-primary-600 hover:underline">
                  {t("auth.login.termsOfService")}
                </a>{" "}
                {t("auth.login.and")}{" "}
                <a href="#" className="text-primary-600 hover:underline">
                  {t("auth.login.privacyPolicy")}
                </a>
              </p>
            </div> */}
            <div className="text-center text-sm text-gray-600">
              <p>
                {t("auth.login.createNewAccountTitle")}{" "}
                <span
                  onClick={handleSwap}
                  className="text-primary-600 hover:underline cursor-pointer"
                >
                  {t("auth.login.createNewAccountSubtitle")}
                </span>
              </p>
            </div>
            <div className="text-center text-sm text-gray-600">
              <p>
                {t("auth.login.forgotPasswordTitle")}{" "}
                <span
                  onClick={() => navigate("/forgot-password")}
                  className="text-primary-600 hover:underline cursor-pointer"
                >
                  {t("auth.login.forgotPasswordSubtitle")}
                </span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
