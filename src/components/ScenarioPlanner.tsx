import React, { useState } from 'react';
import { formatCurrency } from '../utils/format';

interface ScenarioPlannerProps {
  initialMonthlyGoal: number;
  privacyMode: boolean;
  onUpdateGoal?: (newGoal: number) => void;
}

export const ScenarioPlanner: React.FC<ScenarioPlannerProps> = ({
  initialMonthlyGoal,
  privacyMode,
  onUpdateGoal,
}) => {
  const [monthlyGoal, setMonthlyGoal] = useState<number>(initialMonthlyGoal || 15000);
  const [horizonYears, setHorizonYears] = useState<1 | 3 | 5>(1);
  const [includeYield, setIncludeYield] = useState<boolean>(true);

  // Math logic:
  // Simple savings = monthlyGoal * 12 * years
  // Compound yield @ 5% annual = Monthly investment formula: P * (((1 + r)^n - 1) / r)
  const annualInterestRate = 0.05;
  const monthlyRate = annualInterestRate / 12;
  const totalMonths = horizonYears * 12;

  let projectedWealth = 0;
  if (includeYield) {
    projectedWealth =
      monthlyGoal *
      (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
        (1 + monthlyRate));
  } else {
    projectedWealth = monthlyGoal * totalMonths;
  }

  const handleChangeGoal = (val: number) => {
    setMonthlyGoal(val);
    if (onUpdateGoal) onUpdateGoal(val);
  };

  return (
    <div
      id="scenario-planner-card"
      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600 text-xl">
              trending_up
            </span>
            <h3 className="font-bold text-slate-900 text-base">
              Scenario Planner
            </h3>
          </div>
          {/* Horizon Pills */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-[11px] font-mono-num font-bold">
            {([1, 3, 5] as (1 | 3 | 5)[]).map((y) => (
              <button
                key={y}
                onClick={() => setHorizonYears(y)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  horizonYears === y
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {y}Y
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-5">
          Adjust monthly goal to project your future wealth growth.
        </p>

        {/* Value Display */}
        <div className="flex justify-between items-end mb-2">
          <span className="font-mono-num text-xs text-slate-500 font-semibold">Monthly Goal</span>
          <span className="font-mono-num font-extrabold text-2xl text-indigo-600">
            {formatCurrency(monthlyGoal, privacyMode)}
          </span>
        </div>

        {/* Custom Slider */}
        <div className="relative w-full py-2">
          <input
            type="range"
            min={1000}
            max={50000}
            step={500}
            value={monthlyGoal}
            onChange={(e) => handleChangeGoal(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-700"
          />
          <div className="flex justify-between text-[10px] font-mono-num text-slate-400 font-medium mt-1">
            <span>₹1k/mo</span>
            <span>₹25k/mo</span>
            <span>₹50k/mo</span>
          </div>
        </div>
      </div>

      {/* Outcome Projection Banner */}
      <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <span className="material-symbols-outlined text-xl">rocket_launch</span>
          </div>
          <div>
            <div className="font-mono-num text-[11px] text-slate-500 font-semibold flex items-center gap-1">
              <span>Projected {horizonYears}Y Wealth</span>
              {includeYield && (
                <span className="text-[9px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 rounded font-bold">
                  +5% APY
                </span>
              )}
            </div>
            <div className="font-mono-num font-extrabold text-lg text-slate-900 mt-0.5">
              +{formatCurrency(projectedWealth, privacyMode)}
            </div>
          </div>
        </div>

        {/* Yield Toggle Checkbox */}
        <button
          onClick={() => setIncludeYield(!includeYield)}
          title="Toggle 5% annual compound yield estimation"
          className={`px-2.5 py-1 rounded text-[10px] font-mono-num font-bold border transition-colors ${
            includeYield
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-slate-200 text-slate-600 border-slate-300'
          }`}
        >
          {includeYield ? '5% Yield ON' : 'Flat'}
        </button>
      </div>
    </div>
  );
};
