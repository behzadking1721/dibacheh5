import React from 'react';
import { Moon, Sun, Smartphone, Monitor, Lightbulb, User, Shield, BookOpen } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { TabType } from '../types';

interface HeaderProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
  onOpenSuggestions: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onChangeTab,
  isDarkMode,
  onToggleDarkMode,
  isPhoneFrame,
  onTogglePhoneFrame,
  onOpenSuggestions,
}) => {
  return (
    <header className="bg-blue-600 text-white shadow-md relative z-10 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div
            onClick={() => onChangeTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-2xl bg-white/15 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
              📚
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-black tracking-tight flex items-center gap-1.5">
                <span>خلاصه کده</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 font-bold">
                  رایگان
                </span>
              </h1>
              <p className="text-blue-100 text-[11px] sm:text-xs">
                خلاصه برترین کتاب‌های جهان در ۱۵ دقیقه
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* User Profile tab button */}
            <button
              id="header-user-profile-btn"
              onClick={() => onChangeTab(currentTab === 'profile' ? 'home' : 'profile')}
              className={`p-1.5 rounded-full transition-all flex items-center gap-1 text-xs font-bold ${
                currentTab === 'profile'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title="پروفایل کاربری و کتاب‌های آفلاین"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">پروفایل</span>
            </button>

            {/* Admin Dashboard tab button */}
            <button
              id="header-admin-dashboard-btn"
              onClick={() => onChangeTab(currentTab === 'admin' ? 'home' : 'admin')}
              className={`p-1.5 rounded-full transition-all flex items-center gap-1 text-xs font-bold ${
                currentTab === 'admin'
                  ? 'bg-amber-400 text-neutral-900 shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title="پنل مدیریت کتاب‌ها و تبلیغات"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">مدیریت</span>
            </button>

            {/* Suggestions button */}
            <button
              id="open-suggestions-button"
              onClick={onOpenSuggestions}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white"
              title="پیشنهادات توسعه بعدی"
            >
              <Lightbulb className="w-4 h-4 text-amber-300 fill-amber-300" />
            </button>

            {/* Mobile frame toggle */}
            <button
              id="toggle-phone-frame-button"
              onClick={onTogglePhoneFrame}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white hidden sm:flex"
              title={isPhoneFrame ? 'نمای تمام‌صفحه وب' : 'نمای شبیه‌ساز موبایل'}
            >
              {isPhoneFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
            </button>

            {/* Dark mode switch */}
            <button
              id="toggle-dark-mode-button"
              onClick={onToggleDarkMode}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white"
              title={isDarkMode ? 'حالت روز' : 'حالت شب'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
