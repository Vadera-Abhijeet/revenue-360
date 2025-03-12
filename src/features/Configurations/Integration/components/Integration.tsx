import { useMemo, useState } from "react";
import { Button, Card, TextInput, Modal } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { IIntegrations } from "../../../../interfaces";
import NewIntegrationModal from "./AddIntegrationModal";
import IntegrationBlock from "./IntegrationBlock";
import { PackagePlus, X } from "lucide-react";

export type TDirection = "inward" | "outward" | null;

interface IIntegrationsComponentProps {
  integrations?: IIntegrations[];
  onUpdateIntegration: (
    index: number,
    direction: TDirection,
    newEmail: string
  ) => void;
  onToggleConnection: (index: number, direction: TDirection) => void;
  onAddNewIntegrations: (payload: IIntegrations) => void;
  onDeleteIntegration: (index: number) => void;
}
interface IInitialModalStateInterface {
  index: number;
  open: boolean;
  direction: TDirection;
  email: string;
}
interface IInitialConfirmationPopUpInterface {
  index: number;
  open: boolean;
  direction: "inward" | "outward" | null;
  type: "connect" | "disconnect" | "updateEmail" | null;
}
const initialModalState: IInitialModalStateInterface = {
  index: -1,
  open: false,
  direction: null,
  email: "",
};
const initialConfirmationPopUpState: IInitialConfirmationPopUpInterface = {
  open: false,
  index: -1,
  direction: null,
  type: null,
};
const Integration = ({
  integrations = [],
  onUpdateIntegration,
  onToggleConnection,
  onAddNewIntegrations,
  onDeleteIntegration,
}: IIntegrationsComponentProps) => {
  const { t } = useTranslation();
  const [editModal, setEditModal] = useState(initialModalState);
  const [confirmModal, setConfirmModal] = useState(
    initialConfirmationPopUpState
  );

  const [confirmDeleteIntegrationModal, setConfirmDeleteIntegrationModal] =
    useState({ open: false, index: -1 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState("");

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActionType("");
  };

  const isAddNewIntegrationModalOpen = useMemo(
    () => isModalOpen && actionType === "addNewIntegration",
    [isModalOpen, actionType]
  );

  return (
    <div className="space-y-4">
      <Card
        theme={{
          root: {
            children: "flex h-full flex-col justify-center gap-4 p-4",
          },
        }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-indigo-700">
            {t("configurations.integrations.title")}
          </h2>
          <Button
            size="sm"
            color="indigo"
            onClick={() => {
              setIsModalOpen(true);
              setActionType("addNewIntegration");
            }}
          >
            <div className="flex items-center gap-1">
              <PackagePlus className="mr-2 h-4 w-4" />
              {t("configurations.integrations.addNew")}
            </div>
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-2 gap-6">
        {integrations.map((integrationSet, index) => (
          <Card
            key={index}
            className="shadow-md border border-gray-200 relative"
          >
            <div
              className="bg-red-500 hover:bg-red-600 cursor-pointer hover:rotate-180 transition delay-100 duration-300 ease-in-out  absolute top-[-8px] right-[-8px] h-8 w-8 flex items-center justify-center rounded-full"
              onClick={() =>
                setConfirmDeleteIntegrationModal({ open: true, index })
              }
            >
              <X color="white" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="border-r pr-4">
                <IntegrationBlock
                  integration={integrationSet.inward}
                  t={t}
                  onEditEmail={(email) =>
                    setEditModal({
                      open: true,
                      index,
                      email,
                      direction: "inward",
                    })
                  }
                  onToggleConnection={() =>
                    setConfirmModal({
                      open: true,
                      index,
                      direction: "inward",
                      type: integrationSet.inward.connected
                        ? "disconnect"
                        : "connect",
                    })
                  }
                />
              </div>
              <div>
                <IntegrationBlock
                  integration={integrationSet.outward}
                  t={t}
                  onEditEmail={(email) =>
                    setEditModal({
                      open: true,
                      index,
                      email,
                      direction: "outward",
                    })
                  }
                  onToggleConnection={() =>
                    setConfirmModal({
                      open: true,
                      index,
                      direction: "outward",
                      type: integrationSet.outward.connected
                        ? "disconnect"
                        : "connect",
                    })
                  }
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        size={"md"}
        show={editModal.open}
        onClose={() => setEditModal(initialModalState)}
      >
        <Modal.Header>
          {t("configurations.integrations.editEmail")}
        </Modal.Header>
        <Modal.Body>
          <TextInput
            color={"indigo"}
            value={editModal.email}
            onChange={(e) =>
              setEditModal((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </Modal.Body>
        <Modal.Footer className="justify-center">
          <Button color="light" onClick={() => setEditModal(initialModalState)}>
            {t("common.cancel")}
          </Button>
          <Button
            color={"indigo"}
            onClick={() => {
              setConfirmModal({
                open: true,
                index: editModal.index,
                direction: editModal.direction,
                type: "updateEmail",
              });
              setEditModal((prevState) => ({
                ...prevState,
                open: false,
              }));
            }}
          >
            {t("common.save")}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        size={"md"}
        show={confirmModal.open}
        onClose={() => setConfirmModal({ ...confirmModal, open: false })}
      >
        <Modal.Header>{t(`common.confirmation`)}</Modal.Header>
        <Modal.Body>
          <p>
            {confirmModal.type === "updateEmail"
              ? t("configurations.integrations.confirmEmailUpdate")
              : confirmModal.type === "connect"
              ? t("configurations.integrations.confirmConnect")
              : t("configurations.integrations.confirmDisconnect")}
          </p>
        </Modal.Body>
        <Modal.Footer className="justify-center">
          <Button
            color="light"
            onClick={() => {
              setConfirmModal({ ...confirmModal, open: false });
              if (confirmModal.type === "updateEmail") {
                setEditModal((prevState) => ({
                  ...prevState,
                  open: true,
                }));
              }
            }}
          >
            {t("common.cancel")}
          </Button>
          <Button
            color={"indigo"}
            onClick={() => {
              if (confirmModal.type === "updateEmail") {
                onUpdateIntegration(
                  editModal.index,
                  editModal.direction,
                  editModal.email
                );
                setEditModal(initialModalState);
              } else {
                onToggleConnection(confirmModal.index, confirmModal.direction);
              }
              setConfirmModal({ ...confirmModal, open: false });
            }}
          >
            {t("common.confirm")}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        size="md"
        show={confirmDeleteIntegrationModal.open}
        onClose={() =>
          setConfirmDeleteIntegrationModal({
            ...confirmDeleteIntegrationModal,
            open: false,
          })
        }
      >
        <Modal.Header>{t("common.confirmation")}</Modal.Header>
        <Modal.Body>
          <p>{t("configurations.integrations.confirmDelete")}</p>
        </Modal.Body>
        <Modal.Footer className="justify-center">
          <Button
            color="light"
            onClick={() =>
              setConfirmDeleteIntegrationModal({
                ...confirmDeleteIntegrationModal,
                open: false,
              })
            }
          >
            {t("common.cancel")}
          </Button>
          <Button
            color={"indigo"}
            onClick={() => {
              onDeleteIntegration(confirmDeleteIntegrationModal.index);
              setConfirmDeleteIntegrationModal({
                ...confirmDeleteIntegrationModal,
                open: false,
              });
            }}
          >
            {t("common.confirm")}
          </Button>
        </Modal.Footer>
      </Modal>

      <NewIntegrationModal
        key={isAddNewIntegrationModalOpen.toString()}
        onAddIntegration={onAddNewIntegrations}
        closeModal={handleCloseModal}
        open={isAddNewIntegrationModalOpen}
      />
    </div>
  );
};

export default Integration;
