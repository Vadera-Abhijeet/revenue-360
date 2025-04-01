import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AnimatedModal from "../../../../components/AnimatedModal";
import { httpService } from "../../../../services/httpService";
import { API_CONFIG } from "../../../../shared/constants";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";
import Loading from "../../../../components/Loading";

interface InviteTeamMemberModalProps {
  open: boolean;
  onClose: () => void;
  onInvite: (email: string, permissions: string[], isOwner: boolean) => void;
}

interface Permission {
  id: number;
  name: string;
  codename: string;
  category: string;
  description: string;
}

interface ApiResponse {
  permissions: IPermissionCategories;
}

interface IPermissionCategories {
  account: Permission[];
  application: Permission[];
  module: Permission[];
}

const InviteTeamMemberModal: React.FC<InviteTeamMemberModalProps> = ({
  open,
  onClose,
  onInvite,
}) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<{
    [key: string]: boolean;
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<IPermissionCategories>({
    account: [],
    application: [],
    module: [],
  });
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [errors, setErrors] = useState<{
    email?: string;
    permissions?: string;
  }>({});

  useEffect(() => {
    setIsLoading(true);
    httpService
      .get<ApiResponse>(API_CONFIG.path.categorizedPermissions)
      .then((res) => {
        setPermissions(res.permissions);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching permissions:", error);
        setPermissions({
          account: [],
          application: [],
          module: [],
        });
        setIsLoading(false);
      });
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: { email?: string; permissions?: string } = {};

    if (!email) {
      newErrors.email = t("configurations.team.emailRequired");
    } else if (!validateEmail(email)) {
      newErrors.email = t("configurations.team.invalidEmail");
    }

    // Only validate permissions if not an owner
    if (!isOwner) {
      const selectedCount =
        Object.values(selectedPermissions).filter(Boolean).length;
      if (selectedCount === 0) {
        newErrors.permissions = t("configurations.team.minPermissionsRequired");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePermissionChange = (codename: string, checked: boolean) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [codename]: checked,
    }));
    // Clear permissions error when a permission is selected
    if (checked) {
      setErrors((prev) => ({ ...prev, permissions: undefined }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear email error when user types
    setErrors((prev) => ({ ...prev, email: undefined }));
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const categoryPermissions =
      permissions[category as keyof IPermissionCategories];
    const newSelectedPermissions = { ...selectedPermissions };

    categoryPermissions.forEach((permission) => {
      newSelectedPermissions[permission.codename] = checked;
    });

    setSelectedPermissions(newSelectedPermissions);
    // Clear permissions error when a category is selected
    if (checked) {
      setErrors((prev) => ({ ...prev, permissions: undefined }));
    }
  };

  const isCategoryFullySelected = (category: string) => {
    const categoryPermissions =
      permissions[category as keyof IPermissionCategories];
    return (
      categoryPermissions.length > 0 &&
      categoryPermissions.every((p) => selectedPermissions[p.codename])
    );
  };

  const isCategoryPartiallySelected = (category: string) => {
    const categoryPermissions =
      permissions[category as keyof IPermissionCategories];
    return (
      categoryPermissions.some((p) => selectedPermissions[p.codename]) &&
      !isCategoryFullySelected(category)
    );
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const selectedPermissionCodenames = Object.entries(selectedPermissions)
        .filter(([, value]) => value)
        .map(([codename]) => codename);

      onInvite(email, selectedPermissionCodenames, isOwner);
      onClose();
    }
  };

  const categories = [
    { key: "account", label: "Account Management" },
    { key: "application", label: "Application Access" },
    { key: "module", label: "Module Access" },
  ];

  return (
    <AnimatedModal
      show={open}
      onClose={onClose}
      title={t("configurations.team.invite")}
      size="xl"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="email" value={t("configurations.team.email")} />
          <TextInput
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="name@company.com"
            required
            color={errors.email ? "failure" : undefined}
            helperText={errors.email}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isOwner"
            checked={isOwner}
            onChange={(e) => setIsOwner(e.target.checked)}
            color="indigo"
          />
          <Label htmlFor="isOwner" className="text-gray-900">
            Is Owner
          </Label>
        </div>

        {!isOwner && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {t("configurations.team.permissions")}
              </h3>
              {errors.permissions && (
                <span className="text-sm text-red-500">
                  {errors.permissions}
                </span>
              )}
            </div>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loading className="h-[200px]" />
              </div>
            ) : (
              <div className="space-y-2 max-h-[calc(100vh-380px)] overflow-y-auto">
                {categories.map(({ key, label }) => (
                  <div key={key} className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleCategory(key)}
                      className="w-full px-4 py-2 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className="flex items-center space-x-2 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCategoryChange(
                              key,
                              !isCategoryFullySelected(key)
                            );
                          }}
                        >
                          <Checkbox
                            color={"indigo"}
                            id={`category-${key}`}
                            checked={isCategoryFullySelected(key)}
                            ref={(input) => {
                              if (input) {
                                input.indeterminate =
                                  isCategoryPartiallySelected(key);
                              }
                            }}
                            onChange={(e) =>
                              handleCategoryChange(key, e.target.checked)
                            }
                            className="mr-2"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className="font-medium capitalize select-none">
                            {label}
                          </span>
                        </div>
                      </div>
                      <motion.div
                        animate={{
                          rotate: expandedCategories.includes(key) ? 180 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                        className="cursor-pointer"
                      >
                        <ChevronDownIcon className="w-4 h-4" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {expandedCategories.includes(key) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {permissions[
                                key as keyof IPermissionCategories
                              ].map((permission) => (
                                <motion.div
                                  key={permission.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <Checkbox
                                    color={"indigo"}
                                    id={permission.codename}
                                    checked={
                                      selectedPermissions[
                                        permission.codename
                                      ] || false
                                    }
                                    onChange={(e) =>
                                      handlePermissionChange(
                                        permission.codename,
                                        e.target.checked
                                      )
                                    }
                                    className="mt-1"
                                  />
                                  <div>
                                    <Label
                                      htmlFor={permission.codename}
                                      className="font-medium text-gray-900 select-none cursor-pointer"
                                    >
                                      {permission.name}
                                    </Label>
                                    <p className="text-sm text-gray-500">
                                      {permission.description}
                                    </p>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <Button color="light" onClick={onClose}>
          {t("common.cancel")}
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading} color={"indigo"}>
          {t("configurations.team.invite")}
        </Button>
      </div>
    </AnimatedModal>
  );
};

export default InviteTeamMemberModal;
