import React, { useState } from 'react';
import { UserStats } from '../types';
import { Trophy, Target, Award, CheckCircle2, Flame, Sparkles, Clock, Sliders } from 'lucide-react';

interface ChallengesModalProps {
  stats: UserStats;
  isOpen: boolean;
  onClose: () => void;
  onUpdateDailyGoal: (minutes: number) => void;
  isDarkMode: boolean;
}

export const ChallengesModal: React.FC<ChallengesModalProps> = ({
  stats,
  isOpen,
  onClose,
  onUpdateDailyGoal,
  isDarkMode,
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState(stats.dailyGoalMinutes);

  if (!isOpen) return null;

  const badges = [
    {
      id: 'first_read',
      name: 'آغازگر مسیر',
      desc: 'خواندن اولین خلاصه کتاب',
      icon: '🌱',
      unlocked: true,
    },
    {
      id: 'streak_3',
      name: 'پشتکار طلایی',
      desc: '۳ روز زنجیره مطالعه متوالی',
      icon: '🔥',
      unlocked: stats.streakDays >= 3,
    },
    {
      id: 'challenge_master',
      name: 'فاتح اردیبهشت',
      desc: 'تکمیل چالش ۴ کتاب در ماه',
      icon: '🏆',
      unlocked: stats.completedBooksThisMonth >= stats.monthlyChallengeGoal,
    },
    {
      id: 'note_taker',
      name: 'پژوهشگر دقیق',
      desc: 'ثبت اولین یادداشت و هایلایت',
      icon: '✍️',
      unlocked: true,
    },
  ];

  const handleSaveGoal = () => {
    onUpdateDailyGoal(selectedMinutes);
  };

  const challengePercent = Math.min(
    100,
    Math.round((stats.completedBooksThisMonth / stats.monthlyChallengeGoal) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl shadow-2xl border overflow-hidden ${
          isDarkMode
            ? 'bg-neutral-900 border-neutral-800 text-white'
            : 'bg-white border-neutral-100 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Trophy className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-base">چالش‌های مطالعه و گیمیفیکیشن</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                تقویت عادات روزانه و دستاوردهای شما
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-500 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Monthly Challenge Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20">
                چالش ماهانه جاری
              </span>
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
                <span>+۲۵۰ XP پاداش</span>
              </span>
            </div>

            <div>
              <h4 className="text-base font-black">چالش مطالعه {stats.monthlyChallengeGoal} کتاب در ماه</h4>
              <p className="text-xs text-blue-100 mt-1">
                شما تاکنون {stats.completedBooksThisMonth} کتاب از این چالش را با موفقیت تمام کرده‌اید!
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-blue-100">
                <span>پیشرفت چالش:</span>
                <span>{challengePercent}٪</span>
              </div>
              <div className="h-2.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${challengePercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Daily Goal Settings */}
          <div className="p-4 rounded-2xl border border-neutral-200/60 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold">هدف‌گذاری مطالعه روزانه</h4>
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                {selectedMinutes} دقیقه در روز
              </span>
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              انتخاب یک هدف ملایم و مستمر، راز اصلی ساخت عادت ماندگار مطالعه است.
            </p>

            <div className="grid grid-cols-4 gap-2 pt-1">
              {[10, 15, 20, 30].map((min) => (
                <button
                  key={min}
                  onClick={() => setSelectedMinutes(min)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedMinutes === min
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {min} دقیقه
                </button>
              ))}
            </div>

            {selectedMinutes !== stats.dailyGoalMinutes && (
              <button
                onClick={handleSaveGoal}
                className="w-full mt-2 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                ذخیره هدف روزانه جدید
              </button>
            )}
          </div>

          {/* Badges and Trophies */}
          <div>
            <h4 className="text-sm font-bold mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>نشان‌ها و دستاوردهای شما</span>
            </h4>

            <div className="grid grid-cols-2 gap-2.5">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center gap-2.5 ${
                    badge.unlocked
                      ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-800/50'
                      : 'opacity-50 grayscale border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40'
                  }`}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold truncate">{badge.name}</span>
                      {badge.unlocked && (
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                      {badge.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
