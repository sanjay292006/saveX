import React from 'react';
import { SavingsBucket } from '../types';
import { formatCurrency } from '../utils/format';

interface BucketsViewProps {
  buckets: SavingsBucket[];
  privacyMode: boolean;
  onOpenDepositModal: (bucket: SavingsBucket) => void;
  onOpenAddBucketModal: () => void;
  onDeleteBucket: (id: string) => void;
}

export const BucketsView: React.FC<BucketsViewProps> = ({
  buckets,
  privacyMode,
  onOpenDepositModal,
  onOpenAddBucketModal,
  onDeleteBucket,
}) => {
  const totalSaved = buckets.reduce((sum, b) => sum + b.currentAmount, 0);
  const totalTargets = buckets.reduce((sum, b) => sum + b.targetAmount, 0);
  const overallProgress = Math.min(
    100,
    Math.round((totalSaved / (totalTargets || 1)) * 100)
  );

  return (
    <div id="buckets-view" className="flex flex-col gap-5 pb-24 animate-fadeIn">
      {/* Overview Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-xs font-mono-num font-semibold text-slate-400 uppercase tracking-wider">
              Total Savings Vault
            </span>
            <div className="font-extrabold text-3xl text-slate-900 font-mono-num mt-1">
              {formatCurrency(totalSaved, privacyMode)}
            </div>
          </div>
          <button
            onClick={onOpenAddBucketModal}
            className="px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-base">add</span>
            New Bucket
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-mono-num text-slate-500 font-semibold">
            <span>Overall Goal Progress ({overallProgress}%)</span>
            <span>Target: {formatCurrency(totalTargets, privacyMode)}</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-700"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bucket Grid */}
      {buckets.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <span className="material-symbols-outlined text-3xl">savings</span>
          </div>
          <h3 className="font-bold text-slate-800 text-base">No Savings Buckets Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm">
            Create your custom savings buckets (e.g. Vacation, Emergency Fund, Gadget) to track your goal progress.
          </p>
          <button
            onClick={onOpenAddBucketModal}
            className="mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-mono-num font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Create Your First Bucket
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {buckets.map((bucket) => {
          const progressPercent = Math.min(
            100,
            Math.round((bucket.currentAmount / (bucket.targetAmount || 1)) * 100)
          );

          return (
            <div
              key={bucket.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between relative group hover:border-slate-300 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                    <span className="material-symbols-outlined text-xl">
                      {bucket.icon || 'savings'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      {bucket.name}
                    </h3>
                    <span className="text-[11px] font-mono-num text-slate-400 font-semibold">
                      {bucket.category || 'Goal'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className="font-mono-num text-xs font-bold text-indigo-700 px-2 py-0.5 bg-indigo-50 rounded-full border border-indigo-200">
                    {progressPercent}%
                  </span>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete savings bucket "${bucket.name}"?`)) {
                        onDeleteBucket(bucket.id);
                      }
                    }}
                    title="Delete bucket"
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-600 text-slate-400 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>

              {/* Saved vs Goal */}
              <div className="font-mono-num font-extrabold text-2xl text-slate-900 mb-3">
                {formatCurrency(bucket.currentAmount, privacyMode)}
                <span className="text-xs font-normal text-slate-400 ml-2">
                  / {formatCurrency(bucket.targetAmount, privacyMode)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4 border border-slate-200/50">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => onOpenDepositModal(bucket)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-mono-num font-bold text-slate-700 transition-colors border border-slate-200 active:scale-98 flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm text-emerald-600">
                    add_circle
                  </span>
                  Deposit / Withdraw
                </button>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
};
