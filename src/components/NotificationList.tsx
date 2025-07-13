import React from 'react';
import { useNotification, NotificationItem } from '../context/NotificationContext';

interface NotificationListProps {
  onSelect: (notification: NotificationItem) => void;
  onClose: () => void;
}

const NotificationList: React.FC<NotificationListProps> = ({ onSelect, onClose }) => {
  const { notifications, markAsRead } = useNotification();

  return (
    <div className="fixed top-14 right-6 z-50 w-80 bg-white shadow-xl rounded-xl border border-gray-200">
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
        <span className="font-bold text-gray-900">通知</span>
        <button className="text-gray-400 hover:text-gray-600" onClick={onClose}>×</button>
      </div>
      <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
        {notifications.length === 0 && (
          <div className="p-4 text-gray-500 text-center">通知はありません</div>
        )}
        {notifications.map((n) => (
          <button
            key={n.id}
            className={`w-full text-left px-4 py-3 hover:bg-gray-50 focus:outline-none transition flex items-start space-x-2 ${n.isRead ? '' : 'bg-orange-50'}`}
            onClick={() => { markAsRead(n.id); onSelect(n); onClose(); }}
          >
            <div className="flex-1">
              <div className="font-medium text-gray-900 truncate">{n.title}</div>
              <div className="text-sm text-gray-700 truncate">{n.message}</div>
              <div className="text-xs text-gray-400 mt-1">{new Date(n.date).toLocaleString()}</div>
            </div>
            {!n.isRead && <span className="ml-2 w-2 h-2 bg-orange-500 rounded-full mt-2"></span>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NotificationList; 