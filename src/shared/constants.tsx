import { Role } from "../interfaces";

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  path: {
    login: "login",
    logout: "logout",
    register: "register",
    users: "users",
    refreshToken: "token/refresh",
    me: "users/me",
    permissions: "permissions",
    categorizedPermissions: "permissions/category",
    validateInvite: "validate-invite",
    onboarding: "onboarding",
    oauthCallback: "oauth/callback",
    acceptInvite: "accept-invite",
    changePassword: "change-password",
    forgotPassword: "forgot-password",
    resetPassword: "password-reset-confirm",
    oauth: {
      admob: {
        authorize: "oauth/admob/authorize",
        callback: "oauth/admob/callback",
      },
      googleads: {
        authorize: "oauth/googleads/authorize",
        callback: "oauth/googleads/callback",
      },
    },
  },
};

export const DEFAULT_ITEMS_PER_PAGE = 10;

export const PLATFORM_ICON_MAP: Record<string, string> = {
  googleAds: "https://www.gstatic.com/images/branding/product/2x/ads_48dp.png",
  adMob: "https://cdn.worldvectorlogo.com/logos/google-admob.svg",
  facebook:
    "https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png",
};

export const PLATFORM_OPTIONS = [
  { label: "GoogleAds", value: "googleAds" },
  { label: "AdMob", value: "adMob" },
  { label: "FaceBook", value: "facebook" },
];

export const DEFAULT_AVATAR =
  "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541";

export const CURRENCIES_OPTIONS = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
];

export const LANGUAGES_OPTIONS = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
];

export const PLANS = [
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

export const ROLES: Role[] = ["super_admin", "admin", "sub_admin"];
