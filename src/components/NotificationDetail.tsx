import React from 'react';
import { NotificationItem, useNotification } from '../context/NotificationContext';

interface NotificationDetailProps {
  notification: NotificationItem;
  onClose: () => void;
}

const NotificationDetail: React.FC<NotificationDetailProps> = ({ notification, onClose }) => {
  const { removeNotification } = useNotification();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ×
        </button>
        <div className="mb-2 text-xs text-gray-400 text-right">{new Date(notification.date).toLocaleString()}</div>
        <h2 className="text-xl font-bold mb-2">{notification.title}</h2>
        <div className="text-gray-700 mb-4">{notification.message}</div>
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
            onClick={() => { removeNotification(notification.id); onClose(); }}
          >
            削除
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            onClick={onClose}
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetail; 