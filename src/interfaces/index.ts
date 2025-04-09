import { CurrencyCode } from "../contexts/CurrencyContext";
import { TDataKeyTypes } from "../features/Campaigns/interface";

export interface ISettings {
  integrations: IIntegrations[];
}
// export interface IAccount {
//   name: string;
//   email: string;
//   company: string;
//   role: string;
//   timezone: string;
//   photoURL?: string;
// }

export interface IIntegrations {
  inward: IIntegrationsSet;
  outward: IIntegrationsSet;
}
export interface IIntegrationsSet {
  platform: "google_ads" | "ad_mob" | "facebook";
  connected: boolean;
  accountEmail: string;
  accountId: string;
  selectedAccounts?: string[];
  selectedSubAccounts?: string[];
}
export interface IPreferences {
  language: string;
  currency: CurrencyCode;
  theme: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  dataRefreshRate: string;
}

export type TInviteStatus = "pending" | "accepted" | "rejected";
export interface ITeamEntity {
  id: string;
  name: string;
  email: string;
  role: Role;
  password: string;
  timezone: string;
  permissions: string[];
  photoURL?: string;
  status: TStatusType;
  createdAt: Date;
  updatedAt: Date;
  inviteStatus: TInviteStatus;
}

export type TPlatformsType = "google_ads" | "ad_mob" | "facebook";
export type TStatusType = "active" | "inactive";

export type ChartType = "line" | "bar" | "pie" | "area";

export interface ChartConfig {
  id: string;
  name: string;
  type: ChartType;
  xAxis: string;
  yAxis: string[];
  groupId: string;
  order: number;
  dataKey: TDataKeyTypes;
}

export interface ChartGroup {
  id: string;
  name: string;
  order: number;
  charts: ChartConfig[];
}

export type TCurrency =
  | "USD"
  | "INR"
  | "EUR"
  | "GBP"
  | "CAD"
  | "AUD"
  | "NZD"
  | "JPY"
  | "CNY"
  | "RUB"
  | "MXN"
  | "BRL"
  | "ARS"
  | "CLP"
  | "COP"
  | "EGP"
  | "HKD"
  | "IDR"
  | "ILS"
  | "KRW"
  | "NGN"
  | "PHP"
  | "PLN"
  | "SAR"
  | "SEK"
  | "SGD"
  | "THB"
  | "TRY"
  | "TWD"
  | "UAH"
  | "VND"
  | "ZAR";

export interface IMerchant {
  id?: number;
  role: Role;
  user_permissions: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  is_deleted?: boolean;
  email: string;
  schema?: string;
  name?: string | null;
  slug?: string;
  is_team_admin?: boolean;
  both_social_account_connected_at?: string | null;
  last_sync_at?: string | null;
  profile_picture?: string | File | null;
  company_name?: string | null;
  currency?: TCurrency | null;
  tax_percentage?: number;
}

export interface IPermission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface ILanguageOption {
  code: string;
  name: string;
  flag: string;
}

export type Role = "super_admin" | "admin" | "sub_admin";

export interface ResponseObj<T> {
  data: T;
  is_error: boolean;
  message: string | null;
}

export interface SignupResponse {
  user: IMerchant;
  access: string;
  refresh: string;
}

export interface ILoginResponse {
  user: IMerchant;
  access: string;
  refresh: string;
}
