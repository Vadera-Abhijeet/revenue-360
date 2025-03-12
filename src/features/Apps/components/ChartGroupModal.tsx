import React, { useState } from "react";
import { Modal, Button, Label, TextInput } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { ChartGroup } from "../../../interfaces";

interface ChartGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (group: ChartGroup) => void;
  initialGroup?: ChartGroup;
}

const ChartGroupModal: React.FC<ChartGroupModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialGroup,
}) => {
  const { t } = useTranslation();
  const [group, setGroup] = useState<ChartGroup>(
    initialGroup || {
      id: crypto.randomUUID(),
      name: "",
      order: 0,
      charts: [],
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(group);
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={onClose}>
      <Modal.Header>
        {initialGroup
          ? t("charts.editGroup")
          : t("charts.createGroup")}
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value={t("charts.groupName")} />
            </div>
            <TextInput
              id="name"
              value={group.name}
              onChange={(e) =>
                setGroup((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button color="light" onClick={onClose}>
          {t("common.cancel")}
        </Button>
        <Button color="indigo" onClick={handleSubmit}>
          {t("common.save")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChartGroupModal;