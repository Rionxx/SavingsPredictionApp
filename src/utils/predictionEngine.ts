import { Transaction, PredictionData } from '../types';
import { addMonths, differenceInMonths, parseISO } from 'date-fns';

export class PredictionEngine {
  private transactions: Transaction[];

  constructor(transactions: Transaction[]) {
    this.transactions = transactions;
  }

  // 短期予測（1-12ヶ月）
  generateShortTermPrediction(months: number): PredictionData {
    const monthlyData = this.getMonthlyAverages();
    const trend = this.calculateTrend();
    const seasonality = this.calculateSeasonality();
    
    const baseAmount = monthlyData.avgSavings * months;
    const trendAdjustment = trend * months * (months / 12);
    const seasonalAdjustment = this.applySeasonality(months, seasonality);
    
    const predictedAmount = Math.max(0, baseAmount + trendAdjustment + seasonalAdjustment);
    const confidence = this.calculateConfidence(months, 'short');

    return {
      period: 'short',
      months,
      predictedAmount,
      confidence,
      factors: this.getInfluencingFactors('short')
    };
  }

  // 中期予測（1-5年）
  generateMediumTermPrediction(months: number): PredictionData {
    const monthlyData = this.getMonthlyAverages();
    const trend = this.calculateTrend();
    const inflationRate = 0.02; // 2%年間インフレ率
    
    let predictedAmount = 0;
    for (let i = 1; i <= months; i++) {
      const monthlyInflation = Math.pow(1 + inflationRate, i / 12);
      const adjustedSavings = monthlyData.avgSavings / monthlyInflation;
      const trendAdjustment = trend * (i / 12);
      predictedAmount += adjustedSavings + trendAdjustment;
    }

    const confidence = this.calculateConfidence(months, 'medium');

    return {
      period: 'medium',
      months,
      predictedAmount: Math.max(0, predictedAmount),
      confidence,
      factors: this.getInfluencingFactors('medium')
    };
  }

  // 長期予測（5年以上）
  generateLongTermPrediction(months: number): PredictionData {
    const monthlyData = this.getMonthlyAverages();
    const baseGrowthRate = 0.05; // 5%年間成長率（投資収益含む）
    const inflationRate = 0.02;
    
    const realGrowthRate = baseGrowthRate - inflationRate;
    const monthlyGrowthRate = Math.pow(1 + realGrowthRate, 1/12) - 1;
    
    let predictedAmount = 0;
    let currentSavings = monthlyData.avgSavings;
    
    for (let i = 1; i <= months; i++) {
      currentSavings *= (1 + monthlyGrowthRate);
      predictedAmount += currentSavings;
    }

    const confidence = this.calculateConfidence(months, 'long');

    return {
      period: 'long',
      months,
      predictedAmount: Math.max(0, predictedAmount),
      confidence,
      factors: this.getInfluencingFactors('long')
    };
  }

  // シナリオ分析
  generateScenario(type: 'expense_reduction' | 'income_increase', percentage: number, months: number) {
    const baseData = this.getMonthlyAverages();
    let adjustedSavings = baseData.avgSavings;

    if (type === 'expense_reduction') {
      const expenseReduction = baseData.avgExpenses * (percentage / 100);
      adjustedSavings += expenseReduction;
    } else if (type === 'income_increase') {
      const incomeIncrease = baseData.avgIncome * (percentage / 100);
      adjustedSavings += incomeIncrease;
    }

    const predictedAmount = adjustedSavings * months;
    const improvement = predictedAmount - (baseData.avgSavings * months);

    return {
      predictedAmount,
      improvement,
      monthlyImprovement: improvement / months,
      scenario: type,
      percentage
    };
  }

  private getMonthlyAverages() {
    const monthlyData = new Map<string, { income: number; expenses: number }>();
    
    this.transactions.forEach(transaction => {
      const monthKey = transaction.date.substring(0, 7); // YYYY-MM
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { income: 0, expenses: 0 });
      }
      
      const data = monthlyData.get(monthKey)!;
      if (transaction.type === 'income') {
        data.income += transaction.amount;
      } else {
        data.expenses += transaction.amount;
      }
    });

    const months = Array.from(monthlyData.values());
    const avgIncome = months.reduce((sum, m) => sum + m.income, 0) / months.length;
    const avgExpenses = months.reduce((sum, m) => sum + m.expenses, 0) / months.length;
    const avgSavings = avgIncome - avgExpenses;

    return { avgIncome, avgExpenses, avgSavings };
  }

  private calculateTrend(): number {
    const monthlyData = this.getMonthlyTrend();
    if (monthlyData.length < 2) return 0;

    // 線形回帰で傾向を計算
    const n = monthlyData.length;
    const sumX = monthlyData.reduce((sum, _, i) => sum + i, 0);
    const sumY = monthlyData.reduce((sum, data) => sum + data.savings, 0);
    const sumXY = monthlyData.reduce((sum, data, i) => sum + i * data.savings, 0);
    const sumXX = monthlyData.reduce((sum, _, i) => sum + i * i, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope || 0;
  }

  private getMonthlyTrend() {
    const monthlyData = new Map<string, number>();
    
    this.transactions.forEach(transaction => {
      const monthKey = transaction.date.substring(0, 7);
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, 0);
      }
      
      const amount = transaction.type === 'income' ? transaction.amount : -transaction.amount;
      monthlyData.set(monthKey, monthlyData.get(monthKey)! + amount);
    });

    return Array.from(monthlyData.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, savings]) => ({ month, savings }));
  }

  private calculateSeasonality(): number[] {
    // 12ヶ月の季節性パターンを計算
    const monthlyPatterns = new Array(12).fill(0);
    const monthlyCounts = new Array(12).fill(0);
    const monthlyVariances = new Array(12).fill(0);
    const monthlySums = new Array(12).fill(0);
    const monthlySquaredSums = new Array(12).fill(0);

    // 各月のデータを収集
    this.transactions.forEach(transaction => {
      const month = parseInt(transaction.date.substring(5, 7)) - 1; // 0-11
      const amount = transaction.type === 'income' ? transaction.amount : -transaction.amount;
      monthlySums[month] += amount;
      monthlySquaredSums[month] += amount * amount;
      monthlyCounts[month]++;
    });

    // 各月の平均と標準偏差を計算
    for (let i = 0; i < 12; i++) {
      if (monthlyCounts[i] > 0) {
        const mean = monthlySums[i] / monthlyCounts[i];
        const variance = (monthlySquaredSums[i] / monthlyCounts[i]) - (mean * mean);
        monthlyPatterns[i] = mean;
        monthlyVariances[i] = Math.sqrt(variance);
      }
    }

    // 季節性の強さを計算
    const overallMean = monthlyPatterns.reduce((sum, val) => sum + val, 0) / 12;
    const seasonalityStrength = monthlyPatterns.map((pattern, i) => {
      if (monthlyCounts[i] === 0) return 0;
      return (pattern - overallMean) / monthlyVariances[i];
    });

    return seasonalityStrength;
  }

  private applySeasonality(months: number, seasonality: number[]): number {
    let adjustment = 0;
    const currentMonth = new Date().getMonth();
    const monthlyData = this.getMonthlyAverages();
    
    for (let i = 0; i < months; i++) {
      const month = (currentMonth + i) % 12;
      // 季節性の影響を、データの変動に応じて調整
      const seasonalityImpact = seasonality[month] * monthlyData.avgSavings * 0.15;
      adjustment += seasonalityImpact;
    }
    
    return adjustment;
  }

  private calculateConfidence(months: number, period: 'short' | 'medium' | 'long'): number {
    const dataPoints = this.transactions.length;
    const timeSpan = this.getDataTimeSpan();
    
    // データの量に基づく信頼度
    const dataConfidence = Math.min(dataPoints / 100, 1);
    
    // 期間に基づく信頼度
    let periodConfidence = 1;
    if (period === 'short') {
      periodConfidence = Math.max(0, 1 - (months / 12));
    } else if (period === 'medium') {
      periodConfidence = Math.max(0, 1 - (months / 60));
    } else {
      periodConfidence = Math.max(0, 1 - (months / 120));
    }
    
    // データの一貫性に基づく信頼度
    const consistencyConfidence = this.calculateDataConsistency();
    
    // 総合的な信頼度を計算
    return (dataConfidence * 0.3 + periodConfidence * 0.4 + consistencyConfidence * 0.3);
  }

  private calculateDataConsistency(): number {
    const monthlyData = this.getMonthlyTrend();
    if (monthlyData.length < 2) return 0;

    // 標準偏差を計算
    const mean = monthlyData.reduce((sum, data) => sum + data.savings, 0) / monthlyData.length;
    const variance = monthlyData.reduce((sum, data) => {
      const diff = data.savings - mean;
      return sum + (diff * diff);
    }, 0) / monthlyData.length;
    const stdDev = Math.sqrt(variance);

    // 変動係数（CV）を計算
    const cv = stdDev / Math.abs(mean);
    
    // 変動係数が小さいほど信頼度が高い
    return Math.max(0, 1 - cv);
  }

  private getDataTimeSpan(): number {
    if (this.transactions.length === 0) return 0;
    
    const dates = this.transactions.map(t => parseISO(t.date));
    const earliest = new Date(Math.min(...dates.map(d => d.getTime())));
    const latest = new Date(Math.max(...dates.map(d => d.getTime())));
    
    return differenceInMonths(latest, earliest);
  }

  private getInfluencingFactors(period: 'short' | 'medium' | 'long'): string[] {
    const factors = [];
    
    if (period === 'short') {
      factors.push('過去の支出パターン', '季節性要因', '定期収入');
    } else if (period === 'medium') {
      factors.push('収入成長トレンド', 'インフレ率', 'ライフイベント');
    } else {
      factors.push('投資収益', '長期経済成長', 'インフレ調整');
    }
    
    return factors;
  }
}