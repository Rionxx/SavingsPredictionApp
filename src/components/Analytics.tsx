import React, { useState } from 'react';
import { TrendingUp, Calendar, Target, BarChart3, ChevronLeft, Zap, AlertCircle, CheckCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { mockTransactions, mockGoals } from '../data/mockData';
import { PredictionEngine } from '../utils/predictionEngine';

// 分析ページコンポーネント
const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'short' | 'medium' | 'long'>('short');
  const [selectedScenario, setSelectedScenario] = useState<'expense_reduction' | 'income_increase'>('expense_reduction');
  const [scenarioPercentage, setScenarioPercentage] = useState(10);

  const predictionEngine = new PredictionEngine(mockTransactions);
  
  // 予測結果のオブジェクト
  const predictions = {
    short: predictionEngine.generateShortTermPrediction(12),
    medium: predictionEngine.generateMediumTermPrediction(36),
    long: predictionEngine.generateLongTermPrediction(120)
  };

  const currentPrediction = predictions[selectedPeriod];
  const scenarioAnalysis = predictionEngine.generateScenario(selectedScenario, scenarioPercentage, 12);

  // チャート用データ
  const predictionChartData = [
    { month: '現在', amount: 1850000 },
    { month: '3ヶ月後', amount: 2100000 },
    { month: '6ヶ月後', amount: 2350000 },
    { month: '9ヶ月後', amount: 2600000 },
    { month: '12ヶ月後', amount: Math.round(currentPrediction.predictedAmount) }
  ];

  const categoryData = [
    { name: '食費', value: 50000, color: '#FF6B6B' },
    { name: '交通費', value: 25000, color: '#4ECDC4' },
    { name: '娯楽費', value: 35000, color: '#45B7D1' },
    { name: '光熱費', value: 15000, color: '#96CEB4' },
    { name: 'その他', value: 20000, color: '#FFEAA7' }
  ];

  const monthlyTrendData = [
    { month: '1月', income: 400000, expenses: 195000, savings: 205000 },
    { month: '2月', income: 350000, expenses: 182000, savings: 168000 },
    { month: '3月', income: 380000, expenses: 201000, savings: 179000 },
    { month: '4月', income: 420000, expenses: 188000, savings: 232000 },
    { month: '5月', income: 350000, expenses: 195000, savings: 155000 },
    { month: '6月', income: 390000, expenses: 203000, savings: 187000 }
  ];

  // 分析ページのレンダリング
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">予測分析</h1>
          <div className="ml-auto flex items-center space-x-2">
            <div className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
              データ更新: 今日
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Prediction Period Selector */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">予測期間を選択</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'short', label: '短期', period: '1年', icon: Calendar },
              { key: 'medium', label: '中期', period: '3年', icon: TrendingUp },
              { key: 'long', label: '長期', period: '10年', icon: Target }
            ].map(({ key, label, period, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSelectedPeriod(key as any)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedPeriod === key
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className={`mx-auto mb-2 ${
                  selectedPeriod === key ? 'text-orange-600' : 'text-gray-400'
                }`} size={24} />
                <div className={`font-medium ${
                  selectedPeriod === key ? 'text-orange-600' : 'text-gray-700'
                }`}>
                  {label}
                </div>
                <div className="text-xs text-gray-500">{period}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Prediction Display */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-white" size={16} />
            </div>
            <span className="font-medium">
              {selectedPeriod === 'short' ? '短期' : selectedPeriod === 'medium' ? '中期' : '長期'}予測結果
            </span>
            <div className="ml-auto text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
              信頼度 {Math.round(currentPrediction.confidence * 100)}%
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="text-3xl font-bold mb-1">
                {Math.round(currentPrediction.predictedAmount).toLocaleString()} <span className="text-lg">円</span>
              </div>
              <p className="text-white text-opacity-90">
                {currentPrediction.months}ヶ月後の予測貯金額
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white border-opacity-20">
              <div>
                <div className="text-sm text-white text-opacity-90">月平均貯金額</div>
                <div className="text-lg font-semibold">
                  {Math.round(currentPrediction.predictedAmount / currentPrediction.months).toLocaleString()}円
                </div>
              </div>
              <div>
                <div className="text-sm text-white text-opacity-90">年間成長率</div>
                <div className="text-lg font-semibold">+12.5%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Prediction Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">貯金額推移予測</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictionChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`} />
                <Tooltip formatter={(value) => [`${Number(value).toLocaleString()}円`, '貯金額']} />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#FF5722" 
                  strokeWidth={3}
                  dot={{ fill: '#FF5722', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scenario Analysis */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">シナリオ分析</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">シナリオタイプ</label>
                <select
                  value={selectedScenario}
                  onChange={(e) => setSelectedScenario(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="expense_reduction">支出削減</option>
                  <option value="income_increase">収入増加</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">変更率 (%)</label>
                <input
                  type="number"
                  value={scenarioPercentage}
                  onChange={(e) => setScenarioPercentage(Number(e.target.value))}
                  min="1"
                  max="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="text-green-500" size={20} />
                <span className="font-medium text-green-700">シナリオ結果</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-green-600">予測改善額</div>
                  <div className="text-xl font-bold text-green-700">
                    +{Math.round(scenarioAnalysis.improvement).toLocaleString()}円
                  </div>
                </div>
                <div>
                  <div className="text-sm text-green-600">月間改善額</div>
                  <div className="text-xl font-bold text-green-700">
                    +{Math.round(scenarioAnalysis.monthlyImprovement).toLocaleString()}円
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Trend Analysis */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">月別収支トレンド</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`} />
                <Tooltip formatter={(value) => [`${Number(value).toLocaleString()}円`]} />
                <Bar dataKey="income" fill="#4CAF50" name="収入" />
                <Bar dataKey="expenses" fill="#FF5722" name="支出" />
                <Bar dataKey="savings" fill="#2196F3" name="貯金" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">支出カテゴリー分析</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${Number(value).toLocaleString()}円`]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-gray-700">{category.name}</span>
                  </div>
                  <div className="font-semibold text-gray-900">
                    {category.value.toLocaleString()}円
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Goal Achievement Forecast */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="text-green-600" size={16} />
            </div>
            <span className="text-lg font-semibold text-gray-900">目標達成予測</span>
          </div>
          
          <div className="space-y-4">
            {mockGoals.map((goal) => {
              const monthsToAchieve = Math.ceil((goal.targetAmount - goal.currentAmount) / 50000);
              const achievementDate = new Date();
              achievementDate.setMonth(achievementDate.getMonth() + monthsToAchieve);
              
              return (
                <div key={goal.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-900">{goal.name}</div>
                    <div className="text-sm text-gray-500">
                      残り {(goal.targetAmount - goal.currentAmount).toLocaleString()}円
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {achievementDate.getFullYear()}年{achievementDate.getMonth() + 1}月
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      monthsToAchieve <= 12 
                        ? 'bg-green-100 text-green-600' 
                        : monthsToAchieve <= 24 
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {monthsToAchieve}ヶ月後
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="text-white" size={20} />
            <span className="text-lg font-semibold">最適化提案</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <ArrowUp className="text-white" size={12} />
              </div>
              <div>
                <div className="font-medium mb-1">収入最適化</div>
                <p className="text-sm text-white text-opacity-90">
                  副業収入を月5万円増やすことで、年間60万円の追加貯金が可能です
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <ArrowDown className="text-white" size={12} />
              </div>
              <div>
                <div className="font-medium mb-1">支出最適化</div>
                <p className="text-sm text-white text-opacity-90">
                  娯楽費を15%削減することで、月1万円の節約効果が期待できます
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <TrendingUp className="text-white" size={12} />
              </div>
              <div>
                <div className="font-medium mb-1">投資提案</div>
                <p className="text-sm text-white text-opacity-90">
                  月3万円の積立投資で、長期的に年利5%の成長が見込めます
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;