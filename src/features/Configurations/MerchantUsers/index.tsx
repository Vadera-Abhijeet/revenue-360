import { Button, Table, TextInput, Tooltip } from "flowbite-react";
import { Eye, Search, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from "../../../components/Loading";
import { IUser } from "../../../interfaces";

const Merchants = () => {
    const { t } = useTranslation();
    const [merchantUsers, setMerchantUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchMerchantUsers = () => {
            try {
                const usersJson = localStorage.getItem('users');
                if (usersJson) {
                    const allUsers = JSON.parse(usersJson);
                    // Filter users with role "admin"
                    const merchants = allUsers.filter((user: IUser) => user.role === "admin");
                    setMerchantUsers(merchants);
                }
            } catch (error) {
                console.error("Error fetching merchant users from localStorage:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMerchantUsers();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredMerchants = merchantUsers.filter((merchant) => {
        const matchesSearch = merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            merchant.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="space-y-5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Users size={20} className="text-gray-700" />
                    <h1 className="text-2xl font-bold text-gray-700">
                        {t("merchant.title")}
                    </h1>
                </div>
                <div className="w-full md:w-96">
                    <TextInput
                        id="search"
                        type="text"
                        color={"gray"}
                        icon={Search}
                        placeholder={t("merchant.search")}
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-md">
                <Table>
                    <Table.Head className="border-b h-[50px] border-gray-200 dark:border-gray-700">
                        <Table.HeadCell>{t("merchant.name")}</Table.HeadCell>
                        <Table.HeadCell>{t("merchant.email")}</Table.HeadCell>
                        <Table.HeadCell>{t("merchant.company")}</Table.HeadCell>
                        <Table.HeadCell>{t("merchant.statusLabel")}</Table.HeadCell>
                        <Table.HeadCell>{t("merchant.actions")}</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {filteredMerchants.map((merchant) => (
                            <Table.Row key={merchant.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {merchant.name}
                                </Table.Cell>
                                <Table.Cell>{merchant.email}</Table.Cell>
                                <Table.Cell>{merchant.company || "-"}</Table.Cell>
                                <Table.Cell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${merchant.status === "active"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                        }`}>
                                        {t(`merchant.status.${merchant.status}`)}
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
        </div>
    );
};

export default Merchants; 