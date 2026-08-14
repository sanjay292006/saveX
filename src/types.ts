export type TimeHorizon = 'weekly' | 'monthly' | 'yearly';

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: 'expense' | 'income';
  category: string;
  date: string; // ISO date format YYYY-MM-DD
  rawInput?: string;
}

export interface SavingsBucket {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  color: string; // e.g. 'primary' | 'secondary' | 'tertiary'
  category?: string;
}

export interface BudgetConfig {
  monthlyBudget: number;
  monthlyIncome: number;
  monthlySavingsGoal: number;
}

export interface HeatmapCell {
  date: string;
  dayLabel: string;
  amount: number;
  intensityLevel: 0 | 1 | 2 | 3 | 4; // 0 = none, 1 = low, 2 = mid, 3 = high, 4 = max
}
