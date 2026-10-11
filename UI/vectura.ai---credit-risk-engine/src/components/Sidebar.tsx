import React from 'react';

interface SidebarProps {
  activeScreen: 'intake' | 'analytics';
  onNavigate: (screen: 'intake' | 'analytics') => void;
  onOpenDocs: () => void;
  onOpenSimulator: () => void;
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeScreen,
  onNavigate,
  onOpenDocs,
  onOpenSimulator,
  mobileMenuOpen,
  onCloseMobileMenu,
}) => {
  const content = (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px]">account_tree</span>
            <span className="font-display text-[12px] font-bold tracking-wider uppercase text-slate-800 dark:text-slate-100">
              Underwriting Flow
            </span>
          </div>
          <span className="material-symbols-outlined text-slate-400 text-[18px]">unfold_less</span>
        </div>

        {/* Pipeline Nav */}
        <nav className="p-3 space-y-1">
          <div className="px-3 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Underwriting Pipeline
          </div>

          <button
            onClick={() => {
              onNavigate('intake');
              onCloseMobileMenu();
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors text-left ${
              activeScreen === 'intake'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">person_outline</span>
            <span>Intake &amp; Risk Inputs</span>
          </button>

          <button
            onClick={() => {
              onNavigate('analytics');
              onCloseMobileMenu();
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors text-left ${
              activeScreen === 'analytics'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">insights</span>
            <span>Analytics &amp; Output</span>
          </button>

          <div className="pt-3 pb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Analytical Sandbox
          </div>

          <button
            onClick={() => {
              onOpenSimulator();
              onCloseMobileMenu();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 text-[13px] font-medium transition-colors text-left"
          >
            <span className="material-symbols-outlined text-[18px] text-purple-500">science</span>
            <span>What-If Simulator</span>
          </button>

          <button
            onClick={() => {
              onOpenDocs();
              onCloseMobileMenu();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 text-[13px] font-medium transition-colors text-left"
          >
            <span className="material-symbols-outlined text-[18px] text-emerald-500">auto_stories</span>
            <span>Model Documentation</span>
          </button>
        </nav>
      </div>

      {/* Bottom Node Meta */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Inference Node</span>
          <span className="font-mono text-[11px] font-medium text-slate-800 dark:text-slate-200">
            us-east-quants-09
          </span>
        </div>
        <div className="flex items-center gap-1.5" title="Node Online: Latency < 42ms">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">99.98%</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40 flex-col justify-between transition-colors">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobileMenu}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 pt-16 z-10 shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
