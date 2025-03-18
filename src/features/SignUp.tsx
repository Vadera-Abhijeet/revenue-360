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
import { Check, Camera } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_AVATAR } from "../shared/constants";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface ILanguageOption {
  code: string;
  name: string;
  flag: string;
}

interface SignUpFormData {
  username: string;
  email: string;
  company?: string;
  password: string;
  confirmPassword: string;
}

const LANGUAGES: ILanguageOption[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
];

const SignUp: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<ILanguageOption>(
    LANGUAGES[0]
  );
  const [profilePic, setProfilePic] = useState<string>(DEFAULT_AVATAR);

  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .required(t("auth.signup.errors.usernameRequired"))
      .min(3, t("auth.signup.errors.usernameMin")),
    email: yup
      .string()
      .required(t("auth.signup.errors.emailRequired"))
      .email(t("auth.signup.errors.emailInvalid")),
    company: yup.string(),
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
  } = useForm<SignUpFormData>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
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

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      const mockUser = {
        id: uuidv4(),
        name: data.username,
        email: data.email,
        password: data.password,
        photoURL: profilePic,
        company: data.company,
      };
      await signup(mockUser);
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Language switcher function
  const changeLanguage = (lng: ILanguageOption) => {
    i18n.changeLanguage(lng.code);
    setSelectedLanguage(lng);
  };

  // Profile picture handling
  const handleProfilePicChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
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
                <Dropdown.Item key={lang.code} onClick={() => changeLanguage(lang)}>
                  <div className="flex items-center gap-2 justify-center w-full">
                    <p>{lang.flag}</p>
                    <p>{lang.name}</p>
                  </div>
                </Dropdown.Item>
              ))}
            </Dropdown>
          </div>

          {/* Signup Card */}
          <Card
            className="w-full max-w-xl min-h-[500px] flex flex-col items-center justify-center"
            theme={{
              root: {
                children: "flex h-full flex-col justify-between gap-4 p-12",
              },
            }}
          >
            <div className="text-center max-w-1000">
              <h2 className="text-2xl font-bold text-gray-900">
                {t("auth.signup.title")}
              </h2>
              <p className="text-gray-600 ">{t("auth.signup.subtitle")}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-2">
              {/* Profile Picture Upload */}
              <div className="flex justify-center">
                <label
                  htmlFor="profilePicInput"
                  className="relative cursor-pointer group"
                >
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-gray-300 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <input
                    id="profilePicInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePicChange}
                  />
                </label>
              </div>

              <div>
                <Label htmlFor="username" value={t("auth.signup.username")} />
                <TextInput
                  id="username"
                  type="text"
                  color={errors.username ? "failure" : "indigo"}
                  placeholder={t("auth.signup.usernamePlaceholder")}
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" value={t("auth.signup.email")} />
                <TextInput
                  id="email"
                  type="email"
                  color={errors.email ? "failure" : "indigo"}
                  placeholder={t("auth.signup.emailPlaceholder")}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="company" value={t("auth.signup.company")} />
                <TextInput
                  id="company"
                  type="text"
                  color={errors.company ? "failure" : "indigo"}
                  placeholder={t("auth.signup.companyPlaceholder")}
                  {...register("company")}
                />
                {errors.company && (
                  <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password" value={t("auth.signup.password")} />
                <TextInput
                  id="password"
                  type="password"
                  color={errors.password ? "failure" : "indigo"}
                  placeholder={t("auth.signup.passwordPlaceholder")}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword" value={t("auth.signup.confirmPassword")} />
                <TextInput
                  id="confirmPassword"
                  type="password"
                  color={errors.confirmPassword ? "failure" : "indigo"}
                  placeholder={t("auth.signup.confirmPasswordPlaceholder")}
                  rightIcon={(watch("password") && watch("password") === watch("confirmPassword")) ? Check : undefined}
                  {...register("confirmPassword")}
                  theme={{
                    field: {
                      rightIcon: {
                        svg: "h-5 w-5 text-green-500 dark:text-green-400",
                      },
                    },
                  }}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

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
                  onClick={() => navigate("/sign-in")}
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
