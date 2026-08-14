import React, { useState } from 'react';
import { Transaction } from '../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const CATEGORIES = [
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

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
}) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!name.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    onAddTransaction({
      name: name.trim(),
      amount: parsedAmount,
      type,
      category: type === 'income' ? 'Income' : category,
      date: date || new Date().toISOString().split('T')[0],
      rawInput: `${name} ${amount} ${category}`,
    });

    setName('');
    setAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-xl flex flex-col gap-5 relative">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600 text-2xl">
              receipt_long
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              Add Transaction
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors border border-slate-200"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Expense vs Income Type Switch */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 py-2 rounded-lg text-xs font-mono-num font-bold transition-all ${
              type === 'expense'
                ? 'bg-white text-rose-700 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 py-2 rounded-lg text-xs font-mono-num font-bold transition-all ${
              type === 'income'
                ? 'bg-white text-emerald-700 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Income
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-mono-num font-semibold text-slate-700 mb-1">
              Description / Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Coffee, Grocery Market, Client Invoice"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono-num font-semibold text-slate-700 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                required
                min="0.01"
                step="any"
                placeholder="250"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono-num text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-num font-semibold text-slate-700 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-mono-num text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Category Selector (Expense only) */}
          {type === 'expense' && (
            <div>
              <label className="block text-xs font-mono-num font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono-num text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                {CATEGORIES.filter((c) => c !== 'Income').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all"
          >
            Save Transaction
          </button>
        </form>
      </div>
    </div>
  );
};
