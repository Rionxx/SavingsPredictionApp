import React, { useState, useEffect } from 'react';
import { Bell, PiggyBank, Lock, User, AlertCircle, Mail } from 'lucide-react';
import { validateCredentials, registerNewUser } from '../utils/authUtils';
import { AuthError } from '../types';

// 認証画面コンポーネントのProps
interface AuthScreenProps {
  onAuth: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuth }) => {
// 認証画面コンポーネント
const AuthScreen = ({ onAuth }: AuthScreenProps) => {
  // ログイン状態とメールアドレス、パスワードの状態を管理
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30分を秒で表示
  const [error, setError] = useState<AuthError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!showWarning) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showWarning]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        const { user, error: authError } = validateCredentials(username, password);
        
        if (authError) {
          setError(authError);
          return;
        }

        if (user) {
          onAuth();
        }
      } else {
        const { user, error: registerError } = registerNewUser(username, password, email);
        
        if (registerError) {
          setError(registerError);
          return;
        }

        if (user) {
          onAuth();
        }
      }
    } catch (err) {
      setError({
        code: 'INVALID_CREDENTIALS',
        message: '認証中にエラーが発生しました。'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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

          {showWarning && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    セキュリティのため、{formatTime(timeLeft)}後に自動的にログアウトされます。
                    操作を続ける場合は、何かアクションを起こしてください。
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Auth Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-6">
              {isLogin ? 'ログイン' : '新規登録'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="username" className="sr-only">
                    ユーザー名
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                      placeholder="ユーザー名"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label htmlFor="email" className="sr-only">
                      メールアドレス
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                        placeholder="メールアドレス"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="password" className="sr-only">
                    パスワード
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                      placeholder="パスワード"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError(null);
                    setUsername('');
                    setPassword('');
                    setEmail('');
                  }}
                  className="text-sm text-orange-600 hover:text-orange-500"
                >
                  {isLogin ? '新規登録はこちら' : 'ログインはこちら'}
                </button>
              </div>

              <div>
                <button
                  type="submit"
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                    isLoading
                      ? 'bg-orange-400 cursor-not-allowed'
                      : 'bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (isLogin ? 'ログイン中...' : '登録中...') : (isLogin ? 'ログイン' : '新規登録')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;