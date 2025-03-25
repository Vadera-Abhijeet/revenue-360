import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Tabs,
  Card,
  Button,
  TextInput,
  Select,
  Label,
  ToggleSwitch,
} from "flowbite-react";
import {
  User,
  Building,
  Mail,
  Clock,
  Globe,
  DollarSign,
  Moon,
  Sun,
  RefreshCw,
  Box,
  CheckCircle,
  XCircle,
  Camera,
} from "lucide-react";
import { fetchUserSettings, updateUserSettings } from "../services/api";
import { IAccount, IPreferences } from "../interfaces";
import { CurrencyCode, useCurrency } from "../contexts/CurrencyContext";
import RazorpayButton from "../components/RazorPayButton";
import { useAuth } from "../hooks/useAuth";
import { DEFAULT_AVATAR } from "../shared/constants";

const plans = [
  {
    name: "Free",
    priceDisplay: "₹0/mo",
    price: 0,
    features: ["Basic Features", "Limited Support"],
    unavailable: ["Advanced Analytics", "Priority Support"],
    buttonText: "Get Started",
    buttonVariant: "active",
  },
  {
    name: "Basic",
    priceDisplay: "₹9/mo",
    price: 9,
    features: ["All Free Features", "Advanced Analytics"],
    unavailable: ["Priority Support"],
    buttonText: "Subscribe",
    buttonVariant: "default",
  },
  {
    name: "Pro",
    priceDisplay: "₹19/mo",
    price: 19,
    features: ["All Basic Features", "Priority Support", "Customization"],
    unavailable: [],
    buttonText: "Go Pro",
    buttonVariant: "primary",
  },
];
const Settings: React.FC = () => {
  const { user, setUser } = useAuth();
  const { setCurrency, currency } = useCurrency();
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<{
    account: IAccount;
    preferences: IPreferences;
  }>({
    account: {
      name: "",
      email: "",
      company: "",
      role: "",
      timezone: "",
      photoURL: "",
    },
    preferences: {
      language: "",
      currency,
      theme: "",
      emailNotifications: false,
      pushNotifications: false,
      dataRefreshRate: "",
    },
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const data = await fetchUserSettings();
        setFormData({
          account: { ...data.account },
          preferences: { ...data.preferences },
        });
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleAccountChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      account: {
        ...prev.account,
        [name]: value,
      },
    }));
  };

  const handlePreferencesChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: value,
      },
    }));
  };

  const handleToggleChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: checked,
      },
    }));
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        language,
      },
    }));
  };

  const handleCurrencyChange = (currencyCode: CurrencyCode) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        currency: currencyCode,
      },
    }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await updateUserSettings({
        account: formData.account,
        preferences: formData.preferences,
      });
      setCurrency(formData.preferences.currency);

      if (
        user &&
        (formData.account.name !== user.name ||
          formData.account.email !== user.email ||
          formData.account.photoURL !== user.photoURL)
      ) {
        setUser({
          ...user,
          name: formData.account.name,
          email: formData.account.email,
          photoURL: formData.account.photoURL || DEFAULT_AVATAR,
        });
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          account: {
            ...prev.account,
            photoURL: reader.result as string,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs aria-label="Settings tabs" style="pills">
        <Tabs.Item active title={t("settings.account.title")} icon={User}>
          <Card>
            <h2 className="text-xl font-semibold ">
              {t("settings.account.title")}
            </h2>
            <div className="space-y-2">
              <div className="flex mb-6">
                <label
                  htmlFor="profilePicInput"
                  className="relative cursor-pointer group"
                >
                  <img
                    src={formData.account.photoURL || DEFAULT_AVATAR}
                    className="w-32 h-32 rounded-full border-4 border-gray-300 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <input
                    id="profilePicInput"
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value={t("settings.account.name")} />
                </div>
                <TextInput
                  id="name"
                  name="name"
                  icon={User}
                  value={formData.account.name}
                  onChange={handleAccountChange}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="email" value={t("settings.account.email")} />
                </div>
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  icon={Mail}
                  value={formData.account.email}
                  onChange={handleAccountChange}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="company"
                    value={t("settings.account.company")}
                  />
                </div>
                <TextInput
                  id="company"
                  name="company"
                  icon={Building}
                  value={formData.account.company}
                  onChange={handleAccountChange}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="role" value={t("settings.account.role")} />
                </div>
                <Select
                  id="role"
                  name="role"
                  icon={User}
                  value={formData.account.role}
                  onChange={handleAccountChange}
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </Select>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="timezone"
                    value={t("settings.account.timezone")}
                  />
                </div>
                <Select
                  id="timezone"
                  name="timezone"
                  icon={Clock}
                  value={formData.account.timezone}
                  onChange={handleAccountChange}
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">
                    Greenwich Mean Time (GMT)
                  </option>
                  <option value="Europe/Paris">
                    Central European Time (CET)
                  </option>
                  <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
                </Select>
              </div>
              <Button
                color="indigo"
                onClick={handleSaveChanges}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    {t("settings.account.saving")}
                  </>
                ) : (
                  t("settings.account.save")
                )}
              </Button>
            </div>
          </Card>
        </Tabs.Item>

        <Tabs.Item title={t("settings.preferences.title")} icon={Globe}>
          <Card>
            <h2 className="text-xl font-semibold mb-4">
              {t("settings.preferences.title")}
            </h2>
            <div className="space-y-6">
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="language"
                    value={t("settings.preferences.language")}
                  />
                </div>
                <Select
                  id="language"
                  name="language"
                  icon={Globe}
                  value={formData.preferences.language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="ja">日本語</option>
                </Select>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="currency"
                    value={t("settings.preferences.currency")}
                  />
                </div>
                <Select
                  id="currency"
                  name="currency"
                  icon={DollarSign}
                  value={formData.preferences.currency}
                  onChange={(e) =>
                    handleCurrencyChange(e.target.value as CurrencyCode)
                  }
                >
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                  <option value="JPY">Japanese Yen (¥)</option>
                  <option value="CNY">Chinese Yuan (¥)</option>
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="AUD">Australian Dollar (A$)</option>
                  <option value="CAD">Canadian Dollar (C$)</option>
                </Select>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="theme"
                    value={t("settings.preferences.theme")}
                  />
                </div>
                <Select
                  id="theme"
                  name="theme"
                  icon={formData.preferences.theme === "dark" ? Moon : Sun}
                  value={formData.preferences.theme}
                  onChange={handlePreferencesChange}
                >
                  <option value="light">{t("common.light")}</option>
                  <option value="dark">{t("common.dark")}</option>
                  <option value="system">{t("common.system")}</option>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {t("settings.preferences.emailNotifications")}
                  </p>
                  <p className="text-sm text-gray-500">
                    Receive notifications via email
                  </p>
                </div>
                <ToggleSwitch
                  checked={formData.preferences.emailNotifications}
                  onChange={(checked) =>
                    handleToggleChange("emailNotifications", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {t("settings.preferences.pushNotifications")}
                  </p>
                  <p className="text-sm text-gray-500">
                    Receive push notifications in browser
                  </p>
                </div>
                <ToggleSwitch
                  checked={formData.preferences.pushNotifications}
                  onChange={(checked) =>
                    handleToggleChange("pushNotifications", checked)
                  }
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="dataRefreshRate"
                    value={t("settings.preferences.dataRefresh")}
                  />
                </div>
                <Select
                  id="dataRefreshRate"
                  name="dataRefreshRate"
                  icon={RefreshCw}
                  value={formData.preferences.dataRefreshRate}
                  onChange={handlePreferencesChange}
                >
                  <option value="5m">Every 5 minutes</option>
                  <option value="15m">Every 15 minutes</option>
                  <option value="30m">Every 30 minutes</option>
                  <option value="1h">Every hour</option>
                  <option value="manual">Manual refresh only</option>
                </Select>
              </div>
              <Button
                color="indigo"
                onClick={handleSaveChanges}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    {t("common.saving")}
                  </>
                ) : (
                  t("common.save")
                )}
              </Button>
            </div>
          </Card>
        </Tabs.Item>
        <Tabs.Item title={"Subscription"} icon={Box}>
          <Card>
            <h2 className="text-xl font-semibold mb-4">Subscription</h2>
            <div className="flex flex-col items-center py-10 bg-gray-100">
              <h2 className="text-3xl font-bold mb-6">Choose Your Plan</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <Card
                    key={plan.name}
                    className={`p-6 w-80 shadow-lg ${plan.buttonVariant === "active"
                        ? "border-2 border-blue-600"
                        : ""
                      }`}
                    theme={{
                      root: {
                        children:
                          "flex h-full flex-col justify-between gap-4 p-6",
                      },
                    }}
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-center">
                        {plan.name}
                      </h3>
                      <p className="text-2xl font-bold text-center my-4">
                        {plan.priceDisplay}
                      </p>
                      <ul className="space-y-2">
                        {plan.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center text-green-600"
                          >
                            <CheckCircle className="w-5 h-5 mr-2" /> {feature}
                          </li>
                        ))}
                        {plan.unavailable.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center text-red-500 line-through"
                          >
                            <XCircle className="w-5 h-5 mr-2" /> {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <RazorpayButton amount={plan.price} />
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </Tabs.Item>
      </Tabs>
    </div>
  );
};

export default Settings;
