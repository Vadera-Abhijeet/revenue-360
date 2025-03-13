import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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

const Auth: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<ILanguageOption>(
    LANGUAGES[0]
  );

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

  const handleLogin = () => {
    setError("");
    // if (username === "admin" && password === "admin") {}
    if (!!username && !!password) {
      const mockUser = {
        id: "user123",
        name: "Demo User",
        email: "demo@example.com",
        photoURL: "https://randomuser.me/api/portraits/men/32.jpg",
      };
      setIsLoading(true);
      setTimeout(() => {
        login(mockUser);
        navigate("/dashboard");
      }, 1500);
    } else {
      setError(t("auth.login.error"));
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
              className={`absolute inset-0 transition-opacity duration-1000 flex flex-col justify-center items-center text-white p-12 ${
                currentFrame === index ? "opacity-100" : "opacity-0"
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

          {/* Login Card */}
          <Card className="w-full max-w-xl min-h-[500px] flex flex-col items-center justify-center">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {t("auth.login.title")}
              </h2>
              <p className="text-gray-600 mt-2">{t("auth.login.subtitle")}</p>
            </div>

            <div className="w-full space-y-4">
              <div>
                <Label htmlFor="username" value={t("auth.login.username")} />
                <TextInput
                  color="indigo"
                  id="username"
                  type="text"
                  placeholder={t("auth.login.usernamePlaceholder")}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" value={t("auth.login.password")} />
                <TextInput
                  id="password"
                  color="indigo"
                  type="password"
                  placeholder={t("auth.login.passwordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button
                color="indigo"
                className="w-full"
                onClick={handleLogin}
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
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
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
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
