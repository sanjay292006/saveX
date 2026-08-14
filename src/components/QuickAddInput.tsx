import React, { useState } from 'react';
import { parseQuickAddText } from '../utils/format';
import { Transaction } from '../types';

interface QuickAddInputProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onOpenManualModal: () => void;
}

export const QuickAddInput: React.FC<QuickAddInputProps> = ({
  onAddTransaction,
  onOpenManualModal,
}) => {
  const [inputText, setInputText] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const parsed = parseQuickAddText(inputText);

    onAddTransaction({
      name: parsed.name,
      amount: parsed.amount,
      category: parsed.category,
      type: parsed.type,
      date: new Date().toISOString().split('T')[0],
      rawInput: inputText,
    });

    setFeedback(
      `Added ${parsed.type === 'income' ? '+' : '-'}₹${parsed.amount} (${parsed.category}) - ${parsed.name}`
    );

    setInputText('');

    setTimeout(() => {
      setFeedback(null);
    }, 3500);
  };

  return (
    <div id="quick-add-container" className="flex flex-col gap-2 w-full">
      {/* Quick Add Bar */}
      <div className="relative w-full group">
        <form
          onSubmit={handleAdd}
          className="relative flex items-center bg-white border border-slate-200 rounded-full p-2 pl-4 shadow-sm transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20"
        >
          <span className="material-symbols-outlined text-slate-400 mr-2 text-xl select-none">
            edit_note
          </span>
          <input
            id="quick-add-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Quick Add: e.g. Coffee 250 Food"
            className="flex-1 bg-transparent border-none focus:outline-none font-sans text-xs sm:text-base text-slate-900 placeholder:text-slate-400"
          />

          <div className="flex items-center gap-1.5 ml-2">
            <button
              type="button"
              onClick={onOpenManualModal}
              title="Open Full Add Modal"
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors hidden sm:block font-mono-num font-semibold border border-slate-200"
            >
              Manual Form
            </button>
            <button
              id="quick-add-submit-btn"
              type="submit"
              disabled={!inputText.trim()}
              title="Add Transaction"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm disabled:opacity-40 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">add</span>
            </button>
          </div>
        </form>
      </div>

      {/* Instant Feedback Chip */}
      {feedback && (
        <div className="self-start px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono-num font-medium rounded-full flex items-center gap-1.5 animate-fadeIn">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          {feedback}
        </div>
      )}

      {/* Helpful Parsing Hints */}
      <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono-num text-slate-500 px-3 gap-2">
        <span className="truncate">Try: &quot;Dinner 850 Food&quot;, &quot;Auto 150&quot;</span>
        <button
          onClick={onOpenManualModal}
          className="text-indigo-600 hover:underline sm:hidden font-semibold whitespace-nowrap shrink-0 text-[10px]"
        >
          Detailed Form
        </button>
      </div>
    </div>
  );
};
