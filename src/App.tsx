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
import { useNotifications } from './hooks/useNotifications';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

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