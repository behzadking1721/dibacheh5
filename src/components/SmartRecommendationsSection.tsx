import React, { useState, useMemo } from 'react';
import { Book, Highlight, Note } from '../types';
import {
  Sparkles,
  BookOpen,
  Bookmark,
  Star,
  ChevronLeft,
  RotateCcw,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  TrendingUp,
  Brain,
  Layers,
  Info
} from 'lucide-react';

interface SmartRecommendationsSectionProps {
  books: Book[];
  highlights?: Highlight[];
  notes?: Note[];
  onSelectBook: (book: Book) => void;
  onOpenReader: (book: Book) => void;
  onToggleWantToRead: (id: number, e: React.MouseEvent) => void;
  onToggleFavorite: (id: number, e: React.MouseEvent) => void;
  isDarkMode: boolean;
}

interface ScoredBook {
  book: Book;
  matchScore: number;
  matchPercent: number;
  reason: string;
  badgeType: 'affinity' | 'continue' | 'want_to_read' | 'top_rated' | 'editor';
}

export const SmartRecommendationsSection: React.FC<SmartRecommendationsSectionProps> = ({
  books,
  highlights = [],
  notes = [],
  onSelectBook,
  onOpenReader,
  onToggleWantToRead,
  onToggleFavorite,
  isDarkMode,
}) => {
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');
  const [shuffleSeed, setShuffleSeed] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Set of books that have notes or highlights
  const annotatedBookIds = useMemo(() => {
    const set = new Set<number>();
    highlights.forEach((h) => set.add(h.bookId));
    notes.forEach((n) => set.add(n.bookId));
    return set;
  }, [highlights, notes]);

  // 1. Calculate user category interest affinity profile
  const categoryProfile = useMemo(() => {
    const stats: Record<string, { score: number; count: number; read: number; inProgress: number; favorites: number }> = {};

    books.forEach((b) => {
      const cat = b.category || 'عمومی';
      if (!stats[cat]) {
        stats[cat] = { score: 0, count: 0, read: 0, inProgress: 0, favorites: 0 };
      }

      let bookEngagement = 0;
      if (b.isRead) {
        bookEngagement += 6;
        stats[cat].read += 1;
      }
      if ((b.progress || 0) > 0 && !b.isRead) {
        bookEngagement += 4.5;
        stats[cat].inProgress += 1;
      }
      if (b.isFavorite) {
        bookEngagement += 4;
        stats[cat].favorites += 1;
      }
      if (b.isWantToRead) {
        bookEngagement += 2.5;
      }
      if (b.isDownloaded) {
        bookEngagement += 2;
      }
      if (annotatedBookIds.has(b.id)) {
        bookEngagement += 3;
      }

      stats[cat].score += bookEngagement;
      if (bookEngagement > 0) {
        stats[cat].count += 1;
      }
    });

    const activeEntries = Object.entries(stats)
      .filter(([_, data]) => data.score > 0)
      .sort((a, b) => b[1].score - a[1].score);

    const totalScore = activeEntries.reduce((sum, [_, data]) => sum + data.score, 0);

    const sortedWithPercent = activeEntries.map(([cat, data]) => ({
      category: cat,
      score: data.score,
      percent: totalScore > 0 ? Math.round((data.score / totalScore) * 100) : 0,
      read: data.read,
      inProgress: data.inProgress,
      favorites: data.favorites,
    }));

    return {
      hasEngagementHistory: sortedWithPercent.length > 0,
      topCategories: sortedWithPercent,
      primaryCategory: sortedWithPercent[0]?.category || null,
      categoryScoreMap: new Map(sortedWithPercent.map((c) => [c.category, c])),
    };
  }, [books, annotatedBookIds]);

  // 2. Score and rank recommended books dynamically
  const scoredRecommendations = useMemo(() => {
    const list: ScoredBook[] = [];

    books.forEach((book) => {
      // Books currently in progress (highest priority to continue reading)
      if ((book.progress || 0) > 0 && !book.isRead) {
        const progressPercent = Math.round(book.progress * 100);
        list.push({
          book,
          matchScore: 100 + (book.progress * 10),
          matchPercent: 99,
          reason: `در حال مطالعه (${progressPercent}٪ خوانده شده) - ادامه دهید`,
          badgeType: 'continue',
        });
        return;
      }

      // Books in want-to-read list (user explicitly expressed interest)
      if (book.isWantToRead && !book.isRead) {
        const catAffinity = categoryProfile.categoryScoreMap.get(book.category)?.percent || 15;
        const matchPct = Math.min(98, 85 + Math.round(catAffinity * 0.25) + (book.rating > 4.6 ? 4 : 0));
        list.push({
          book,
          matchScore: 85 + catAffinity + (book.rating * 3),
          matchPercent: matchPct,
          reason: `در قفسه «باید بخوانم» با امتیاز ${book.rating}`,
          badgeType: 'want_to_read',
        });
        return;
      }

      // If already completely read, lower recommendation priority unless user has very few books
      if (book.isRead) {
        return;
      }

      const categoryData = categoryProfile.categoryScoreMap.get(book.category);
      if (categoryData && categoryData.score > 0) {
        // High Category Affinity
        const basePercent = Math.min(97, 75 + Math.round(categoryData.percent * 0.35) + (book.isEditorChoice ? 5 : 0) + (book.isTrending ? 4 : 0));
        list.push({
          book,
          matchScore: 60 + (categoryData.score * 3) + (book.rating * 5) + (book.isEditorChoice ? 10 : 0),
          matchPercent: basePercent,
          reason: `بر اساس علاقه ${categoryData.percent}٪ شما به دسته‌بندی «${book.category}»`,
          badgeType: 'affinity',
        });
      } else {
        // Cold start or broad recommendations
        if (book.rating >= 4.7 || book.isEditorChoice || book.isTrending) {
          const matchPct = Math.min(94, 80 + Math.round((book.rating - 4.5) * 40));
          list.push({
            book,
            matchScore: 30 + (book.rating * 6) + (book.isEditorChoice ? 8 : 0),
            matchPercent: matchPct,
            reason: book.isEditorChoice
              ? `برگزیده سردبیر در موضوع پرطرفدار ${book.category}`
              : `امتیاز درخشان کاربران (${book.rating} از ۵)`,
            badgeType: book.isEditorChoice ? 'editor' : 'top_rated',
          });
        }
      }
    });

    // Sort by matchScore descending
    const sorted = [...list].sort((a, b) => b.matchScore - a.matchScore);

    // Apply shuffle seed rotation if user requested refresh
    if (shuffleSeed > 0 && sorted.length > 3) {
      const offset = shuffleSeed % Math.min(sorted.length, 5);
      const head = sorted.slice(offset);
      const tail = sorted.slice(0, offset);
      return [...head, ...tail];
    }

    return sorted;
  }, [books, categoryProfile, shuffleSeed]);

  // Filter by user selected category chip if not 'all'
  const filteredRecommendations = useMemo(() => {
    if (selectedFilterCategory === 'all') {
      return scoredRecommendations;
    }
    return scoredRecommendations.filter((item) => item.book.category === selectedFilterCategory);
  }, [scoredRecommendations, selectedFilterCategory]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setShuffleSeed((prev) => prev + 1);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 450);
  };

  return (
    <section
      id="smart-recommendations-section"
      className="space-y-3.5 mb-6"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="p-1.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xs">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <h2 className="font-extrabold text-base sm:text-lg text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <span>پیشنهاد ویژه برای شما</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                <Brain className="w-3 h-3" />
                <span>هوشمند</span>
              </span>
            </h2>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 pr-8">
            {categoryProfile.hasEngagementHistory
              ? `شخصی‌سازی شده بر اساس مطالعه و بیشترین علاقه شما به «${categoryProfile.topCategories.slice(0, 2).map((c) => c.category).join(' و ')}»`
              : 'پیشنهادهای هوشمند اولیه بر اساس علایق و برترین امتیازهای خوانندگان'}
          </p>
        </div>

        {/* Controls: Refresh & Info */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
          <button
            id="smart-refresh-btn"
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95 shadow-2xs"
            title="بروزرسانی و چرخش پیشنهادهای هوشمند"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
            <span>بروزرسانی هوشمند</span>
          </button>

          <button
            type="button"
            onClick={() => setShowExplanation(!showExplanation)}
            className={`p-1.5 rounded-xl border transition-all text-xs ${
              showExplanation
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-neutral-200 dark:border-neutral-700 hover:bg-black/5 dark:hover:bg-white/10 text-neutral-500'
            }`}
            title="چگونه کار می‌کند؟"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Explanation Banner (Collapsible) */}
      {showExplanation && (
        <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/60 text-xs text-indigo-950 dark:text-indigo-200 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>موتور هوشمند پیشنهاد کتاب چگونه کار می‌کند؟</span>
            </span>
            <button
              onClick={() => setShowExplanation(false)}
              className="text-indigo-600 dark:text-indigo-400 hover:opacity-75 text-xs font-semibold"
            >
              بستن
            </button>
          </div>
          <p className="leading-relaxed text-[11px] opacity-90">
            این سیستم با تحلیل زنده کتاب‌های خوانده‌شده، درصد پیشرفت مطالعه، نشان‌شده‌ها، نشانه‌گذاری‌ها و یادداشت‌های شما،
            ضریب علاقه دسته‌بندی‌ها را محاسبه می‌کند و در هر لحظه مناسب‌ترین گزینه‌ها را همراه با دلیل پیشنهاد در بالای صفحه قرار می‌دهد.
          </p>
          {categoryProfile.hasEngagementHistory && (
            <div className="pt-2 border-t border-indigo-200/50 dark:border-indigo-800/40 flex flex-wrap items-center gap-2 text-[11px]">
              <span className="font-bold">توزیع علایق فعلی شما:</span>
              {categoryProfile.topCategories.map((c) => (
                <span
                  key={c.category}
                  className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 font-semibold"
                >
                  {c.category}: {c.percent}٪
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Category Affinity Chips Filter */}
      {categoryProfile.topCategories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 px-0.5">
          <button
            type="button"
            onClick={() => setSelectedFilterCategory('all')}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              selectedFilterCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-600/30'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            همه علایق شما ({categoryProfile.topCategories.length} موضوع)
          </button>

          {categoryProfile.topCategories.map((cat) => (
            <button
              key={cat.category}
              type="button"
              onClick={() => setSelectedFilterCategory(cat.category)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                selectedFilterCategory === cat.category
                  ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-600/30'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              <span>{cat.category}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                selectedFilterCategory === cat.category
                  ? 'bg-white/20 text-white'
                  : 'bg-black/5 dark:bg-white/10 text-neutral-500 dark:text-neutral-400'
              }`}>
                {cat.percent}٪
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Horizontal Carousel of Recommended Books */}
      <div className="flex items-stretch gap-3.5 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth">
        {filteredRecommendations.slice(0, 8).map(({ book, matchPercent, reason, badgeType }) => {
          const isReadingNow = (book.progress || 0) > 0 && !book.isRead;

          return (
            <div
              key={book.id}
              id={`smart-rec-card-${book.id}`}
              onClick={() => onSelectBook(book)}
              className={`shrink-0 w-48 sm:w-52 rounded-2xl p-3 border transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-xl active:scale-[0.98] group relative ${
                isDarkMode
                  ? 'bg-neutral-800/90 border-neutral-700/80 hover:border-indigo-500/60'
                  : 'bg-white border-slate-200/90 hover:border-indigo-400 shadow-xs'
              }`}
            >
              <div>
                {/* Book Cover with Top Match Badge */}
                <div className="relative w-full h-48 sm:h-52 rounded-xl overflow-hidden shadow-xs mb-2.5 bg-neutral-200 dark:bg-neutral-700">
                  <img
                    src={book.cover}
                    alt={book.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Dynamic Match Score Badge */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 items-start">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md flex items-center gap-1 backdrop-blur-xs">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>{matchPercent}٪ تطابق</span>
                    </span>

                    {isReadingNow && (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-blue-600 text-white shadow-xs">
                        در حال مطالعه
                      </span>
                    )}
                  </div>

                  {/* Bookmark Button */}
                  <button
                    id={`smart-rec-want-btn-${book.id}`}
                    type="button"
                    onClick={(e) => onToggleWantToRead(book.id, e)}
                    className={`absolute top-2 left-2 p-1.5 rounded-full backdrop-blur-md transition-transform active:scale-75 shadow-xs ${
                      book.isWantToRead
                        ? 'bg-amber-500 text-white ring-2 ring-amber-300'
                        : 'bg-black/50 text-white/90 hover:text-white hover:bg-black/70'
                    }`}
                    title={book.isWantToRead ? 'در لیست مطالعه شما قرار دارد' : 'افزودن به لیست باید بخوانم'}
                  >
                    <Bookmark className="w-3.5 h-3.5" fill={book.isWantToRead ? 'currentColor' : 'none'} />
                  </button>

                  {/* Category Pill at bottom of image */}
                  <div className="absolute bottom-2 right-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/65 text-white backdrop-blur-xs">
                      {book.category}
                    </span>
                  </div>

                  {/* Progress Line (if active reading) */}
                  {isReadingNow && (
                    <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black/40">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${Math.round(book.progress * 100)}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Match Reason Tag */}
                <div className="mb-1.5">
                  <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md line-clamp-1 border border-indigo-100 dark:border-indigo-900/50">
                    {reason}
                  </span>
                </div>

                {/* Title & Author */}
                <h4 className="font-bold text-xs sm:text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors text-neutral-900 dark:text-neutral-100">
                  {book.title}
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                  {book.author}
                </p>
              </div>

              {/* Bottom Metadata & Fast Actions */}
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-neutral-700/60 flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{book.rating}</span>
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenReader(book);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 font-bold flex items-center gap-1 transition-colors text-xs"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>{isReadingNow ? 'ادامه' : 'مطالعه'}</span>
                  <ChevronLeft className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
