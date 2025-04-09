import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Label, Select, Spinner, TextInput } from "flowbite-react";
import {
  Building,
  Camera,
  DollarSign,
  Lock,
  Mail,
  Percent,
  User,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import ProfileSkeleton from "../components/SkeletonLoaders/ProfileSkeleton";
import { useAuth } from "../hooks/useAuth";
import { IMerchant } from "../interfaces";
import { httpService } from "../services/httpService";
import {
  API_CONFIG,
  CURRENCIES_OPTIONS,
  DEFAULT_AVATAR,
} from "../shared/constants";

interface CurrencyOption {
  value: string;
  label: string;
}

const currencyOptions: CurrencyOption[] = CURRENCIES_OPTIONS.map(
  (currency) => ({
    value: currency.code,
    label: `${currency.code} - ${currency.name} (${currency.symbol})`,
  })
);

interface PasswordChangeForm {
  old_password: string;
  new_password: string;
  new_confirm_password: string;
}

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<Partial<IMerchant>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  const schema = yup.object().shape({
    id: yup.number().optional(),
    role: yup.string().optional(),
    user_permissions: yup.array().of(yup.string()).nullable().optional(),
    is_active: yup.boolean().optional(),
    created_at: yup.string().optional(),
    updated_at: yup.string().optional(),
    is_deleted: yup.boolean().optional(),
    email: yup.string().email().required(),
    schema: yup.string().optional(),
    name: yup.string().nullable().optional(),
    slug: yup.string().optional(),
    is_team_admin: yup.boolean().optional(),
    both_social_account_connected_at: yup.string().nullable().optional(),
    last_sync_at: yup.string().nullable().optional(),
    profile_picture: yup.mixed().optional(),
    company_name: yup.string().nullable().optional(),
    currency: yup.mixed().nullable().optional(),
    tax_percentage: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" || originalValue === null ? null : value
      )
      .typeError(t("validation.tax_percentage.number"))
      .min(0, t("validation.tax_percentage.min"))
      .max(100, t("validation.tax_percentage.max"))
      .nullable()
      .optional(),
  }) as yup.ObjectSchema<IMerchant>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IMerchant>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      company_name: "",
      role: "admin",
      currency: "USD",
      tax_percentage: 0,
      profile_picture: DEFAULT_AVATAR,
    },
  });

  const passwordSchema = yup.object().shape({
    old_password: yup.string().required(t("validation.required")),
    new_password: yup
      .string()
      .required(t("validation.required"))
      .min(8, t("validation.password.min")),
    new_confirm_password: yup
      .string()
      .required(t("validation.required"))
      .oneOf([yup.ref("new_password")], t("validation.password.match")),
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm<PasswordChangeForm>({
    resolver: yupResolver(passwordSchema),
  });

  const formData = watch();

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        if (user) {
          // Store initial values
          setInitialValues({
            name: user.name || "",
            email: user.email || "",
            company_name: user.company_name || "",
            currency: user.currency || "USD",
            tax_percentage: user.tax_percentage || 0,
            profile_picture: user.profile_picture || DEFAULT_AVATAR,
          });

          // Set form values using setValue
          Object.entries(user).forEach(([key, value]) => {
            setValue(key as keyof IMerchant, value);
          });
          setValue("profile_picture", user.profile_picture || DEFAULT_AVATAR);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [setValue, user]);

  const hasChanges = () => {
    const currentValues = watch();
    return Object.keys(initialValues).some((key) => {
      const k = key as keyof IMerchant;
      return (currentValues[k] || "") !== (initialValues[k] || "");
    });
  };

  const onSubmit = async (data: IMerchant) => {
    setIsSaving(true);
    try {
      const formDataToSend = new FormData();

      // Add form data with type checking
      Object.entries(data).forEach(([key, value]) => {
        if (
          key !== "profile_picture" &&
          value !== undefined &&
          value !== null
        ) {
          if (typeof value === "object") {
            formDataToSend.append(key, JSON.stringify(value));
          } else {
            formDataToSend.append(key, String(value));
          }
        }
      });

      // Handle profile picture
      if (imagePreview && data.profile_picture) {
        formDataToSend.append("profile_picture", data.profile_picture as File);
      }

      formDataToSend.append("is_active", "true");

      const res = await httpService.put(
        `${API_CONFIG.path.users}/${data.id}`,
        formDataToSend
      );

      setUser(res as IMerchant);
      setInitialValues(data);
      httpService.setUserData(res as IMerchant);
      setIsSaving(false);
      toast.success(t("settings.account.saved"));
    } catch (error) {
      console.error("Error saving settings:", error);
      setIsSaving(false);
      toast.error(t("settings.account.error"));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("profile_picture", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onPasswordSubmit = async (data: PasswordChangeForm) => {
    setIsPasswordSaving(true);
    try {
      await httpService.patch(API_CONFIG.path.changePassword, data);
      // await axios.patch(API_CONFIG.path.changePassword, data);
      toast.success(t("settings.password.success"));
      // Reset form
      registerPassword("old_password").onChange({ target: { value: "" } });
      registerPassword("new_password").onChange({ target: { value: "" } });
      registerPassword("new_confirm_password").onChange({
        target: { value: "" },
      });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(t("settings.password.error"));
    } finally {
      setIsPasswordSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 space-x-6">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4 min-h-[38px]">
            <User size={20} className="text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-700">
              {t("settings.profile.title")}
            </h1>
          </div>
        </div>
        {isLoading ? (
          <ProfileSkeleton />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-6">
              <div className="flex h-[164px] w-[164px] justify-center items-center">
                <label
                  htmlFor="profilePicInput"
                  className="relative cursor-pointer group"
                >
                  <img
                    src={imagePreview || (formData.profile_picture as string)}
                    className="rounded-sm border-4 border-gray-300 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center rounded-md justify-center bg-black bg-opacity-50  opacity-0 group-hover:opacity-100 transition-opacity">
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
              <div className="space-y-4 flex-1">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="name" value={t("settings.account.name")} />
                  </div>
                  <TextInput
                    id="name"
                    {...register("name")}
                    disabled={isSaving}
                    placeholder={t("settings.account.name")}
                    icon={User}
                    color={errors.name ? "failure" : undefined}
                    helperText={errors.name?.message}
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label
                      htmlFor="email"
                      value={t("settings.account.email")}
                    />
                  </div>
                  <TextInput
                    id="email"
                    type="email"
                    {...register("email")}
                    disabled={isSaving}
                    placeholder={t("settings.account.email")}
                    icon={Mail}
                    color={errors.email ? "failure" : undefined}
                    helperText={errors.email?.message}
                  />
                </div>
              </div>
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
                {...register("company_name")}
                placeholder={t("settings.account.company")}
                disabled={isSaving}
                icon={Building}
                color={errors.company_name ? "failure" : undefined}
                helperText={errors.company_name?.message}
              />
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
                {...register("currency")}
                icon={DollarSign}
                disabled={isSaving}
                helperText={errors.currency?.message}
                color={errors.currency ? "failure" : undefined}
              >
                {currencyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="tax_percentage"
                  value={t("settings.preferences.tax_percentage")}
                />
              </div>
              <TextInput
                id="tax_percentage"
                type="text"
                {...register("tax_percentage")}
                placeholder={t("settings.preferences.tax_percentage")}
                disabled={isSaving}
                icon={Percent}
                color={errors.tax_percentage ? "failure" : undefined}
                pattern="[0-9]*\.?[0-9]*"
                inputMode="decimal"
              />
            </div>
            <Button
              type="submit"
              color="indigo"
              disabled={isSaving || !hasChanges()}
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <Spinner color={"purple"} size={"sm"} />
                  {t("settings.account.saving")}
                </div>
              ) : (
                t("settings.account.save")
              )}
            </Button>
          </form>
        )}
      </div>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4 min-h-[38px]">
            <Lock size={20} className="text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-700">
              {t("settings.password.title")}
            </h1>
          </div>
        </div>
        {isLoading ? (
          <ProfileSkeleton />
        ) : (
          <form
            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
            className="space-y-4"
          >
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="currentPassword"
                  value={t("settings.password.current")}
                />
              </div>
              <TextInput
                id="currentPassword"
                type="password"
                icon={Lock}
                placeholder={t("settings.password.current")}
                {...registerPassword("old_password")}
                color={passwordErrors.old_password ? "failure" : undefined}
                helperText={passwordErrors.old_password?.message}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="newPassword"
                  value={t("settings.password.new")}
                />
              </div>
              <TextInput
                id="newPassword"
                type="password"
                icon={Lock}
                placeholder={t("settings.password.new")}
                {...registerPassword("new_password")}
                color={passwordErrors.new_password ? "failure" : undefined}
                helperText={passwordErrors.new_password?.message}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="confirmPassword"
                  value={t("settings.password.confirm")}
                />
              </div>
              <TextInput
                id="confirmPassword"
                type="password"
                icon={Lock}
                placeholder={t("settings.password.confirm")}
                {...registerPassword("new_confirm_password")}
                color={
                  passwordErrors.new_confirm_password ? "failure" : undefined
                }
                helperText={passwordErrors.new_confirm_password?.message}
              />
            </div>
            <Button type="submit" color="indigo" disabled={isPasswordSaving}>
              {isPasswordSaving ? (
                <div className="flex items-center gap-2">
                  <Spinner color={"purple"} size={"sm"} />
                  {t("settings.password.saving")}
                </div>
              ) : (
                t("settings.password.change")
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Settings;
