import React, { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useTranslation } from "react-i18next";
import AnimatedModal from "../../../components/AnimatedModal";
import { httpService } from "../../../services/httpService";
import { API_CONFIG } from "../../../shared/constants";
import { toast } from "react-hot-toast";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  open,
  onClose,
}) => {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!currentPassword) {
      newErrors.currentPassword = t("auth.currentPasswordRequired");
    }

    if (!newPassword) {
      newErrors.newPassword = t("auth.newPasswordRequired");
    } else if (newPassword.length < 8) {
      newErrors.newPassword = t("auth.passwordMinLength");
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t("auth.confirmPasswordRequired");
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = t("auth.passwordsDoNotMatch");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await httpService.post(API_CONFIG.path.changePassword, {
        current_password: currentPassword,
        new_password: newPassword,
      });

      toast.success(t("auth.passwordChangeSuccess"));
      onClose();
      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
    } catch (error) {
      console.log(" handleSubmit error:", error);
      toast.error(t("auth.passwordChangeError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedModal
      show={open}
      onClose={onClose}
      title={t("auth.changePassword")}
      size="md"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="currentPassword" value={t("auth.currentPassword")} />
          <TextInput
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              setErrors((prev) => ({ ...prev, currentPassword: undefined }));
            }}
            color={errors.currentPassword ? "failure" : undefined}
            helperText={errors.currentPassword}
          />
        </div>

        <div>
          <Label htmlFor="newPassword" value={t("auth.newPassword")} />
          <TextInput
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setErrors((prev) => ({ ...prev, newPassword: undefined }));
            }}
            color={errors.newPassword ? "failure" : undefined}
            helperText={errors.newPassword}
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword" value={t("auth.confirmPassword")} />
          <TextInput
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }}
            color={errors.confirmPassword ? "failure" : undefined}
            helperText={errors.confirmPassword}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <Button color="light" onClick={onClose}>
          {t("common.cancel")}
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading} color="indigo">
          {isLoading ? t("common.saving") : t("common.save")}
        </Button>
      </div>
    </AnimatedModal>
  );
};

export default ChangePasswordModal;
