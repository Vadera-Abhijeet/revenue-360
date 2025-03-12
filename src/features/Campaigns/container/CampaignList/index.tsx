import { Badge, Button, Table, TextInput } from "flowbite-react";
import { BarChart2, Eye, Search } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import DateRangePicker from "../../../../components/DateRangePicker";
import { useCurrency } from "../../../../contexts/CurrencyContext";
import { fetchCampaigns } from "../../../../services/api";
import CampaignsDataTable from "../../component/CampaignListModal";
import { ICampaignData } from "../../interface";

const Campaigns: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { formatCurrency } = useCurrency();
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<ICampaignData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<ICampaignData>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState("");

  const [startDate, setStartDate] = useState<Date>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  console.log(" startDate:", startDate);
  const [endDate, setEndDate] = useState<Date>(new Date());
  console.log(" endDate:", endDate);

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

  const filteredCampaigns = useMemo(
    () =>
      campaigns.filter((campaign) => {
        const search = searchTerm.toLowerCase();

        return Object.values(campaign).some((value) =>
          String(value).toLowerCase().includes(search)
        );
      }),
    [campaigns, searchTerm]
  );

  const getPercentageBadgeColor = (percentage: number) => {
    if (percentage <= 0.25) return "failure";
    if (percentage <= 0.5) return "warning";
    return "success";
  };

  const handleOpenModal = (campaign: ICampaignData, actionType: string) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
    setActionType(actionType);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-indigo-700">
          {t("campaigns.title")}
        </h1>
        <div className="flex gap-2">
          <DateRangePicker onDateRangeChange={handleDateRangeChange} />
          <TextInput
            color={"indigo"}
            id="search"
            type="text"
            icon={Search}
            placeholder={t("campaigns.search")}
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-md">
          <Table>
            <Table.Head className="border-b h-[50px] border-gray-200 dark:border-gray-700">
              <Table.HeadCell>{t("apps.columns.name")}</Table.HeadCell>
              <Table.HeadCell>{t("common.country")}</Table.HeadCell>

              <Table.HeadCell>
                {`${t("apps.columns.estimateRevenue")} (USD)`}
              </Table.HeadCell>
              <Table.HeadCell>
                {`${t("apps.columns.totalCost")} (USD)`}
              </Table.HeadCell>
              <Table.HeadCell>{t("apps.columns.totalCost")}</Table.HeadCell>
              <Table.HeadCell>{t("apps.columns.netUSD")}</Table.HeadCell>
              <Table.HeadCell>{t("apps.columns.percentage")}</Table.HeadCell>
              <Table.HeadCell>
                {t("apps.columns.lastBidCurrentBid")}
              </Table.HeadCell>
              <Table.HeadCell>{t("apps.columns.actions")}</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {filteredCampaigns.map((campaign) => (
                <Table.Row
                  key={campaign.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <div
                      className="cursor-pointer flex items-center gap-2 hover:text-primary-600"
                      onClick={() => navigate(`/campaigns/${campaign.id}`)}
                    >
                      <div className="w-10 h-10 flex justify-center items-center border border-gray-200 dark:border-gray-700 rounded-md">
                        <img
                          src={campaign.icon || "/default-app-icon.png"} // Default icon if none provided
                          alt={campaign.name}
                          className="w-6 h-6"
                        />
                      </div>
                      <div>
                        <p>{campaign.name}</p>
                        <p className="text-gray-400 text-xs">
                          {campaign.platform}
                        </p>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="flex items-center gap-2">
                    <img
                      src={campaign.flag}
                      alt={campaign.country}
                      className="w-6 h-4 rounded-sm border"
                    />
                    {campaign.country}
                  </Table.Cell>
                  <Table.Cell>{campaign.estimateRevenueUSD}</Table.Cell>
                  <Table.Cell>{campaign.totalCostUSD}</Table.Cell>
                  <Table.Cell>{campaign.totalCostINR}</Table.Cell>
                  <Table.Cell>{formatCurrency(campaign.netUSD)}</Table.Cell>
                  <Table.Cell>
                    <Badge
                      color={getPercentageBadgeColor(campaign.percentage)}
                      className="px-3 py-1 w-max text-sm font-semibold"
                    >
                      {campaign.percentage.toFixed(2)}%
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    {campaign.lastBidINR} | {campaign.currentBidINR}
                  </Table.Cell>
                  <Table.Cell className="flex items-center gap-2">
                    <Button
                      color="light"
                      size="xs"
                      onClick={() => navigate(`/campaigns/${campaign.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      color="green"
                      size="xs"
                      onClick={() => handleOpenModal(campaign, "setActionType")}
                    >
                      <BarChart2 className="h-4 w-4" />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <CampaignsDataTable
            actionType={actionType}
            isModalOpen={isModalOpen}
            selectedCampaign={selectedCampaign}
            closeModal={() => {
              setIsModalOpen(false);
              setSelectedCampaign(undefined);
              setActionType("");
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Campaigns;
