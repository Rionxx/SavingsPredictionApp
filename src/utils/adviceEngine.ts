import { Transaction, BudgetCategory, Goal } from '../types';

export class AdviceEngine {
  private transactions: Transaction[];
  private budgetCategories: BudgetCategory[];
  private goals: Goal[];

  constructor(transactions: Transaction[], budgetCategories: BudgetCategory[], goals: Goal[]) {
    this.transactions = transactions;
    this.budgetCategories = budgetCategories;
    this.goals = goals;
  }

  generatePersonalizedAdvice(): string[] {
    const advice: string[] = [];
    
    // 支出分析に基づくアドバイス
    advice.push(...this.analyzeSpendingPatterns());
    
    // 目標達成に向けたアドバイス
    advice.push(...this.analyzeGoalProgress());
    
    // 予算管理アドバイス
    advice.push(...this.analyzeBudgetPerformance());
    
    // 貯金効率化アドバイス
    advice.push(...this.generateSavingsOptimization());
    
    return advice.slice(0, 5); // 上位5つのアドバイスを返す
  }

  private analyzeSpendingPatterns(): string[] {
    const advice: string[] = [];
    const monthlyExpenses = this.getMonthlyExpensesByCategory();
    
    // 最も支出の多いカテゴリーを特定
    const topCategory = Object.entries(monthlyExpenses)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (topCategory && topCategory[1] > 0) {
      const [category, amount] = topCategory;
      const reduction = Math.floor(amount * 0.1);
      advice.push(`${category}の支出を10%削減すると、月々${reduction.toLocaleString()}円の節約が可能です`);
    }

    // 支出の変動が大きいカテゴリーを特定
    const volatileCategory = this.findVolatileCategory();
    if (volatileCategory) {
      advice.push(`${volatileCategory}の支出にばらつきがあります。予算を設定して管理することをお勧めします`);
    }

    return advice;
  }

  private analyzeGoalProgress(): string[] {
    const advice: string[] = [];
    
    this.goals.forEach(goal => {
      const progressRate = goal.currentAmount / goal.targetAmount;
      const monthsRemaining = this.getMonthsUntilTarget(goal.targetDate);
      const monthlyRequired = (goal.targetAmount - goal.currentAmount) / monthsRemaining;
      
      if (progressRate < 0.5 && monthsRemaining < 12) {
        advice.push(`${goal.name}の達成には月々${Math.ceil(monthlyRequired).toLocaleString()}円の貯金が必要です`);
      } else if (progressRate > 0.8) {
        advice.push(`${goal.name}の達成まであと少しです！このペースを維持しましょう`);
      }
    });

    return advice;
  }

  private analyzeBudgetPerformance(): string[] {
    const advice: string[] = [];
    
    this.budgetCategories.forEach(category => {
      const utilizationRate = category.spentAmount / category.budgetAmount;
      
      if (utilizationRate > 1.1) {
        const overspend = category.spentAmount - category.budgetAmount;
        advice.push(`${category.name}で予算を${overspend.toLocaleString()}円超過しています。支出を見直しましょう`);
      } else if (utilizationRate < 0.7) {
        const remaining = category.budgetAmount - category.spentAmount;
        advice.push(`${category.name}で${remaining.toLocaleString()}円の予算が余っています。貯金に回すことを検討しましょう`);
      }
    });

    return advice;
  }

  private generateSavingsOptimization(): string[] {
    const advice: string[] = [];
    const currentSavingsRate = this.calculateSavingsRate();
    
    if (currentSavingsRate < 0.1) {
      advice.push('貯金率が10%を下回っています。まずは収入の10%を目標に貯金を始めましょう');
    } else if (currentSavingsRate < 0.2) {
      advice.push('貯金率を20%まで上げることで、より早く目標を達成できます');
    }

    // 定期支出の最適化提案
    const recurringExpenses = this.transactions.filter(t => t.isRecurring && t.type === 'expense');
    if (recurringExpenses.length > 0) {
      advice.push('定期支出を見直すことで、継続的な節約効果が期待できます');
    }

    return advice;
  }

  private getMonthlyExpensesByCategory(): Record<string, number> {
    const expenses: Record<string, number> = {};
    const monthsCount = this.getUniqueMonthsCount();
    
    this.transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        if (!expenses[transaction.category]) {
          expenses[transaction.category] = 0;
        }
        expenses[transaction.category] += transaction.amount;
      });

    // 月平均に変換
    Object.keys(expenses).forEach(category => {
      expenses[category] = expenses[category] / monthsCount;
    });

    return expenses;
  }

  private findVolatileCategory(): string | null {
    const categoryVariances: Record<string, number> = {};
    const monthlyData = this.getMonthlyDataByCategory();
    
    Object.entries(monthlyData).forEach(([category, monthlyAmounts]) => {
      if (monthlyAmounts.length < 2) return;
      
      const mean = monthlyAmounts.reduce((sum, amount) => sum + amount, 0) / monthlyAmounts.length;
      const variance = monthlyAmounts.reduce((sum, amount) => sum + Math.pow(amount - mean, 2), 0) / monthlyAmounts.length;
      const coefficientOfVariation = Math.sqrt(variance) / mean;
      
      categoryVariances[category] = coefficientOfVariation;
    });

    const mostVolatile = Object.entries(categoryVariances)
      .sort(([,a], [,b]) => b - a)[0];
    
    return mostVolatile && mostVolatile[1] > 0.5 ? mostVolatile[0] : null;
  }

  private getMonthlyDataByCategory(): Record<string, number[]> {
    const data: Record<string, Record<string, number>> = {};
    
    this.transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const month = transaction.date.substring(0, 7);
        if (!data[transaction.category]) {
          data[transaction.category] = {};
        }
        if (!data[transaction.category][month]) {
          data[transaction.category][month] = 0;
        }
        data[transaction.category][month] += transaction.amount;
      });

    const result: Record<string, number[]> = {};
    Object.entries(data).forEach(([category, monthlyData]) => {
      result[category] = Object.values(monthlyData);
    });

    return result;
  }

  private getMonthsUntilTarget(targetDate: string): number {
    const target = new Date(targetDate);
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30)));
  }

  private calculateSavingsRate(): number {
    const totalIncome = this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return totalIncome > 0 ? (totalIncome - totalExpenses) / totalIncome : 0;
  }

  private getUniqueMonthsCount(): number {
    const months = new Set(this.transactions.map(t => t.date.substring(0, 7)));
    return Math.max(1, months.size);
  }
}