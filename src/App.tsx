import React, { useState } from 'react';
import { Home, BarChart3, Plus, Settings, Bell, TrendingUp, Target, Users } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import AddRecord from './components/AddRecord';
import SettingsPage from './components/SettingsPage';
import AuthScreen from './components/AuthScreen';
import NotificationCenter from './components/NotificationCenter';
import GoalsManager from './components/GoalsManager';
import BudgetManager from './components/BudgetManager';
import ComparisonView from './components/ComparisonView';
import { NotificationProvider } from './context/NotificationContext';
import ToastNotifications from './components/ToastNotifications';
import NotificationDetail from './components/NotificationDetail';
import { NotificationItem } from './context/NotificationContext';
import NotificationList from './components/NotificationList';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [showNotificationList, setShowNotificationList] = useState(false);

  if (!isAuthenticated) {
    return <AuthScreen onAuth={() => setIsAuthenticated(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard />;
      case 'analytics':
        return <Analytics />;
      case 'add':
        return <AddRecord onClose={() => setActiveTab('home')} />;
      case 'goals':
        return <GoalsManager onClose={() => setActiveTab('home')} />;
      case 'budget':
        return <BudgetManager onClose={() => setActiveTab('home')} />;
      case 'comparison':
        return <ComparisonView onClose={() => setActiveTab('home')} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-50">
        {/* トースト通知 */}
        <ToastNotifications onClickNotification={setSelectedNotification} />
        {/* 通知リスト */}
        {showNotificationList && (
          <NotificationList
            onSelect={setSelectedNotification}
            onClose={() => setShowNotificationList(false)}
          />
        )}
        {/* 通知詳細 */}
        {selectedNotification && (
          <NotificationDetail
            notification={selectedNotification}
            onClose={() => setSelectedNotification(null)}
          />
        )}
        {/* Content */}
        <div className="pb-20">
          {renderContent()}
        </div>
        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
          <div className="flex justify-around items-center max-w-md mx-auto">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                activeTab === 'home' ? 'text-orange-500' : 'text-gray-500'
              }`}
            >
              <Home size={20} />
              <span className="text-xs mt-1">ホーム</span>
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                activeTab === 'add' ? 'text-orange-500' : 'text-gray-500'
              }`}
            >
              <Plus size={20} />
              <span className="text-xs mt-1">記録</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                activeTab === 'analytics' ? 'text-orange-500' : 'text-gray-500'
              }`}
            >
              <TrendingUp size={20} />
              <span className="text-xs mt-1">予測</span>
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                activeTab === 'comparison' ? 'text-orange-500' : 'text-gray-500'
              }`}
            >
              <Users size={20} />
              <span className="text-xs mt-1">比較</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                activeTab === 'settings' ? 'text-orange-500' : 'text-gray-500'
              }`}
            >
              <Settings size={20} />
              <span className="text-xs mt-1">設定</span>
            </button>
            {/* 通知アイコン */}
            <button
              onClick={() => setShowNotificationList((prev) => !prev)}
              className="relative flex flex-col items-center py-2 px-3 rounded-lg transition-colors text-gray-500 hover:text-orange-500"
            >
              <Bell size={20} />
              <span className="text-xs mt-1">通知</span>
            </button>
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
}

export default App;