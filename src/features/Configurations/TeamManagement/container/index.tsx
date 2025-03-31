import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge, Trash2, User, UserPlus } from "lucide-react";
import {
  ISettings,
  ITeamEntity,
  Role,
  TStatusType,
  TInviteStatus,
} from "../../../../interfaces";
import { Button } from "flowbite-react";
import { fetchUserSettings } from "../../../../services/api";
import InviteTeamMemberModal from "../components/InviteTeamMemberModal";
import ListSkeleton from "../../../../components/SkeletonLoaders/ListSkeleton";

const TeamManagement: React.FC = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<ISettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

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

  const handleInviteTeamMember = (email: string, permissions: string[]) => {
    if (settings) {
      const newMember: ITeamEntity = {
        id: `user${Date.now()}`,
        name: email.split("@")[0], // Temporary name from email
        email,
        role: "sub_admin" as Role,
        status: "inactive" as TStatusType,
        password: "", // Will be set by the user during first login
        timezone: "UTC",
        permissions,
        createdAt: new Date(),
        updatedAt: new Date(),
        inviteStatus: "pending" as TInviteStatus,
      };

      setSettings({
        ...settings,
        team: [...(settings.team || []), newMember],
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <User size={20} className="text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-700">
            {t("configurations.team.title")}
          </h1>
        </div>
        <Button color="primary" onClick={() => setIsInviteModalOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          {t("configurations.team.invite")}
        </Button>
      </div>
      {/* Add your team management content here */}
      {isLoading ? (
        <ListSkeleton />
      ) : (
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-2 py-3">
                {t("configurations.team.name")}
              </th>
              <th scope="col" className="px-2 py-3">
                {t("configurations.team.email")}
              </th>
              <th scope="col" className="px-2 py-3">
                {t("configurations.team.role")}
              </th>
              <th scope="col" className="px-2 py-3">
                {t("configurations.team.status")}
              </th>
              <th scope="col" className="px-2 py-3">
                {t("configurations.team.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {(settings?.team || []).map((member: ITeamEntity) => (
              <tr key={member.id} className="bg-white border-b">
                <td className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {member.name}
                </td>
                <td className="px-2 py-4">{member.email}</td>
                <td className="px-2 py-4">{member.role}</td>
                <td className="px-2 py-4">
                  <Badge
                    color={member.status === "active" ? "success" : "warning"}
                    className="w-max capitalize"
                  >
                    {member.status}
                  </Badge>
                </td>
                <td className="px-2 py-4">
                  <div className="flex space-x-2">
                    <Button size="xs" color="light">
                      {t("common.edit")}
                    </Button>
                    {member.id !== "user1" && (
                      <Button size="xs" color="failure">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <InviteTeamMemberModal
        open={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteTeamMember}
      />
    </div>
  );
};

export default TeamManagement;
