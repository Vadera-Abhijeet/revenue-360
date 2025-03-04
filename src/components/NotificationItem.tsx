import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle,
  X
} from 'lucide-react';
import { Notification, NotificationType } from '../contexts/NotificationContext';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onRemove,
}) => {
  const { t } = useTranslation();
  
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="text-red-500" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={20} />;
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'info':
      default:
        return <Info className="text-blue-500" size={20} />;
    }
  };
  
  const getTypeLabel = (type: NotificationType) => {
    switch (type) {
      case 'error':
        return t('notifications.types.alert');
      case 'warning':
        return t('notifications.types.warning');
      case 'success':
        return t('notifications.types.success');
      case 'info':
      default:
        return t('notifications.types.info');
    }
  };
  
  const getBgColor = (type: NotificationType, read: boolean) => {
    if (read) return 'bg-white';
    
    switch (type) {
      case 'error':
        return 'bg-red-50';
      case 'warning':
        return 'bg-yellow-50';
      case 'success':
        return 'bg-green-50';
      case 'info':
      default:
        return 'bg-blue-50';
    }
  };
  
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };
  
  return (
    <div 
      className={`${getBgColor(notification.type, notification.read)} p-4 rounded-lg mb-2 border border-gray-200 transition-colors duration-200 hover:bg-gray-50`}
      onClick={handleClick}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {getIcon(notification.type)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">
              {notification.title || getTypeLabel(notification.type)}
            </p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onRemove(notification.id);
              }}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={16} />
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
          <p className="mt-1 text-xs text-gray-500">
            {format(notification.timestamp, 'MMM d, yyyy h:mm a')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;