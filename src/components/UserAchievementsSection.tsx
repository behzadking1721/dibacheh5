import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Trophy,
  Flame,
  Sun,
  BookOpen,
  Lock,
  Sparkles,
  CheckCircle2,
  HardDriveDownload,
  Bookmark,
  Compass,
  Zap,
  Highlighter,
  ChevronLeft,
  X,
  Share2,
} from 'lucide-react';
import { UserStats, Book, AchievementBadge } from '../types';

interface UserAchievementsSectionProps {
  stats: UserStats;
  books: Book[];
  notesCount?: number;
  highlightsCount?: number;
  isDarkMode: boolean;
}

export const UserAchievementsSection: React.FC<UserAchievementsSectionProps> = ({
  stats,
  books,
  notesCount = 0,
  highlightsCount = 0,
  isDarkMode,
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);

  // Compute calculated metrics
  const totalReadBooks = useMemo(() => books.filter((b) => b.isRead).length, [books]);
  const downloadedBooksCount = useMemo(() => books.filter((b) => b.isDownloaded).length, [books]);
  const wantToReadCount = useMemo(() => books.filter((b) => b.isWantToRead).length, [books]);
  const readCategoriesCount = useMemo(() => {
    const categories = new Set(books.filter((b) => b.isRead || (b.progress || 0) > 0.5).map((b) => b.category));
    return categories.size;
  }, [books]);
  const totalNotesAndHighlights = notesCount + highlightsCount;

  // Build the list of achievements
  const badges: AchievementBadge[] = useMemo(() => {
    return [
      {
        id: 'bookworm',
        title: 'کرم کتاب',
        category: 'reading',
        description: 'مطالعه و تکمیل حداقل ۳ خلاصه کتاب ارزشمند',
        requirement: 'خواندن کامل ۳ عنوان خلاصه کتاب',
        icon: '📚',
        color: 'emerald',
        xpReward: 150,
        currentValue: totalReadBooks,
        targetValue: 3,
        unit: 'کتاب',
        isUnlocked: totalReadBooks >= 3,
        unlockedAt: totalReadBooks >= 3 ? '۱۴۰۳/۰۲/۱۵' : undefined,
      },
      {
        id: 'early_bird',
        title: 'سحرخیز',
        category: 'habit',
        description: 'تکمیل هدف مطالعه در ساعات پرانرژی روز یا رسیدن به حد نصاب روزانه',
        requirement: 'ثبت حداقل ۱۵ دقیقه مطالعه متمرکز در یک روز',
        icon: '🌅',
        color: 'amber',
        xpReward: 100,
        currentValue: stats.todayMinutesRead,
        targetValue: Math.max(15, stats.dailyGoalMinutes),
        unit: 'دقیقه',
        isUnlocked: stats.todayMinutesRead >= Math.max(15, stats.dailyGoalMinutes),
        unlockedAt: stats.todayMinutesRead >= Math.max(15, stats.dailyGoalMinutes) ? 'امروز' : undefined,
      },
      {
        id: 'consistency_master',
        title: 'استادِ استمرار',
        category: 'habit',
        description: 'حفظ زنجیره مطالعه روزانه برای حداقل ۵ روز متوالی بدون وقفه',
        requirement: 'زنجیره پیوسته ۵ روز مطالعه فعال',
        icon: '🔥',
        color: 'orange',
        xpReward: 200,
        currentValue: stats.streakDays,
        targetValue: 5,
        unit: 'روز پیوسته',
        isUnlocked: stats.streakDays >= 5,
        unlockedAt: stats.streakDays >= 5 ? 'دیروز' : undefined,
      },
      {
        id: 'idea_hunter',
        title: 'شکارچی ایده',
        category: 'note',
        description: 'استخراج و نشانه‌گذاری حداقل ۴ یادداشت یا هایلایت طلایی حین مطالعه',
        requirement: 'ثبت ۴ یادداشت شخصی یا جمله هایلایت‌شده در ریدر',
        icon: '✍️',
        color: 'blue',
        xpReward: 120,
        currentValue: totalNotesAndHighlights,
        targetValue: 4,
        unit: 'نکته',
        isUnlocked: totalNotesAndHighlights >= 4,
        unlockedAt: totalNotesAndHighlights >= 4 ? 'هفته جاری' : undefined,
      },
      {
        id: 'offline_voyager',
        title: 'مسافر آفلاین',
        category: 'reading',
        description: 'ذخیره ۲ خلاصه کتاب برای مطالعه در سفر، مترو و بدون نیاز به اینترنت',
        requirement: 'دانلود حداقل ۲ کتاب در حافظه آفلاین دستگاه',
        icon: '📴',
        color: 'purple',
        xpReward: 90,
        currentValue: downloadedBooksCount,
        targetValue: 2,
        unit: 'کتاب دانلودشده',
        isUnlocked: downloadedBooksCount >= 2,
        unlockedAt: downloadedBooksCount >= 2 ? '۱۴۰۳/۰۲/۰۱' : undefined,
      },
      {
        id: 'priority_master',
        title: 'استاد اولویت‌بندی',
        category: 'reading',
        description: 'برنامه‌ریزی و نشاندار کردن حداقل ۳ عنوان در قفسه نوبت مطالعه',
        requirement: 'افزودن ۳ کتاب به لیست «باید بخوانم»',
        icon: '🎯',
        color: 'teal',
        xpReward: 80,
        currentValue: wantToReadCount,
        targetValue: 3,
        unit: 'کتاب در نوبت',
        isUnlocked: wantToReadCount >= 3,
        unlockedAt: wantToReadCount >= 3 ? 'هفته جاری' : undefined,
      },
      {
        id: 'horizon_explorer',
        title: 'کاوشگر افق‌ها',
        category: 'reading',
        description: 'کسب بینش چندجانبه با مطالعه در حداقل ۳ دسته‌بندی و ژانر متفاوت',
        requirement: 'مطالعه کتاب در ۳ ژانر مختلف (مثلاً روانشناسی، مدیریت، رمان)',
        icon: '🧭',
        color: 'indigo',
        xpReward: 160,
        currentValue: readCategoriesCount,
        targetValue: 3,
        unit: 'دسته‌بندی',
        isUnlocked: readCategoriesCount >= 3,
        unlockedAt: readCategoriesCount >= 3 ? 'ماه گذشته' : undefined,
      },
      {
        id: 'scholar_pioneer',
        title: 'دانشمند فرهیخته',
        category: 'mastery',
        description: 'رسیدن به سطح تجربه عالی با کسب حداقل ۲۵۰ امتیاز XP در سیستم',
        requirement: 'کسب ۲۵۰ امتیاز تجربه (XP) در سامانه',
        icon: '⚡',
        color: 'rose',
        xpReward: 250,
        currentValue: stats.xpPoints,
        targetValue: 250,
        unit: 'امتیاز XP',
        isUnlocked: stats.xpPoints >= 250,
        unlockedAt: stats.xpPoints >= 250 ? 'به‌تازگی' : undefined,
      },
    ];
  }, [
    totalReadBooks,
    stats.todayMinutesRead,
    stats.dailyGoalMinutes,
    stats.streakDays,
    totalNotesAndHighlights,
    downloadedBooksCount,
    wantToReadCount,
    readCategoriesCount,
    stats.xpPoints,
  ]);

  const unlockedBadges = useMemo(() => badges.filter((b) => b.isUnlocked), [badges]);
  const totalBadgesCount = badges.length;
  const unlockedCount = unlockedBadges.length;
  const unlockPercentage = Math.round((unlockedCount / totalBadgesCount) * 100);
  const totalEarnedXP = unlockedBadges.reduce((acc, b) => acc + b.xpReward, 0);

  const filteredBadges = useMemo(() => {
    if (filter === 'unlocked') return badges.filter((b) => b.isUnlocked);
    if (filter === 'locked') return badges.filter((b) => !b.isUnlocked);
    return badges;
  }, [badges, filter]);

  // Color theme helpers
  const getColorStyles = (color: string, unlocked: boolean) => {
    if (!unlocked) {
      return {
        cardBg: isDarkMode ? 'bg-neutral-850/60 border-neutral-800' : 'bg-neutral-50/80 border-neutral-200',
        badgeBg: isDarkMode ? 'bg-neutral-800 text-neutral-500' : 'bg-neutral-200 text-neutral-400',
        textColor: 'text-neutral-400',
        accentBorder: 'border-neutral-700/40',
      };
    }

    switch (color) {
      case 'emerald':
        return {
          cardBg: isDarkMode
            ? 'bg-emerald-950/25 border-emerald-800/50 hover:border-emerald-700'
            : 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-300',
          badgeBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
          textColor: 'text-emerald-600 dark:text-emerald-400',
          accentBorder: 'border-emerald-400',
        };
      case 'amber':
        return {
          cardBg: isDarkMode
            ? 'bg-amber-950/25 border-amber-800/50 hover:border-amber-700'
            : 'bg-amber-50/70 border-amber-200 hover:border-amber-300',
          badgeBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
          textColor: 'text-amber-600 dark:text-amber-400',
          accentBorder: 'border-amber-400',
        };
      case 'orange':
        return {
          cardBg: isDarkMode
            ? 'bg-orange-950/25 border-orange-800/50 hover:border-orange-700'
            : 'bg-orange-50/70 border-orange-200 hover:border-orange-300',
          badgeBg: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
          textColor: 'text-orange-600 dark:text-orange-400',
          accentBorder: 'border-orange-400',
        };
      case 'blue':
        return {
          cardBg: isDarkMode
            ? 'bg-blue-950/25 border-blue-800/50 hover:border-blue-700'
            : 'bg-blue-50/70 border-blue-200 hover:border-blue-300',
          badgeBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
          textColor: 'text-blue-600 dark:text-blue-400',
          accentBorder: 'border-blue-400',
        };
      case 'purple':
        return {
          cardBg: isDarkMode
            ? 'bg-purple-950/25 border-purple-800/50 hover:border-purple-700'
            : 'bg-purple-50/70 border-purple-200 hover:border-purple-300',
          badgeBg: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
          textColor: 'text-purple-600 dark:text-purple-400',
          accentBorder: 'border-purple-400',
        };
      case 'teal':
        return {
          cardBg: isDarkMode
            ? 'bg-teal-950/25 border-teal-800/50 hover:border-teal-700'
            : 'bg-teal-50/70 border-teal-200 hover:border-teal-300',
          badgeBg: 'bg-teal-500/15 text-teal-600 dark:text-teal-400',
          textColor: 'text-teal-600 dark:text-teal-400',
          accentBorder: 'border-teal-400',
        };
      case 'indigo':
        return {
          cardBg: isDarkMode
            ? 'bg-indigo-950/25 border-indigo-800/50 hover:border-indigo-700'
            : 'bg-indigo-50/70 border-indigo-200 hover:border-indigo-300',
          badgeBg: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400',
          textColor: 'text-indigo-600 dark:text-indigo-400',
          accentBorder: 'border-indigo-400',
        };
      case 'rose':
      default:
        return {
          cardBg: isDarkMode
            ? 'bg-rose-950/25 border-rose-800/50 hover:border-rose-700'
            : 'bg-rose-50/70 border-rose-200 hover:border-rose-300',
          badgeBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
          textColor: 'text-rose-600 dark:text-rose-400',
          accentBorder: 'border-rose-400',
        };
    }
  };

  return (
    <div
      id="user-achievements-section"
      className={`p-4 sm:p-5 rounded-3xl border shadow-xs space-y-4 transition-all ${
        isDarkMode
          ? 'bg-neutral-850/80 border-neutral-700/80 text-white'
          : 'bg-white border-neutral-200/80 text-neutral-900'
      }`}
    >
      {/* Header with Title and Level Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
            <Trophy className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-black flex items-center gap-2">
              <span>مدال‌های افتخار و دستاوردهای مطالعه</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300">
                {unlockedCount} از {totalBadgesCount} کسب‌شده
              </span>
            </h4>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              نشان‌ها و رتبه‌های اختصاصی شما بر اساس استمرار، نظم و عمق مطالعه
            </p>
          </div>
        </div>

        {/* Total Gained XP Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>{totalEarnedXP} XP پاداش مدال‌ها</span>
          </div>
        </div>
      </div>

      {/* Progress Bar & Filter Pills */}
      <div className="space-y-3">
        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-neutral-500 dark:text-neutral-400">پیشرفت کل دستاوردها</span>
            <span className="font-bold font-mono text-blue-600 dark:text-blue-400">
              {unlockPercentage}٪ تکمیل شده
            </span>
          </div>
          <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${unlockPercentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 rounded-full"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold no-scrollbar">
          <button
            id="badge-filter-all"
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
            }`}
          >
            همه مدال‌ها ({totalBadgesCount})
          </button>
          <button
            id="badge-filter-unlocked"
            type="button"
            onClick={() => setFilter('unlocked')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1 ${
              filter === 'unlocked'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>کسب‌شده‌ها ({unlockedCount})</span>
          </button>
          <button
            id="badge-filter-locked"
            type="button"
            onClick={() => setFilter('locked')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1 ${
              filter === 'locked'
                ? 'bg-neutral-700 text-white shadow-xs'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>در انتظار دستیابی ({totalBadgesCount - unlockedCount})</span>
          </button>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {filteredBadges.map((badge) => {
          const styles = getColorStyles(badge.color, badge.isUnlocked);
          const progressPercent = Math.min(
            100,
            Math.round((badge.currentValue / badge.targetValue) * 100)
          );

          return (
            <motion.div
              key={badge.id}
              id={`achievement-card-${badge.id}`}
              whileHover={{ y: -2 }}
              onClick={() => setSelectedBadge(badge)}
              className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between relative group overflow-hidden ${
                styles.cardBg
              }`}
            >
              {/* Unlocked / Locked Top Status */}
              <div className="flex items-start justify-between gap-1 mb-2">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-xs transition-transform group-hover:scale-110 shrink-0 ${
                    badge.isUnlocked
                      ? 'bg-white dark:bg-neutral-800 ring-2 ring-offset-1 ring-amber-400/50 dark:ring-amber-500/40'
                      : 'bg-neutral-200 dark:bg-neutral-800 grayscale opacity-60'
                  }`}
                >
                  {badge.icon}
                </div>

                {badge.isUnlocked ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>فعال</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-400 flex items-center gap-0.5">
                    <Lock className="w-2.5 h-2.5" />
                    <span>قفل</span>
                  </span>
                )}
              </div>

              {/* Title & Desc */}
              <div className="space-y-1 mb-2">
                <h5 className="text-xs sm:text-sm font-black truncate group-hover:text-blue-600 transition-colors">
                  {badge.title}
                </h5>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Progress or Reward Footer */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 space-y-1">
                {badge.isUnlocked ? (
                  <div className="flex items-center justify-between text-[10px] font-bold text-amber-600 dark:text-amber-400">
                    <span className="flex items-center gap-0.5">
                      <Sparkles className="w-3 h-3" />
                      <span>+{badge.xpReward} XP</span>
                    </span>
                    <span className="text-neutral-400 font-normal">کسب شد ✓</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 font-semibold">
                      <span>پیشرفت</span>
                      <span>
                        {badge.currentValue} / {badge.targetValue} {badge.unit}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`relative w-full max-w-sm rounded-3xl border shadow-2xl p-6 overflow-hidden ${
                isDarkMode
                  ? 'bg-neutral-900 border-neutral-800 text-white'
                  : 'bg-white border-neutral-200 text-neutral-900'
              }`}
            >
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 left-4 p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-3 pt-2">
                {/* Big Icon */}
                <div
                  className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl shadow-lg ${
                    selectedBadge.isUnlocked
                      ? 'bg-gradient-to-tr from-amber-400 to-amber-200 ring-4 ring-amber-300/40 shadow-amber-500/25'
                      : 'bg-neutral-200 dark:bg-neutral-800 grayscale'
                  }`}
                >
                  {selectedBadge.icon}
                </div>

                <div>
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        selectedBadge.isUnlocked
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {selectedBadge.isUnlocked ? 'دستاورد کسب شده ✓' : 'قفل شده (در انتظار تکمیل)'}
                    </span>
                  </div>
                  <h3 className="text-lg font-black">{selectedBadge.title}</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 px-4 leading-relaxed">
                    {selectedBadge.description}
                  </p>
                </div>

                {/* Requirements Box */}
                <div
                  className={`p-3.5 rounded-2xl border text-right space-y-2 text-xs ${
                    isDarkMode ? 'bg-neutral-800/60 border-neutral-700/80' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-neutral-400">شرط دستیابی:</span>
                    <span className="text-blue-600 dark:text-blue-400">
                      +{selectedBadge.xpReward} امتیاز XP
                    </span>
                  </div>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {selectedBadge.requirement}
                  </p>

                  {/* Progress info */}
                  <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-700 space-y-1">
                    <div className="flex items-center justify-between font-mono text-[11px] text-neutral-500">
                      <span>وضعیت فعلی:</span>
                      <span className="font-bold">
                        {selectedBadge.currentValue} از {selectedBadge.targetValue} {selectedBadge.unit}
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          selectedBadge.isUnlocked ? 'bg-emerald-500' : 'bg-blue-600'
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round((selectedBadge.currentValue / selectedBadge.targetValue) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedBadge(null)}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm"
                >
                  متوجه شدم
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
