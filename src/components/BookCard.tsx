import React from 'react';
import { Book } from '../types';
import { Heart, CheckCircle2, BookOpen, Star, Clock, HardDriveDownload, Sparkles, Bookmark, Flame, Award } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onSelect: (book: Book) => void;
  onToggleFavorite: (id: number, e: React.MouseEvent) => void;
  onToggleRead: (id: number, e: React.MouseEvent) => void;
  onToggleWantToRead?: (id: number, e: React.MouseEvent) => void;
  onToggleDownload?: (id: number, e: React.MouseEvent) => void;
  isDarkMode: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onSelect,
  onToggleFavorite,
  onToggleRead,
  onToggleWantToRead,
  onToggleDownload,
  isDarkMode,
}) => {
  const reviewsCount = book.reviews?.length || 0;

  return (
    <div
      onClick={() => onSelect(book)}
      className={`group relative rounded-2xl p-3.5 sm:p-4 border transition-all duration-200 cursor-pointer flex gap-3.5 hover:shadow-lg active:scale-[0.99] ${
        isDarkMode
          ? 'bg-neutral-800/90 border-neutral-700/70 hover:border-neutral-600 shadow-neutral-950/20'
          : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
      }`}
    >
      {/* Book Cover Container */}
      <div className="relative shrink-0 w-22 sm:w-26 h-32 sm:h-38 rounded-xl overflow-hidden shadow-sm bg-neutral-200 dark:bg-neutral-700">
        <img
          src={book.cover}
          alt={book.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badges on cover */}
        <div className="absolute top-1.5 right-1.5 flex flex-col gap-1 items-end">
          {book.isBookOfDay && (
            <span className="px-1.5 py-0.5 rounded-md bg-amber-500 text-white text-[9px] font-black shadow-md flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" />
              <span>روز</span>
            </span>
          )}
          {book.isTrending && !book.isBookOfDay && (
            <span className="px-1.5 py-0.5 rounded-md bg-rose-500 text-white text-[9px] font-black shadow-md flex items-center gap-0.5">
              <Flame className="w-2.5 h-2.5" />
              <span>ترند</span>
            </span>
          )}
          {book.isEditorChoice && !book.isBookOfDay && !book.isTrending && (
            <span className="px-1.5 py-0.5 rounded-md bg-indigo-600 text-white text-[9px] font-bold shadow-md flex items-center gap-0.5">
              <Award className="w-2.5 h-2.5" />
              <span>پیشنهادی</span>
            </span>
          )}
        </div>

        {/* Offline downloaded badge */}
        {book.isDownloaded && (
          <div
            className="absolute top-1.5 left-1.5 w-5 h-5 rounded-md bg-purple-600 text-white flex items-center justify-center shadow-xs"
            title="ذخیره‌شده برای مطالعه آفلاین"
          >
            <HardDriveDownload className="w-3 h-3" />
          </div>
        )}

        {/* Read Completed badge */}
        {book.isRead && (
          <div
            className="absolute bottom-1.5 left-1.5 w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center shadow-xs"
            title="خوانده شده"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {/* Book Info Column */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-1.5">
            <h3
              className={`font-bold text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors ${
                isDarkMode ? 'text-neutral-100' : 'text-neutral-900'
              }`}
            >
              {book.title}
            </h3>

            {/* Quick Action Icons */}
            <div className="flex items-center gap-0.5 shrink-0">
              {/* Want to Read button */}
              {onToggleWantToRead && (
                <button
                  id={`want-read-btn-${book.id}`}
                  onClick={(e) => onToggleWantToRead(book.id, e)}
                  className={`p-1 rounded-full transition-transform active:scale-75 ${
                    book.isWantToRead
                      ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50'
                      : 'text-neutral-400 hover:text-amber-500 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                  title={book.isWantToRead ? 'حذف از لیست باید بخوانم' : 'افزودن به لیست کتاب‌هایی که باید خوانده شود'}
                >
                  <Bookmark
                    className="w-3.5 h-3.5"
                    fill={book.isWantToRead ? 'currentColor' : 'none'}
                  />
                </button>
              )}

              {/* Download offline button */}
              {onToggleDownload && (
                <button
                  id={`download-btn-${book.id}`}
                  onClick={(e) => onToggleDownload(book.id, e)}
                  className={`p-1 rounded-full transition-transform active:scale-75 ${
                    book.isDownloaded
                      ? 'text-purple-600 bg-purple-50 dark:bg-purple-950/50'
                      : 'text-neutral-400 hover:text-purple-600 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                  title={book.isDownloaded ? 'حذف از حافظه آفلاین' : 'دانلود برای مطالعه بدون اینترنت'}
                >
                  <HardDriveDownload className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Favorite toggle button */}
              <button
                id={`fav-btn-${book.id}`}
                onClick={(e) => onToggleFavorite(book.id, e)}
                className={`p-1 rounded-full transition-transform active:scale-75 ${
                  book.isFavorite
                    ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                    : 'text-neutral-400 hover:text-rose-500 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
                title={book.isFavorite ? 'حذف از نشان‌شده‌ها' : 'افزودن به علاقه‌مندی‌ها'}
              >
                <Heart
                  className="w-3.5 h-3.5"
                  fill={book.isFavorite ? 'currentColor' : 'none'}
                />
              </button>
            </div>
          </div>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
            نویسنده: <span className="text-neutral-700 dark:text-neutral-300 font-medium">{book.author}</span>
          </p>

          <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
              {book.category}
            </span>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
              رایگان
            </span>
            {book.isWantToRead && (
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded-md hidden sm:inline">
                در لیست مطالعه
              </span>
            )}
          </div>
        </div>

        {/* Metadata row: time, rating, reviews */}
        <div className="my-1.5 flex items-center gap-2.5 text-[11px] text-neutral-500 dark:text-neutral-400 flex-wrap">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-neutral-400" />
            <span>{book.readTime}</span>
          </span>
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{book.rating}</span>
            {reviewsCount > 0 && (
              <span className="text-[10px] text-neutral-400 font-normal">({reviewsCount} نظر)</span>
            )}
          </span>
        </div>

        {/* Reading progress if active */}
        {book.progress > 0 && !book.isRead && (
          <div className="mb-1.5">
            <div className="flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-400 mb-0.5">
              <span>پیشرفت مطالعه:</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {Math.round(book.progress * 100)}٪
              </span>
            </div>
            <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${Math.round(book.progress * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Row */}
        <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-neutral-700/60">
          <span className="text-xs text-blue-600 dark:text-blue-400 group-hover:underline font-bold flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>مشخصات و مطالعه</span>
          </span>

          <button
            id={`read-status-btn-${book.id}`}
            onClick={(e) => onToggleRead(book.id, e)}
            className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full transition-all ${
              book.isRead
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold'
                : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
            }`}
            title={book.isRead ? 'علامت‌گذاری به عنوان خوانده‌نشده' : 'علامت‌گذاری به عنوان خوانده‌شده'}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{book.isRead ? 'خوانده‌شده' : 'خواندم'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
