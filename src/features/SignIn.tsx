import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Card,
  Label,
  Spinner,
  TextInput
} from "flowbite-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useAuth } from "../hooks/useAuth";
import { IUser } from "../interfaces";

interface SignInFormInputs {
  email: string;
  password: string;
}

const SignIn: React.FC<{ handleSwap: () => void }> = ({ handleSwap }) => {
  const { t, } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Add Yup Schema
  const schema = yup.object({
    email: yup
      .string()
      .email(t("auth.login.invalidEmail"))
      .required(t("auth.login.emailRequired")),
    password: yup
      .string()
      .min(6, t("auth.login.passwordMinLength"))
      .required(t("auth.login.passwordRequired")),
  }).required();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignInFormInputs>({
    resolver: yupResolver(schema)
  });


  const onSubmit = async (data: SignInFormInputs) => {
    setError("");
    setIsLoading(true);

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find((user: IUser) => user.email === data.email);

    if (foundUser) {
      // Check if password matches
      if (foundUser.password === data.password) {
        setTimeout(() => {
          login(foundUser);
          navigate("/dashboard");
        }, 1500);
      } else {
        setIsLoading(false);
        setError(t("auth.login.wrongPassword"));
      }
    } else {
      setIsLoading(false);
      setError(t("auth.login.userNotFound"));
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
            <div className="text-center mb-4 max-w-1000">
              <h2 className="text-2xl font-bold text-gray-900">
                {t("auth.login.title")}
              </h2>
              <p className="text-gray-600 mt-2">{t("auth.login.subtitle")}</p>
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
                <p className="text-red-500 text-xs mt-1 min-h-4">{errors.email?.message || ""}</p>
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
                <p className="text-red-500 text-xs mt-1 min-h-4">{errors.password?.message || ""}</p>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
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

            <div className="mt-4 text-center text-sm text-gray-600">
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
            </div>
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
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
