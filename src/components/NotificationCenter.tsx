import React from 'react';
import { X, Bell, AlertTriangle, CheckCircle, Info, Clock } from 'lucide-react';
import { Notification } from '../types';

// 通知センターコンポーネントのProps
interface NotificationCenterProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

// 通知センターコンポーネント
const NotificationCenter = ({ notifications, onClose, onMarkAsRead, onMarkAllAsRead }: NotificationCenterProps) => {
  // 通知のアイコンを取得
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="text-red-500" size={20} />;
      case 'achievement':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'advice':
        return <Info className="text-blue-500" size={20} />;
      default:
        return <Bell className="text-gray-500" size={20} />;
    }
  };

  // 優先度に応じた色を取得
  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      default:
        return 'border-l-gray-300';
    }
  };

  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '今';
    if (diffInHours < 24) return `${diffInHours}時間前`;
    if (diffInHours < 48) return '昨日';
    return date.toLocaleDateString('ja-JP');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full max-w-md mx-4 rounded-t-2xl sm:rounded-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Bell className="text-gray-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">通知</h2>
            {notifications.filter(n => !n.isRead).length > 0 && (
              <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {notifications.filter(n => !n.isRead).length}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {notifications.filter(n => !n.isRead).length > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-sm text-orange-500 font-medium hover:text-orange-600"
              >
                すべて既読
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Bell className="text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">通知はありません</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-l-4 ${getPriorityColor(notification.priority)} ${
                    !notification.isRead ? 'bg-blue-50' : 'bg-white'
                  } hover:bg-gray-50 transition-colors cursor-pointer`}
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`text-sm font-medium ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {formatDate(notification.date)}
                          </span>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <p className={`text-sm ${
                        !notification.isRead ? 'text-gray-700' : 'text-gray-600'
                      }`}>
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;