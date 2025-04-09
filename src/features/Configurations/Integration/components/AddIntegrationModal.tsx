import {
  Button,
  Checkbox,
  Modal,
  Select,
  Spinner,
  Label,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import {
  IIntegrations,
  IIntegrationsSet,
  TPlatformsType,
} from "../../../../interfaces";
import { httpService } from "../../../../services/httpService";
import { API_CONFIG, PLATFORM_OPTIONS } from "../../../../shared/constants";

interface Step {
  title: string;
  description: string;
}

interface StepperProps {
  currentStep: number;
}

interface OAuthResponse {
  email: string;
  accountId: string;
  accessToken: string;
  refreshToken: string;
  [key: string]: string;
}

interface OAuthDetails {
  authorization_url: string;
}

interface GoogleAdsAccount {
  id: string;
  name: string;
  currency_code: string;
}

interface GoogleAdsAccountsResponse {
  customers: GoogleAdsAccount[];
}

interface GoogleAdsSubAccount {
  name: string;
  customer_id: number;
  level: number;
  manager: boolean;
  currency_code: string;
}

interface GoogleAdsSubAccountsResponse {
  sub_accounts: GoogleAdsSubAccount[];
  message: string;
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
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [processingOAuth, setProcessingOAuth] = useState(false);
  const [googleAdsAccounts, setGoogleAdsAccounts] = useState<
    GoogleAdsAccount[]
  >([]);
  const [googleAdsSubAccounts, setGoogleAdsSubAccounts] = useState<
    GoogleAdsSubAccount[]
  >([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [selectedSubAccounts, setSelectedSubAccounts] = useState<string[]>([]);
  const [oauthResponse, setOAuthResponse] = useState<OAuthResponse | null>(
    null
  );
  const [inward, setInward] = useState<IIntegrationsSet>({
    platform: "google_ads",
    accountEmail: "",
    accountId: "",
    connected: false,
    selectedAccounts: [],
    selectedSubAccounts: [],
  });
  const [outward, setOutward] = useState<IIntegrationsSet>({
    platform: "ad_mob",
    accountEmail: "",
    accountId: "",
    connected: false,
  });

  useEffect(() => {
    const fetchGoogleAdsAccounts = async () => {
      if (
        inward.platform === "google_ads" &&
        inward.connected &&
        oauthResponse
      ) {
        try {
          const response = await httpService.post<GoogleAdsAccountsResponse>(
            API_CONFIG.path.googleAdsAccounts,
            oauthResponse
          );
          setGoogleAdsAccounts(response.customers);
        } catch (error) {
          toast.error("Failed to fetch Google Ads accounts");
          console.error("Error fetching Google Ads accounts:", error);
        }
      }
    };

    fetchGoogleAdsAccounts();
  }, [inward.platform, inward.connected, oauthResponse]);

  useEffect(() => {
    const fetchGoogleAdsSubAccounts = async () => {
      if (
        inward.platform === "google_ads" &&
        inward.connected &&
        selectedAccounts.length > 0 &&
        oauthResponse
      ) {
        try {
          const response = await httpService.get<GoogleAdsSubAccountsResponse>(
            API_CONFIG.path.googleAdsSubAccounts,
            { customer_id: selectedAccounts[0] }
          );
          setGoogleAdsSubAccounts(response.sub_accounts);
        } catch (error) {
          toast.error("Failed to fetch Google Ads sub-accounts");
          console.error("Error fetching Google Ads sub-accounts:", error);
        }
      }
    };

    fetchGoogleAdsSubAccounts();
  }, [inward.platform, inward.connected, selectedAccounts, oauthResponse]);

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get("code");
      const integration = localStorage.getItem("integration");
      if (code && integration) {
        const { platform, step } = JSON.parse(integration);
        setProcessingOAuth(true);
        try {
          const response = await httpService.post<OAuthResponse>(
            API_CONFIG.path.googleOAuthCallback,
            {
              code,
              authorise_type: platform,
            }
          );

          setOAuthResponse(response);

          if (step === 0) {
            localStorage.setItem(
              "inward",
              JSON.stringify({
                accountEmail: response.email || "",
                accountId: response.accountId || "",
                connected: true,
                platform,
              })
            );
            setInward({
              accountEmail: response.email || "",
              accountId: response.accountId || "",
              connected: true,
              platform,
            });
          } else if (step === 1) {
            const inward = localStorage.getItem("inward");
            if (inward && outward) {
              setInward(JSON.parse(inward));
              setOutward({
                ...outward,
                accountEmail: response.email || "",
                accountId: response.accountId || "",
                connected: true,
                platform,
              });
            }
          }

          // setStep(step + 1);
          // navigate("/configurations/integrations", { replace: true });
        } catch (error) {
          toast.error("Failed to process OAuth code. Please try again.");
          console.error("OAuth error:", error);
        } finally {
          setProcessingOAuth(false);
        }
      }
    };

    if (open) {
      handleOAuthRedirect();
    }
  }, []);

  const handleConnect = () => {
    setLoading(true);
    const platform = step === 0 ? inward.platform : outward.platform;
    httpService
      .get<OAuthDetails>(`${API_CONFIG.path.googleOAuth}/${platform}`)
      .then((details) => {
        localStorage.setItem(
          "integration",
          JSON.stringify({
            platform,
            step,
          })
        );
        window.location.href = details.authorization_url;
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  };

  const handleAccountSelection = (accountId: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleSubAccountSelection = (subAccountId: string) => {
    setSelectedSubAccounts((prev) =>
      prev.includes(subAccountId)
        ? prev.filter((id) => id !== subAccountId)
        : [...prev, subAccountId]
    );
  };

  const handleNextStep = () => {
    if (inward.platform === "google_ads" && inward.connected) {
      if (selectedAccounts.length === 0) {
        toast.error("Please select at least one account");
        return;
      }
    }
    setStep(step + 1);
  };

  return (
    <Modal
      dismissible
      show={open}
      size="4xl"
      onClose={closeModal}
      initialFocus={undefined}
    >
      <Modal.Header>
        {t("configurations.integrations.add_new_integration")}
      </Modal.Header>
      <Modal.Body>
        {processingOAuth ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Spinner size="xl" color="purple" />
            <p className="text-gray-600">Processing OAuth authentication...</p>
          </div>
        ) : (
          <>
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
                {inward.platform === "google_ads" && inward.connected && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Select Accounts
                      </h3>
                      <div className="space-y-2">
                        {googleAdsAccounts.map((account) => (
                          <div
                            key={account.id}
                            className="flex items-center gap-2"
                          >
                            <Checkbox
                              id={`account-${account.id}`}
                              checked={selectedAccounts.includes(account.id)}
                              onChange={() =>
                                handleAccountSelection(account.id)
                              }
                            />
                            <Label htmlFor={`account-${account.id}`}>
                              {account.name || `Account ${account.id}`}
                              {account.currency_code && (
                                <span className="text-gray-500 dark:text-gray-300">
                                  {" "}
                                  ({account.currency_code})
                                </span>
                              )}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    {selectedAccounts.length > 0 &&
                      googleAdsSubAccounts.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">
                            Select Sub-Accounts
                          </h3>
                          <div className="space-y-2">
                            {googleAdsSubAccounts.map((subAccount) => (
                              <div
                                key={subAccount.customer_id}
                                className="flex items-center gap-2"
                              >
                                <Checkbox
                                  id={`subaccount-${subAccount.customer_id}`}
                                  checked={selectedSubAccounts.includes(
                                    subAccount.customer_id.toString()
                                  )}
                                  onChange={() =>
                                    handleSubAccountSelection(
                                      subAccount.customer_id.toString()
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={`subaccount-${subAccount.customer_id}`}
                                >
                                  {subAccount.name}
                                  <span className="text-gray-500 dark:text-gray-300">
                                    {" "}
                                    ({subAccount.currency_code})
                                  </span>
                                  {subAccount.manager && (
                                    <span className="text-blue-500 dark:text-blue-400 ml-2">
                                      (Manager)
                                    </span>
                                  )}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}
                <div className="flex justify-end">
                  {inward.platform === "google_ads" && inward.connected ? (
                    <Button
                      color="indigo"
                      onClick={handleNextStep}
                      disabled={selectedAccounts.length === 0}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      color="indigo"
                      onClick={handleConnect}
                      isProcessing={loading}
                      processingSpinner={<Spinner color="purple" />}
                    >
                      {`Connect ${
                        PLATFORM_OPTIONS.find(
                          (pt) => pt.value === inward.platform
                        )?.label
                      }`}
                    </Button>
                  )}
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
                    onClick={handleConnect}
                    isProcessing={loading}
                    processingSpinner={<Spinner color="purple" />}
                  >
                    {`Connect ${
                      PLATFORM_OPTIONS.find(
                        (pt) => pt.value === outward.platform
                      )?.label
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
                {inward.platform === "google_ads" && (
                  <>
                    <div>
                      <h4 className="font-medium">Selected Accounts:</h4>
                      <ul className="list-disc ml-6">
                        {selectedAccounts.map((accountId) => {
                          const account = googleAdsAccounts.find(
                            (a) => a.id === accountId
                          );
                          return (
                            <li key={accountId}>
                              {account?.name || `Account ${accountId}`}
                              {account?.currency_code
                                ? ` (${account.currency_code})`
                                : ""}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium">Selected Sub-Accounts:</h4>
                      <ul className="list-disc ml-6">
                        {selectedSubAccounts.map((subAccountId) => {
                          const subAccount = googleAdsSubAccounts.find(
                            (sa) => sa.customer_id.toString() === subAccountId
                          );
                          return (
                            <li key={subAccountId}>
                              {subAccount?.name || subAccountId}
                              {subAccount?.currency_code &&
                                ` (${subAccount.currency_code})`}
                              {subAccount?.manager && " (Manager)"}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </>
                )}
                <p>
                  Outward Platform: {outward.platform} - {outward.accountEmail}
                </p>
                <div className="flex justify-end">
                  <Button
                    color="primary"
                    onClick={() => {
                      if (inward) {
                        onAddIntegration({
                          inward: {
                            ...inward,
                            selectedAccounts,
                            selectedSubAccounts,
                          },
                          outward: outward,
                        });
                        closeModal();
                        localStorage.removeItem("integration");
                        localStorage.removeItem("inward");
                        localStorage.removeItem("outward");
                      }
                    }}
                  >
                    Finish
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default NewIntegrationModal;
