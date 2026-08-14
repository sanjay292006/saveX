import { Transaction, SavingsBucket, BudgetConfig } from '../types';

const STORAGE_KEYS = {
  TRANSACTIONS: 'savex_transactions_v2',
  BUCKETS: 'savex_buckets_v3',
  BUDGET: 'savex_budget_v2',
  PRIVACY: 'savex_privacy_v2',
  USER: 'savex_user_v1',
};

// Seed default transactions if empty (in INR)
const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    name: 'Coffee & Breakfast',
    amount: 250,
    type: 'expense',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    rawInput: 'Coffee & Breakfast 250 Food',
  },
  {
    id: 'tx-2',
    name: 'Grocery Supermarket',
    amount: 3450,
    type: 'expense',
    category: 'Food',
    date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
    rawInput: 'Grocery Supermarket 3450 Food',
  },
  {
    id: 'tx-3',
    name: 'Monthly Salary',
    amount: 85000,
    type: 'income',
    category: 'Income',
    date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    rawInput: 'Monthly Salary 85000 Income',
  },
  {
    id: 'tx-4',
    name: 'Electricity & Wifi Utility',
    amount: 2200,
    type: 'expense',
    category: 'Utilities',
    date: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
    rawInput: 'Electricity & Wifi Utility 2200 Utilities',
  },
  {
    id: 'tx-5',
    name: 'Gym Membership',
    amount: 1800,
    type: 'expense',
    category: 'Health',
    date: new Date(Date.now() - 86400000 * 6).toISOString().split('T')[0],
    rawInput: 'Gym Membership 1800 Health',
  },
  {
    id: 'tx-6',
    name: 'Weekend Dining',
    amount: 1950,
    type: 'expense',
    category: 'Food',
    date: new Date(Date.now() - 86400000 * 8).toISOString().split('T')[0],
    rawInput: 'Weekend Dining 1950 Food',
  },
  {
    id: 'tx-7',
    name: 'OTT Subscriptions',
    amount: 699,
    type: 'expense',
    category: 'Subscriptions',
    date: new Date(Date.now() - 86400000 * 11).toISOString().split('T')[0],
    rawInput: 'OTT Subscriptions 699 Subscriptions',
  },
];

const DEFAULT_BUCKETS: SavingsBucket[] = [];

const DEFAULT_BUDGET: BudgetConfig = {
  monthlyBudget: 45000,
  monthlyIncome: 85000,
  monthlySavingsGoal: 15000,
};

export function getStoredTransactions(): Transaction[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(DEFAULT_TRANSACTIONS));
      return DEFAULT_TRANSACTIONS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load transactions from localStorage', e);
    return DEFAULT_TRANSACTIONS;
  }
}

export function saveStoredTransactions(transactions: Transaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (e) {
    console.error('Failed to save transactions to localStorage', e);
  }
}

export function getStoredBuckets(): SavingsBucket[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BUCKETS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.BUCKETS, JSON.stringify(DEFAULT_BUCKETS));
      return DEFAULT_BUCKETS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load buckets from localStorage', e);
    return DEFAULT_BUCKETS;
  }
}

export function saveStoredBuckets(buckets: SavingsBucket[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BUCKETS, JSON.stringify(buckets));
  } catch (e) {
    console.error('Failed to save buckets to localStorage', e);
  }
}

export function getStoredBudget(): BudgetConfig {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BUDGET);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(DEFAULT_BUDGET));
      return DEFAULT_BUDGET;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load budget from localStorage', e);
    return DEFAULT_BUDGET;
  }
}

export function saveStoredBudget(budget: BudgetConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budget));
  } catch (e) {
    console.error('Failed to save budget to localStorage', e);
  }
}

export function getStoredPrivacyMode(): boolean {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRIVACY);
    return data ? JSON.parse(data) : false;
  } catch {
    return false;
  }
}

export function saveStoredPrivacyMode(privacy: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRIVACY, JSON.stringify(privacy));
  } catch (e) {
    console.error('Failed to save privacy mode', e);
  }
}

export function getStoredUser(): any | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveStoredUser(user: any | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  } catch (e) {
    console.error('Failed to save user session', e);
  }
}

export function resetToDefaults(): void {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(DEFAULT_TRANSACTIONS));
  localStorage.setItem(STORAGE_KEYS.BUCKETS, JSON.stringify(DEFAULT_BUCKETS));
  localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(DEFAULT_BUDGET));
}
