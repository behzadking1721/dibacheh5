import React from 'react';
import { Book } from '../types';
import { Flame, Award, Crown, Sparkles, Bookmark, Clock, Star, ChevronLeft, BookOpen } from 'lucide-react';

interface BookCuratedSectionsProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onOpenReader: (book: Book) => void;
  onToggleWantToRead: (id: number, e: React.MouseEvent) => void;
  onToggleFavorite: (id: number, e: React.MouseEvent) => void;
  isDarkMode: boolean;
}

interface SectionConfig {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
  filterFn: (b: Book) => boolean;
  emptyMessage?: string;
  showWhenEmpty?: boolean;
}

export const BookCuratedSections: React.FC<BookCuratedSectionsProps> = ({
  books,
  onSelectBook,
  onOpenReader,
  onToggleWantToRead,
  onToggleFavorite,
  isDarkMode,
}) => {
  const sections: SectionConfig[] = [
    {
      id: 'want-to-read',
      title: 'کتاب‌هایی که باید بخوانید (قفسه مطالعه من)',
      subtitle: 'لیست اختصاصی کتاب‌هایی که برای مطالعه آینده نشان کرده‌اید',
      badge: 'برنامه مطالعه',
      badgeColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20',
      icon: <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500" />,
      filterFn: (b) => !!b.isWantToRead,
      emptyMessage: 'هنوز کتابی در لیست «باید بخوانم» قرار نداده‌اید. با کلیک روی آیکون بوکمارک هر کتاب، آن را به این قفسه اضافه کنید.',
      showWhenEmpty: true,
    },
    {
      id: 'trending',
      title: 'کتاب‌های ترند و داغ هفته',
      subtitle: 'محبوب‌ترین و پربازدیدترین خلاصه‌ها در بین کاربران',
      badge: 'پربازدیدترین‌ها',
      badgeColor: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20',
      icon: <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />,
      filterFn: (b) => !!b.isTrending,
    },
    {
      id: 'editor-choice',
      title: 'پیشنهادهای ویژه سردبیر',
      subtitle: 'برگزیده‌ترین آثار تأثیرگذار به انتخاب تیم کارشناسی',
      badge: 'پیشنهادی',
      badgeColor: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
      icon: <Award className="w-4 h-4 text-indigo-500 fill-indigo-500" />,
      filterFn: (b) => !!b.isEditorChoice,
    },
    {
      id: 'classics',
      title: 'شاهکارهای مشهور و پرفروش تاریخ',
      subtitle: 'کتاب‌های کلاسیک و مرجع که نگرش میلیون‌ها انسان را دگرگون کردند',
      badge: 'پرفروش‌های جهانی',
      badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
      icon: <Crown className="w-4 h-4 text-emerald-500 fill-emerald-500" />,
      filterFn: (b) => !!b.isClassic,
    },
    {
      id: 'new-releases',
      title: 'تازه‌ترین خلاصه‌های اضافه‌شده',
      subtitle: 'جدیدترین آثار منتشر شده در سامانه برای به‌روز ماندن دانش شما',
      badge: 'جدید',
      badgeColor: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20',
      icon: <Sparkles className="w-4 h-4 text-blue-500 fill-blue-500" />,
      filterFn: (b) => !!b.isNew,
    },
  ];

  return (
    <div className="space-y-7 pb-4">
      {sections.map((sec) => {
        const matchingBooks = books.filter(sec.filterFn);

        if (matchingBooks.length === 0 && !sec.showWhenEmpty) {
          return null;
        }

        return (
          <section key={sec.id} className="space-y-2.5">
            {/* Section Header */}
            <div className="flex items-center justify-between px-1">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                    {sec.icon}
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-neutral-100">
                    {sec.title}
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sec.badgeColor}`}>
                    {sec.badge}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 pr-8">
                  {sec.subtitle}
                </p>
              </div>

              {matchingBooks.length > 0 && (
                <span className="text-xs text-neutral-400 font-medium">
                  {matchingBooks.length} کتاب
                </span>
              )}
            </div>

            {/* Content row */}
            {matchingBooks.length > 0 ? (
              <div className="flex items-stretch gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
                {matchingBooks.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => onSelectBook(book)}
                    className={`shrink-0 w-44 sm:w-48 rounded-2xl p-3 border transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-lg active:scale-[0.98] ${
                      isDarkMode
                        ? 'bg-neutral-800/80 border-neutral-700/60 hover:border-neutral-600'
                        : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div>
                      {/* Cover & Overlay Actions */}
                      <div className="relative w-full h-44 sm:h-50 rounded-xl overflow-hidden shadow-2xs mb-2.5 bg-neutral-200 dark:bg-neutral-700 group">
                        <img
                          src={book.cover}
                          alt={book.title}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                          <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-black/60 text-white backdrop-blur-xs">
                            {book.readTime}
                          </span>
                        </div>

                        {/* Want to Read button */}
                        <button
                          id={`curated-want-btn-${sec.id}-${book.id}`}
                          onClick={(e) => onToggleWantToRead(book.id, e)}
                          className={`absolute top-1.5 left-1.5 p-1.5 rounded-full backdrop-blur-md transition-transform active:scale-75 ${
                            book.isWantToRead
                              ? 'bg-amber-500 text-white shadow-sm'
                              : 'bg-black/40 text-white/80 hover:text-white'
                          }`}
                          title={book.isWantToRead ? 'در لیست مطالعه شما قرار دارد' : 'افزودن به کتاب‌هایی که باید بخوانید'}
                        >
                          <Bookmark className="w-3.5 h-3.5" fill={book.isWantToRead ? 'currentColor' : 'none'} />
                        </button>

                        <div className="absolute bottom-1.5 right-1.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-blue-600/90 text-white backdrop-blur-xs">
                            {book.category}
                          </span>
                        </div>
                      </div>

                      {/* Title & Author */}
                      <h4 className="font-bold text-xs sm:text-sm line-clamp-1 group-hover:text-blue-600 transition-colors text-neutral-900 dark:text-neutral-100">
                        {book.title}
                      </h4>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                        {book.author}
                      </p>
                    </div>

                    {/* Bottom Metadata & Actions */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-neutral-700/60 flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1 text-amber-500 font-semibold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{book.rating}</span>
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenReader(book);
                        }}
                        className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-0.5 hover:underline"
                      >
                        <span>مطالعه</span>
                        <ChevronLeft className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty state for want-to-read */
              <div className={`p-4 rounded-2xl border border-dashed text-center space-y-1.5 ${
                isDarkMode ? 'border-neutral-700 bg-neutral-800/30' : 'border-slate-300 bg-slate-50/50'
              }`}>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {sec.emptyMessage}
                </p>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};
