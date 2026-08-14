import React, { useState, useEffect } from 'react';
import { BudgetConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  budget: BudgetConfig;
  onClose: () => void;
  onSaveBudget: (budget: BudgetConfig) => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  budget,
  onClose,
  onSaveBudget,
  onResetData,
}) => {
  const [monthlyBudget, setMonthlyBudget] = useState(budget.monthlyBudget.toString());
  const [monthlyIncome, setMonthlyIncome] = useState(budget.monthlyIncome.toString());
  const [monthlySavingsGoal, setMonthlySavingsGoal] = useState(
    budget.monthlySavingsGoal.toString()
  );

  // Synchronize state whenever modal opens or budget prop changes
  useEffect(() => {
    if (isOpen) {
      setMonthlyBudget(budget.monthlyBudget.toString());
      setMonthlyIncome(budget.monthlyIncome.toString());
      setMonthlySavingsGoal(budget.monthlySavingsGoal.toString());
    }
  }, [isOpen, budget]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pBudget = parseFloat(monthlyBudget);
    const pIncome = parseFloat(monthlyIncome);
    const pGoal = parseFloat(monthlySavingsGoal);

    onSaveBudget({
      monthlyBudget: !isNaN(pBudget) ? Math.max(0, pBudget) : budget.monthlyBudget,
      monthlyIncome: !isNaN(pIncome) ? Math.max(0, pIncome) : budget.monthlyIncome,
      monthlySavingsGoal: !isNaN(pGoal) ? Math.max(0, pGoal) : budget.monthlySavingsGoal,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-xl flex flex-col gap-5 relative">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600 text-2xl">
              tune
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              Budget & Preferences
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors border border-slate-200"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Monthly Budget Cap */}
          <div>
            <label className="block text-xs font-mono-num font-semibold text-slate-700 mb-1">
              Monthly Expense Budget Cap (₹)
            </label>
            <input
              type="number"
              required
              min="100"
              step="any"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-base font-mono-num text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
            <span className="text-[11px] font-mono-num text-slate-500 mt-1 block">
              Used in dynamic Safe-To-Spend math calculation.
            </span>
          </div>

          {/* Monthly Expected Income */}
          <div>
            <label className="block text-xs font-mono-num font-semibold text-slate-700 mb-1">
              Expected Monthly Income (₹)
            </label>
            <input
              type="number"
              required
              min="100"
              step="any"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-base font-mono-num text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Target Monthly Savings Goal */}
          <div>
            <label className="block text-xs font-mono-num font-semibold text-slate-700 mb-1">
              Default Scenario Savings Goal (₹/mo)
            </label>
            <input
              type="number"
              required
              min="10"
              step="any"
              value={monthlySavingsGoal}
              onChange={(e) => setMonthlySavingsGoal(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-base font-mono-num text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all"
          >
            Save Settings
          </button>
        </form>

        <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
          <span className="text-xs font-mono-num text-slate-500 font-semibold">
            Local-First Data
          </span>
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  'Reset all transactions and buckets to initial sample data?'
                )
              ) {
                onResetData();
                onClose();
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-mono-num font-bold transition-colors border border-rose-200"
          >
            Reset Sample Data
          </button>
        </div>
      </div>
    </div>
  );
};
