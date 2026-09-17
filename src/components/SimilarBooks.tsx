import React from 'react';
import { Book } from '../types';
import { Sparkles, Star, Clock, ChevronLeft, Bookmark } from 'lucide-react';

interface SimilarBooksProps {
  currentBook: Book;
  allBooks: Book[];
  onSelectBook: (book: Book) => void;
  onToggleWantToRead?: (id: number, e: React.MouseEvent) => void;
  isDarkMode: boolean;
  title?: string;
  subtitle?: string;
}

export const SimilarBooks: React.FC<SimilarBooksProps> = ({
  currentBook,
  allBooks,
  onSelectBook,
  onToggleWantToRead,
  isDarkMode,
  title = 'کتاب‌های مشابه و پیشنهادی',
  subtitle = 'خوانندگانی که این کتاب را خوانده‌اند، این آثار را هم پیشنهاد کرده‌اند',
}) => {
  // Find books in the same category first, then supplement with top rated
  const similarBooks = React.useMemo(() => {
    const sameCategory = allBooks.filter(
      (b) => b.id !== currentBook.id && b.category === currentBook.category
    );
    const others = allBooks.filter(
      (b) => b.id !== currentBook.id && b.category !== currentBook.category
    );

    const merged = [...sameCategory, ...others].slice(0, 4);
    return merged;
  }, [allBooks, currentBook]);

  if (similarBooks.length === 0) return null;

  return (
    <div className="pt-5 border-t border-slate-200/80 dark:border-neutral-800 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm sm:text-base font-bold flex items-center gap-1.5 text-neutral-900 dark:text-neutral-100">
            <Sparkles className="w-4 h-4 text-blue-500 fill-blue-500" />
            <span>{title}</span>
          </h4>
          <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {similarBooks.map((book) => (
          <div
            key={book.id}
            onClick={() => onSelectBook(book)}
            className={`group relative rounded-xl p-2.5 border transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-md active:scale-[0.98] ${
              isDarkMode
                ? 'bg-neutral-800/80 border-neutral-700/60 hover:border-neutral-600'
                : 'bg-white border-slate-200/70 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div>
              {/* Cover */}
              <div className="relative w-full h-28 sm:h-34 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-700 mb-2 shadow-2xs">
                <img
                  src={book.cover}
                  alt={book.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-black/60 text-white backdrop-blur-xs">
                  {book.readTime}
                </span>

                {onToggleWantToRead && (
                  <button
                    onClick={(e) => onToggleWantToRead(book.id, e)}
                    className={`absolute top-1 left-1 p-1 rounded-full backdrop-blur-xs transition-colors ${
                      book.isWantToRead
                        ? 'bg-amber-500 text-white'
                        : 'bg-black/40 text-white/80 hover:text-white'
                    }`}
                    title={book.isWantToRead ? 'در لیست مطالعه' : 'افزودن به لیست مطالعه آینده'}
                  >
                    <Bookmark className="w-3 h-3" fill={book.isWantToRead ? 'currentColor' : 'none'} />
                  </button>
                )}
              </div>

              {/* Title & Author */}
              <h5 className="font-bold text-xs line-clamp-1 group-hover:text-blue-600 transition-colors text-neutral-900 dark:text-neutral-100">
                {book.title}
              </h5>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                {book.author}
              </p>
            </div>

            {/* Bottom info */}
            <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-neutral-700/50 flex items-center justify-between text-[10px]">
              <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                <span>{book.rating}</span>
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-0.5 group-hover:translate-x-[-2px] transition-transform">
                <span>مطالعه</span>
                <ChevronLeft className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
