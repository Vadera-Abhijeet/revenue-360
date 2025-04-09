import { Button, Checkbox, Label, Spinner, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AnimatedModal from "../../../../components/AnimatedModal";
import { httpService } from "../../../../services/httpService";
import { API_CONFIG } from "../../../../shared/constants";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";
import Loading from "../../../../components/Loading";
import {
  ApiResponse,
  InviteTeamMemberModalProps,
  IPermissionCategories,
  Permission,
} from "../interface";
import { useAuth } from "../../../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface FormData {
  email: string;
  isOwner: boolean;
  permissions: IPermissionCategories;
}

const InviteTeamMemberModal: React.FC<InviteTeamMemberModalProps> = ({
  open,
  onClose,
  onInvite,
  selectedMember,
  isInviting,
  existingMembers = [],
}) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [availablePermissions, setAvailablePermissions] =
    useState<IPermissionCategories>({
      account: [],
      application: [],
      module: [],
    });
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const permissionSchema = yup.object().shape({
    id: yup.number().required(),
    codename: yup.string().required(),
    name: yup.string().required(),
    description: yup.string().required(),
    category: yup.string().required(),
    enabled: yup.boolean().required(),
  });

  const schema = yup.object().shape({
    email: yup
      .string()
      .required(t("configurations.team.emailRequired"))
      .email(t("configurations.team.invalidEmail"))
      .test(
        "not-self",
        t("configurations.team.cannotInviteYourself"),
        (value) => {
          if (!value || !user?.email) return true;
          return value.toLowerCase() !== user.email.toLowerCase();
        }
      )
      .test(
        "not-existing",
        t("configurations.team.emailAlreadyInvited"),
        (value) => {
          if (!value) return true;
          return !existingMembers.some(
            (member) =>
              member.email.toLowerCase() === value.toLowerCase() &&
              (!selectedMember ||
                member.email.toLowerCase() !==
                  selectedMember.email.toLowerCase())
          );
        }
      ),
    isOwner: yup.boolean().required(),
    permissions: yup
      .object()
      .shape({
        account: yup.array().of(permissionSchema).required(),
        application: yup.array().of(permissionSchema).required(),
        module: yup.array().of(permissionSchema).required(),
      })
      .test(
        "min-permissions",
        t("configurations.team.minPermissionsRequired"),
        function (value: IPermissionCategories) {
          const isOwner = this.parent.isOwner;
          if (isOwner) return true;

          const totalEnabledPermissions = Object.values(value || {}).reduce(
            (count, category) =>
              count + category.filter((p: Permission) => p.enabled).length,
            0
          );
          return totalEnabledPermissions > 0;
        }
      ),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver<FormData>(schema),
    defaultValues: {
      email: selectedMember?.email || "",
      isOwner: selectedMember?.is_owner || false,
      permissions: {
        account: [],
        application: [],
        module: [],
      },
    },
    mode: "onChange",
  });

  const isOwner = watch("isOwner");
  const formPermissions = watch("permissions");

  useEffect(() => {
    setIsLoading(true);
    httpService
      .get<ApiResponse>(API_CONFIG.path.categorizedPermissions)
      .then((res) => {
        setAvailablePermissions(res.permissions);
        // Initialize form permissions with the available permissions
        const initialPermissions = {
          account: res.permissions.account.map((p) => ({
            ...p,
            enabled: false,
          })),
          application: res.permissions.application.map((p) => ({
            ...p,
            enabled: false,
          })),
          module: res.permissions.module.map((p) => ({ ...p, enabled: false })),
        };
        setValue("permissions", initialPermissions);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching permissions:", error);
        setAvailablePermissions({
          account: [],
          application: [],
          module: [],
        });
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  // Initialize permissions from member if editing
  useEffect(() => {
    if (selectedMember?.permissions) {
      // Ensure all permissions from the selected member are properly initialized
      const memberPermissions = {
        account: availablePermissions.account.map((p) => ({
          ...p,
          enabled: selectedMember.permissions.account.some(
            (mp) => mp.id === p.id && mp.enabled
          ),
        })),
        application: availablePermissions.application.map((p) => ({
          ...p,
          enabled: selectedMember.permissions.application.some(
            (mp) => mp.id === p.id && mp.enabled
          ),
        })),
        module: availablePermissions.module.map((p) => ({
          ...p,
          enabled: selectedMember.permissions.module.some(
            (mp) => mp.id === p.id && mp.enabled
          ),
        })),
      };
      setValue("permissions", memberPermissions);
    }
    setValue("isOwner", selectedMember?.is_owner || false);
  }, [selectedMember, setValue, availablePermissions]);

  const handlePermissionChange = (
    category: keyof IPermissionCategories,
    permissionId: number,
    checked: boolean
  ) => {
    const updatedPermissions = { ...formPermissions };
    const permissionIndex = updatedPermissions[category].findIndex(
      (p) => p.id === permissionId
    );

    if (permissionIndex !== -1) {
      updatedPermissions[category][permissionIndex] = {
        ...updatedPermissions[category][permissionIndex],
        enabled: checked,
      };
      setValue("permissions", updatedPermissions);
    }
  };

  const handleCategoryChange = (
    category: keyof IPermissionCategories,
    checked: boolean
  ) => {
    const updatedPermissions = { ...formPermissions };
    updatedPermissions[category] = updatedPermissions[category].map(
      (permission) => ({
        ...permission,
        enabled: checked,
      })
    );
    setValue("permissions", updatedPermissions);
  };

  const isCategoryFullySelected = (category: keyof IPermissionCategories) => {
    return (
      formPermissions[category].length > 0 &&
      formPermissions[category].every((p) => p.enabled)
    );
  };

  const isCategoryPartiallySelected = (
    category: keyof IPermissionCategories
  ) => {
    return (
      formPermissions[category].some((p) => p.enabled) &&
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

  const onSubmit = (data: FormData) => {
    onInvite(data.email, data.isOwner, data.permissions);
  };

  const categories = [
    { key: "account", label: "Account Management" },
    { key: "application", label: "Application Access" },
    { key: "module", label: "Module Access" },
  ] as const;

  return (
    <AnimatedModal
      show={open}
      onClose={onClose}
      title={t("configurations.team.invite")}
      size="xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email" value={t("configurations.team.email")} />
          <TextInput
            id="email"
            type="email"
            {...register("email")}
            placeholder="name@company.com"
            color={errors.email ? "failure" : undefined}
            helperText={errors.email?.message}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="isOwner" {...register("isOwner")} color="indigo" />
          <Label htmlFor="isOwner" className="text-gray-900">
            {t("configurations.team.isOwner")}
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
                  {t("configurations.team.minPermissionsRequired")}
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
                      type="button"
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
                              {availablePermissions[key].map((permission) => (
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
                                      formPermissions[key].find(
                                        (p) => p.id === permission.id
                                      )?.enabled || false
                                    }
                                    onChange={(e) =>
                                      handlePermissionChange(
                                        key,
                                        permission.id,
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
      </form>

      <div className="flex justify-end space-x-2 mt-6">
        <Button
          color="light"
          onClick={onClose}
          disabled={isLoading || isInviting}
        >
          {t("common.cancel")}
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
          color={"indigo"}
        >
          <div className="flex items-center gap-2">
            {isInviting && <Spinner color={"purple"} size={"sm"} />}
            {t("configurations.team.invite")}
          </div>
        </Button>
      </div>
    </AnimatedModal>
  );
};

export default InviteTeamMemberModal;
