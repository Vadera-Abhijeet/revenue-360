import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, Card, Button, TextInput, Select, Label, ToggleSwitch, Badge } from 'flowbite-react';
import {
  User,
  Building,
  Mail,
  Clock,
  Globe,
  DollarSign,
  Bell,
  Moon,
  Sun,
  RefreshCw,
  UserPlus,
  Trash2
} from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';
import { fetchUserSettings, updateUserSettings } from '../services/api';

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { currency, setCurrency } = useCurrency();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    account: {
      name: '',
      email: '',
      company: '',
      role: '',
      timezone: '',
    },
    preferences: {
      language: '',
      currency: '',
      theme: '',
      emailNotifications: false,
      pushNotifications: false,
      dataRefreshRate: '',
    },
  });

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const data = await fetchUserSettings();
        setSettings(data);
        setFormData({
          account: { ...data.account },
          preferences: { ...data.preferences },
        });
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      account: {
        ...prev.account,
        [name]: value,
      },
    }));
  };

  const handlePreferencesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: value,
      },
    }));
  };

  const handleToggleChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: checked,
      },
    }));
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        language,
      },
    }));
  };

  const handleCurrencyChange = (currencyCode: string) => {
    setCurrency(currencyCode as any);
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        currency: currencyCode,
      },
    }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await updateUserSettings({
        account: formData.account,
        preferences: formData.preferences,
      });
      // Update settings in state
      setSettings(prev => ({
        ...prev,
        account: formData.account,
        preferences: formData.preferences,
      }));
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('settings.title')}</h1>

      <Tabs aria-label="Settings tabs">
        <Tabs.Item active title={t('settings.account.title')} icon={User}>
          <Card>
            <h2 className="text-xl font-semibold mb-4">{t('settings.account.title')}</h2>
            <div className="space-y-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value={t('settings.account.name')} />
                </div>
                <TextInput
                  id="name"
                  name="name"
                  icon={User}
                  value={formData.account.name}
                  onChange={handleAccountChange}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="email" value={t('settings.account.email')} />
                </div>
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  icon={Mail}
                  value={formData.account.email}
                  onChange={handleAccountChange}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="company" value={t('settings.account.company')} />
                </div>
                <TextInput
                  id="company"
                  name="company"
                  icon={Building}
                  value={formData.account.company}
                  onChange={handleAccountChange}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="role" value={t('settings.account.role')} />
                </div>
                <Select
                  id="role"
                  name="role"
                  value={formData.account.role}
                  onChange={handleAccountChange}
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </Select>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="timezone" value={t('settings.account.timezone')} />
                </div>
                <Select
                  id="timezone"
                  name="timezone"
                  icon={Clock}
                  value={formData.account.timezone}
                  onChange={handleAccountChange}
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                  <option value="Europe/Paris">Central European Time (CET)</option>
                  <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
                </Select>
              </div>
              <Button onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    {t('common.saving')}
                  </>
                ) : (
                  t('settings.account.save')
                )}
              </Button>
            </div>
          </Card>
        </Tabs.Item>

        <Tabs.Item title={t('settings.integrations.title')} icon={RefreshCw}>
          <Card>
            <h2 className="text-xl font-semibold mb-4">{t('settings.integrations.title')}</h2>
            <div className="space-y-6">
              {Object.entries(settings.integrations).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4">
                      {key === 'googleAds' && <img src="https://www.gstatic.com/images/branding/product/2x/ads_48dp.png" alt="Google Ads" className="w-8 h-8" />}
                      {key === 'adMob' && <img src="https://www.gstatic.com/admob/static/images/admob-logo-1x.png" alt="AdMob" className="w-8 h-8" />}
                      {key === 'firebase' && <img src="https://www.gstatic.com/devrel-devsite/prod/v84e6f6a61298bbae5bb110" alt="Firebase" className="w-8 h-8" />}
                      {key === 'playStore' && <img src="https://www.gstatic.com/images/branding/product/2x/google_play_48dp.png" alt="Play Store" className="w-8 h-8" />}
                      {key === 'appStore' && <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-example-preferred.png" alt="App Store" className="w-8 h-8" />}
                      {key === 'facebook' && <img src="https://static.xx.fbcdn.net/rsrc.php/v3/y4/r/XN0UdPC-KaM.png" alt="Facebook Ads" className="w-8 h-8" />}
                      {key === 'appsFlyer' && <img src="https://www.appsflyer.com/wp-content/uploads/2020/03/AF-Logo-2020.svg" alt="AppsFlyer" className="w-8 h-8" />}
                      {key === 'adjust' && <img src="https://www.adjust.com/assets/images/adjust-logo.svg" alt="Adjust" className="w-8 h-8" />}
                    </div>
                    <div>
                      <p className="font-medium">{t(`settings.integrations.${key}`)}</p>
                      <Badge color={value ? 'success' : 'gray'}>
                        {value ? t('settings.integrations.connected') : t('settings.integrations.notConnected')}
                      </Badge>
                    </div>
                  </div>
                  <Button color={value ? 'failure' : 'primary'} size="sm">
                    {value ? t('settings.integrations.disconnect') : t('settings.integrations.connect')}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </Tabs.Item>

        <Tabs.Item title={t('settings.preferences.title')} icon={Globe}>
          <Card>
            <h2 className="text-xl font-semibold mb-4">{t('settings.preferences.title')}</h2>
            <div className="space-y-6">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="language" value={t('settings.preferences.language')} />
                </div>
                <Select
                  id="language"
                  name="language"
                  icon={Globe}
                  value={formData.preferences.language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="ja">日本語</option>
                </Select>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="currency" value={t('settings.preferences.currency')} />
                </div>
                <Select
                  id="currency"
                  name="currency"
                  icon={DollarSign}
                  value={formData.preferences.currency}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                >
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                  <option value="JPY">Japanese Yen (¥)</option>
                  <option value="CNY">Chinese Yuan (¥)</option>
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="AUD">Australian Dollar (A$)</option>
                  <option value="CAD">Canadian Dollar (C$)</option>
                </Select>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="theme" value={t('settings.preferences.theme')} />
                </div>
                <Select
                  id="theme"
                  name="theme"
                  icon={formData.preferences.theme === 'dark' ? Moon : Sun}
                  value={formData.preferences.theme}
                  onChange={handlePreferencesChange}
                >
                  <option value="light">{t('common.light')}</option>
                  <option value="dark">{t('common.dark')}</option>
                  <option value="system">{t('common.system')}</option>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('settings.preferences.emailNotifications')}</p>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <ToggleSwitch
                  checked={formData.preferences.emailNotifications}
                  onChange={(checked) => handleToggleChange('emailNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('settings.preferences.pushNotifications')}</p>
                  <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                </div>
                <ToggleSwitch
                  checked={formData.preferences.pushNotifications}
                  onChange={(checked) => handleToggleChange('pushNotifications', checked)}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="dataRefreshRate" value={t('settings.preferences.dataRefresh')} />
                </div>
                <Select
                  id="dataRefreshRate"
                  name="dataRefreshRate"
                  icon={RefreshCw}
                  value={formData.preferences.dataRefreshRate}
                  onChange={handlePreferencesChange}
                >
                  <option value="5m">Every 5 minutes</option>
                  <option value="15m">Every 15 minutes</option>
                  <option value="30m">Every 30 minutes</option>
                  <option value="1h">Every hour</option>
                  <option value="manual">Manual refresh only</option>
                </Select>
              </div>
              <Button onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    {t('common.saving')}
                  </>
                ) : (
                  t('common.save')
                )}
              </Button>
            </div>
          </Card>
        </Tabs.Item>

        <Tabs.Item title={t('settings.team.title')} icon={User}>
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{t('settings.team.title')}</h2>
              <Button size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                {t('settings.team.invite')}
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">{t('settings.team.name')}</th>
                    <th scope="col" className="px-6 py-3">{t('settings.team.email')}</th>
                    <th scope="col" className="px-6 py-3">{t('settings.team.role')}</th>
                    <th scope="col" className="px-6 py-3">{t('settings.team.status')}</th>
                    <th scope="col" className="px-6 py-3">{t('settings.team.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {settings.team.map((member: any) => (
                    <tr key={member.id} className="bg-white border-b">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {member.name}
                      </td>
                      <td className="px-6 py-4">{member.email}</td>
                      <td className="px-6 py-4">{member.role}</td>
                      <td className="px-6 py-4">
                        <Badge color={member.status === 'active' ? 'success' : 'warning'} className='w-max capitalize'>
                          {member.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Button size="xs" color="gray">
                            {t('common.edit')}
                          </Button>
                          {member.id !== 'user1' && (
                            <Button size="xs" color="failure">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Tabs.Item>
      </Tabs>
    </div>
  );
};

export default Settings;