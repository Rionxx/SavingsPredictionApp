import React, { useState } from 'react';
import { ChevronLeft, DollarSign, Calendar, Edit3, ShoppingBag, Home, TrendingUp, Gift, ShoppingCart, MoreHorizontal } from 'lucide-react';

interface AddRecordProps {
  onClose: () => void;
}

const AddRecord = ({ onClose }: AddRecordProps) => {
  const [amount, setAmount] = useState('5000');
  const [date, setDate] = useState('2023-11-25');
  const [memo, setMemo] = useState('食料品の購入');
  const [selectedCategory, setSelectedCategory] = useState('食費');

  const categories = [
    { id: 'salary', name: '給料', icon: DollarSign, color: 'bg-blue-500' },
    { id: 'side', name: '副業', icon: Home, color: 'bg-purple-500' },
    { id: 'investment', name: '投資', icon: TrendingUp, color: 'bg-green-500' },
    { id: 'gift', name: 'ギフト', icon: Gift, color: 'bg-pink-500' },
    { id: 'food', name: '食費', icon: ShoppingCart, color: 'bg-orange-500' },
    { id: 'other', name: 'その他', icon: MoreHorizontal, color: 'bg-gray-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">収入記録</h1>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Record Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">記録詳細</h2>
          
          <div className="space-y-6">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">金額 (円)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="金額を入力"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">日付</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Memo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">メモ</label>
              <div className="relative">
                <Edit3 className="absolute left-3 top-3 text-gray-400" size={20} />
                <textarea
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  rows={3}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  placeholder="メモを入力"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">カテゴリ</h3>
          <div className="grid grid-cols-3 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.name;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-12 h-12 ${category.color} rounded-xl mx-auto mb-2 flex items-center justify-center`}>
                    <Icon className="text-white" size={20} />
                  </div>
                  <span className={`text-sm font-medium ${
                    isSelected ? 'text-orange-600' : 'text-gray-700'
                  }`}>
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Save Button */}
        <button className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2">
          <ShoppingBag size={20} />
          <span>記録を保存</span>
        </button>
      </div>
    </div>
  );
};

export default AddRecord;