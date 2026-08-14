import React, { useState } from 'react';
import { Transaction, BudgetConfig } from '../types';
import { formatCurrency } from '../utils/format';
import { ScenarioPlanner } from './ScenarioPlanner';

interface InsightsViewProps {
  transactions: Transaction[];
  budget: BudgetConfig;
  privacyMode: boolean;
  onUpdateBudget: (budget: BudgetConfig) => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  transactions,
  budget,
  privacyMode,
  onUpdateBudget,
}) => {
  const [activeTab, setActiveTab] = useState<'breakdown' | 'simulator'>('breakdown');

  // Category totals
  const expenses = transactions.filter((t) => t.type === 'expense');
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0) || 1;

  const categoryMap: Record<string, number> = {};
  expenses.forEach((t) => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
  });

  const categoryList = Object.entries(categoryMap)
    .map(([cat, amount]) => ({
      category: cat,
      amount,
      percentage: Math.round((amount / totalExpenses) * 100),
    }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <div id="insights-view" className="flex flex-col gap-5 pb-24 animate-fadeIn">
      {/* Sub-navigation Switcher */}
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveTab('breakdown')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-mono-num font-bold transition-all ${
            activeTab === 'breakdown'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Spending Distribution
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-mono-num font-bold transition-all ${
            activeTab === 'simulator'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Scenario Simulator
        </button>
      </div>

      {activeTab === 'breakdown' ? (
        <div className="flex flex-col gap-4">
          {/* Category List Breakdown */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-slate-900">
                Expenses by Category
              </h3>
              <span className="text-xs font-mono-num font-semibold text-slate-500">
                Total: {formatCurrency(totalExpenses, privacyMode)}
              </span>
            </div>

            {categoryList.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono-num text-slate-500">
                No expenses logged yet.
              </div>
            ) : (
              categoryList.map((item) => (
                <div key={item.category} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-mono-num">
                    <span className="text-slate-800 font-bold">{item.category}</span>
                    <span className="text-slate-600 font-medium">
                      {formatCurrency(item.amount, privacyMode)} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Smart Financial Insights */}
          <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2 text-indigo-700">
              <span className="material-symbols-outlined text-xl">auto_awesome</span>
              <h4 className="font-bold text-sm">saveX Insights</h4>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Based on your monthly budget of{' '}
              <strong className="font-mono-num text-slate-900 font-bold">
                {formatCurrency(budget.monthlyBudget, privacyMode)}
              </strong>
              , you are currently spending at a sustainable pace. To maximize
              your vacation and emergency bucket growth, try allocating an extra{' '}
              <strong className="font-mono-num text-indigo-700 font-bold">₹500/week</strong>.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <ScenarioPlanner
            initialMonthlyGoal={budget.monthlySavingsGoal}
            privacyMode={privacyMode}
            onUpdateGoal={(newGoal) => {
              onUpdateBudget({ ...budget, monthlySavingsGoal: newGoal });
            }}
          />
        </div>
      )}
    </div>
  );
};
