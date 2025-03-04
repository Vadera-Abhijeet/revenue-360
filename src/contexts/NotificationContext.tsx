import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchNotifications } from '../services/api';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoadingNotification: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [isLoadingNotification, setIsLoadingNotification] = useState(false);
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications && JSON.parse(savedNotifications).length) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications);
        console.log(" useEffect parsedNotifications:", parsedNotifications)
        const formattedNotifications = parsedNotifications.map((notification: Notification) => ({
          ...notification,
          timestamp: new Date(notification.timestamp),
        }));
        setNotifications(formattedNotifications);
      } catch (error) {
        console.error('Failed to parse notifications from localStorage', error);
      }
    } else {
      const loadNotifications = async () => {
        setIsLoadingNotification(true);
        try {
          const data = await fetchNotifications();

          // Add fetched notifications to the context
          data.forEach((notification) => {
            addNotification({
              type: notification.type as NotificationType,
              title: notification.title,
              message: notification.message,
            });
          });

          // Save to localStorage
          localStorage.setItem('notifications', JSON.stringify(data));
        } catch (error) {
          console.error('Error loading notifications:', error);
        } finally {
          setIsLoadingNotification(false);
        }
      };

      loadNotifications();
    }
  }, []);


  // Save notifications to localStorage when they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const value = {
    notifications,
    unreadCount,
    isLoadingNotification,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};