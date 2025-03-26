import { useTranslation } from "react-i18next";
import { ICampaignData } from "../interface";
import { Modal, Table } from "flowbite-react";

interface IChartDataProps {
  isModalOpen: boolean;
  actionType: string;
  selectedCampaign?: ICampaignData;
  closeModal: () => void;
}
const CampaignsDataTable = (props: IChartDataProps) => {
  const { closeModal, isModalOpen, selectedCampaign } = props;
  const { t } = useTranslation();

  return (
    <Modal show={selectedCampaign && isModalOpen} onClose={() => closeModal()} initialFocus={undefined}>
      <Modal.Header>{`${selectedCampaign?.name}'s campaigns`}</Modal.Header>
      <Modal.Body>
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-md">
          <Table>
            <Table.Head className="border-b h-[50px] border-gray-200 dark:border-gray-700">
              <Table.HeadCell>{t("campaigns.columns.name")}</Table.HeadCell>
              <Table.HeadCell>{t("dashboard.topApps.cost")} (₹)</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {(selectedCampaign?.campaigns?.data || []).map(
                (campaign, index) => (
                  <Table.Row
                    key={index}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>{campaign.campaign}</Table.Cell>
                    <Table.Cell>{campaign.cost}</Table.Cell>
                  </Table.Row>
                )
              )}
            </Table.Body>
          </Table>
        </div>
        <p className="text-sm font-bold text-gray-700 dark:text-gray-400 px-6 mt-6">
          Total Campaign Costs (₹):{" "}
          {selectedCampaign?.campaigns?.totalCost || 0}
        </p>
      </Modal.Body>
    </Modal>
  );
};

export default CampaignsDataTable;
