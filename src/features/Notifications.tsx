import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Card } from "flowbite-react";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { useNotifications } from "../contexts/NotificationContext";
import NotificationItem from "../components/NotificationItem";

const Notifications: React.FC = () => {
  const { t } = useTranslation();
  const {
    notifications,
    isLoadingNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotifications();

  return (
    <div className="space-y-4 max-w-[500px]">
      <div className="max-h-[400px] overflow-y-auto p-4">
        {isLoadingNotification ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification, index) => {
              return (
                <NotificationItem
                  key={notification.id + index}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onRemove={removeNotification}
                />
              );
            })}
          </div>
        ) : (
          <Card className="text-center py-12">
            <div className="flex flex-col items-center">
              <Bell className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t("notifications.empty")}
              </h3>
              <p className="text-gray-500">
                You don't have any notifications at the moment.
              </p>
            </div>
          </Card>
        )}
      </div>
      {notifications?.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex w-full gap-2">
            <Button
              color="light"
              className="w-full"
              onClick={markAllAsRead}
              disabled={notifications.every((n) => n.read)}
            >
              <div className="flex items-center">
                <CheckCheck className="mr-2 h-5 w-5" />
                {t("notifications.markAllRead")}
              </div>
            </Button>
            <Button
              color="red"
              className="w-full"
              onClick={clearAll}
              disabled={notifications.length === 0}
            >
              <div className="flex items-center">
                <Trash2 className="mr-2 h-5 w-5" />
                {t("notifications.clearAll")}
              </div>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
