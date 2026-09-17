import React, { useState } from 'react';
import { UserStats, UserProfile, Book, DailyReminderSettings } from '../types';
import { UserAchievementsSection } from './UserAchievementsSection';
import {
  User,
  Mail,
  Calendar,
  Flame,
  Zap,
  Target,
  Trophy,
  HardDriveDownload,
  BookOpen,
  Trash2,
  Bell,
  Clock,
  Wifi,
  Shield,
  CheckCircle2,
  Edit2,
  Save,
  Bookmark,
  ChevronLeft
} from 'lucide-react';

interface UserProfileViewProps {
  stats: UserStats;
  books: Book[];
  notesCount?: number;
  highlightsCount?: number;
  onOpenBook: (book: Book) => void;
  onRemoveDownloadedBook: (bookId: number) => void;
  onToggleWantToRead?: (bookId: number) => void;
  dailyReminderSettings?: DailyReminderSettings;
  onOpenDailyReminder?: () => void;
  isDarkMode: boolean;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  stats,
  books,
  notesCount = 0,
  highlightsCount = 0,
  onOpenBook,
  onRemoveDownloadedBook,
  onToggleWantToRead,
  dailyReminderSettings,
  onOpenDailyReminder,
  isDarkMode,
}) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('user_profile');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      name: 'کاربر همراه خلاصه کده',
      email: 'user@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      joinedDate: 'اردیبهشت ۱۴۰۳',
      membershipType: 'free',
      notificationsEnabled: true,
      offlineSyncEnabled: true,
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profile.name);
  const [editedEmail, setEditedEmail] = useState(profile.email);

  const downloadedBooks = books.filter((b) => b.isDownloaded);
  const wantToReadBooks = books.filter((b) => b.isWantToRead);
  const totalReadBooks = books.filter((b) => b.isRead).length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...profile,
      name: editedName.trim() || profile.name,
      email: editedEmail.trim() || profile.email,
    };
    setProfile(updated);
    localStorage.setItem('user_profile', JSON.stringify(updated));
    setIsEditing(false);
  };

  const handleToggleNotifications = () => {
    const updated = { ...profile, notificationsEnabled: !profile.notificationsEnabled };
    setProfile(updated);
    localStorage.setItem('user_profile', JSON.stringify(updated));
  };

  const handleToggleOfflineSync = () => {
    const updated = { ...profile, offlineSyncEnabled: !profile.offlineSyncEnabled };
    setProfile(updated);
    localStorage.setItem('user_profile', JSON.stringify(updated));
  };

  return (
    <div className="space-y-5 px-3 sm:px-4 py-2 pb-10">
      {/* Profile Header Card */}
      <div
        className={`p-5 rounded-3xl border shadow-xs transition-all relative overflow-hidden ${
          isDarkMode
            ? 'bg-neutral-850/90 border-neutral-700/80 text-white'
            : 'bg-white border-neutral-200/80 text-neutral-900'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right">
          {/* Avatar with level badge */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500 shadow-md">
              <img
                src={profile.avatar}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -left-1 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black shadow-xs flex items-center gap-0.5">
              <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>سطح {stats.level}</span>
            </div>
          </div>

          {/* Name & Details */}
          <div className="flex-1 min-w-0 space-y-1">
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-2 max-w-sm">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full text-sm font-bold p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800"
                  placeholder="نام و نام خانوادگی"
                />
                <input
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800"
                  placeholder="ایمیل شما"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>ذخیره تغییرات</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 rounded-xl bg-neutral-200 dark:bg-neutral-700 text-xs font-semibold"
                  >
                    انصراف
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-lg font-black">{profile.name}</h3>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 rounded-full text-neutral-400 hover:text-blue-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                    title="ویرایش نام"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{profile.email}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>عضویت از {profile.joinedDate}</span>
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Membership Tag */}
          <div className="shrink-0 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>حساب کاربری فعال (۱۰۰٪ رایگان)</span>
          </div>
        </div>
      </div>

      {/* Reading Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div
          className={`p-3.5 rounded-2xl border ${
            isDarkMode ? 'bg-neutral-800/60 border-neutral-700/80' : 'bg-white border-neutral-200/80'
          }`}
        >
          <div className="flex items-center gap-2 text-orange-500 mb-1">
            <Flame className="w-4 h-4 fill-orange-500" />
            <span className="text-xs font-bold">زنجیره مطالعه</span>
          </div>
          <p className="text-xl font-black">{stats.streakDays} روز</p>
          <p className="text-[10px] text-neutral-400">پیوستگی منظم</p>
        </div>

        <div
          className={`p-3.5 rounded-2xl border ${
            isDarkMode ? 'bg-neutral-800/60 border-neutral-700/80' : 'bg-white border-neutral-200/80'
          }`}
        >
          <div className="flex items-center gap-2 text-blue-500 mb-1">
            <Zap className="w-4 h-4 fill-blue-500" />
            <span className="text-xs font-bold">امتیاز تجربه</span>
          </div>
          <p className="text-xl font-black">{stats.xpPoints} XP</p>
          <p className="text-[10px] text-neutral-400">سطح فعلی: {stats.level}</p>
        </div>

        <div
          className={`p-3.5 rounded-2xl border ${
            isDarkMode ? 'bg-neutral-800/60 border-neutral-700/80' : 'bg-white border-neutral-200/80'
          }`}
        >
          <div className="flex items-center gap-2 text-emerald-500 mb-1">
            <BookOpen className="w-4 h-4" />
            <span className="text-xs font-bold">کتاب‌های تمام‌شده</span>
          </div>
          <p className="text-xl font-black">{totalReadBooks} کتاب</p>
          <p className="text-[10px] text-neutral-400">مطالعه کامل</p>
        </div>

        <div
          className={`p-3.5 rounded-2xl border ${
            isDarkMode ? 'bg-neutral-800/60 border-neutral-700/80' : 'bg-white border-neutral-200/80'
          }`}
        >
          <div className="flex items-center gap-2 text-purple-500 mb-1">
            <HardDriveDownload className="w-4 h-4" />
            <span className="text-xs font-bold">دانلودهای آفلاین</span>
          </div>
          <p className="text-xl font-black">{downloadedBooks.length} کتاب</p>
          <p className="text-[10px] text-neutral-400">ذخیره در حافظه</p>
        </div>
      </div>

      {/* Honor Medals & Achievements Section */}
      <UserAchievementsSection
        stats={stats}
        books={books}
        notesCount={notesCount}
        highlightsCount={highlightsCount}
        isDarkMode={isDarkMode}
      />

      {/* Want to Read Shelf Section (کتاب‌هایی که باید خوانده شود) */}
      <div
        className={`p-4 rounded-3xl border shadow-xs space-y-3 ${
          isDarkMode
            ? 'bg-neutral-850/80 border-neutral-700/80 text-white'
            : 'bg-white border-neutral-200/80 text-neutral-900'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold">قفسه کتاب‌های در نوبت مطالعه (باید بخوانم)</h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                عناوین منتخب شما که در اولویت یادگیری و مطالعه قرار دارند
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
            {wantToReadBooks.length} کتاب
          </span>
        </div>

        {wantToReadBooks.length > 0 ? (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {wantToReadBooks.map((book) => (
              <div
                key={book.id}
                className="py-3 flex items-center justify-between gap-3 group"
              >
                <div
                  onClick={() => onOpenBook(book)}
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                >
                  <img
                    src={book.cover}
                    alt={book.title}
                    referrerPolicy="no-referrer"
                    className="w-10 h-14 rounded-lg object-cover shadow-xs shrink-0"
                  />
                  <div className="truncate">
                    <h5 className="text-xs sm:text-sm font-bold truncate group-hover:text-blue-600 transition-colors">
                      {book.title}
                    </h5>
                    <p className="text-[11px] text-neutral-400 truncate">{book.author}</p>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 mt-0.5">
                      <span>زمان مطالعه: {book.readTime}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onOpenBook(book)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1"
                  >
                    <span>مطالعه</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  {onToggleWantToRead && (
                    <button
                      onClick={() => onToggleWantToRead(book.id)}
                      className="p-1.5 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                      title="حذف از لیست مطالعه"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-1">
            <Bookmark className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mx-auto" />
            <p className="text-xs text-neutral-500">هیچ کتابی در نوبت مطالعه شما قرار ندارد.</p>
            <p className="text-[11px] text-neutral-400">
              با کلیک روی نشانک هر کتاب، آن را به این بخش اضافه کنید تا در دسترستان باشد.
            </p>
          </div>
        )}
      </div>

      {/* Offline Stored Books Section */}
      <div
        className={`p-4 rounded-3xl border shadow-xs space-y-3 ${
          isDarkMode
            ? 'bg-neutral-850/80 border-neutral-700/80 text-white'
            : 'bg-white border-neutral-200/80 text-neutral-900'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <HardDriveDownload className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold">کتاب‌های ذخیره‌شده آفلاین (Offline Storage)</h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                این کتاب‌ها در حافظه کش دستگاه ذخیره شده و بدون اینترنت در دسترس هستند.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
            {downloadedBooks.length} کتاب
          </span>
        </div>

        {downloadedBooks.length > 0 ? (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {downloadedBooks.map((book) => (
              <div
                key={book.id}
                className="py-3 flex items-center justify-between gap-3 group"
              >
                <div
                  onClick={() => onOpenBook(book)}
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                >
                  <img
                    src={book.cover}
                    alt={book.title}
                    referrerPolicy="no-referrer"
                    className="w-10 h-14 rounded-lg object-cover shadow-xs shrink-0"
                  />
                  <div className="truncate">
                    <h5 className="text-xs sm:text-sm font-bold truncate group-hover:text-blue-600 transition-colors">
                      {book.title}
                    </h5>
                    <p className="text-[11px] text-neutral-400 truncate">{book.author}</p>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>آماده مطالعه بدون اینترنت</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onOpenBook(book)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
                  >
                    مطالعه
                  </button>
                  <button
                    onClick={() => onRemoveDownloadedBook(book.id)}
                    className="p-1.5 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                    title="حذف از حافظه آفلاین"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-1">
            <HardDriveDownload className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mx-auto" />
            <p className="text-xs text-neutral-500">هنوز کتابی را برای مطالعه آفلاین ذخیره نکرده‌اید.</p>
            <p className="text-[11px] text-neutral-400">
              در صفحه هر کتاب یا کارت کتاب، آیکون دانلود را بزنید تا متن آن روی دستگاهتان ذخیره شود.
            </p>
          </div>
        )}
      </div>

      {/* Preferences & Settings */}
      <div
        className={`p-4 rounded-3xl border shadow-xs space-y-3 ${
          isDarkMode
            ? 'bg-neutral-850/80 border-neutral-700/80 text-white'
            : 'bg-white border-neutral-200/80 text-neutral-900'
        }`}
      >
        <h4 className="text-sm font-bold flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-500" />
          <span>تنظیمات و ترجیحات برنامه</span>
        </h4>

        <div className="space-y-3 divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className={`w-4 h-4 ${dailyReminderSettings?.enabled ? 'text-blue-500' : 'text-neutral-400'}`} />
                <div>
                  <span className="font-semibold block">اعلان‌های یادآوری مطالعه روزانه</span>
                  <span className="text-[11px] text-neutral-400">
                    {dailyReminderSettings?.enabled
                      ? `یادآور فعال در ساعت ${dailyReminderSettings.time}`
                      : 'ارسال یادآور خودکار برای ادامه کتاب و حفظ زنجیره'}
                  </span>
                </div>
              </div>
              <button
                onClick={onOpenDailyReminder || handleToggleNotifications}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  dailyReminderSettings?.enabled ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    dailyReminderSettings?.enabled ? '-translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {onOpenDailyReminder && (
              <div className="flex items-center justify-between pl-1 text-[11px] text-neutral-500 pt-1">
                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-mono font-bold">
                  <Clock className="w-3 h-3" />
                  <span>زمان اعلان: {dailyReminderSettings?.time || '20:30'}</span>
                </span>
                <button
                  type="button"
                  onClick={onOpenDailyReminder}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                >
                  <span>تنظیم ساعت و تست</span>
                  <ChevronLeft className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-neutral-400" />
              <div>
                <span className="font-semibold block">کش خودکار کتاب‌های باز شده در PWA</span>
                <span className="text-[11px] text-neutral-400">ذخیره خودکار برای دسترسی بعدی بدون نت</span>
              </div>
            </div>
            <button
              onClick={handleToggleOfflineSync}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                profile.offlineSyncEnabled ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  profile.offlineSyncEnabled ? '-translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
