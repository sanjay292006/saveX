import { TimeHorizon } from '../types';

export function formatCurrency(
  amount: number,
  privacyMode: boolean,
  showSymbol: boolean = true
): string {
  if (privacyMode) {
    return '••••••';
  }
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  const prefix = amount < 0 ? '-' : '';
  const symbol = showSymbol ? '₹' : '';
  return `${prefix}${symbol}${formatted}`;
}

export interface ParsedQuickAdd {
  name: string;
  amount: number;
  category: string;
  type: 'expense' | 'income';
}

const KNOWN_CATEGORIES = [
  'Food',
  'Income',
  'Transport',
  'Health',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Housing',
  'Vacation',
  'Subscriptions',
  'General',
];

export function parseQuickAddText(input: string): ParsedQuickAdd {
  const trimmed = input.trim();
  if (!trimmed) {
    return { name: 'Expense', amount: 0, category: 'General', type: 'expense' };
  }

  // Find price pattern (₹25, 25.50, 25, +3000, Rs 500)
  const numberMatch = trimmed.match(/([+-]?(?:₹|\$|rs\.?|inr)?\s*\d+(?:\.\d{1,2})?)/i);
  let amount = 0;
  let rawNumberStr = '';

  if (numberMatch) {
    rawNumberStr = numberMatch[1];
    const cleaned = rawNumberStr.replace(/(?:₹|\$|rs\.?|inr)/gi, '').trim();
    amount = parseFloat(cleaned);
  }

  // Remove the price string from the text to parse name and category
  let remainingText = trimmed;
  if (rawNumberStr) {
    remainingText = remainingText.replace(rawNumberStr, '').trim();
  }

  const words = remainingText.split(/\s+/).filter(Boolean);
  let category = 'General';
  let nameWords: string[] = [];

  for (const word of words) {
    const matchedCategory = KNOWN_CATEGORIES.find(
      (cat) => cat.toLowerCase() === word.toLowerCase()
    );
    if (matchedCategory && category === 'General') {
      category = matchedCategory;
    } else {
      nameWords.push(word);
    }
  }

  let name = nameWords.join(' ');
  if (!name) {
    name = category !== 'General' ? category : 'Quick Expense';
  }

  // Determine type
  let type: 'expense' | 'income' = 'expense';
  if (
    category.toLowerCase() === 'income' ||
    rawNumberStr.startsWith('+') ||
    /salary|paycheck|income|dividend|freelance|bonus|refund/i.test(name)
  ) {
    type = 'income';
  }

  return {
    name: name.charAt(0).toUpperCase() + name.slice(1),
    amount: Math.abs(amount),
    category,
    type,
  };
}

export function calculateDaysRemainingInMonth(date: Date = new Date()): {
  daysRemaining: number;
  daysInMonth: number;
  currentDay: number;
} {
  const year = date.getFullYear();
  const month = date.getMonth();
  const currentDay = date.getDate();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysRemaining = Math.max(1, daysInMonth - currentDay + 1);

  return { daysRemaining, daysInMonth, currentDay };
}

export function calculateSafeToSpend(
  monthlyBudget: number,
  totalSpentSoFar: number,
  timeHorizon: TimeHorizon,
  monthlyIncome: number = 0,
  monthlySavingsGoal: number = 0
): {
  safeToSpendAmount: number;
  dailyLimit: number;
  gaugePercentage: number; // 0 to 100
  daysRemaining: number;
  effectiveBudget: number;
  isOverBudget: boolean;
  overBudgetAmount: number;
} {
  const { daysRemaining } = calculateDaysRemainingInMonth();

  // Determine effective budget cap for living expenses:
  // If income & savings goal are defined, disposable income = max(0, income - savingsGoal).
  // If user specified an expense cap (monthlyBudget), effective budget is min(monthlyBudget, disposable) if monthlyBudget > 0.
  let effectiveBudget = monthlyBudget;
  if (monthlyIncome > 0) {
    const disposable = Math.max(0, monthlyIncome - Math.max(0, monthlySavingsGoal));
    effectiveBudget = monthlyBudget > 0 ? Math.min(monthlyBudget, disposable) : disposable;
  } else if (monthlySavingsGoal > 0) {
    effectiveBudget = Math.max(0, monthlyBudget - monthlySavingsGoal);
  }

  const remainingBudget = effectiveBudget - totalSpentSoFar;
  const isOverBudget = remainingBudget < 0;
  const overBudgetAmount = Math.abs(Math.min(0, remainingBudget));

  const safeToSpendNet = Math.max(0, remainingBudget);
  const dailyLimit = Math.max(0, safeToSpendNet / daysRemaining);

  let safeToSpendAmount = dailyLimit;

  if (timeHorizon === 'weekly') {
    safeToSpendAmount = dailyLimit * 7;
  } else if (timeHorizon === 'monthly') {
    safeToSpendAmount = safeToSpendNet;
  } else if (timeHorizon === 'yearly') {
    safeToSpendAmount = safeToSpendNet * 12;
  }

  // Calculate percentage of budget remaining
  const gaugePercentage = Math.min(
    100,
    Math.max(0, (safeToSpendNet / (effectiveBudget || 1)) * 100)
  );

  return {
    safeToSpendAmount: Math.round(safeToSpendAmount),
    dailyLimit: Math.round(dailyLimit),
    gaugePercentage,
    daysRemaining,
    effectiveBudget: Math.round(effectiveBudget),
    isOverBudget,
    overBudgetAmount: Math.round(overBudgetAmount),
  };
}
