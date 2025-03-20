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