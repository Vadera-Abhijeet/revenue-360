import { Badge, Button, Card } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { ITeamEntity } from "../../../interfaces";
import { Trash2, UserPlus } from "lucide-react";
interface IIntegrationComponentProps {
  team?: ITeamEntity[] | null;
}
const TeamManagement = (props: IIntegrationComponentProps) => {
  const { t } = useTranslation();
  const { team } = props;

  return (
    <div className="space-y-4">
      <Card
        theme={{
          root: {
            children: "flex h-full flex-col justify-center gap-4 p-4",
          },
        }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-indigo-700">
            {t("configurations.team.title")}
          </h2>
          <Button size="sm" color="indigo">
            <div className="flex items-center gap-1">
              <UserPlus className="mr-2 h-4 w-4" />
              {t("configurations.team.invite")}
            </div>
          </Button>
        </div>
      </Card>
      <Card
        theme={{
          root: {
            children: "flex h-full flex-col justify-center gap-4 p-4",
          },
        }}
      >
        <div className="overflow-x-auto">
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
              {(team || []).map((member: ITeamEntity) => (
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
        </div>
      </Card>
    </div>
  );
};

export default TeamManagement;
