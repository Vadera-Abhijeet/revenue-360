import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Table, Button, TextInput, Badge, Dropdown } from "flowbite-react";
import { Search, Filter, Download, Plus, MoreVertical } from "lucide-react";
import { CSVLink } from "react-csv";
import { useCurrency } from "../contexts/CurrencyContext";
import DateRangePicker from "../components/DateRangePicker";
import { fetchCampaigns } from "../services/api";

interface Campaign {
  id: string;
  name: string;
  platform: string;
  status: string;
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  installs: number;
  cpi: number;
  conversions: number;
  cpa: number;
  revenue: number;
  roi: number;
}

const Campaigns: React.FC = () => {
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
    const loadCampaigns = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCampaigns();
        setCampaigns(data);
      } catch (error) {
        console.error("Error loading campaigns:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaigns();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
    // In a real app, we would refetch data with the new date range
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPlatform = platformFilter
      ? campaign.platform === platformFilter
      : true;
    const matchesStatus = statusFilter
      ? campaign.status === statusFilter
      : true;

    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "paused":
        return "warning";
      case "scheduled":
        return "info";
      case "ended":
        return "gray";
      default:
        return "gray";
    }
  };

  const csvData = filteredCampaigns.map((campaign) => ({
    Name: campaign.name,
    Platform: campaign.platform,
    Status: campaign.status,
    Budget: formatCurrency(campaign.budget),
    Spend: formatCurrency(campaign.spend),
    Impressions: campaign.impressions,
    Clicks: campaign.clicks,
    CTR: `${campaign.ctr}%`,
    CPC: formatCurrency(campaign.cpc),
    Installs: campaign.installs,
    CPI: formatCurrency(campaign.cpi),
    Conversions: campaign.conversions,
    CPA: formatCurrency(campaign.cpa),
    Revenue: formatCurrency(campaign.revenue),
    ROI: `${campaign.roi}%`,
  }));

  return (
    <div className="h-full w-full flex items-center justify-center">
      <h1 className="text-6xl">Under progress</h1>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("campaigns.title")}
        </h1>
        <div className="flex gap-2">
          <DateRangePicker onDateRangeChange={handleDateRangeChange} />
          <Button onClick={() => {}}>
            <Plus className="mr-2 h-5 w-5" />
            {t("campaigns.addCampaign")}
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="w-full md:w-1/3">
          <TextInput
            id="search"
            type="text"
            icon={Search}
            placeholder={t("campaigns.search")}
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex gap-2">
          <Dropdown
            label={
              <div className="flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                {t("campaigns.filter")}
              </div>
            }
            color="light"
          >
            <Dropdown.Header>
              <span className="block text-sm font-medium">Platform</span>
            </Dropdown.Header>
            <Dropdown.Item onClick={() => setPlatformFilter(null)}>
              All
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setPlatformFilter("Google Ads")}>
              Google Ads
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setPlatformFilter("Facebook Ads")}>
              Facebook Ads
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setPlatformFilter("AdMob")}>
              AdMob
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => setPlatformFilter("Apple Search Ads")}
            >
              Apple Search Ads
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setPlatformFilter("TikTok Ads")}>
              TikTok Ads
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Header>
              <span className="block text-sm font-medium">Status</span>
            </Dropdown.Header>
            <Dropdown.Item onClick={() => setStatusFilter(null)}>
              All
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setStatusFilter("active")}>
              Active
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setStatusFilter("paused")}>
              Paused
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setStatusFilter("scheduled")}>
              Scheduled
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setStatusFilter("ended")}>
              Ended
            </Dropdown.Item>
          </Dropdown>

          <CSVLink
            data={csvData}
            filename="campaigns-data.csv"
            className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
          >
            <Download className="mr-2 h-5 w-5" />
            {t("campaigns.export")}
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
              <Table.HeadCell>{t("campaigns.columns.name")}</Table.HeadCell>
              <Table.HeadCell>{t("campaigns.columns.platform")}</Table.HeadCell>
              <Table.HeadCell>{t("campaigns.columns.status")}</Table.HeadCell>
              <Table.HeadCell>{t("campaigns.columns.budget")}</Table.HeadCell>
              <Table.HeadCell>{t("campaigns.columns.spend")}</Table.HeadCell>
              <Table.HeadCell>
                {t("campaigns.columns.impressions")}
              </Table.HeadCell>
              <Table.HeadCell>{t("campaigns.columns.clicks")}</Table.HeadCell>
              <Table.HeadCell>{t("campaigns.columns.ctr")}</Table.HeadCell>
              <Table.HeadCell>
                {t("campaigns.columns.conversions")}
              </Table.HeadCell>
              <Table.HeadCell>{t("campaigns.columns.cpa")}</Table.HeadCell>
              <Table.HeadCell>{t("campaigns.columns.roi")}</Table.HeadCell>
              <Table.HeadCell>{t("campaigns.columns.actions")}</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {filteredCampaigns.map((campaign) => (
                <Table.Row
                  key={campaign.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {campaign.name}
                  </Table.Cell>
                  <Table.Cell>{campaign.platform}</Table.Cell>
                  <Table.Cell>
                    <Badge
                      color={getStatusBadgeColor(campaign.status)}
                      className="w-max capitalize"
                    >
                      {campaign.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{formatCurrency(campaign.budget)}</Table.Cell>
                  <Table.Cell>{formatCurrency(campaign.spend)}</Table.Cell>
                  <Table.Cell>
                    {campaign.impressions.toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>{campaign.clicks.toLocaleString()}</Table.Cell>
                  <Table.Cell>{campaign.ctr.toFixed(2)}%</Table.Cell>
                  <Table.Cell>
                    {campaign.conversions.toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>{formatCurrency(campaign.cpa)}</Table.Cell>
                  <Table.Cell
                    className={
                      campaign.roi >= 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    {campaign.roi.toFixed(2)}%
                  </Table.Cell>
                  <Table.Cell>
                    <Dropdown
                      label={<MoreVertical className="h-5 w-5" />}
                      arrowIcon={false}
                      inline
                    >
                      <Dropdown.Item>{t("common.view")}</Dropdown.Item>
                      <Dropdown.Item>{t("common.edit")}</Dropdown.Item>
                      <Dropdown.Item>
                        {campaign.status === "active"
                          ? t("common.pause")
                          : t("common.activate")}
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item color="failure">
                        {t("common.delete")}
                      </Dropdown.Item>
                    </Dropdown>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Campaigns;
