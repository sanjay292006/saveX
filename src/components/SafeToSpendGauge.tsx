import React from 'react';
import { TimeHorizon } from '../types';
import { formatCurrency, calculateSafeToSpend } from '../utils/format';

interface SafeToSpendGaugeProps {
  timeHorizon: TimeHorizon;
  onChangeHorizon: (horizon: TimeHorizon) => void;
  monthlyBudget: number;
  monthlyIncome?: number;
  monthlySavingsGoal?: number;
  totalSpentThisMonth: number;
  privacyMode: boolean;
  onOpenSettings: () => void;
}

export const SafeToSpendGauge: React.FC<SafeToSpendGaugeProps> = ({
  timeHorizon,
  onChangeHorizon,
  monthlyBudget,
  monthlyIncome = 0,
  monthlySavingsGoal = 0,
  totalSpentThisMonth,
  privacyMode,
  onOpenSettings,
}) => {
  const {
    safeToSpendAmount,
    dailyLimit,
    gaugePercentage,
    daysRemaining,
    effectiveBudget,
    isOverBudget,
    overBudgetAmount,
  } = calculateSafeToSpend(
    monthlyBudget,
    totalSpentThisMonth,
    timeHorizon,
    monthlyIncome,
    monthlySavingsGoal
  );

  // Gauge circumference for R=80 semi-circle arc is PI * 80 ≈ 251.3
  const strokeDasharray = 251.2;
  // offset goes from 251.2 (0%) to 0 (100%)
  const strokeDashoffset = strokeDasharray * (1 - gaugePercentage / 100);

  return (
    <div
      id="safe-to-spend-card"
      className="flex flex-col items-center bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-6 relative overflow-hidden transition-all"
    >
      {/* Top subtle border line */}
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${
          isOverBudget
            ? 'from-rose-500 via-amber-500 to-rose-500'
            : 'from-indigo-500 via-emerald-500 to-indigo-500'
        }`}
      />

      {/* Header Row: Money Goal Badge + Settings Link */}
      <div className="w-full flex justify-between items-center gap-1.5 mb-3">
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1 px-2.5 sm:px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 text-[10px] xs:text-[11px] sm:text-xs font-bold hover:bg-indigo-100 transition-colors shrink min-w-0 truncate"
        >
          <span className="shrink-0">🎯</span>
          <span className="truncate">
            <span className="hidden xs:inline">Money </span>Goal:{' '}
            {formatCurrency(monthlySavingsGoal, privacyMode)}/mo
          </span>
          <span className="material-symbols-outlined text-xs shrink-0 ml-0.5">edit</span>
        </button>

        <span className="text-[10px] xs:text-[11px] font-mono-num font-semibold text-slate-500 whitespace-nowrap shrink-0">
          Eff. Budget: {formatCurrency(effectiveBudget, privacyMode)}
        </span>
      </div>

      {/* Over Budget Notice Banner if expenses exceed effective budget */}
      {isOverBudget && (
        <div className="w-full bg-rose-50 border border-rose-200 text-rose-800 text-[11px] sm:text-xs font-medium rounded-xl p-2.5 mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 shrink min-w-0">
            <span className="material-symbols-outlined text-rose-600 text-base shrink-0">
              warning
            </span>
            <span className="truncate">
              Spent {formatCurrency(totalSpentThisMonth, privacyMode)} &gt; Eff. Budget{' '}
              {formatCurrency(effectiveBudget, privacyMode)}
            </span>
          </div>
          <button
            onClick={onOpenSettings}
            className="text-indigo-700 underline font-bold shrink-0 text-[10px] sm:text-xs hover:text-indigo-900"
          >
            Adjust Budget
          </button>
        </div>
      )}

      {/* Pill Toggle for Weekly / Monthly / Yearly */}
      <div className="flex bg-slate-100 rounded-full p-1 w-full max-w-[280px] mb-3 shadow-inner border border-slate-200">
        {(['weekly', 'monthly', 'yearly'] as TimeHorizon[]).map((horizon) => {
          const isActive = timeHorizon === horizon;
          return (
            <button
              key={horizon}
              id={`horizon-btn-${horizon}`}
              onClick={() => onChangeHorizon(horizon)}
              className={`flex-1 py-1.5 rounded-full text-center font-mono-num text-xs font-bold capitalize transition-all duration-200 ${
                isActive
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {horizon}
            </button>
          );
        })}
      </div>

      {/* Gauge Chart */}
      <div className="relative w-full max-w-[280px] aspect-[2/1] flex flex-col items-center justify-end my-2">
        <svg
          className="absolute inset-0 w-full h-full overflow-visible"
          viewBox="0 0 200 110"
        >
          {/* Background Arc Track */}
          <path
            className="text-slate-200"
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Active Arc Track */}
          <path
            className={`${
              isOverBudget ? 'text-rose-500' : 'text-emerald-500'
            } transition-all duration-1000 ease-out`}
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        {/* Center Display Value */}
        <div className="flex flex-col items-center mb-[-4px] z-10 text-center max-w-full px-2">
          <span
            className={`font-extrabold text-2xl xs:text-3xl sm:text-4xl tracking-tight font-mono-num max-w-full truncate ${
              isOverBudget ? 'text-rose-600' : 'text-slate-900'
            }`}
          >
            {formatCurrency(safeToSpendAmount, privacyMode)}
          </span>
          {isOverBudget ? (
            <span className="font-mono-num text-[10px] xs:text-xs font-bold text-rose-600 uppercase tracking-widest mt-0.5 flex items-center gap-1 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
              Over Budget (+{formatCurrency(overBudgetAmount, privacyMode)})
            </span>
          ) : (
            <span className="font-mono-num text-[10px] xs:text-xs font-bold text-emerald-600 uppercase tracking-widest mt-0.5 flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Safe To Spend ({timeHorizon})
            </span>
          )}
        </div>
      </div>

      {/* Quick Stats Banner */}
      <div className="w-full mt-5 pt-3.5 border-t border-slate-100 grid grid-cols-4 gap-0.5 text-center">
        <div className="flex flex-col items-center justify-center">
          <span className="text-slate-400 font-mono-num text-[8.5px] xs:text-[9.5px] sm:text-[10px] uppercase tracking-wider font-semibold whitespace-nowrap">Daily Limit</span>
          <span className="font-mono-num font-bold text-[11px] xs:text-xs sm:text-sm text-slate-800 mt-0.5 whitespace-nowrap">
            {formatCurrency(dailyLimit, privacyMode)}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center border-l border-slate-100 px-0.5">
          <span className="text-slate-400 font-mono-num text-[8.5px] xs:text-[9.5px] sm:text-[10px] uppercase tracking-wider font-semibold whitespace-nowrap">Goal Target</span>
          <span className="font-mono-num font-bold text-[11px] xs:text-xs sm:text-sm text-indigo-600 mt-0.5 whitespace-nowrap">
            {formatCurrency(monthlySavingsGoal, privacyMode)}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center border-l border-slate-100 px-0.5">
          <span className="text-slate-400 font-mono-num text-[8.5px] xs:text-[9.5px] sm:text-[10px] uppercase tracking-wider font-semibold whitespace-nowrap">Days Left</span>
          <span className="font-mono-num font-bold text-[11px] xs:text-xs sm:text-sm text-slate-800 mt-0.5 whitespace-nowrap">
            {daysRemaining} D
          </span>
        </div>

        <div className="flex flex-col items-center justify-center border-l border-slate-100 px-0.5 cursor-pointer group" onClick={onOpenSettings}>
          <span className="text-slate-400 font-mono-num text-[8.5px] xs:text-[9.5px] sm:text-[10px] uppercase tracking-wider font-semibold group-hover:text-indigo-600 whitespace-nowrap">
            Budget Cap
          </span>
          <span className="font-mono-num font-bold text-[11px] xs:text-xs sm:text-sm text-slate-800 mt-0.5 group-hover:text-indigo-600 flex items-center justify-center gap-0.5 whitespace-nowrap">
            {formatCurrency(monthlyBudget, privacyMode)}
          </span>
        </div>
      </div>
    </div>
  );
};
