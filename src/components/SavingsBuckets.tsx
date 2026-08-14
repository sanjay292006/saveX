import React from 'react';
import { SavingsBucket } from '../types';
import { formatCurrency } from '../utils/format';

interface SavingsBucketsProps {
  buckets: SavingsBucket[];
  privacyMode: boolean;
  onOpenDepositModal: (bucket: SavingsBucket) => void;
  onOpenAddBucketModal: () => void;
  onViewAllBuckets?: () => void;
}

export const SavingsBuckets: React.FC<SavingsBucketsProps> = ({
  buckets,
  privacyMode,
  onOpenDepositModal,
  onOpenAddBucketModal,
  onViewAllBuckets,
}) => {
  return (
    <div id="savings-buckets-section" className="flex flex-col gap-3 mt-2">
      {/* Section Header */}
      <div className="flex justify-between items-center px-1 gap-2">
        <div className="flex items-center gap-1.5 shrink min-w-0">
          <span className="material-symbols-outlined text-indigo-600 text-lg sm:text-xl shrink-0">savings</span>
          <h2 className="font-bold text-base sm:text-lg text-slate-900 truncate">Savings Buckets</h2>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {onViewAllBuckets && (
            <button
              onClick={onViewAllBuckets}
              className="text-[11px] sm:text-xs font-mono-num font-semibold text-indigo-600 hover:underline shrink-0 whitespace-nowrap"
            >
              Manage All ({buckets.length})
            </button>
          )}
          <button
            id="add-bucket-header-btn"
            onClick={onOpenAddBucketModal}
            className="px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-mono-num font-bold rounded-full bg-slate-100 hover:bg-slate-200 text-indigo-600 border border-slate-200 transition-colors flex items-center gap-0.5 sm:gap-1 shadow-xs shrink-0 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-sm">add</span> New
          </button>
        </div>
      </div>

      {/* Horizontal Snap Scroll Cards */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 snap-x scrollbar-thin">
        {buckets.map((bucket) => {
          const progressPercent = Math.min(
            100,
            Math.round((bucket.currentAmount / (bucket.targetAmount || 1)) * 100)
          );

          // Determine color scheme
          const colorClass =
            bucket.color === 'tertiary'
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
              : bucket.color === 'secondary'
              ? 'text-indigo-700 bg-indigo-50 border-indigo-200'
              : 'text-indigo-700 bg-indigo-50 border-indigo-200';

          const progressBarColor =
            bucket.color === 'tertiary'
              ? 'bg-emerald-500'
              : bucket.color === 'secondary'
              ? 'bg-indigo-600'
              : 'bg-indigo-600';

          return (
            <div
              key={bucket.id}
              id={`bucket-card-${bucket.id}`}
              className="min-w-[270px] max-w-[300px] bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden snap-start group hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Background Icon Watermark */}
              <div className="absolute top-0 right-0 p-4 opacity-5 text-slate-900 group-hover:scale-110 transition-transform select-none">
                <span className="material-symbols-outlined text-[68px]">
                  {bucket.icon || 'savings'}
                </span>
              </div>

              <div>
                {/* Header: Name & % Tag */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-lg ${colorClass.split(' ')[0]}`}>
                      {bucket.icon || 'savings'}
                    </span>
                    <span className="font-bold text-base text-slate-900">
                      {bucket.name}
                    </span>
                  </div>
                  <span
                    className={`font-mono-num text-xs font-bold px-2.5 py-1 rounded-full border ${colorClass}`}
                  >
                    {progressPercent}%
                  </span>
                </div>

                {/* Amount Display */}
                <div className="font-bold text-2xl text-slate-900 mb-4 font-mono-num">
                  {formatCurrency(bucket.currentAmount, privacyMode)}
                  <span className="text-xs font-normal text-slate-500 ml-1.5">
                    / {formatCurrency(bucket.targetAmount, privacyMode)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative mb-4 border border-slate-200/50">
                  <div
                    className={`h-full ${progressBarColor} rounded-full transition-all duration-700`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Action Button: Deposit / Manage */}
              <button
                onClick={() => onOpenDepositModal(bucket)}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-mono-num font-bold text-slate-700 transition-colors flex items-center justify-center gap-1.5 border border-slate-200 active:scale-98"
              >
                <span className="material-symbols-outlined text-sm text-emerald-600">
                  add_circle
                </span>
                Manage Funds
              </button>
            </div>
          );
        })}

        {/* Add Bucket Card Placeholder */}
        <div
          onClick={onOpenAddBucketModal}
          className="min-w-[200px] bg-slate-50 border-2 border-dashed border-slate-200 hover:border-indigo-400 p-5 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group snap-start"
        >
          <div className="w-12 h-12 rounded-full bg-slate-200 group-hover:bg-indigo-100 text-slate-600 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-2xl">add</span>
          </div>
          <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600">
            Create Bucket
          </span>
          <span className="text-[11px] font-mono-num text-slate-500">
            Set target goal
          </span>
        </div>
      </div>
    </div>
  );
};
