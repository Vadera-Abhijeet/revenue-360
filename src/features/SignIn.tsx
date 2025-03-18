import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  Card,
  TextInput,
  Label,
  Spinner,
  Dropdown,
} from "flowbite-react";
import {
  IllustrationAnalyticsTeam,
  IllustrationDataChart,
} from "../assets/Illustrations";
import { useAuth } from "../hooks/useAuth";
import { IUser } from "../interfaces";

interface ILanguageOption {
  code: string;
  name: string;
  flag: string;
}

const LANGUAGES: ILanguageOption[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
];

interface SignInFormInputs {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [error, setError] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<ILanguageOption>(LANGUAGES[0]);

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

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

  // Language switcher function
  const changeLanguage = (lng: ILanguageOption) => {
    i18n.changeLanguage(lng.code);
    setSelectedLanguage(lng);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex">
        {/* Left side illustration */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-purple-100">
          {[
            {
              title: t("auth.features.trackPerformance.title"),
              description: t("auth.features.trackPerformance.description"),
              image: <IllustrationAnalyticsTeam scale={5} />,
            },
            {
              title: t("auth.features.optimizeAds.title"),
              description: t("auth.features.optimizeAds.description"),
              image: <IllustrationDataChart scale={5} />,
            },
            {
              title: t("auth.features.growRevenue.title"),
              description: t("auth.features.growRevenue.description"),
              image: <IllustrationAnalyticsTeam scale={5} />,
            },
          ].map((frame, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 flex flex-col justify-center items-center text-white p-12 ${currentFrame === index ? "opacity-100" : "opacity-0"
                }`}
            >
              {frame.image}
              <h2 className="text-4xl font-bold mt-8 mb-4 text-center text-gray-900 dark:text-white">
                {frame.title}
              </h2>
              <p className="text-xl text-center max-w-md text-gray-700 dark:text-gray-300">
                {frame.description}
              </p>
            </div>
          ))}
        </div>

        {/* Right side - Login & Language Switcher */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 md:p-8 bg-gray-50 relative">
          {/* Language Switcher - Top Right */}
          <div className="absolute top-4 right-4">
            <Dropdown
              label={
                <div className="flex items-center gap-2">
                  <p>{selectedLanguage?.flag}</p>
                  <div>|</div>
                  {t("common.language")}
                </div>
              }
              color={"indigo"}
              outline
              size={"xs"}
            >
              {LANGUAGES.map((lang) => (
                <Dropdown.Item onClick={() => changeLanguage(lang)}>
                  <div className="flex items-center gap-2 justify-center w-full">
                    <p>{lang.flag}</p>
                    <p>{lang.name}</p>
                  </div>
                </Dropdown.Item>
              ))}
            </Dropdown>
          </div>

          {/* Signin Card */}
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
              className="w-full space-y-4"
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
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
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
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button
                type="submit"
                color="indigo"
                className="w-full"
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
                  onClick={() => navigate("/sign-up")}
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
