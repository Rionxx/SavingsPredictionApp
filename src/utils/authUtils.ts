import { User, AuthError } from '../types';

// ユーザーデータをローカルストレージに保存
const saveUser = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// ユーザーデータをローカルストレージから取得
const getUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  return JSON.parse(userStr);
};

// ユーザー名が既に存在するかチェック
const isUsernameExists = (username: string): boolean => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  return users.some((user: User) => user.username === username);
};

// メールアドレスが既に存在するかチェック
const isEmailExists = (email: string): boolean => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  return users.some((user: User) => user.email === email);
};

// ユーザーを保存
const saveNewUser = (user: User) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
};

// 認証情報の検証
export const validateCredentials = (username: string, password: string): { user: User | null; error: AuthError | null } => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find((u: User) => u.username === username && u.password === password);

  if (!user) {
    return {
      user: null,
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'ユーザー名またはパスワードが正しくありません。'
      }
    };
  }

  saveUser(user);
  return { user, error: null };
};

// 新規ユーザー登録
export const registerNewUser = (username: string, password: string, email: string): { user: User | null; error: AuthError | null } => {
  // 入力値の検証
  if (!username || !password || !email) {
    return {
      user: null,
      error: {
        code: 'INVALID_INPUT',
        message: 'すべての項目を入力してください。'
      }
    };
  }

  // ユーザー名の重複チェック
  if (isUsernameExists(username)) {
    return {
      user: null,
      error: {
        code: 'USERNAME_EXISTS',
        message: 'このユーザー名は既に使用されています。'
      }
    };
  }

  // メールアドレスの重複チェック
  if (isEmailExists(email)) {
    return {
      user: null,
      error: {
        code: 'EMAIL_EXISTS',
        message: 'このメールアドレスは既に登録されています。'
      }
    };
  }

  // パスワードの長さチェック
  if (password.length < 6) {
    return {
      user: null,
      error: {
        code: 'INVALID_PASSWORD',
        message: 'パスワードは6文字以上で入力してください。'
      }
    };
  }

  // メールアドレスの形式チェック
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      user: null,
      error: {
        code: 'INVALID_EMAIL',
        message: '有効なメールアドレスを入力してください。'
      }
    };
  }

  // 新規ユーザーの作成
  const newUser: User = {
    id: Date.now().toString(),
    username,
    email,
    password,
    createdAt: new Date().toISOString()
  };

  saveNewUser(newUser);
  saveUser(newUser);

  return { user: newUser, error: null };
};

// ログアウト
export const logout = () => {
  localStorage.removeItem('user');
};

// 現在のユーザーを取得
export const getCurrentUser = (): User | null => {
  return getUser();
}; 