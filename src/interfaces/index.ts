import { CurrencyCode } from "../contexts/CurrencyContext";
import { TDataKeyTypes } from "../features/Campaigns/interface";

export interface ISettings {
  account: IUser;
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
export interface ITeamEntity {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export type TPlatformsType = "googleAds" | "adMob" | "facebook";

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


export interface IUser {
  id: string;
  name: string;
  email: string;
  role: "super-admin" | "admin" | "sub-admin";
  password: string;
  timezone: string;
  company?: string;
  permissions: string[];
  photoURL?: string;
  status: 'active' | 'inactive';
  isNewMerchant?: boolean;
  createdAt: Date;
  updatedAt: Date;
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
