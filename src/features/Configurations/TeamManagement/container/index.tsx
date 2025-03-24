import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge, Trash2, User } from "lucide-react";
import { ISettings, ITeamEntity } from "../../../../interfaces";
import { Button } from "flowbite-react";
import { fetchUserSettings } from "../../../../services/api";


const TeamManagement: React.FC = () => {
    const { t } = useTranslation();
    const [settings, setSettings] = useState<ISettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
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
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <User size={20} className="text-gray-700" />
                <h1 className="text-2xl font-bold text-gray-700">
                    {t("configurations.team.title")}
                </h1>
            </div>
            {/* Add your team management content here */}
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                </div>
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
                </table>)}
        </div>
    );
};

export default TeamManagement; 