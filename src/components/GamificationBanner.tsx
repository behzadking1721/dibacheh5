import React from 'react';
import { UserStats } from '../types';
import { Flame, Target, Trophy, Award, Zap } from 'lucide-react';

interface GamificationBannerProps {
  stats: UserStats;
  onOpenChallenges: () => void;
  isDarkMode: boolean;
}

export const GamificationBanner: React.FC<GamificationBannerProps> = ({
  stats,
  onOpenChallenges,
  isDarkMode,
}) => {
  const goalPercent = Math.min(100, Math.round((stats.todayMinutesRead / stats.dailyGoalMinutes) * 100));

  return (
    <div className="px-3 sm:px-4 mb-3">
      <div
        className={`rounded-2xl p-3 border shadow-xs transition-all flex flex-col sm:flex-row items-center justify-between gap-3 ${
          isDarkMode
            ? 'bg-neutral-800/80 border-neutral-700/80 text-white'
            : 'bg-white border-neutral-200/80 text-neutral-800'
        }`}
      >
        {/* Streak & Level */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          {/* Flame streak */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-xs">
              <Flame className="w-5 h-5 fill-orange-500 text-orange-500 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-black">{stats.streakDays} روز</span>
                <span className="text-xs text-neutral-400">زنجیره مطالعه</span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                عادت مطالعه فعال 🔥
              </p>
            </div>
          </div>

          <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-700 hidden sm:block" />

          {/* Level & XP */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 fill-blue-500" />
            <span>سطح {stats.level}</span>
            <span className="text-[10px] opacity-70">({stats.xpPoints} XP)</span>
          </div>
        </div>

        {/* Daily Goal & Progress */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex-1 sm:w-44">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400 font-medium">
                <Target className="w-3.5 h-3.5 text-blue-500" />
                <span>هدف روزانه:</span>
              </span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {stats.todayMinutesRead} از {stats.dailyGoalMinutes} دقیقه
              </span>
            </div>
            <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${goalPercent}%` }}
              />
            </div>
          </div>

          {/* Challenge CTA */}
          <button
            onClick={onOpenChallenges}
            className="shrink-0 p-2 rounded-xl bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors text-amber-600 dark:text-amber-400 flex items-center gap-1 text-xs font-semibold"
            title="چالش ماهانه و نشان‌ها"
          >
            <Trophy className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span className="hidden sm:inline">چالش ماهانه</span>
          </button>
        </div>
      </div>
    </div>
  );
};
