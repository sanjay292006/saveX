import React from 'react';

export type NavTab = 'overview' | 'history' | 'buckets' | 'insights';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs: { id: NavTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'history', label: 'History', icon: 'receipt_long' },
    { id: 'buckets', label: 'Buckets', icon: 'savings' },
    { id: 'insights', label: 'Insights', icon: 'analytics' },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 pb-safe shadow-xl"
    >
      <div className="max-w-[1280px] mx-auto h-16 sm:h-20 flex justify-around items-center px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 w-16 py-1.5 transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-indigo-600 scale-105 font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <span
                className={`material-symbols-outlined text-2xl transition-transform ${
                  isActive ? 'scale-110 text-indigo-600' : ''
                }`}
              >
                {tab.icon}
              </span>
              <span className="font-mono-num text-[11px] tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
