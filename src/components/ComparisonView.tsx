import React, { useState } from 'react';
import { ChevronLeft, Users, TrendingUp, TrendingDown, Award, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { mockComparisonData } from '../data/mockData';

interface ComparisonViewProps {
  onClose: () => void;
}

const ComparisonView = ({ onClose }: ComparisonViewProps) => {
  const [selectedAge, setSelectedAge] = useState('20-30');
  const [selectedRegion, setSelectedRegion] = useState('全国');

  const ageGroups = [
    { value: '20-30', label: '20代' },
    { value: '30-40', label: '30代' },
    { value: '40-50', label: '40代' }
  ];

  const regions = [
    { value: '全国', label: '全国平均' },
    { value: '東京', label: '東京都' },
    { value: '大阪', label: '大阪府' },
    { value: '愛知', label: '愛知県' }
  ];

  // レーダーチャート用データ
  const radarData = [
    { category: '貯金額', user: 85, average: 50 },
    { category: '食費管理', user: 65, average: 70 },
    { category: '投資', user: 40, average: 30 },
    { category: '固定費', user: 80, average: 60 },
    { category: '娯楽費', user: 30, average: 50 },
    { category: '緊急資金', user: 70, average: 40 }
  ];

  // 比較チャート用データ
  const comparisonChartData = mockComparisonData.map(item => ({
    category: item.category,
    あなた: item.userAmount,
    平均: item.averageAmount
  }));

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 80) return 'text-green-600 bg-green-100';
    if (percentile >= 60) return 'text-blue-600 bg-blue-100';
    if (percentile >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPercentileLabel = (percentile: number) => {
    if (percentile >= 90) return '優秀';
    if (percentile >= 70) return '良好';
    if (percentile >= 50) return '平均的';
    if (percentile >= 30) return '改善の余地あり';
    return '要改善';
  };

  const overallScore = Math.round(mockComparisonData.reduce((sum, item) => sum + item.percentile, 0) / mockComparisonData.length);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">同世代比較</h1>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Filter Options */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">比較条件</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">年代</label>
              <select
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {ageGroups.map(group => (
                  <option key={group.value} value={group.value}>{group.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">地域</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {regions.map(region => (
                  <option key={region.value} value={region.value}>{region.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Overall Score */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Award className="text-white" size={16} />
            </div>
            <span className="font-medium">総合スコア</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold mb-2">{overallScore}</div>
              <div className="text-white text-opacity-90">
                {getPercentileLabel(overallScore)} ({selectedAge}代 {selectedRegion})
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">上位{100 - overallScore}%</div>
              <div className="text-sm text-white text-opacity-90">同世代内順位</div>
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">総合評価レーダー</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="あなた"
                  dataKey="user"
                  stroke="#FF5722"
                  fill="#FF5722"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="平均"
                  dataKey="average"
                  stroke="#2196F3"
                  fill="#2196F3"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600">あなた</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">同世代平均</span>
            </div>
          </div>
        </div>

        {/* Comparison Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">カテゴリ別比較</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => [`${Number(value).toLocaleString()}円`]} />
                <Bar dataKey="あなた" fill="#FF5722" />
                <Bar dataKey="平均" fill="#2196F3" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Comparison */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">詳細比較</h3>
          {mockComparisonData.map((item, index) => {
            const difference = item.userAmount - item.averageAmount;
            const isAboveAverage = difference > 0;
            
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      {item.category === '貯金額' && <Target className="text-gray-600" size={20} />}
                      {item.category === '食費' && <span className="text-lg">🍽️</span>}
                      {item.category === '交通費' && <span className="text-lg">🚗</span>}
                      {item.category === '娯楽費' && <span className="text-lg">🎮</span>}
                      {item.category === '光熱費' && <span className="text-lg">⚡</span>}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.category}</h4>
                      <div className={`text-xs px-2 py-1 rounded-full ${getPercentileColor(item.percentile)}`}>
                        上位{100 - item.percentile}% ({getPercentileLabel(item.percentile)})
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      {isAboveAverage ? (
                        <TrendingUp className="text-green-500" size={16} />
                      ) : (
                        <TrendingDown className="text-red-500" size={16} />
                      )}
                      <span className={`font-semibold ${
                        isAboveAverage ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {isAboveAverage ? '+' : ''}{difference.toLocaleString()}円
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">平均との差</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-orange-50 rounded-xl">
                    <div className="text-lg font-bold text-orange-600">
                      {item.userAmount.toLocaleString()}円
                    </div>
                    <div className="text-xs text-gray-600">あなた</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-xl">
                    <div className="text-lg font-bold text-blue-600">
                      {item.averageAmount.toLocaleString()}円
                    </div>
                    <div className="text-xs text-gray-600">同世代平均</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Insights */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-6 text-white">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="text-white" size={20} />
            <span className="text-lg font-semibold">インサイト</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold">1</span>
              </div>
              <p className="text-sm">
                あなたの貯金額は同世代の上位18%に位置しており、非常に優秀です
              </p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold">2</span>
              </div>
              <p className="text-sm">
                娯楽費は平均より低く抑えられており、堅実な家計管理ができています
              </p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold">3</span>
              </div>
              <p className="text-sm">
                食費をさらに5%削減することで、同世代上位10%の水準に到達できます
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;