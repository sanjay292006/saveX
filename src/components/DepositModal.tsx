import React, { useState } from 'react';
import { SavingsBucket } from '../types';
import { formatCurrency } from '../utils/format';

interface DepositModalProps {
  bucket: SavingsBucket | null;
  privacyMode: boolean;
  onClose: () => void;
  onUpdateBucketAmount: (
    bucketId: string,
    deltaAmount: number,
    isDeposit: boolean
  ) => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  bucket,
  privacyMode,
  onClose,
  onUpdateBucketAmount,
}) => {
  const [amountStr, setAmountStr] = useState('');
  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit');

  if (!bucket) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amountStr);
    if (isNaN(val) || val <= 0) return;

    onUpdateBucketAmount(bucket.id, val, mode === 'deposit');
    setAmountStr('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 shadow-xl flex flex-col gap-5 relative">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-2xl">
              account_balance_wallet
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Manage {bucket.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors border border-slate-200"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Current Balance Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex justify-between items-center">
          <div>
            <div className="text-xs font-mono-num font-semibold text-slate-500">
              Current Balance
            </div>
            <div className="text-xl font-extrabold font-mono-num text-slate-900">
              {formatCurrency(bucket.currentAmount, privacyMode)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono-num font-semibold text-slate-500">Goal Target</div>
            <div className="text-sm font-bold font-mono-num text-indigo-600">
              {formatCurrency(bucket.targetAmount, privacyMode)}
            </div>
          </div>
        </div>

        {/* Action Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setMode('deposit')}
            className={`flex-1 py-2 rounded-lg text-xs font-mono-num font-bold transition-all ${
              mode === 'deposit'
                ? 'bg-white text-emerald-700 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            + Deposit Funds
          </button>
          <button
            type="button"
            onClick={() => setMode('withdraw')}
            className={`flex-1 py-2 rounded-lg text-xs font-mono-num font-bold transition-all ${
              mode === 'withdraw'
                ? 'bg-white text-rose-700 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            - Withdraw
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-mono-num font-semibold text-slate-700 mb-1">
              Amount (₹)
            </label>
            <input
              type="number"
              required
              min="1"
              step="any"
              placeholder="1000"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-base font-mono-num text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-xl text-white font-bold text-sm shadow-sm transition-all active:scale-98 ${
              mode === 'deposit'
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            Confirm {mode === 'deposit' ? 'Deposit' : 'Withdrawal'}
          </button>
        </form>
      </div>
    </div>
  );
};
