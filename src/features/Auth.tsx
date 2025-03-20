import { Dropdown } from "flowbite-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  IllustrationAnalyticsTeam,
  IllustrationDataChart,
} from "../assets/Illustrations";
import brandLogo from "../assets/images/Logo.png";
import { useAuth } from "../hooks/useAuth";
import { ILanguageOption } from "../interfaces";
import { LANGUAGES_OPTIONS } from "../shared/constants";
import SignIn from "./SignIn";
import SignUp from "./SignUp";



const Auth: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isSignUpMode = searchParams.get('mode') === 'signup';
  const { isAuthenticated } = useAuth();
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isSwapped, setIsSwapped] = useState(isSignUpMode);
  const [formMode, setFormMode] = useState<'signin' | 'signup'>(isSignUpMode ? 'signup' : 'signin');
  const [selectedLanguage, setSelectedLanguage] = useState<ILanguageOption>(
    LANGUAGES_OPTIONS[0]
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

  const handleSwap = () => {
    setIsSwapped(!isSwapped);
    setFormMode(prev => prev === 'signin' ? 'signup' : 'signin');
    navigate(`/auth${formMode === 'signin' ? '?mode=signup' : ''}`, { replace: true });
  };

  // Language switcher function
  const changeLanguage = (lng: ILanguageOption) => {
    i18n.changeLanguage(lng.code);
    setSelectedLanguage(lng);
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col"
    >
      <div className="flex-1 flex">
        {/* Left side illustration */}
        <motion.div
          className={`hidden lg:flex lg:w-1/2 relative overflow-hidden bg-purple-100 z-10 shadow-xl`}
          initial={{ x: isSignUpMode ? "100%" : 0, borderRadius: isSignUpMode ? "2rem 0 0 2rem" : "0 2rem 2rem 0" }}
          animate={{
            x: isSwapped ? "100%" : 0,
            borderRadius: isSwapped ? "2rem 0 0 2rem" : "0 2rem 2rem 0"
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="absolute top-10  flex w-full justify-center items-center z-20">
            <img src={brandLogo} alt="Logo" className="w-1/3 object-contain cursor-pointer" onClick={() => navigate("/")} />
          </div>
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
              className={`absolute  inset-0 transition-opacity duration-1000 flex flex-col justify-center items-center text-white p-12 ${currentFrame === index ? "opacity-100" : "opacity-0"
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
        </motion.div>

        {/* Right side - Login & Language Switcher */}
        <motion.div
          className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-gray-50 relative"
          initial={{ x: isSignUpMode ? "-100%" : 0, opacity: 1 }}
          animate={{ x: isSwapped ? "-100%" : 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >

          <AnimatePresence mode="wait">
            <motion.div
              key={formMode}
              initial={{ opacity: 0, width: "100%" }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Language Switcher - Top Right */}
              <div className={`absolute top-4 ${formMode === 'signup' ? "left-4" : "right-4"} z-10`}>
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
                  {LANGUAGES_OPTIONS.map((lang) => (
                    <Dropdown.Item key={lang.code} onClick={() => changeLanguage(lang)}>
                      <div className="flex items-center gap-2  w-full">
                        <p>{lang.flag}</p>
                        <div>|</div>
                        <p>{lang.name}</p>
                      </div>
                    </Dropdown.Item>
                  ))}
                </Dropdown>
              </div>
              {/* Sign-up and Sign-in forms */}
              {formMode === 'signup' ? (
                <SignUp handleSwap={handleSwap} />
              ) : (
                <SignIn handleSwap={handleSwap} />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Auth;
