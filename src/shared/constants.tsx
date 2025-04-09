import {
  ControlProps,
  StylesConfig,
  CSSObjectWithLabel,
  GroupBase,
} from "react-select";
import { Role, TCurrency } from "../interfaces";

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
    onboarding: "onboarding",
    oauthCallback: "oauth/callback",
    invitations: "invitations",
    acceptInvite: "invite-user-accept",
    changePassword: "change-password",
    forgotPassword: "forgot-password",
    resetPassword: "password-reset-confirm",
    googleOAuth: "google-auth",
    googleOAuthCallback: "google-auth-callback",
    googleAdsAccounts: "google-ads-accounts",
    googleAdsSubAccounts: "get-sub-account-list",
  },
};

export const DEFAULT_ITEMS_PER_PAGE = 10;

export const PLATFORM_ICON_MAP: Record<string, string> = {
  google_ads: "https://www.gstatic.com/images/branding/product/2x/ads_48dp.png",
  ad_mob: "https://cdn.worldvectorlogo.com/logos/google-admob.svg",
  facebook:
    "https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png",
};

export const PLATFORM_OPTIONS = [
  { label: "GoogleAds", value: "google_ads" },
  { label: "AdMob", value: "ad_mob" },
  // { label: "FaceBook", value: "facebook" },
];

export const DEFAULT_AVATAR =
  "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541";

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

export const CURRENCIES: TCurrency[] = [
  "USD",
  "INR",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "NZD",
  "JPY",
  "CNY",
  "RUB",
  "MXN",
  "BRL",
  "ARS",
  "CLP",
  "COP",
  "EGP",
  "HKD",
  "IDR",
  "ILS",
  "KRW",
  "NGN",
  "PHP",
  "PLN",
  "SAR",
  "SEK",
  "SGD",
  "THB",
  "TRY",
  "TWD",
  "UAH",
  "VND",
  "ZAR",
];

export const CURRENCIES_OPTIONS = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble" },
  { code: "MXN", symbol: "$", name: "Mexican Peso" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "ARS", symbol: "₩", name: "Argentine Peso" },
  { code: "CLP", symbol: "$", name: "Chilean Peso" },
  { code: "COP", symbol: "$", name: "Colombian Peso" },
  { code: "EGP", symbol: "£", name: "Egyptian Pound" },
  { code: "HKD", symbol: "$", name: "Hong Kong Dollar" },
  { code: "IDR", symbol: "₩", name: "Indonesian Rupiah" },
  { code: "ILS", symbol: "₪", name: "Israeli New Shekel" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty" },
  { code: "SAR", symbol: "₹", name: "Saudi Riyal" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "SGD", symbol: "$", name: "Singapore Dollar" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "TWD", symbol: "$", name: "New Taiwan Dollar" },
  { code: "UAH", symbol: "₴", name: "Ukrainian Hryvnia" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
];

export const customSelectStyles: StylesConfig = {
  control: (
    base: CSSObjectWithLabel,
    state: ControlProps<unknown, boolean, GroupBase<unknown>>
  ) => ({
    ...base,
    minHeight: "42px",
    height: "42px",
    boxShadow: "none",
    borderColor: state.isFocused ? "#0056ff" : "#d1d5db",
    "&:hover": {
      borderColor: state.isFocused ? "#0056ff" : "#d1d5db",
    },
    borderRadius: "0.5rem",
    borderWidth: state.isFocused ? "2px" : "1px",
    backgroundColor: "#ffffff",
    padding: "0 0.75rem 0 2.5rem",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0",
    margin: "0",
  }),
  input: (base) => ({
    ...base,
    margin: "0",
    padding: "0",
  }),
  indicatorsContainer: (base) => ({
    ...base,
    height: "42px",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#6b7280",
    "&:hover": {
      color: "#4b5563",
    },
  }),
  menu: (base) => ({
    ...base,
    marginTop: "0.25rem",
    borderRadius: "0.5rem",
    boxShadow:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#f3f4f6" : "transparent",
    color: "#374151",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    padding: "0.5rem 0.75rem",
    "&:hover": {
      backgroundColor: "#f3f4f6",
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: "#374151",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#6b7280",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  }),
};
