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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("notifications.title")}
        </h1>
        <div className="flex gap-2">
          <Button
            color="light"
            onClick={markAllAsRead}
            disabled={notifications.every((n) => n.read)}
          >
            <CheckCheck className="mr-2 h-5 w-5" />
            {t("notifications.markAllRead")}
          </Button>
          <Button
            color="light"
            onClick={clearAll}
            disabled={notifications.length === 0}
          >
            <Trash2 className="mr-2 h-5 w-5" />
            {t("notifications.clearAll")}
          </Button>
        </div>
      </div>

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
  );
};

export default Notifications;
