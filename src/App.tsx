import { useState, useEffect, useMemo } from 'react';
import {
  Transaction,
  SavingsBucket,
  BudgetConfig,
  TimeHorizon,
} from './types';
import {
  getStoredTransactions,
  saveStoredTransactions,
  getStoredBuckets,
  saveStoredBuckets,
  getStoredBudget,
  saveStoredBudget,
  getStoredPrivacyMode,
  saveStoredPrivacyMode,
  getStoredUser,
  saveStoredUser,
  resetToDefaults,
} from './utils/storage';

import { Header } from './components/Header';
import { SafeToSpendGauge } from './components/SafeToSpendGauge';
import { QuickAddInput } from './components/QuickAddInput';
import { SavingsBuckets } from './components/SavingsBuckets';
import { ActivityHeatmap } from './components/ActivityHeatmap';
import { ScenarioPlanner } from './components/ScenarioPlanner';
import { HistoryView } from './components/HistoryView';
import { BucketsView } from './components/BucketsView';
import { InsightsView } from './components/InsightsView';

import { AddTransactionModal } from './components/AddTransactionModal';
import { AddBucketModal } from './components/AddBucketModal';
import { DepositModal } from './components/DepositModal';
import { SettingsModal } from './components/SettingsModal';
import { AuthScreen, UserProfile } from './components/AuthScreen';
import { BottomNav, NavTab } from './components/BottomNav';

export default function App() {
  // User Authentication State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // State from storage
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [buckets, setBuckets] = useState<SavingsBucket[]>([]);
  const [budget, setBudget] = useState<BudgetConfig>({
    monthlyBudget: 45000,
    monthlyIncome: 85000,
    monthlySavingsGoal: 15000,
  });
  const [privacyMode, setPrivacyMode] = useState<boolean>(false);

  // App UI State
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>('weekly');

  // Modals
  const [isAddTxModalOpen, setIsAddTxModalOpen] = useState(false);
  const [isAddBucketModalOpen, setIsAddBucketModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [depositBucket, setDepositBucket] = useState<SavingsBucket | null>(null);

  // Load initial data on mount
  useEffect(() => {
    setTransactions(getStoredTransactions());
    setBuckets(getStoredBuckets());
    setBudget(getStoredBudget());
    setPrivacyMode(getStoredPrivacyMode());
    setUser(getStoredUser());
  }, []);

  const handleLoginSuccess = (profile: UserProfile) => {
    setUser(profile);
    saveStoredUser(profile);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    saveStoredUser(null);
  };

  // Save changes to LocalStorage
  const handleAddTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...newTxData,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    saveStoredTransactions(updated);
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    saveStoredTransactions(updated);
  };

  const handleAddBucket = (newBucketData: Omit<SavingsBucket, 'id'>) => {
    const newBucket: SavingsBucket = {
      ...newBucketData,
      id: `bucket-${Date.now()}`,
    };
    const updated = [...buckets, newBucket];
    setBuckets(updated);
    saveStoredBuckets(updated);
  };

  const handleDeleteBucket = (id: string) => {
    const updated = buckets.filter((b) => b.id !== id);
    setBuckets(updated);
    saveStoredBuckets(updated);
  };

  const handleUpdateBucketAmount = (
    bucketId: string,
    deltaAmount: number,
    isDeposit: boolean
  ) => {
    const updated = buckets.map((b) => {
      if (b.id === bucketId) {
        const updatedCurrent = isDeposit
          ? b.currentAmount + deltaAmount
          : Math.max(0, b.currentAmount - deltaAmount);
        return { ...b, currentAmount: updatedCurrent };
      }
      return b;
    });
    setBuckets(updated);
    saveStoredBuckets(updated);

    // Also record transaction for deposit/withdraw if desired
    const targetBucket = buckets.find((b) => b.id === bucketId);
    if (targetBucket) {
      handleAddTransaction({
        name: `${isDeposit ? 'Deposit to' : 'Withdraw from'} ${targetBucket.name}`,
        amount: deltaAmount,
        type: isDeposit ? 'expense' : 'income',
        category: 'Savings',
        date: new Date().toISOString().split('T')[0],
      });
    }
  };

  const handleSaveBudget = (newBudget: BudgetConfig) => {
    setBudget(newBudget);
    saveStoredBudget(newBudget);
  };

  const handleTogglePrivacy = () => {
    const next = !privacyMode;
    setPrivacyMode(next);
    saveStoredPrivacyMode(next);
  };

  const handleReset = () => {
    resetToDefaults();
    setTransactions(getStoredTransactions());
    setBuckets(getStoredBuckets());
    setBudget(getStoredBudget());
  };

  // Calculate total spent so far in current month
  const totalSpentThisMonth = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return transactions
      .filter((t) => {
        if (t.type !== 'expense') return false;
        const d = new Date(t.date);
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col">
      {/* App Header */}
      <Header
        privacyMode={privacyMode}
        onTogglePrivacy={handleTogglePrivacy}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto pt-20 pb-32 px-3 sm:px-6 flex flex-col gap-6">
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            {/* Top Section: Safe-to-Spend Gauge */}
            <SafeToSpendGauge
              timeHorizon={timeHorizon}
              onChangeHorizon={setTimeHorizon}
              monthlyBudget={budget.monthlyBudget}
              monthlyIncome={budget.monthlyIncome}
              monthlySavingsGoal={budget.monthlySavingsGoal}
              totalSpentThisMonth={totalSpentThisMonth}
              privacyMode={privacyMode}
              onOpenSettings={() => setIsSettingsModalOpen(true)}
            />

            {/* Quick-Add Expense Bar */}
            <QuickAddInput
              onAddTransaction={handleAddTransaction}
              onOpenManualModal={() => setIsAddTxModalOpen(true)}
            />

            {/* Interactive Savings Buckets */}
            <SavingsBuckets
              buckets={buckets}
              privacyMode={privacyMode}
              onOpenDepositModal={(b) => setDepositBucket(b)}
              onOpenAddBucketModal={() => setIsAddBucketModalOpen(true)}
              onViewAllBuckets={() => setActiveTab('buckets')}
            />

            {/* Spending Heatmap & What-If Stack */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <ActivityHeatmap
                transactions={transactions}
                privacyMode={privacyMode}
              />

              <ScenarioPlanner
                initialMonthlyGoal={budget.monthlySavingsGoal}
                privacyMode={privacyMode}
                onUpdateGoal={(newGoal) =>
                  handleSaveBudget({ ...budget, monthlySavingsGoal: newGoal })
                }
              />
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <HistoryView
            transactions={transactions}
            privacyMode={privacyMode}
            onOpenAddModal={() => setIsAddTxModalOpen(true)}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {activeTab === 'buckets' && (
          <BucketsView
            buckets={buckets}
            privacyMode={privacyMode}
            onOpenDepositModal={(b) => setDepositBucket(b)}
            onOpenAddBucketModal={() => setIsAddBucketModalOpen(true)}
            onDeleteBucket={handleDeleteBucket}
          />
        )}

        {activeTab === 'insights' && (
          <InsightsView
            transactions={transactions}
            budget={budget}
            privacyMode={privacyMode}
            onUpdateBudget={handleSaveBudget}
          />
        )}
      </main>

      {/* Modals */}
      <AddTransactionModal
        isOpen={isAddTxModalOpen}
        onClose={() => setIsAddTxModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />

      <AddBucketModal
        isOpen={isAddBucketModalOpen}
        onClose={() => setIsAddBucketModalOpen(false)}
        onAddBucket={handleAddBucket}
      />

      <DepositModal
        bucket={depositBucket}
        privacyMode={privacyMode}
        onClose={() => setDepositBucket(null)}
        onUpdateBucketAmount={handleUpdateBucketAmount}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        budget={budget}
        onClose={() => setIsSettingsModalOpen(false)}
        onSaveBudget={handleSaveBudget}
        onResetData={handleReset}
      />

      {/* Auth Screen Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition-colors"
            >
              ✕
            </button>
            <AuthScreen
              onLoginSuccess={handleLoginSuccess}
              onSkipAsGuest={() => setIsAuthModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Fixed Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
}
