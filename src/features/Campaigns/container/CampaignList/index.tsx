import { Badge, Button, TextInput } from "flowbite-react";
import { BarChart2, Eye, Megaphone, Search } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import DateRangePicker from "../../../../components/DateRangePicker";
import Pagination from "../../../../components/Pagination";
import { Table } from "../../../../components/Table";
import { useCurrency } from "../../../../contexts/CurrencyContext";
import { fetchCampaigns } from "../../../../services/api";
import { DEFAULT_ITEMS_PER_PAGE } from "../../../../shared/constants";
import CampaignsDataTable from "../../component/CampaignListModal";
import { ICampaignData } from "../../interface";
import { ColumnDef } from "@tanstack/react-table";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

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
  }, [startDate, endDate]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
    // In a real app, we would refetch data with the new date range
  };

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) =>
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [campaigns, searchTerm]);

  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);

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

  // Define columns for the table
  const columns: ColumnDef<ICampaignData>[] = [
    {
      accessorKey: "name",
      header: t("apps.columns.name"),
      cell: ({ row }) => {
        const campaign = row.original;
        return (
          <div
            className="cursor-pointer flex items-center gap-2 hover:text-primary-600"
            onClick={() => navigate(`/campaigns/${campaign.id}`)}
          >
            <div className="w-10 h-10 flex justify-center items-center border border-gray-200 dark:border-gray-700 rounded-md">
              <img
                src={campaign.icon || "/default-app-icon.png"}
                alt={campaign.name}
                className="w-6 h-6"
              />
            </div>
            <div>
              <p>{campaign.name}</p>
              <p className="text-gray-400 text-xs">{campaign.platform}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "country",
      header: t("common.country"),
      cell: ({ row }) => {
        const campaign = row.original;
        return (
          <div className="flex items-center gap-2">
            <img
              src={campaign.flag}
              alt={campaign.country}
              className="w-6 h-4 rounded-sm border"
            />
            {campaign.country}
          </div>
        );
      },
    },
    {
      accessorKey: "estimateRevenueUSD",
      header: `${t("apps.columns.estimateRevenue")} (USD)`,
      cell: ({ row }) => row.original.estimateRevenueUSD,
    },
    {
      accessorKey: "totalCostUSD",
      header: `${t("apps.columns.totalCost")} (USD)`,
      cell: ({ row }) => row.original.totalCostUSD,
    },
    {
      accessorKey: "totalCostINR",
      header: t("apps.columns.totalCost"),
      cell: ({ row }) => row.original.totalCostINR,
    },
    {
      accessorKey: "netUSD",
      header: t("apps.columns.netUSD"),
      cell: ({ row }) => formatCurrency(row.original.netUSD),
    },
    {
      accessorKey: "percentage",
      header: t("apps.columns.percentage"),
      cell: ({ row }) => {
        const campaign = row.original;
        return (
          <Badge
            color={getPercentageBadgeColor(campaign.percentage)}
            className="px-3 py-1 w-max text-sm font-semibold"
          >
            {campaign.percentage.toFixed(2)}%
          </Badge>
        );
      },
    },
    {
      accessorKey: "lastBidCurrentBid",
      header: t("apps.columns.lastBidCurrentBid"),
      cell: ({ row }) => {
        const campaign = row.original;
        return `${campaign.lastBidINR} | ${campaign.currentBidINR}`;
      },
    },
    {
      id: "actions",
      header: t("apps.columns.actions"),
      cell: ({ row }) => {
        const campaign = row.original;
        return (
          <div className="flex items-center gap-2">
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
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Megaphone size={20} className="text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-700">
            {t("campaigns.title")}
          </h1>
        </div>
        <div className="flex gap-2">
          <DateRangePicker onDateRangeChange={handleDateRangeChange} />
          <TextInput
            color={"gray"}
            id="search"
            type="text"
            icon={Search}
            placeholder={t("campaigns.search")}
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <Table
        data={filteredCampaigns}
        columns={columns}
        isLoading={isLoading}
        showPagination={false}
        showSearch={false}
      />

      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredCampaigns.length}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          itemsPerPage={itemsPerPage}
        />
      )}

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
  );
};

export default Campaigns;
