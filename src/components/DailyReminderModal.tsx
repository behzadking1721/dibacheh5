import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  Clock,
  Volume2,
  VolumeX,
  CheckCircle2,
  Sparkles,
  X,
  Play,
  Flame,
  ShieldCheck,
  Smartphone,
  BookOpen,
} from 'lucide-react';
import { DailyReminderSettings, Book } from '../types';
import { playReminderChime } from '../utils/notificationSound';

interface DailyReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: DailyReminderSettings;
  onUpdateSettings: (newSettings: DailyReminderSettings) => void;
  onTestReminder: () => void;
  targetBook: Book | null;
  isDarkMode: boolean;
}

const TIME_PRESETS = [
  { label: 'صبح زود', time: '08:00', icon: '🌅' },
  { label: 'ظهر', time: '13:30', icon: '☀️' },
  { label: 'عصر', time: '17:30', icon: '☕' },
  { label: 'شب (پیشنهادی)', time: '20:30', icon: '🌙' },
  { label: 'آخر شب', time: '22:30', icon: '✨' },
];

export const DailyReminderModal: React.FC<DailyReminderModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onTestReminder,
  targetBook,
  isDarkMode,
}) => {
  const [permissionStatus, setPermissionStatus] = useState<string>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  if (!isOpen) return null;

  const handleToggleEnabled = async () => {
    const nextEnabled = !settings.enabled;
    let nextPermission = settings.pushPermission;

    // If enabling and browser notifications are supported, ask for permission
    if (nextEnabled && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        try {
          const perm = await Notification.requestPermission();
          setPermissionStatus(perm);
          nextPermission = perm;
        } catch {
          // ignore
        }
      }
    }

    onUpdateSettings({
      ...settings,
      enabled: nextEnabled,
      pushPermission: nextPermission,
    });
  };

  const handleRequestPushPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setPermissionStatus(perm);
        onUpdateSettings({
          ...settings,
          pushPermission: perm,
        });
      } catch {
        // ignore
      }
    }
  };

  const handlePlaySoundTest = () => {
    playReminderChime();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className={`relative w-full max-w-lg rounded-3xl border shadow-2xl p-5 sm:p-6 overflow-hidden max-h-[90vh] overflow-y-auto ${
            isDarkMode
              ? 'bg-neutral-900 border-neutral-700 text-neutral-100'
              : 'bg-white border-neutral-200 text-neutral-900'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80 dark:border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black flex items-center gap-2">
                  <span>سیستم یادآور روزانه مطالعه</span>
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  تنظیم زمان دعوت به مطالعه و حفظ زنجیره یادگیری
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 transition"
              title="بستن پنجره"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-5 pt-4 text-xs sm:text-sm">
            {/* Main Switch Card */}
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                settings.enabled
                  ? isDarkMode
                    ? 'bg-blue-950/40 border-blue-800/80'
                    : 'bg-blue-50/70 border-blue-200'
                  : isDarkMode
                  ? 'bg-neutral-800/50 border-neutral-800'
                  : 'bg-neutral-50 border-neutral-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    settings.enabled
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">فعال‌سازی یادآور مطالعه</h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    {settings.enabled
                      ? `یادآور هر روز در ساعت ${settings.time} برای شما فعال است.`
                      : 'یادآور مطالعه در حال حاضر غیرفعال است.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleEnabled}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                  settings.enabled ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.enabled ? '-translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Time Settings (Shown when enabled) */}
            {settings.enabled && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>انتخاب ساعت یادآوری در روز:</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded-md">
                    {settings.time}
                  </span>
                </div>

                {/* Preset Time Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TIME_PRESETS.map((preset) => {
                    const isSelected = settings.time === preset.time;
                    return (
                      <button
                        key={preset.time}
                        type="button"
                        onClick={() => onUpdateSettings({ ...settings, time: preset.time })}
                        className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : isDarkMode
                            ? 'bg-neutral-800/80 border-neutral-700 hover:border-neutral-600 text-neutral-200'
                            : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-800'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{preset.icon}</span>
                          <span className="text-xs font-semibold">{preset.label}</span>
                        </div>
                        <span className="text-[11px] font-mono font-bold opacity-90">
                          {preset.time}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Time Input */}
                <div className="pt-2 flex items-center gap-3">
                  <span className="text-xs text-neutral-500">یا تنظیم ساعت دلخواه:</span>
                  <input
                    type="time"
                    value={settings.time}
                    onChange={(e) => {
                      if (e.target.value) {
                        onUpdateSettings({ ...settings, time: e.target.value });
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl border font-mono font-bold text-xs ${
                      isDarkMode
                        ? 'bg-neutral-800 border-neutral-700 text-white'
                        : 'bg-white border-neutral-300 text-neutral-900'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Sound & Notification Options */}
            <div
              className={`p-3.5 rounded-2xl border space-y-3 ${
                isDarkMode ? 'bg-neutral-850/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {settings.soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-neutral-400" />
                  )}
                  <div>
                    <span className="font-semibold block">صدای ملایم زنگ یادآور</span>
                    <span className="text-[11px] text-neutral-400">
                      پخش یک ملودی زنگ دلنشین همراه با باز شدن یادآور
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePlaySoundTest}
                    className="p-1.5 rounded-lg text-xs hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 transition"
                    title="تست صدای زنگ"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })
                    }
                    className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                      settings.soundEnabled ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        settings.soundEnabled ? '-translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Browser Push Permission State */}
              <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-500" />
                  <div>
                    <span className="font-semibold block">اعلان سیستمی مرورگر / موبایل (Push)</span>
                    <span className="text-[11px] text-neutral-400">
                      {permissionStatus === 'granted'
                        ? 'مجوز ارسال اعلان مرورگر فعال است.'
                        : permissionStatus === 'denied'
                        ? 'دسترسی در تنظیمات مرورگر مسدود است.'
                        : 'برای دریافت اعلان خارج از صفحه مرورگر، مجوز دهید.'}
                    </span>
                  </div>
                </div>

                {permissionStatus !== 'granted' && permissionStatus !== 'unsupported' && (
                  <button
                    type="button"
                    onClick={handleRequestPushPermission}
                    className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shadow-xs transition"
                  >
                    فعال‌سازی مجوز
                  </button>
                )}
                {permissionStatus === 'granted' && (
                  <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>فعال</span>
                  </span>
                )}
              </div>
            </div>

            {/* Target Book Preview (The book that will be suggested) */}
            {targetBook && (
              <div
                className={`p-3 rounded-2xl border ${
                  isDarkMode
                    ? 'bg-neutral-850/40 border-neutral-800 text-neutral-300'
                    : 'bg-neutral-50/70 border-neutral-200 text-neutral-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs font-bold">کتاب هدف در یادآور بعدی:</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <img
                    src={targetBook.cover}
                    alt={targetBook.title}
                    referrerPolicy="no-referrer"
                    className="w-9 h-12 rounded-lg object-cover shadow-xs shrink-0"
                  />
                  <div className="truncate">
                    <h5 className="text-xs font-bold truncate">{targetBook.title}</h5>
                    <p className="text-[11px] text-neutral-400 truncate">{targetBook.author}</p>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                      {(targetBook.progress || 0) > 0
                        ? `پیشرفت فعلی: ${Math.round((targetBook.progress || 0) * 100)}٪`
                        : 'کتاب انتخاب شده برای شروع مطالعه'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions: Test Button & Close */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onTestReminder();
                  onClose();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all"
              >
                <Play className="w-3.5 h-3.5" />
                <span>تست آنی یادآور (مشاهده خروجی)</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold transition"
              >
                بستن
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
