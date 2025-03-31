import { PuzzlePiece } from "@phosphor-icons/react";
import { Button, Card, Modal, TextInput } from "flowbite-react";
import { PackagePlus, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { IIntegrations, ISettings } from "../../../../interfaces";
import { fetchUserSettings } from "../../../../services/api";
import NewIntegrationModal from "../components/AddIntegrationModal";
import IntegrationBlock from "../components/IntegrationBlock";
import {
  IInitialConfirmationPopUpInterface,
  IInitialModalStateInterface,
  TDirection,
} from "../interface";

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

const Configurations: React.FC = () => {
  const { t } = useTranslation();
  const [editModal, setEditModal] = useState(initialModalState);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<ISettings | null>(null);
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

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const data = await fetchUserSettings();
        setSettings(data);
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleUpdateIntegration = (
    index: number,
    direction: "inward" | "outward" | null,
    newEmail: string
  ) => {
    if (settings?.integrations && direction !== null) {
      const updatedIntegrations = [...settings.integrations];
      const selectedSet = updatedIntegrations[index][direction];
      updatedIntegrations[index] = {
        ...updatedIntegrations[index],
        [direction]: {
          ...selectedSet,
          accountEmail: newEmail,
        },
      };
      setSettings({ ...settings, integrations: updatedIntegrations });
    }
  };

  const handleToggleIntegrationConnection = (
    index: number,
    direction: TDirection
  ) => {
    if (settings?.integrations && direction !== null) {
      const updatedIntegrations = [...settings.integrations];
      const selectedSet = updatedIntegrations[index][direction];
      updatedIntegrations[index] = {
        ...updatedIntegrations[index],
        [direction]: {
          ...selectedSet,
          connected: !selectedSet.connected,
        },
      };
      setSettings({ ...settings, integrations: updatedIntegrations });
    }
  };

  const handleDeleteIntegration = (selectedIndex: number) => {
    if (selectedIndex > -1 && settings?.integrations) {
      const clonedIntegrations = [...settings.integrations];
      setSettings({
        ...settings,
        integrations: clonedIntegrations.filter(
          (dt, index) => index !== selectedIndex
        ),
      });
    }
  };

  const handleAddNewIntegration = (integration: IIntegrations) => {
    if (settings?.integrations) {
      setSettings({
        ...settings,
        integrations: [...settings.integrations, integration],
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <PuzzlePiece size={20} className="text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-700">
            {t("configurations.integrations.title")}
          </h1>
        </div>
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
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-2 gap-6">
              {settings?.integrations.map((integrationSet, index) => (
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
              initialFocus={undefined}
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
                <Button
                  color="light"
                  onClick={() => setEditModal(initialModalState)}
                >
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
              initialFocus={undefined}
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
                      handleUpdateIntegration(
                        editModal.index,
                        editModal.direction,
                        editModal.email
                      );
                      setEditModal(initialModalState);
                    } else {
                      handleToggleIntegrationConnection(
                        confirmModal.index,
                        confirmModal.direction
                      );
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
              initialFocus={undefined}
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
                    handleDeleteIntegration(
                      confirmDeleteIntegrationModal.index
                    );
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
              onAddIntegration={handleAddNewIntegration}
              closeModal={handleCloseModal}
              open={isAddNewIntegrationModalOpen}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Configurations;
