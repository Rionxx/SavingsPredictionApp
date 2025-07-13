import React, { useEffect, useState } from 'react';
import { useNotification, NotificationItem } from '../context/NotificationContext';

interface ToastNotificationsProps {
  onClickNotification: (notification: NotificationItem) => void;
}

const ToastNotifications: React.FC<ToastNotificationsProps> = ({ onClickNotification }) => {
  const { notifications, removeNotification, markAsRead } = useNotification();
  const [visibleIds, setVisibleIds] = useState<string[]>([]);

  useEffect(() => {
    // 新しい通知が来たら表示
    if (notifications.length > 0) {
      const latest = notifications[0];
      if (!visibleIds.includes(latest.id)) {
        setVisibleIds((prev) => [latest.id, ...prev]);
        // 5秒後に自動で消す
        setTimeout(() => {
          setVisibleIds((prev) => prev.filter((id) => id !== latest.id));
        }, 5000);
      }
    }
  }, [notifications]);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2">
      {notifications.filter(n => visibleIds.includes(n.id)).map((notification) => (
        <div
          key={notification.id}
          className={`bg-white shadow-lg rounded-lg px-4 py-3 border-l-4 cursor-pointer transition-all ${
            notification.type === 'success' ? 'border-green-500' :
            notification.type === 'error' ? 'border-red-500' :
            notification.type === 'warning' ? 'border-yellow-500' :
            'border-blue-500'
          }`}
          onClick={() => {
            markAsRead(notification.id);
            onClickNotification(notification);
            setVisibleIds((prev) => prev.filter((id) => id !== notification.id));
          }}
        >
          <div className="font-semibold text-gray-900">{notification.title}</div>
          <div className="text-gray-700 text-sm">{notification.message}</div>
          <div className="text-xs text-gray-400 text-right mt-1">{new Date(notification.date).toLocaleTimeString()}</div>
        </div>
      ))}
    </div>
  );
};

export default ToastNotifications; 