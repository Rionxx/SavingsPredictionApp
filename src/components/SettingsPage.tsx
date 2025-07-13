import React, { useState } from 'react';
import { Bell, Mail, Megaphone, Target, Archive, RotateCcw, Trash2, ChevronRight } from 'lucide-react';

// 設定ページコンポーネント
const SettingsPage = () => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [promotionalNotifications, setPromotionalNotifications] = useState(true);
  const [targetAmount, setTargetAmount] = useState('500000');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">設定</h1>
          <div className="ml-auto">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Notifications */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Bell className="text-orange-600" size={16} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">通知設定</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="text-gray-400" size={20} />
                <div>
                  <div className="font-medium text-gray-900">プッシュ通知</div>
                  <div className="text-sm text-gray-500">最新情報やイベントをプッシュ通知で受け取る</div>
                </div>
              </div>
              <div
                className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${
                  pushNotifications ? 'bg-orange-500' : 'bg-gray-300'
                }`}
                onClick={() => setPushNotifications(!pushNotifications)}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    pushNotifications ? 'translate-x-6' : 'translate-x-0.5'
                  } mt-0.5`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="text-gray-400" size={20} />
                <div>
                  <div className="font-medium text-gray-900">メール通知</div>
                  <div className="text-sm text-gray-500">アカウントの活動や重要な更新をメールで受け取る</div>
                </div>
              </div>
              <div
                className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${
                  emailNotifications ? 'bg-orange-500' : 'bg-gray-300'
                }`}
                onClick={() => setEmailNotifications(!emailNotifications)}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    emailNotifications ? 'translate-x-6' : 'translate-x-0.5'
                  } mt-0.5`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Megaphone className="text-gray-400" size={20} />
                <div>
                  <div className="font-medium text-gray-900">プロモーション通知</div>
                  <div className="text-sm text-gray-500">特別オファーやプロモーションのお知らせを受け取る</div>
                </div>
              </div>
              <div
                className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${
                  promotionalNotifications ? 'bg-orange-500' : 'bg-gray-300'
                }`}
                onClick={() => setPromotionalNotifications(!promotionalNotifications)}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    promotionalNotifications ? 'translate-x-6' : 'translate-x-0.5'
                  } mt-0.5`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Goal Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="text-green-600" size={16} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">目標金額</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">目標金額入力</label>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="目標金額"
              />
              <span className="text-sm text-gray-500 ml-2">円</span>
            </div>

            <div className="bg-orange-50 rounded-xl p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">¥500,000</div>
                <div className="text-sm text-gray-600">今月の目標達成まであと少し！</div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Archive className="text-blue-600" size={16} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">データ管理</h3>
          </div>

          <div className="space-y-4">
            <button className="w-full flex items-center justify-between py-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Archive className="text-gray-400" size={20} />
                <span className="font-medium text-gray-900">データバックアップ</span>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </button>

            <button className="w-full flex items-center justify-between py-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <RotateCcw className="text-gray-400" size={20} />
                <div>
                  <div className="font-medium text-gray-900">データ復元</div>
                  <div className="text-sm text-gray-500">以前のバックアップからデータを復元します</div>
                </div>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </button>

            <button className="w-full bg-red-500 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-red-600 transition-colors">
              <Trash2 size={18} />
              <span>すべてのデータを削除</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;