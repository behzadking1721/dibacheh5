import React from 'react';
import { Book } from '../types';
import { Sparkles, Clock, Star, Gift, BookOpen, ChevronLeft } from 'lucide-react';

interface BookOfDayBannerProps {
  book: Book;
  onSelect: (book: Book) => void;
  onOpenReader: (book: Book) => void;
  isDarkMode: boolean;
}

export const BookOfDayBanner: React.FC<BookOfDayBannerProps> = ({
  book,
  onSelect,
  onOpenReader,
  isDarkMode,
}) => {
  return (
    <div
      className={`mx-3 sm:mx-4 mb-4 rounded-3xl p-4 sm:p-5 relative overflow-hidden border shadow-sm transition-all ${
        isDarkMode
          ? 'bg-gradient-to-r from-amber-950/40 via-neutral-900 to-neutral-900 border-amber-800/40 text-white'
          : 'bg-gradient-to-r from-amber-50 via-amber-50/50 to-white border-amber-200/80 text-neutral-900'
      }`}
    >
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
        {/* Book cover with Free Badge */}
        <div
          onClick={() => onSelect(book)}
          className="relative shrink-0 w-24 sm:w-28 h-36 sm:h-40 rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
        >
          <img
            src={book.cover}
            alt={book.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold shadow-md flex items-center gap-1">
            <Gift className="w-3 h-3" />
            <span>رایگان امروز</span>
          </div>
        </div>

        {/* Content details */}
        <div className="flex-1 text-center sm:text-right space-y-2">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
            <Sparkles className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
            <span>کتاب رایگان پیشنهادی امروز (۲۴ ساعت دسترسی رایگان)</span>
          </div>

          <h3
            onClick={() => onSelect(book)}
            className="text-lg sm:text-xl font-black cursor-pointer hover:text-blue-600 transition-colors"
          >
            {book.title}
          </h3>

          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            اثر ماندگار {book.author} • دسته‌بندی {book.category}
          </p>

          <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-relaxed">
            {book.summary}
          </p>

          {/* Metadata badges and CTA */}
          <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <span className="flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400">
              <Clock className="w-3.5 h-3.5" />
              <span>زمان خواندن: {book.readTime}</span>
            </span>

            <span className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{book.rating}</span>
            </span>

            <button
              id="read-book-of-day-btn"
              onClick={() => onOpenReader(book)}
              className="mr-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>شروع مطالعه رایگان امروز</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
