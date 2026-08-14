import React, { useState } from 'react';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/format';

interface ActivityHeatmapProps {
  transactions: Transaction[];
  privacyMode: boolean;
}

interface DayData {
  dateStr: string;
  dayName: string;
  totalSpent: number;
  intensity: 0 | 1 | 2 | 3 | 4;
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  transactions,
  privacyMode,
}) => {
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  // Generate 28 days (4 weeks) ending today
  const generateHeatmapGrid = (): DayData[] => {
    const grid: DayData[] = [];
    const today = new Date();
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    for (let i = 27; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = dayNames[d.getDay()];

      // Calculate total expenses for this date
      const totalSpent = transactions
        .filter((t) => t.date === dateStr && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      // Determine intensity level (0 to 4)
      let intensity: 0 | 1 | 2 | 3 | 4 = 0;
      if (totalSpent > 0 && totalSpent <= 20) intensity = 1;
      else if (totalSpent > 20 && totalSpent <= 50) intensity = 2;
      else if (totalSpent > 50 && totalSpent <= 100) intensity = 3;
      else if (totalSpent > 100) intensity = 4;

      grid.push({
        dateStr,
        dayName,
        totalSpent,
        intensity,
      });
    }

    return grid;
  };

  const gridData = generateHeatmapGrid();

  // Helper for cell color based on intensity
  const getCellBg = (intensity: number) => {
    switch (intensity) {
      case 1:
        return 'bg-emerald-100 border border-emerald-200 hover:bg-emerald-200';
      case 2:
        return 'bg-emerald-300 border border-emerald-400 hover:bg-emerald-400';
      case 3:
        return 'bg-amber-100 border border-amber-200 hover:bg-amber-200';
      case 4:
        return 'bg-rose-200 border border-rose-300 hover:bg-rose-300';
      default:
        return 'bg-slate-100 border border-slate-200/60 hover:bg-slate-200';
    }
  };

  return (
    <div
      id="activity-heatmap-card"
      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600 text-xl">
              calendar_month
            </span>
            <h3 className="font-bold text-slate-900 text-base">
              Activity Heatmap
            </h3>
          </div>
          <span className="text-xs font-mono-num text-slate-500 font-medium">Last 28 Days</span>
        </div>

        {/* Day Header Row */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center font-mono-num text-xs text-slate-400 font-bold">
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>T</div>
          <div>F</div>
          <div>S</div>
          <div>S</div>
        </div>

        {/* 28 Day Cells Grid */}
        <div className="grid grid-cols-7 gap-2">
          {gridData.map((day, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedDay(day)}
              onMouseEnter={() => setSelectedDay(day)}
              title={`${day.dateStr}: $${day.totalSpent.toFixed(2)}`}
              className={`aspect-square rounded-md transition-all duration-150 cursor-pointer ${getCellBg(
                day.intensity
              )} ${
                selectedDay?.dateStr === day.dateStr
                  ? 'ring-2 ring-indigo-600 scale-110 z-10'
                  : ''
              }`}
            />
          ))}
        </div>
      </div>

      {/* Selected Day Info OR Default Legend */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
        {selectedDay ? (
          <div className="flex justify-between items-center bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono-num">
            <span className="text-slate-500 font-semibold">{selectedDay.dateStr}</span>
            <span className="text-slate-900 font-bold">
              Spent: {formatCurrency(selectedDay.totalSpent, privacyMode)}
            </span>
          </div>
        ) : (
          <div className="flex justify-between items-center text-xs font-mono-num text-slate-500 font-semibold">
            <span>Less</span>
            <div className="flex gap-1.5 items-center">
              <div className="w-3 h-3 bg-slate-100 border border-slate-200 rounded-xs" />
              <div className="w-3 h-3 bg-emerald-100 border border-emerald-200 rounded-xs" />
              <div className="w-3 h-3 bg-emerald-300 border border-emerald-400 rounded-xs" />
              <div className="w-3 h-3 bg-amber-100 border border-amber-200 rounded-xs" />
              <div className="w-3 h-3 bg-rose-200 border border-rose-300 rounded-xs" />
            </div>
            <span>More</span>
          </div>
        )}
      </div>
    </div>
  );
};
