import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, BookOpen, Clock, X, ArrowLeft, Volume2 } from 'lucide-react';
import { Book } from '../types';

interface ReminderToastProps {
  isVisible: boolean;
  targetBook: Book | null;
  onOpenBook: (book: Book) => void;
  onSnooze: () => void;
  onClose: () => void;
  isDarkMode: boolean;
}

export const ReminderToast: React.FC<ReminderToastProps> = ({
  isVisible,
  targetBook,
  onOpenBook,
  onSnooze,
  onClose,
  isDarkMode,
}) => {
  if (!isVisible || !targetBook) return null;

  const progressPercent = Math.round((targetBook.progress || 0) * 100);
  const hasStarted = progressPercent > 0 && progressPercent < 98;

  return (
    <AnimatePresence>
      <motion.div
        key="reminder-toast"
        initial={{ opacity: 0, y: -40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed top-4 inset-x-3 sm:inset-x-auto sm:right-6 sm:max-w-md z-50 pointer-events-auto"
      >
        <div
          className={`rounded-3xl border shadow-2xl p-4 transition-colors ${
            isDarkMode
              ? 'bg-neutral-900/95 border-blue-500/40 text-neutral-100 backdrop-blur-md shadow-blue-950/40'
              : 'bg-white/95 border-blue-300 text-neutral-900 backdrop-blur-md shadow-blue-500/15'
          }`}
        >
          {/* Header row */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600/15 dark:bg-blue-400/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4 animate-bounce" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                  <span>یادآور مطالعه روزانه</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  فرصت عالی برای پیشرفت و گسترش دانش
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
              title="بستن اعلان"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Book Card Snippet */}
          <div
            onClick={() => onOpenBook(targetBook)}
            className={`flex items-center gap-3 p-2.5 rounded-2xl border cursor-pointer group transition-all ${
              isDarkMode
                ? 'bg-neutral-800/80 border-neutral-700 hover:border-blue-500/60'
                : 'bg-blue-50/70 border-blue-100 hover:border-blue-300'
            }`}
          >
            <img
              src={targetBook.cover}
              alt={targetBook.title}
              referrerPolicy="no-referrer"
              className="w-11 h-15 rounded-xl object-cover shadow-sm shrink-0 group-hover:scale-105 transition-transform"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600/10 dark:bg-blue-400/15 text-blue-600 dark:text-blue-400 inline-block mb-1">
                {hasStarted ? 'ادامه مطالعه قبلی' : 'نوبت مطالعه شما'}
              </span>
              <h5 className="text-xs sm:text-sm font-bold truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {targetBook.title}
              </h5>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                {targetBook.author} • {targetBook.readTime}
              </p>

              {/* Progress bar if started */}
              {hasStarted && (
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                    {progressPercent}٪
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => onOpenBook(targetBook)}
              className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{hasStarted ? 'ادامه مطالعه کتاب' : 'شروع خواندن خلاصه'}</span>
              <ArrowLeft className="w-3 h-3" />
            </button>

            <button
              onClick={onSnooze}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1 shrink-0 ${
                isDarkMode
                  ? 'border-neutral-700 hover:bg-neutral-800 text-neutral-300'
                  : 'border-neutral-200 hover:bg-neutral-100 text-neutral-700'
              }`}
              title="یادآوری مجدد ۱۰ دقیقه بعد"
            >
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden xs:inline">۱۰ دقیقه بعد</span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
