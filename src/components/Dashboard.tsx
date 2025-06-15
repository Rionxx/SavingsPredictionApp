import React, { useState } from 'react';
import { Bell, ChevronRight, TrendingUp, Target, BarChart3, Plus, AlertTriangle, CheckCircle, Clock, Users, Edit2, Check, X } from 'lucide-react';
import { mockTransactions, mockGoals, mockBudgetCategories } from '../data/mockData';
import { PredictionEngine } from '../utils/predictionEngine';
import { AdviceEngine } from '../utils/adviceEngine';

// ダッシュボードコンポーネント
const Dashboard: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSavings, setEditedSavings] = useState('');
  const [localTransactions, setLocalTransactions] = useState(mockTransactions);

  const predictionEngine = new PredictionEngine(localTransactions);
  const adviceEngine = new AdviceEngine(localTransactions, mockBudgetCategories, mockGoals);
  
  const shortTermPrediction = predictionEngine.generateShortTermPrediction(12);
  const personalizedAdvice = adviceEngine.generatePersonalizedAdvice();

  // 現在の貯金額を計算
  const totalIncome = localTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = localTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const currentSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (currentSavings / totalIncome) * 100 : 0;

  // 編集ボタンクリック時の処理
  const handleEditClick = () => {
    setIsEditing(true);
    setEditedSavings(currentSavings.toString());
  };

  // 保存ボタンクリック時の処理
  const handleSave = () => {
    const newAmount = parseInt(editedSavings.replace(/,/g, ''));
    if (!isNaN(newAmount)) {
      // 新しい取引を追加して貯金額を調整
      const adjustment = newAmount - currentSavings;
      const newTransaction = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        type: adjustment >= 0 ? 'income' : 'expense',
        amount: Math.abs(adjustment),
        category: '調整',
        description: '貯金額の手動調整'
      };
      setLocalTransactions([...localTransactions, newTransaction as Transaction]);
    }
    setIsEditing(false);
  };

  // キャンセルボタンクリック時の処理
  const handleCancel = () => {
    setIsEditing(false);
    setEditedSavings('');
  };

  // 入力フィールドの変更時の処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setEditedSavings(parseInt(value).toLocaleString());
  };

  // 前月比の計算
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const lastMonthTransactions = localTransactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === lastMonth && date.getFullYear() === lastYear;
  });

  const lastMonthIncome = lastMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const lastMonthExpenses = lastMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const lastMonthSavings = lastMonthIncome - lastMonthExpenses;
  const monthOverMonthChange = currentSavings - lastMonthSavings;
  const monthOverMonthPercentage = lastMonthSavings !== 0 
    ? ((monthOverMonthChange / lastMonthSavings) * 100)
    : 0;

  // 今月の予算状況
  const budgetStatus = mockBudgetCategories.map(category => ({
    ...category,
    utilizationRate: (category.spentAmount / category.budgetAmount) * 100
  }));

  const overBudgetCategories = budgetStatus.filter(c => c.utilizationRate > 100);
  const underBudgetCategories = budgetStatus.filter(c => c.utilizationRate < 70);

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
                <span className="text-xs text-white font-bold">2</span>
              </div>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">田</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Current Savings Overview */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <BarChart3 className="text-white" size={16} />
              </div>
              <span className="font-medium">現在の貯金状況</span>
            </div>
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <button
                  onClick={handleEditClick}
                  className="text-white text-sm font-medium flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full"
                >
                  <Edit2 size={14} className="mr-1" />
                  編集
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSave}
                    className="text-white text-sm font-medium flex items-center bg-green-500 bg-opacity-20 px-3 py-1 rounded-full"
                  >
                    <Check size={14} className="mr-1" />
                    保存
                  </button>
                  <button
                    onClick={handleCancel}
                    className="text-white text-sm font-medium flex items-center bg-red-500 bg-opacity-20 px-3 py-1 rounded-full"
                  >
                    <X size={14} className="mr-1" />
                    キャンセル
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={editedSavings}
                    onChange={handleInputChange}
                    className="text-3xl font-bold bg-white bg-opacity-20 rounded-lg px-3 py-2 w-full text-white placeholder-white placeholder-opacity-50"
                    placeholder="貯金額を入力"
                  />
                  <span className="text-lg">円</span>
                </div>
              ) : (
                <div className="text-3xl font-bold mb-1">
                  {currentSavings.toLocaleString()} <span className="text-lg">円</span>
                </div>
              )}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <TrendingUp size={16} />
                  <span className="text-sm">貯金率 {savingsRate.toFixed(1)}%</span>
                </div>
                <div className="text-sm opacity-90">
                  前月比 {monthOverMonthChange >= 0 ? '+' : ''}{monthOverMonthChange.toLocaleString()}円
                  ({monthOverMonthPercentage >= 0 ? '+' : ''}{monthOverMonthPercentage.toFixed(1)}%)
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white border-opacity-20">
              <div>
                <div className="text-sm opacity-90">今月の収入</div>
                <div className="text-lg font-semibold">{(totalIncome / 2).toLocaleString()}円</div>
              </div>
              <div>
                <div className="text-sm opacity-90">今月の支出</div>
                <div className="text-lg font-semibold">{(totalExpenses / 2).toLocaleString()}円</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Predictions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-purple-600" size={16} />
              </div>
              <span className="text-gray-600 font-medium">AI予測分析</span>
            </div>
            <div className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
              信頼度 {Math.round(shortTermPrediction.confidence * 100)}%
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {Math.round(shortTermPrediction.predictedAmount).toLocaleString()} <span className="text-lg">円</span>
              </div>
              <p className="text-gray-600 text-sm">1年後の予測貯金額</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">+15%</div>
                <div className="text-xs text-gray-500">成長率</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">8.5ヶ月</div>
                <div className="text-xs text-gray-500">目標達成</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-orange-600">A+</div>
                <div className="text-xs text-gray-500">貯金スコア</div>
              </div>
            </div>
          </div>
        </div>

        {/* Goals Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="text-green-600" size={16} />
              </div>
              <span className="text-gray-600 font-medium">目標進捗</span>
            </div>
            <button className="text-orange-500 text-sm font-medium flex items-center">
              すべて見る <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
          
          <div className="space-y-4">
            {mockGoals.slice(0, 2).map((goal) => {
              const progressRate = (goal.currentAmount / goal.targetAmount) * 100;
              const remaining = goal.targetAmount - goal.currentAmount;
              
              return (
                <div key={goal.id} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900">{goal.name}</div>
                      <div className="text-sm text-gray-500">
                        {goal.currentAmount.toLocaleString()}円 / {goal.targetAmount.toLocaleString()}円
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">{progressRate.toFixed(1)}%</div>
                      <div className="text-xs text-gray-500">残り {remaining.toLocaleString()}円</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(progressRate, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Budget Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="text-blue-600" size={16} />
              </div>
              <span className="text-gray-600 font-medium">今月の予算状況</span>
            </div>
            <button className="text-orange-500 text-sm font-medium flex items-center">
              管理 <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Budget Alerts */}
            {overBudgetCategories.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="text-red-500" size={16} />
                  <span className="text-red-700 font-medium text-sm">予算超過アラート</span>
                </div>
                <div className="space-y-1">
                  {overBudgetCategories.map(category => (
                    <div key={category.id} className="text-sm text-red-600">
                      {category.name}: {(category.spentAmount - category.budgetAmount).toLocaleString()}円超過
                      ({((category.spentAmount / category.budgetAmount - 1) * 100).toFixed(1)}%)
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Budget Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-lg font-bold text-gray-900">
                  {budgetStatus.reduce((sum, c) => sum + c.budgetAmount, 0).toLocaleString()}円
                </div>
                <div className="text-xs text-gray-500">今月の予算</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-lg font-bold text-gray-900">
                  {budgetStatus.reduce((sum, c) => sum + c.spentAmount, 0).toLocaleString()}円
                </div>
                <div className="text-xs text-gray-500">使用済み</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Advice */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-white" size={16} />
            </div>
            <span className="font-medium">AIからのアドバイス</span>
          </div>
          
          <div className="space-y-3">
            {personalizedAdvice.slice(0, 3).map((advice, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">{index + 1}</span>
                </div>
                <p className="text-sm leading-relaxed">{advice}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">クイックアクション</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-orange-500 text-white py-4 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-orange-600 transition-colors">
              <Plus size={20} />
              <span>収支記録</span>
            </button>
            <button className="bg-green-500 text-white py-4 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-green-600 transition-colors">
              <Target size={20} />
              <span>目標設定</span>
            </button>
            <button className="border border-gray-200 py-4 rounded-xl font-medium text-gray-700 flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors">
              <BarChart3 size={20} />
              <span>予算管理</span>
            </button>
            <button className="border border-gray-200 py-4 rounded-xl font-medium text-gray-700 flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors">
              <Users size={20} />
              <span>同世代比較</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;