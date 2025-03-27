import { Table } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { Eye } from "lucide-react";
import { Button, Tooltip } from "flowbite-react";
import { ITeamEntity } from "../../../interfaces";

const TeamMembersModal = ({ teamMembers }: { teamMembers: ITeamEntity[] }) => {
    const { t } = useTranslation();
    return (
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-md">
            <Table>
                <Table.Head className="border-b h-[50px] border-gray-200 dark:border-gray-700">
                    <Table.HeadCell>{t("merchant.name")}</Table.HeadCell>
                    <Table.HeadCell>{t("merchant.email")}</Table.HeadCell>
                    <Table.HeadCell>{t("merchant.statusLabel")}</Table.HeadCell>
                    <Table.HeadCell>{t("merchant.actions")}</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {teamMembers.map((member) => (
                        <Table.Row key={member.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {member.name}
                            </Table.Cell>
                            <Table.Cell>{member.email}</Table.Cell>
                            <Table.Cell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${member.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                    }`}>
                                    {t(`merchant.status.${member.status}`)}
                                </span>
                            </Table.Cell>
                            <Table.Cell>
                                <Tooltip content={t("merchant.view")} placement="bottom">
                                    <Button
                                        color="light"
                                        size="xs"
                                        onClick={() => false}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </Tooltip>

                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
};

export default TeamMembersModal;