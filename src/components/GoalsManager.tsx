import React, { useState } from 'react';
import { ChevronLeft, Target, Plus, Edit3, Trash2, Calendar, DollarSign } from 'lucide-react';
import { mockGoals } from '../data/mockData';
import { Goal } from '../types';

interface GoalsManagerProps {
  onClose: () => void;
}

const GoalsManager = ({ onClose }: GoalsManagerProps) => {
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    targetDate: '',
    priority: 'medium' as Goal['priority'],
    category: 'other' as Goal['category']
  });

  const categoryOptions = [
    { value: 'housing', label: '住宅', icon: '🏠' },
    { value: 'emergency', label: '緊急資金', icon: '🚨' },
    { value: 'vacation', label: '旅行', icon: '✈️' },
    { value: 'education', label: '教育', icon: '📚' },
    { value: 'retirement', label: '退職', icon: '👴' },
    { value: 'other', label: 'その他', icon: '💰' }
  ];

  const priorityOptions = [
    { value: 'high', label: '高', color: 'text-red-600 bg-red-100' },
    { value: 'medium', label: '中', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'low', label: '低', color: 'text-green-600 bg-green-100' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const goalData: Goal = {
      id: editingGoal?.id || Date.now().toString(),
      name: formData.name,
      targetAmount: parseInt(formData.targetAmount),
      currentAmount: editingGoal?.currentAmount || 0,
      targetDate: formData.targetDate,
      priority: formData.priority,
      category: formData.category
    };

    if (editingGoal) {
      setGoals(goals.map(g => g.id === editingGoal.id ? goalData : g));
    } else {
      setGoals([...goals, goalData]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      targetAmount: '',
      targetDate: '',
      priority: 'medium',
      category: 'other'
    });
    setShowAddForm(false);
    setEditingGoal(null);
  };

  const handleEdit = (goal: Goal) => {
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      targetDate: goal.targetDate,
      priority: goal.priority,
      category: goal.category
    });
    setEditingGoal(goal);
    setShowAddForm(true);
  };

  const handleDelete = (goalId: string) => {
    if (confirm('この目標を削除しますか？')) {
      setGoals(goals.filter(g => g.id !== goalId));
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getDaysRemaining = (targetDate: string) => {
    const target = new Date(targetDate);
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (showAddForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <button onClick={resetForm} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              {editingGoal ? '目標を編集' : '新しい目標'}
            </h1>
          </div>
        </div>

        <div className="px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">目標詳細</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">目標名</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="例: 住宅購入頭金"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">目標金額</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="number"
                      value={formData.targetAmount}
                      onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="1000000"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">目標達成日</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="date"
                      value={formData.targetDate}
                      onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリ</label>
                  <div className="grid grid-cols-3 gap-3">
                    {categoryOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: option.value as Goal['category'] })}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          formData.category === option.value
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">{option.icon}</div>
                        <div className={`text-sm font-medium ${
                          formData.category === option.value ? 'text-orange-600' : 'text-gray-700'
                        }`}>
                          {option.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">優先度</label>
                  <div className="grid grid-cols-3 gap-3">
                    {priorityOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, priority: option.value as Goal['priority'] })}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          formData.priority === option.value
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                          formData.priority === option.value ? option.color : 'text-gray-700'
                        }`}>
                          {option.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-orange-600 transition-colors"
            >
              {editingGoal ? '目標を更新' : '目標を作成'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">目標管理</h1>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-orange-600 transition-colors"
          >
            <Plus size={16} />
            <span>新規作成</span>
          </button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-12">
            <Target className="text-gray-300 mb-4 mx-auto" size={48} />
            <p className="text-gray-500 mb-4">まだ目標が設定されていません</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors"
            >
              最初の目標を作成
            </button>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const remaining = goal.targetAmount - goal.currentAmount;
            const daysRemaining = getDaysRemaining(goal.targetDate);
            const categoryOption = categoryOptions.find(c => c.value === goal.category);
            const priorityOption = priorityOptions.find(p => p.value === goal.priority);

            return (
              <div key={goal.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{categoryOption?.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${priorityOption?.color}`}>
                          {priorityOption?.label}優先度
                        </span>
                        <span className="text-xs text-gray-500">
                          {daysRemaining > 0 ? `${daysRemaining}日後` : '期限切れ'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(goal)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">進捗状況</span>
                    <span className="text-sm font-medium text-gray-900">{progress.toFixed(1)}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {goal.currentAmount.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">現在額</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {remaining.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">残り</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {goal.targetAmount.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">目標額</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GoalsManager;