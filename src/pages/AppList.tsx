import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Table, Button, TextInput, Badge, Dropdown } from 'flowbite-react';
import { Search, Filter, Download, Plus, Star, MoreVertical } from 'lucide-react';
import { CSVLink } from 'react-csv';
import { useCurrency } from '../contexts/CurrencyContext';
import ConnectAppModal, { AppFormData } from '../components/ConnectAppModal';
import { fetchApps } from '../services/api';

interface App {
  id: string;
  name: string;
  platform: string;
  revenue: number;
  installs: number;
  uninstalls: number;
  retention: number;
  rating: number;
  status: 'active' | 'inactive' | 'pending';
}

const AppList: React.FC = () => {
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [apps, setApps] = useState<App[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [platformFilter, setPlatformFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    const loadApps = async () => {
      setIsLoading(true);
      try {
        const data = await fetchApps();
        setApps(data);
      } catch (error) {
        console.error('Error loading apps:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadApps();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleConnectApp = (appData: AppFormData) => {
    // In a real app, this would send the data to the server
    const newApp: App = {
      id: `app-${Date.now()}`,
      name: appData.name,
      platform: appData.platform,
      revenue: 0,
      installs: 0,
      uninstalls: 0,
      retention: 0,
      rating: 0,
      status: 'pending',
    };

    setApps([...apps, newApp]);
    setIsModalOpen(false);
  };

  const filteredApps = apps.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = platformFilter ? app.platform === platformFilter : true;
    const matchesStatus = statusFilter ? app.status === statusFilter : true;

    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const getPlatformBadgeColor = (platform: string) => {
    switch (platform) {
      case 'android':
        return 'success';
      case 'ios':
        return 'info';
      case 'web':
        return 'warning';
      default:
        return 'gray';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'failure';
      case 'pending':
        return 'warning';
      default:
        return 'gray';
    }
  };

  const csvData = filteredApps.map((app) => ({
    Name: app.name,
    Platform: app.platform,
    Revenue: formatCurrency(app.revenue),
    Installs: app.installs,
    Uninstalls: app.uninstalls,
    Retention: `${app.retention}%`,
    Rating: app.rating,
    Status: app.status,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">{t('apps.title')}</h1>
        <Button onClick={() => setIsModalOpen(true)} color={'primary'}>
          <Plus className="mr-2 h-5 w-5" />
          {t('apps.addApp')}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="w-full md:w-1/3">
          <TextInput
            id="search"
            type="text"
            icon={Search}
            placeholder={t('apps.search')}
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex gap-2">
          <Dropdown
            label={
              <div className="flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                {t('apps.filter')}
              </div>
            }
            color="gray"
          >
            <Dropdown.Header>
              <span className="block text-sm font-medium">Platform</span>
            </Dropdown.Header>
            <Dropdown.Item onClick={() => setPlatformFilter(null)}>All</Dropdown.Item>
            <Dropdown.Item onClick={() => setPlatformFilter('android')}>Android</Dropdown.Item>
            <Dropdown.Item onClick={() => setPlatformFilter('ios')}>iOS</Dropdown.Item>
            <Dropdown.Item onClick={() => setPlatformFilter('web')}>Web</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Header>
              <span className="block text-sm font-medium">Status</span>
            </Dropdown.Header>
            <Dropdown.Item onClick={() => setStatusFilter(null)}>All</Dropdown.Item>
            <Dropdown.Item onClick={() => setStatusFilter('active')}>Active</Dropdown.Item>
            <Dropdown.Item onClick={() => setStatusFilter('inactive')}>Inactive</Dropdown.Item>
            <Dropdown.Item onClick={() => setStatusFilter('pending')}>Pending</Dropdown.Item>
          </Dropdown>

          <CSVLink
            data={csvData}
            filename="apps-data.csv"
            className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
          >
            <Download className="mr-2 h-5 w-5" />
            {t('apps.export')}
          </CSVLink>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <Table.Head>
              <Table.HeadCell>{t('apps.columns.name')}</Table.HeadCell>
              <Table.HeadCell>{t('apps.columns.platform')}</Table.HeadCell>
              <Table.HeadCell>{t('apps.columns.revenue')}</Table.HeadCell>
              <Table.HeadCell>{t('apps.columns.installs')}</Table.HeadCell>
              <Table.HeadCell>{t('apps.columns.uninstalls')}</Table.HeadCell>
              <Table.HeadCell>{t('apps.columns.retention')}</Table.HeadCell>
              <Table.HeadCell>{t('apps.columns.rating')}</Table.HeadCell>
              <Table.HeadCell>{t('apps.columns.status')}</Table.HeadCell>
              <Table.HeadCell>{t('apps.columns.actions')}</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {filteredApps.map((app) => (
                <Table.Row key={app.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <div
                      className="cursor-pointer hover:text-primary-600"
                      onClick={() => navigate(`/apps/${app.id}`)}
                    >
                      {app.name}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={getPlatformBadgeColor(app.platform)} className='w-max capitalize'>
                      {app.platform}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{formatCurrency(app.revenue)}</Table.Cell>
                  <Table.Cell>{app.installs.toLocaleString()}</Table.Cell>
                  <Table.Cell>{app.uninstalls.toLocaleString()}</Table.Cell>
                  <Table.Cell>{app.retention}%</Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                      {app.rating.toFixed(1)}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={getStatusBadgeColor(app.status)} className='w-max capitalize'>
                      {app.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Dropdown
                      label={<MoreVertical className="h-5 w-5" />}
                      arrowIcon={false}
                      inline
                    >
                      <Dropdown.Item onClick={() => navigate(`/apps/${app.id}`)}>
                        {t('common.view')}
                      </Dropdown.Item>
                      <Dropdown.Item>{t('common.edit')}</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item color="failure">{t('common.delete')}</Dropdown.Item>
                    </Dropdown>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}

      <ConnectAppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleConnectApp}
      />
    </div>
  );
};

export default AppList;