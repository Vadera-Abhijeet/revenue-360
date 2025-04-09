import { ColumnDef } from "@tanstack/react-table";
import { Badge, Button, Tooltip } from "flowbite-react";
import {
  ArrowUpDown,
  Pencil,
  Send,
  Trash2,
  User,
  UserPlus,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import AnimatedModal from "../../../../components/AnimatedModal";
import { Table } from "../../../../components/Table";
import { httpService } from "../../../../services/httpService";
import { API_CONFIG } from "../../../../shared/constants";
import InviteTeamMemberModal from "../components/InviteTeamMemberModal";
import { IPermissionCategories, ITeamMember } from "../interface";

const TeamManagement: React.FC = () => {
  const { t } = useTranslation();
  const [teamMembers, setTeamMembers] = useState<ITeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviting, setIsInviting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<
    "invite" | "reinvite" | "delete"
  >();
  const [selectedMember, setSelectedMember] = useState<ITeamMember>();
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = () => {
    setIsLoading(true);
    httpService
      .get<ITeamMember[]>(API_CONFIG.path.invitations)
      .then((res) => {
        setTeamMembers(res);
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error(err.message);
        setIsLoading(false);
      });
  };

  const handleInviteTeamMember = (
    email: string,
    isOwner: boolean,
    permissions: IPermissionCategories
  ) => {
    setIsInviting(true);
    const payload = {
      email,
      is_owner: isOwner,
      permissions: isOwner ? undefined : permissions,
    };

    httpService
      .post(API_CONFIG.path.invitations, payload)
      .then(() => {
        closeModal();
        fetchTeamMembers();
        toast.success(t("configurations.team.inviteSuccess"));
      })
      .catch((err) => {
        closeModal();
        toast.error(err.message);
      })
      .finally(() => {
        setIsInviting(false);
      });
  };

  const handleDeleteInvite = () => {
    setIsDeleting(true);
    httpService
      .delete(`${API_CONFIG.path.invitations}/${selectedMember?.id}`)
      .then(() => {
        closeModal();
        fetchTeamMembers();
        toast.success(t("configurations.team.deleteSuccess"));
      })
      .catch((err) => {
        closeModal();
        toast.error(err.message);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(undefined);
    setActionType(undefined);
    setIsInviting(false);
    setIsDeleting(false);
  };

  const columns = useMemo<ColumnDef<ITeamMember>[]>(
    () => [
      {
        accessorKey: "email",
        header: ({ column }) => (
          <div
            className="flex items-center cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("configurations.team.email")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        ),
      },
      {
        accessorKey: "is_owner",
        header: t("configurations.team.isOwner"),
        cell: ({ row }) => (
          <Badge
            color={row.original.is_owner ? "indigo" : "gray"}
            className="w-max capitalize"
          >
            {row.original.is_owner ? t("common.yes") : t("common.no")}
          </Badge>
        ),
      },
      {
        accessorKey: "status",
        header: t("configurations.team.status"),
        cell: ({ row }) => (
          <Badge
            color={row.original.status === "active" ? "success" : "warning"}
            className="w-max capitalize"
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: t("configurations.team.actions"),
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Tooltip content={t("common.edit")}>
              <Button
                size="xs"
                color="dark"
                onClick={() => {
                  setIsModalOpen(true);
                  setSelectedMember(row.original);
                  setActionType("invite");
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </Tooltip>
            {row.original.status === "invited" && (
              <Tooltip content={t("common.resend")}>
                <Button
                  size="xs"
                  color="indigo"
                  onClick={() => {
                    setIsModalOpen(true);
                    setSelectedMember(row.original);
                    setActionType("reinvite");
                  }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </Tooltip>
            )}
            <Tooltip content={t("common.delete")}>
              <Button
                size="xs"
                color="failure"
                onClick={() => {
                  setIsModalOpen(true);
                  setSelectedMember(row.original);
                  setActionType("delete");
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Tooltip>
          </div>
        ),
      },
    ],
    [t]
  );

  return (
    <div>
      <Table
        data={teamMembers}
        columns={columns}
        isLoading={isLoading}
        showSearch
        searchValue={searchValue}
        onSearch={setSearchValue}
        title={
          <div className="flex items-center gap-4">
            <User size={20} className="text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-700">
              {t("configurations.team.title")}
            </h1>
          </div>
        }
        prependWithSearch={
          <Button
            color="primary"
            onClick={() => {
              setIsModalOpen(true);
              setActionType("invite");
            }}
          >
            <div className="flex items-center gap-1">
              <UserPlus className="w-4 h-4" />
              {t("configurations.team.invite")}
            </div>
          </Button>
        }
      />

      <InviteTeamMemberModal
        open={isModalOpen && actionType === "invite"}
        onClose={closeModal}
        onInvite={handleInviteTeamMember}
        selectedMember={selectedMember}
        isInviting={isInviting}
        existingMembers={teamMembers}
      />

      <AnimatedModal
        isConfirmation
        show={isModalOpen && actionType === "delete"}
        onClose={closeModal}
        onConfirm={handleDeleteInvite}
        isConfirming={isDeleting}
        title={t("configurations.team.confirmDeleteMemberTitle")}
        children={
          <div className="text-gray-700 text-center">
            {t("configurations.team.confirmDeleteMemberContent")}
          </div>
        }
        confirmText={t("common.delete")}
        confirmButtonColor="red"
      />

      <AnimatedModal
        isConfirmation
        show={isModalOpen && actionType === "reinvite"}
        onClose={closeModal}
        isConfirming={isInviting}
        onConfirm={() =>
          selectedMember
            ? handleInviteTeamMember(
                selectedMember.email,
                selectedMember.is_owner,
                selectedMember.permissions as IPermissionCategories
              )
            : null
        }
        title={t("configurations.team.confirmResendInviteTitle")}
        children={
          <div className="text-gray-700 text-center">
            {t("configurations.team.confirmResendInviteContent")}
          </div>
        }
        confirmText={t("common.resend")}
        confirmButtonColor="indigo"
      />
    </div>
  );
};

export default TeamManagement;
