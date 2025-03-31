import { Button, Label, TextInput } from "flowbite-react";
import { Building, Camera, Mail, User } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import { IMerchant } from "../interfaces";
import { httpService } from "../services/httpService";
import { API_CONFIG, DEFAULT_AVATAR } from "../shared/constants";
import ProfileSkeleton from "../components/SkeletonLoaders/ProfileSkeleton";

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const { setUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<IMerchant>({
    name: "",
    email: "",
    company_name: "",
    role: "admin",
    profile_picture: DEFAULT_AVATAR,
    user_permissions: [],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const user = await httpService.getCurrentUser();
        if (user) {
          setFormData(user);
        }
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
      [name]: value,
    }));
  };

  // const handleToggleChange = (name: string, checked: boolean) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     preferences: {
  //       ...prev.preferences,
  //       [name]: checked,
  //     },
  //   }));
  // };

  // const handleLanguageChange = (language: string) => {
  //   i18n.changeLanguage(language);
  //   setFormData((prev) => ({
  //     ...prev,
  //     preferences: {
  //       ...prev.preferences,
  //       language,
  //     },
  //   }));
  // };

  // const handleCurrencyChange = (currencyCode: CurrencyCode) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     preferences: {
  //       ...prev.preferences,
  //       currency: currencyCode,
  //     },
  //   }));
  // };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const formDataToSend = new FormData();

      // Add name with null check
      if (formData.name) {
        formDataToSend.append("name", formData.name);
      }

      // Add email with null check
      if (formData.email) {
        formDataToSend.append("email", formData.email);
      }

      // Add company_name with null check
      if (formData.company_name) {
        formDataToSend.append("company_name", formData.company_name);
      }

      // Handle profile picture
      if (imagePreview && formData.profile_picture) {
        formDataToSend.append("profile_picture", formData.profile_picture);
      }

      formDataToSend.append("is_active", "true");

      // Call the API with the form data
      httpService
        .put(`${API_CONFIG.path.users}/${formData.id}`, formDataToSend)
        .then((res) => {
          setUser(res as IMerchant);
          httpService.setUserData(res as IMerchant);
          setIsSaving(false);
          toast.success(t("settings.account.saved"));
        })
        .catch((error) => {
          console.error("Error saving settings:", error);
          setIsSaving(false);
          toast.error(t("settings.account.error"));
        });
    } catch (error) {
      console.error("Error saving settings:", error);
      setIsSaving(false);
      toast.error(t("settings.account.error"));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profile_picture: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4 min-h-[38px]">
          <User size={20} className="text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-700">
            {t("settings.account.title")}
          </h1>
        </div>
      </div>
      {isLoading ? (
        <ProfileSkeleton />
      ) : (
        <div className="space-y-2 max-w-2xl">
          <div className="flex mb-6">
            <label
              htmlFor="profilePicInput"
              className="relative cursor-pointer group"
            >
              <img
                src={imagePreview || (formData.profile_picture as string)}
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
              disabled={isSaving}
              icon={User}
              value={formData.name || ""}
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
              disabled={isSaving}
              icon={Mail}
              value={formData.email}
              onChange={handleAccountChange}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="companyName"
                value={t("settings.account.company")}
              />
            </div>
            <TextInput
              id="companyName"
              name="company_name"
              disabled={isSaving}
              icon={Building}
              value={formData.company_name || ""}
              onChange={handleAccountChange}
            />
          </div>
          {/* <div>
                <div className="mb-2 block">
                  <Label htmlFor="role" value={t("settings.account.role")} />
                </div>
                <Select
                  id="role"
                  name="role"
                  icon={User}
                  value={formData.role}
                  onChange={handleAccountChange}
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </Select>
              </div> */}
          {/* <div>
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
                  value={formData.timezone}
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
              </div> */}
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
      )}
    </div>
  );
};

export default Settings;
