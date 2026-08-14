import React, { useState } from 'react';
import { SavingsBucket } from '../types';

interface AddBucketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBucket: (bucket: Omit<SavingsBucket, 'id'>) => void;
}

const ICONS = [
  'beach_access',
  'health_and_safety',
  'laptop_mac',
  'directions_car',
  'home',
  'flight_takeoff',
  'payments',
  'school',
  'celebration',
  'shopping_bag',
];

export const AddBucketModal: React.FC<AddBucketModalProps> = ({
  isOpen,
  onClose,
  onAddBucket,
}) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('beach_access');
  const [selectedColor, setSelectedColor] = useState<'primary' | 'secondary' | 'tertiary'>(
    'secondary'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !targetAmount) return;

    onAddBucket({
      name: name.trim(),
      targetAmount: Math.abs(parseFloat(targetAmount)) || 1000,
      currentAmount: Math.abs(parseFloat(currentAmount)) || 0,
      icon: selectedIcon,
      color: selectedColor,
      category: 'Savings',
    });

    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-xl flex flex-col gap-5 relative">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600 text-2xl">
              savings
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              Create Savings Bucket
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
          {/* Bucket Name */}
          <div>
            <label className="block text-xs font-mono-num font-semibold text-slate-700 mb-1">
              Bucket Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. New Car, Dream Vacation, Emergency"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Target Amount */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono-num font-semibold text-slate-700 mb-1">
                Target Goal (₹)
              </label>
              <input
                type="number"
                required
                min="1"
                step="any"
                placeholder="50000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono-num text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-num font-semibold text-slate-700 mb-1">
                Initial Saved (₹)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="0"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono-num text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-mono-num font-semibold text-slate-700 mb-2">
              Choose Icon
            </label>
            <div className="grid grid-cols-5 gap-2 max-h-28 overflow-y-auto p-1">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`p-2.5 rounded-xl flex items-center justify-center transition-colors border ${
                    selectedIcon === icon
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-500 border-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Accent Theme */}
          <div>
            <label className="block text-xs font-mono-num font-semibold text-slate-700 mb-2">
              Accent Color
            </label>
            <div className="flex gap-3">
              {[
                { id: 'secondary', label: 'Indigo', bg: 'bg-indigo-600' },
                { id: 'tertiary', label: 'Emerald', bg: 'bg-emerald-500' },
                { id: 'primary', label: 'Slate', bg: 'bg-slate-700' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() =>
                    setSelectedColor(c.id as 'primary' | 'secondary' | 'tertiary')
                  }
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-mono-num font-semibold flex items-center justify-center gap-2 transition-all ${
                    selectedColor === c.id
                      ? 'border-indigo-300 bg-indigo-50 text-indigo-900 shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${c.bg}`} />
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all"
          >
            Create Bucket
          </button>
        </form>
      </div>
    </div>
  );
};
