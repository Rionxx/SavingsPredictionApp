import React, { useState } from 'react';
import { ChevronLeft, PieChart, Plus, Edit3, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { mockBudgetCategories } from '../data/mockData';
import { BudgetCategory } from '../types';

interface BudgetManagerProps {
  onClose: () => void;
}

const BudgetManager = ({ onClose }: BudgetManagerProps) => {
  const [categories, setCategories] = useState<BudgetCategory[]>(mockBudgetCategories);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    budgetAmount: '',
    color: '#FF6B6B',
    icon: 'utensils'
  });

  const iconOptions = [
    { value: 'utensils', label: '食事', icon: '🍽️' },
    { value: 'car', label: '交通', icon: '🚗' },
    { value: 'gamepad-2', label: '娯楽', icon: '🎮' },
    { value: 'zap', label: '光熱費', icon: '⚡' },
    { value: 'smartphone', label: '通信', icon: '📱' },
    { value: 'heart', label: '医療', icon: '❤️' },
    { value: 'shopping-bag', label: '買い物', icon: '🛍️' },
    { value: 'home', label: '住居', icon: '🏠' }
  ];

  const colorOptions = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEAA7', '#DDA0DD', '#FFB347', '#87CEEB'
  ];

  const totalBudget = categories.reduce((sum, cat) => sum + cat.budgetAmount, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spentAmount, 0);
  const remainingBudget = totalBudget - totalSpent;
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const categoryData: BudgetCategory = {
      id: editingCategory?.id || Date.now().toString(),
      name: formData.name,
      budgetAmount: parseInt(formData.budgetAmount),
      spentAmount: editingCategory?.spentAmount || 0,
      color: formData.color,
      icon: formData.icon
    };

    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? categoryData : c));
    } else {
      setCategories([...categories, categoryData]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      budgetAmount: '',
      color: '#FF6B6B',
      icon: 'utensils'
    });
    setShowAddForm(false);
    setEditingCategory(null);
  };

  const handleEdit = (category: BudgetCategory) => {
    setFormData({
      name: category.name,
      budgetAmount: category.budgetAmount.toString(),
      color: category.color,
      icon: category.icon
    });
    setEditingCategory(category);
    setShowAddForm(true);
  };

  const getUtilizationStatus = (spent: number, budget: number) => {
    const rate = (spent / budget) * 100;
    if (rate > 100) return { status: 'over', color: 'text-red-600 bg-red-50', icon: AlertTriangle };
    if (rate > 80) return { status: 'warning', color: 'text-yellow-600 bg-yellow-50', icon: TrendingUp };
    return { status: 'good', color: 'text-green-600 bg-green-50', icon: CheckCircle };
  };

  const chartData = categories.map(cat => ({
    name: cat.name,
    value: cat.spentAmount,
    color: cat.color
  }));

  if (showAddForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <button onClick={resetForm} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              {editingCategory ? 'カテゴリを編集' : '新しいカテゴリ'}
            </h1>
          </div>
        </div>

        <div className="px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">カテゴリ詳細</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリ名</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="例: 食費"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">予算金額</label>
                  <input
                    type="number"
                    value={formData.budgetAmount}
                    onChange={(e) => setFormData({ ...formData, budgetAmount: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="50000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">アイコン</label>
                  <div className="grid grid-cols-4 gap-3">
                    {iconOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: option.value })}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          formData.icon === option.value
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">{option.icon}</div>
                        <div className={`text-xs font-medium ${
                          formData.icon === option.value ? 'text-orange-600' : 'text-gray-700'
                        }`}>
                          {option.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">カラー</label>
                  <div className="flex space-x-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-10 h-10 rounded-full border-4 transition-all ${
                          formData.color === color ? 'border-gray-400' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-orange-600 transition-colors"
            >
              {editingCategory ? 'カテゴリを更新' : 'カテゴリを作成'}
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
            <h1 className="text-xl font-bold text-gray-900">予算管理</h1>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-orange-600 transition-colors"
          >
            <Plus size={16} />
            <span>追加</span>
          </button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Budget Overview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <PieChart className="text-blue-600" size={16} />
            </div>
            <span className="text-lg font-semibold text-gray-900">予算概要</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {totalBudget.toLocaleString()}円
              </div>
              <div className="text-sm text-gray-500">総予算</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">
                {totalSpent.toLocaleString()}円
              </div>
              <div className="text-sm text-gray-500">使用済み</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {remainingBudget.toLocaleString()}円
              </div>
              <div className="text-sm text-gray-500">残り</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">予算使用率</span>
              <span className={`text-sm font-medium ${
                budgetUtilization > 100 ? 'text-red-600' : 
                budgetUtilization > 80 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {budgetUtilization.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  budgetUtilization > 100 ? 'bg-red-500' : 
                  budgetUtilization > 80 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Spending Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">支出分布</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${Number(value).toLocaleString()}円`]} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category List */}
        <div className="space-y-4">
          {categories.map((category) => {
            const utilizationRate = (category.spentAmount / category.budgetAmount) * 100;
            const status = getUtilizationStatus(category.spentAmount, category.budgetAmount);
            const StatusIcon = status.icon;

            return (
              <div key={category.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl"
                      style={{ backgroundColor: category.color }}
                    >
                      {iconOptions.find(i => i.value === category.icon)?.icon || '💰'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
                          {utilizationRate.toFixed(1)}%
                        </span>
                        <StatusIcon size={14} className={status.color.split(' ')[0]} />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {category.spentAmount.toLocaleString()}円 / {category.budgetAmount.toLocaleString()}円
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      残り {(category.budgetAmount - category.spentAmount).toLocaleString()}円
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(utilizationRate, 100)}%`,
                        backgroundColor: category.color
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <PieChart className="text-gray-300 mb-4 mx-auto" size={48} />
            <p className="text-gray-500 mb-4">予算カテゴリがありません</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors"
            >
              最初のカテゴリを作成
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetManager;