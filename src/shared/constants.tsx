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

export const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "ja", name: "日本語" },
];

export const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
];
