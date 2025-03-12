import { useState } from "react";
import { Button, Modal, Select, Spinner } from "flowbite-react";
import { PLATFORM_OPTIONS } from "../../../../shared/constants";
import {
  IIntegrations,
  IIntegrationsSet,
  TPlatformsType,
} from "../../../../interfaces";
import { useTranslation } from "react-i18next";

import React from "react";

interface Step {
  title: string;
  description: string;
}

interface StepperProps {
  currentStep: number;
}

const steps: Step[] = [
  { title: "Inward", description: "Connect your inward connection" },
  { title: "Outward", description: "Connect your outward connection" },
  { title: "Summary", description: "Final summary" },
];

const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  return (
    <ol className="items-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse justify-between px-6 mb-4">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <li
            key={index}
            className={`flex items-center space-x-2.5 rtl:space-x-reverse ${
              isActive || isCompleted
                ? "text-indigo-600 dark:text-indigo-500"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {/* Step Number Circle */}
            <span
              className={`flex items-center justify-center w-8 h-8 border rounded-full shrink-0 
                ${
                  isCompleted
                    ? "border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500"
                    : isActive
                    ? "border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-500"
                    : "border-gray-500 dark:border-gray-400"
                }`}
            >
              {index + 1}
            </span>

            {/* Step Info */}
            <span>
              <h3 className="font-medium leading-tight">{step.title}</h3>
              <p className="text-sm">{step.description}</p>
            </span>
          </li>
        );
      })}
    </ol>
  );
};

const NewIntegrationModal = ({
  open,
  closeModal,
  onAddIntegration,
}: {
  open: boolean;
  closeModal: () => void;
  onAddIntegration: (payload: IIntegrations) => void;
}) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [inward, setInward] = useState<IIntegrationsSet>({
    platform: "googleAds",
    accountEmail: "",
    accountId: "",
    connected: false,
  });
  const [outward, setOutward] = useState<IIntegrationsSet>({
    platform: "adMob",
    accountEmail: "",
    accountId: "",
    connected: false,
  });

  const handleConnect = (setState: (state: IIntegrationsSet) => void) => {
    setLoading(true);
    setTimeout(() => {
      setState({
        platform: inward.platform,
        accountEmail: `user${Math.floor(Math.random() * 1000)}@example.com`,
        accountId: `ID-${Math.floor(Math.random() * 1000)}`,
        connected: true,
      });
      setStep((prev) => prev + 1);
      setLoading(false);
    }, 2000);
  };

  return (
    <Modal dismissible show={open} size="4xl" onClose={closeModal}>
      <Modal.Header>
        {t("configurations.integrations.add_new_integration")}
      </Modal.Header>
      <Modal.Body>
        <Stepper currentStep={step} />
        {step === 0 && (
          <div className="space-y-4">
            <Select
              color={"indigo"}
              value={inward.platform}
              onChange={(e) =>
                setInward({
                  ...inward,
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
            <div className="flex justify-end">
              <Button
                color="indigo"
                onClick={() => handleConnect(setInward)}
                isProcessing={loading}
                processingSpinner={<Spinner color="purple" />}
              >
                {`Connect ${
                  PLATFORM_OPTIONS.find((pt) => pt.value === inward.platform)
                    ?.label
                }`}
              </Button>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-4">
            <Select
              value={outward.platform}
              onChange={(e) =>
                setOutward({
                  ...outward,
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
            <div className="flex justify-end">
              <Button
                color="indigo"
                onClick={() => handleConnect(setOutward)}
                isProcessing={loading}
                processingSpinner={<Spinner color="purple" />}
              >
                {`Connect ${
                  PLATFORM_OPTIONS.find((pt) => pt.value === outward.platform)
                    ?.label
                }`}
              </Button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <h3>Summary</h3>
            <p>
              Inward Platform: {inward.platform} - {inward.accountEmail}
            </p>
            <p>
              Outward Platform: {outward.platform} - {outward.accountEmail}
            </p>
            <div className="flex justify-end">
              <Button
                color="primary"
                onClick={() => {
                  onAddIntegration({ inward, outward });
                  closeModal();
                }}
              >
                Finish
              </Button>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default NewIntegrationModal;
