import React, { useState } from 'react';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/format';

interface HistoryViewProps {
  transactions: Transaction[];
  privacyMode: boolean;
  onOpenAddModal: () => void;
  onDeleteTransaction: (id: string) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  Food: 'restaurant',
  Income: 'payments',
  Transport: 'directions_car',
  Health: 'health_and_safety',
  Utilities: 'bolt',
  Entertainment: 'movie',
  Shopping: 'shopping_bag',
  Housing: 'home',
  Vacation: 'flight_takeoff',
  Subscriptions: 'subscriptions',
  General: 'receipt',
};

export const HistoryView: React.FC<HistoryViewProps> = ({
  transactions,
  privacyMode,
  onOpenAddModal,
  onDeleteTransaction,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<'all' | 'expense' | 'income'>('all');

  // Filter transactions
  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || tx.category === selectedCategory;

    const matchesType = selectedType === 'all' || tx.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netCashflow = totalIncome - totalExpense;

  const categoriesList = [
    'All',
    ...Array.from(new Set(transactions.map((t) => t.category))),
  ];

  return (
    <div id="history-view" className="flex flex-col gap-5 pb-24 animate-fadeIn">
      {/* Metrics Banner */}
      <div className="grid grid-cols-3 gap-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
        <div>
          <div className="text-[11px] font-mono-num font-semibold text-slate-400 uppercase tracking-wider">Total Income</div>
          <div className="text-base font-extrabold font-mono-num text-emerald-600 mt-0.5">
            +{formatCurrency(totalIncome, privacyMode)}
          </div>
        </div>

        <div className="border-x border-slate-100 px-2">
          <div className="text-[11px] font-mono-num font-semibold text-slate-400 uppercase tracking-wider">Total Spent</div>
          <div className="text-base font-extrabold font-mono-num text-rose-600 mt-0.5">
            -{formatCurrency(totalExpense, privacyMode)}
          </div>
        </div>

        <div>
          <div className="text-[11px] font-mono-num font-semibold text-slate-400 uppercase tracking-wider">Net Cashflow</div>
          <div
            className={`text-base font-extrabold font-mono-num mt-0.5 ${
              netCashflow >= 0 ? 'text-indigo-600' : 'text-rose-600'
            }`}
          >
            {formatCurrency(netCashflow, privacyMode)}
          </div>
        </div>
      </div>

      {/* Header & Controls */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">Transaction Log</h2>
          <button
            onClick={onOpenAddModal}
            className="px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Log
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by description or category..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-mono-num text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 shadow-xs"
          />
        </div>

        {/* Category & Type Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {(['all', 'expense', 'income'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1 rounded-full text-xs font-mono-num capitalize whitespace-nowrap transition-colors border ${
                selectedType === t
                  ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900 font-medium'
              }`}
            >
              {t}
            </button>
          ))}

          <div className="w-px h-5 bg-slate-200 my-auto" />

          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-mono-num whitespace-nowrap transition-colors border ${
                selectedCategory === cat
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-bold'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900 font-medium'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl text-slate-500 text-sm font-medium">
            No transactions found matching criteria.
          </div>
        ) : (
          filtered.map((tx) => {
            const iconName = CATEGORY_ICONS[tx.category] || 'receipt';
            const isIncome = tx.type === 'income';

            return (
              <div
                key={tx.id}
                className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between transition-colors shadow-xs group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                      isIncome
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                        : 'bg-slate-100 border-slate-200 text-indigo-600'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {iconName}
                    </span>
                  </div>

                  <div>
                    <div className="font-bold text-sm text-slate-900">
                      {tx.name}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-mono-num text-slate-500 mt-0.5 font-medium">
                      <span>{tx.category}</span>
                      <span>•</span>
                      <span>{tx.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono-num font-bold text-sm ${
                      isIncome ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {isIncome ? '+' : '-'}
                    {formatCurrency(tx.amount, privacyMode)}
                  </span>

                  <button
                    onClick={() => onDeleteTransaction(tx.id)}
                    title="Delete transaction"
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-rose-50 text-rose-600 transition-all"
                  >
                    <span className="material-symbols-outlined text-base">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
