import React, { useState } from "react";
import {
  Modal,
  Button,
  Label,
  TextInput,
  Select,
  Checkbox,
} from "flowbite-react";
import { useTranslation } from "react-i18next";

interface ConnectAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (appData: AppFormData) => void;
}

export interface AppFormData {
  name: string;
  appId: string;
  platform: string;
  category: string;
  integrations: {
    googleAds: boolean;
    adMob: boolean;
    firebase: boolean;
  };
}

const ConnectAppModal: React.FC<ConnectAppModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<AppFormData>({
    name: "",
    appId: "",
    platform: "android",
    category: "games",
    integrations: {
      googleAds: false,
      adMob: false,
      firebase: false,
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        [name]: checked,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form
    setFormData({
      name: "",
      appId: "",
      platform: "android",
      category: "games",
      integrations: {
        googleAds: false,
        adMob: false,
        firebase: false,
      },
    });
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <Modal.Header
        theme={{
          title: "text-xl font-medium text-indigo-600 dark:text-white",
        }}
      >
        {t("apps.connect.title")}
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <p className="text-sm text-gray-500">{t("apps.connect.subtitle")}</p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value={t("apps.connect.appName")} />
              </div>
              <TextInput
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="appId" value={t("apps.connect.appId")} />
              </div>
              <TextInput
                id="appId"
                name="appId"
                value={formData.appId}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="platform" value={t("apps.connect.platform")} />
              </div>
              <Select
                id="platform"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                required
              >
                <option value="android">Android</option>
                <option value="ios">iOS</option>
                <option value="web">Web</option>
                <option value="cross-platform">Cross-Platform</option>
              </Select>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="category" value={t("apps.connect.category")} />
              </div>
              <Select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="games">Games</option>
                <option value="business">Business</option>
                <option value="education">Education</option>
                <option value="entertainment">Entertainment</option>
                <option value="finance">Finance</option>
                <option value="health">Health & Fitness</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="productivity">Productivity</option>
                <option value="social">Social</option>
                <option value="utilities">Utilities</option>
                <option value="other">Other</option>
              </Select>
            </div>
            <div>
              <div className="mb-2 block">
                <Label value={t("apps.connect.integrations")} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="googleAds"
                    name="googleAds"
                    checked={formData.integrations.googleAds}
                    onChange={handleCheckboxChange}
                  />
                  <Label htmlFor="googleAds">Google Ads</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="adMob"
                    name="adMob"
                    checked={formData.integrations.adMob}
                    onChange={handleCheckboxChange}
                  />
                  <Label htmlFor="adMob">AdMob</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="firebase"
                    name="firebase"
                    checked={formData.integrations.firebase}
                    onChange={handleCheckboxChange}
                  />
                  <Label htmlFor="firebase">Firebase</Label>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Modal.Body>
      <Modal.Footer
        theme={{
          base: "flex items-center justify-end space-x-2 rounded-b border-gray-200 p-6 dark:border-gray-600",
        }}
      >
        <Button color="light" onClick={onClose}>
          {t("common.cancel")}
        </Button>
        <Button color={"indigo"} onClick={handleSubmit}>
          {t("apps.connect.submit")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConnectAppModal;
