import { CurrencyCode } from "../contexts/CurrencyContext";
import { TDataKeyTypes } from "../features/Campaigns/interface";

export interface ISettings {
  account: IMerchant;
  integrations: IIntegrations[];
  preferences: IPreferences;
  team?: ITeamEntity[] | null;
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
  platform: "googleAds" | "adMob" | "facebook";
  connected: boolean;
  accountEmail: string;
  accountId: string;
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

export type TPlatformsType = "googleAds" | "adMob" | "facebook";
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

export interface IMerchant {
  id: number;
  roles: string[];
  user_permissions: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  email: string;
  schema: string;
  name: string | null;
  slug: string;
  is_team_admin: boolean;
  both_social_account_connected_at: string | null;
  last_sync_at: string | null;
  profile_picture: string | null;
  company_name: string | null;
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

export type Role = "super-admin" | "admin" | "sub-admin";

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
