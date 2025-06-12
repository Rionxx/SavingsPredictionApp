import { useState, useEffect } from 'react';
import { Notification } from '../types';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // 初期通知データの設定
    const initialNotifications: Notification[] = [
      {
        id: '1',
        type: 'reminder',
        title: '支出記録のリマインダー',
        message: '今日の支出をまだ記録していません。記録を忘れずに！',
        date: new Date().toISOString(),
        isRead: false,
        priority: 'medium'
      },
      {
        id: '2',
        type: 'alert',
        title: '予算超過アラート',
        message: '食費の予算を15%超過しています。支出を見直しましょう。',
        date: new Date(Date.now() - 86400000).toISOString(),
        isRead: false,
        priority: 'high'
      },
      {
        id: '3',
        type: 'achievement',
        title: '目標達成おめでとうございます！',
        message: '今月の貯金目標を達成しました。素晴らしいです！',
        date: new Date(Date.now() - 172800000).toISOString(),
        isRead: true,
        priority: 'high'
      }
    ];

    setNotifications(initialNotifications);
    setUnreadCount(initialNotifications.filter(n => !n.isRead).length);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    setUnreadCount(0);
  };

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    if (!newNotification.isRead) {
      setUnreadCount(prev => prev + 1);
    }
  };

  const removeNotification = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (notification && !notification.isRead) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification
  };
};