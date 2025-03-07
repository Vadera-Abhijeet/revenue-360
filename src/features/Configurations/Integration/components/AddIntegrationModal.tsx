import {
  Button,
  Modal,
  TextInput,
  Select,
  ToggleSwitch,
  Label,
} from "flowbite-react";
import { useState } from "react";
import { PLATFORM_OPTIONS } from "../../../../shared/constants";
import {
  IIntegrations,
  IIntegrationsSet,
  TPlatformsType,
} from "../../../../interfaces";
import { useTranslation } from "react-i18next";
interface IAddNewIntegrationComponentProps {
  open: boolean;
  closeModal: () => void;
  onAddIntegration: (payload: IIntegrations) => void;
}
const NewIntegrationModal = (props: IAddNewIntegrationComponentProps) => {
  const { t } = useTranslation();
  const { open, closeModal, onAddIntegration } = props;
  const [inward, setInward] = useState<IIntegrationsSet>({
    platform: "googleAds",
    accountEmail: "",
    accountId: "",
    connected: false,
  });
  const [outward, setOutward] = useState<IIntegrationsSet>({
    platform: "adMob",
    connected: false,
    accountEmail: "",
    accountId: "",
  });

  return (
    <Modal dismissible show={open} size={"4xl"} onClose={() => closeModal()}>
      <Modal.Header>
        {t("configurations.integrations.add_new_integration")}
      </Modal.Header>
      <Modal.Body>
        <div className="flex justify-center items-center gap-6">
          {[
            {
              label: t("configurations.integrations.inward"),
              state: inward,
              setState: setInward,
            },
            {
              label: t("configurations.integrations.outward"),
              state: outward,
              setState: setOutward,
            },
          ].map(({ label, state, setState }, index) => (
            <div key={label} className="mb-4 space-y-2 w-full">
              <h3 className="font-bold text-indigo-700">{label}</h3>
              <div className="space-y-1">
                <Label htmlFor={`selectPlatform${index}`}>
                  {t("configurations.integrations.select_platform")}
                </Label>
                <Select
                  id={`selectPlatform${index}`}
                  color={"indigo"}
                  value={state.platform}
                  onChange={(e) =>
                    setState({
                      ...state,
                      platform: e.target.value as TPlatformsType,
                    })
                  }
                >
                  {PLATFORM_OPTIONS.map(({ label, value }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor={`email${index}`}>
                  {" "}
                  {t("configurations.integrations.email")}
                </Label>
                <TextInput
                  id={`email${index}`}
                  color={"indigo"}
                  placeholder={t("configurations.integrations.email")}
                  value={state.accountEmail}
                  onChange={(e) =>
                    setState({ ...state, accountEmail: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`accountId${index}`}>
                  {t("configurations.integrations.accountId")}
                </Label>
                <TextInput
                  id={`accountId${index}`}
                  color={"indigo"}
                  placeholder={t("configurations.integrations.accountId")}
                  value={state.accountId}
                  onChange={(e) =>
                    setState({ ...state, accountId: e.target.value })
                  }
                />
              </div>
              <ToggleSwitch
                color="indigo"
                label={t("configurations.integrations.connection_status")}
                checked={state.connected}
                onChange={(connected) => setState({ ...state, connected })}
              ></ToggleSwitch>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-end">
        <Button color="light" onClick={() => closeModal()}>
          {t("common.cancel")}
        </Button>
        <Button
          color="indigo"
          onClick={() => {
            onAddIntegration({ inward, outward });
            closeModal();
          }}
        >
          {t("common.save")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewIntegrationModal;
