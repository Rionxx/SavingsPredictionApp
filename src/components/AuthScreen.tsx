import React, { useState } from 'react';
import { Bell, PiggyBank } from 'lucide-react';

// 認証画面コンポーネントのProps
interface AuthScreenProps {
  onAuth: () => void;
}

// 認証画面コンポーネント
const AuthScreen = ({ onAuth }: AuthScreenProps) => {
  // ログイン状態とメールアドレス、パスワードの状態を管理
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuth();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">ホーム</h1>
          <div className="flex items-center space-x-3">
            <Bell className="text-gray-400" size={20} />
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-12">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <PiggyBank className="text-white" size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">貯金予測アプリ</h2>
            <p className="text-gray-600">あなたの貯金目標を達成しよう</p>
          </div>

          {/* Auth Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-6">
              {isLogin ? 'ログイン' : '新規登録'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="ユーザー名/メールアドレス"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="パスワード"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
              >
                {isLogin ? 'ログイン' : '新規登録'}
              </button>
            </form>

            <button
              onClick={() => setIsLogin(!isLogin)}
              className="w-full mt-4 py-3 text-gray-600 font-medium hover:text-gray-800 transition-colors"
            >
              {isLogin ? '新規登録' : 'ログインに戻る'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;