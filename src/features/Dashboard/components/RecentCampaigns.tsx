import { Badge, Card, Table } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../../../contexts/CurrencyContext";
import { IRecentCampaignsEntity } from "../interface";
import { useState } from "react";

const RecentCampaigns = ({
  data = [],
}: {
  data?: IRecentCampaignsEntity[];
}) => {
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Filter campaigns based on active filter
  const filteredCampaigns = data.filter((campaign) => {
    if (activeFilter === "all") return true;
    return campaign.status === activeFilter;
  });

  // Custom filter button component
  const FilterButton = ({
    value,
    label,
    color,
  }: {
    value: string;
    label: string;
    color?: string;
  }) => {
    const isActive = activeFilter === value;

    return (
      <button
        onClick={() => setActiveFilter(value)}
        className={`px-4 py-2 text-sm font-medium rounded-md mr-2 ${
          isActive
            ? "bg-gray-100 text-gray-900"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
        }`}
      >
        {color && (
          <span
            className={`inline-block w-2 h-2 rounded-full bg-${color}-500 mr-2`}
          ></span>
        )}
        {label}
      </button>
    );
  };

  return (
    <Card>
      <div className="h-full">
        <div className="mb-4 flex justify-between items-center">
          <h5 className="text-xl font-bold text-gray-900 mb-3">
            {t("dashboard.recentCampaigns.title")}
          </h5>
          <div className="flex flex-wrap border-b border-gray-200 pb-2">
            <FilterButton value="all" label="All" />
            <FilterButton value="active" label="Active" color="green" />
            <FilterButton value="paused" label="Paused" color="yellow" />
            <FilterButton value="completed" label="Completed" color="red" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <Table.Head>
              <Table.HeadCell>
                {t("dashboard.recentCampaigns.campaign")}
              </Table.HeadCell>
              <Table.HeadCell>
                {t("dashboard.recentCampaigns.status")}
              </Table.HeadCell>
              <Table.HeadCell>
                {t("dashboard.recentCampaigns.spend")}
              </Table.HeadCell>
              <Table.HeadCell>
                {t("dashboard.recentCampaigns.conversions")}
              </Table.HeadCell>
              <Table.HeadCell>
                {t("dashboard.recentCampaigns.cpa")}
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {filteredCampaigns.length > 0 ? (
                filteredCampaigns.map((campaign) => (
                  <Table.Row
                    key={campaign.id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {campaign.name}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        color={
                          campaign.status === "active"
                            ? "success"
                            : campaign.status === "paused"
                            ? "warning"
                            : "failure"
                        }
                        className="w-max capitalize"
                      >
                        {campaign.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>{formatCurrency(campaign.spend)}</Table.Cell>
                    <Table.Cell>{campaign.conversions}</Table.Cell>
                    <Table.Cell>{formatCurrency(campaign.cpa)}</Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={5} className="text-center py-4">
                    No campaigns found with the selected status.
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export default RecentCampaigns;
