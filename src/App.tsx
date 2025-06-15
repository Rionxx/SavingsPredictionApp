import React, { useState, useEffect, useCallback } from 'react';
import { Home, BarChart3, Plus, Settings, Bell, TrendingUp, Target, Users, LogOut } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import AddRecord from './components/AddRecord';
import SettingsPage from './components/SettingsPage';
import AuthScreen from './components/AuthScreen';
import NotificationCenter from './components/NotificationCenter';
import GoalsManager from './components/GoalsManager';
import BudgetManager from './components/BudgetManager';
import ComparisonView from './components/ComparisonView';
import { useNotifications } from './hooks/useNotifications';

// 自動ログアウトの時間（ミリ秒）
const AUTO_LOGOUT_TIME = 30 * 60 * 1000; // 30分

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // ユーザーのアクティビティを記録
  const updateLastActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // 自動ログアウトのチェック
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkInactivity = () => {
      const currentTime = Date.now();
      if (currentTime - lastActivity > AUTO_LOGOUT_TIME) {
        handleLogout();
      }
    };

    // ユーザーのアクティビティを監視
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateLastActivity);
    });

    // 定期的にチェック
    const interval = setInterval(checkInactivity, 1000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateLastActivity);
      });
      clearInterval(interval);
    };
  }, [isAuthenticated, lastActivity, updateLastActivity]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('home');
    setShowNotifications(false);
    // 必要に応じて他の状態もリセット
  };

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">おはようございます</h1>
            <p className="text-sm text-gray-600">今日も貯金目標に向けて頑張りましょう！</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bell className="text-gray-400" size={20} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">{unreadCount}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">田</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="ログアウト"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Center */}
      {showNotifications && (
        <NotificationCenter
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
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
        </div>
      </div>
    </div>
  );
}

export default App;