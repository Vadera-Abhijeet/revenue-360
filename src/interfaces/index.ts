import { CurrencyCode } from "../contexts/CurrencyContext";

export interface ISettings {
  account: IAccount;
  integrations: IIntegrations;
  preferences: IPreferences;
  team?: ITeamEntity[] | null;
}
export interface IAccount {
  name: string;
  email: string;
  company: string;
  role: string;
  timezone: string;
}
export interface IIntegrations {
  googleAds: boolean;
  adMob: boolean;
  facebook: boolean;
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
