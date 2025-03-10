import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ICampaignData } from "../interface";
import { Modal } from "flowbite-react";

interface IChartDataProps {
  isModalOpen: boolean;
  selectedCampaign?: ICampaignData;
  closeModal: () => void;
}
const CampaignChartData = (props: IChartDataProps) => {
  const { closeModal, isModalOpen, selectedCampaign } = props;
  return (
    <Modal show={selectedCampaign && isModalOpen} onClose={() => closeModal()}>
      <Modal.Header>{selectedCampaign?.name} Performance</Modal.Header>
      <Modal.Body>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={selectedCampaign?.chartData || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </Modal.Body>
    </Modal>
  );
};

export default CampaignChartData;
