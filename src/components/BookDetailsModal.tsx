import React, { useEffect, useState } from 'react';
import { Book, BookReview } from '../types';
import { SimilarBooks } from './SimilarBooks';
import { BookReviewsSection } from './BookReviewsSection';
import {
  X,
  Heart,
  CheckCircle2,
  Star,
  Clock,
  Calendar,
  Tag,
  BookOpen,
  Sparkles,
  HardDriveDownload,
  Share2,
  ListChecks,
  Info,
  Check,
  Award,
  Bookmark,
  MessageSquare
} from 'lucide-react';

interface BookDetailsModalProps {
  book: Book | null;
  allBooks: Book[];
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (id: number) => void;
  onToggleRead: (id: number) => void;
  onToggleWantToRead?: (id: number) => void;
  onToggleDownload: (id: number) => void;
  onOpenReader: (book: Book) => void;
  onSelectRelatedBook: (book: Book) => void;
  onAddReview?: (bookId: number, review: Omit<BookReview, 'id' | 'createdAt' | 'likesCount'>) => void;
  onLikeReview?: (reviewId: string) => void;
  isDarkMode: boolean;
}

export const BookDetailsModal: React.FC<BookDetailsModalProps> = ({
  book,
  allBooks,
  isOpen,
  onClose,
  onToggleFavorite,
  onToggleRead,
  onToggleWantToRead,
  onToggleDownload,
  onOpenReader,
  onSelectRelatedBook,
  onAddReview,
  onLikeReview,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'chapters' | 'reviews' | 'info'>('summary');
  const [copySuccess, setCopySuccess] = useState(false);

  // Dynamic SEO metadata injection for the specific book
  useEffect(() => {
    if (!isOpen || !book) return;

    const originalTitle = document.title;
    const originalDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';

    // Update document title for SEO
    document.title = `خلاصه کتاب ${book.title} اثر ${book.author} | خلاصه کده`;

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', `مطالعه آنلاین و دانلود آفلاین خلاصه کتاب ${book.title} نوشته ${book.author} در ${book.readTime}. ${book.summary.slice(0, 120)}...`);
    }

    // Inject Schema.org Book JSON-LD
    const scriptId = 'book-json-ld';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Book',
      'name': book.title,
      'author': {
        '@type': 'Person',
        'name': book.author,
      },
      'datePublished': book.publishYear.toString(),
      'genre': book.category,
      'description': book.summary,
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': book.rating.toString(),
        'bestRating': '5',
        'worstRating': '1',
        'ratingCount': (book.reviews?.length || 10).toString(),
      },
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'IRR',
        'availability': 'https://schema.org/InStock',
      },
    });

    return () => {
      document.title = originalTitle;
      if (metaDesc) metaDesc.setAttribute('content', originalDesc);
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    };
  }, [isOpen, book]);

  if (!isOpen || !book) return null;

  const handleShare = async () => {
    const shareUrl = window.location.origin + window.location.pathname + `#book-${book.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `خلاصه کتاب ${book.title}`,
          text: `خلاصه کتاب ${book.title} از ${book.author} را در خلاصه کده به رایگان بخوانید:`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    await navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl shadow-2xl border overflow-hidden ${
          isDarkMode
            ? 'bg-neutral-900 border-neutral-800 text-white'
            : 'bg-white border-neutral-100 text-neutral-900'
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200/60 dark:border-neutral-800 shrink-0">
          <button
            id="close-details-modal-btn"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5">
            {/* Want to Read button */}
            {onToggleWantToRead && (
              <button
                onClick={() => onToggleWantToRead(book.id)}
                className={`p-2 rounded-full transition-all flex items-center gap-1 text-xs font-bold ${
                  book.isWantToRead
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-amber-600'
                }`}
                title={book.isWantToRead ? 'حذف از لیست باید بخوانم' : 'افزودن به کتاب‌هایی که باید خوانده شود'}
              >
                <Bookmark className="w-4 h-4" fill={book.isWantToRead ? 'currentColor' : 'none'} />
                <span className="hidden sm:inline">
                  {book.isWantToRead ? 'در لیست مطالعه' : 'باید بخوانم'}
                </span>
              </button>
            )}

            {/* Download for offline button */}
            <button
              onClick={() => onToggleDownload(book.id)}
              className={`p-2 rounded-full transition-all flex items-center gap-1 text-xs font-bold ${
                book.isDownloaded
                  ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-purple-600'
              }`}
              title={book.isDownloaded ? 'حذف از حافظه آفلاین' : 'دانلود برای مطالعه آفلاین'}
            >
              <HardDriveDownload className="w-4 h-4" />
              <span className="hidden sm:inline">
                {book.isDownloaded ? 'آفلاین' : 'دانلود'}
              </span>
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-blue-500 transition relative"
              title="اشتراک‌گذاری لینک کتاب"
            >
              {copySuccess ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>

            {/* Favorite button */}
            <button
              onClick={() => onToggleFavorite(book.id)}
              className={`p-2 rounded-full transition-all ${
                book.isFavorite
                  ? 'bg-red-50 text-red-500 dark:bg-red-950/50'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-red-500'
              }`}
              title={book.isFavorite ? 'حذف از نشان‌شده‌ها' : 'افزودن به نشان‌شده‌ها'}
            >
              <Heart className="w-4 h-4" fill={book.isFavorite ? 'currentColor' : 'none'} />
            </button>

            {/* Read status button */}
            <button
              onClick={() => onToggleRead(book.id)}
              className={`p-2 rounded-full transition-all ${
                book.isRead
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-emerald-600'
              }`}
              title={book.isRead ? 'خوانده‌شده' : 'علامت به عنوان خوانده‌شده'}
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Share Copy Notification */}
        {copySuccess && (
          <div className="bg-emerald-500 text-white text-xs text-center py-1 font-bold animate-in fade-in">
            لینک اختصاصی صفحه کتاب کپی شد! می‌توانید آن را ارسال کنید.
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Top Hero Presentation */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-right">
            <div className="relative w-32 h-44 sm:w-36 sm:h-48 rounded-2xl overflow-hidden shadow-xl shrink-0 border border-neutral-200 dark:border-neutral-700">
              <img
                src={book.cover}
                alt={book.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {book.isBookOfDay && (
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-bold shadow-md">
                  کتاب روز ★
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-black">
                  ۱۰۰٪ رایگان و آزاد
                </span>
                {book.isWantToRead && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[11px] font-bold">
                    در لیست مطالعه شما
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black">{book.title}</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                نویسنده: <span className="font-bold text-neutral-800 dark:text-neutral-200">{book.author}</span>
              </p>

              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 font-medium">
                  <Tag className="w-3 h-3" />
                  {book.category}
                </span>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                  <Clock className="w-3 h-3" />
                  {book.readTime}
                </span>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {book.rating}
                </span>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                  <Calendar className="w-3 h-3" />
                  {book.publishYear}
                </span>
              </div>
            </div>
          </div>

          {/* Reading Progress Bar (if reading) */}
          {book.progress > 0 && (
            <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200/50 dark:border-neutral-700/50">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-semibold text-neutral-600 dark:text-neutral-300">
                  میزان پیشرفت مطالعه شما:
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {Math.round(book.progress * 100)}٪ خوانده شده
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${Math.round(book.progress * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 text-xs font-bold overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('summary')}
              className={`pb-1 transition border-b-2 flex items-center gap-1.5 shrink-0 ${
                activeTab === 'summary'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>خلاصه و نکات کلیدی</span>
            </button>
            <button
              onClick={() => setActiveTab('chapters')}
              className={`pb-1 transition border-b-2 flex items-center gap-1.5 shrink-0 ${
                activeTab === 'chapters'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <ListChecks className="w-3.5 h-3.5" />
              <span>سرفصل‌ها ({book.chapters?.length || 1})</span>
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-1 transition border-b-2 flex items-center gap-1.5 shrink-0 ${
                activeTab === 'reviews'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>نظرات کاربران ({book.reviews?.length || 0})</span>
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`pb-1 transition border-b-2 flex items-center gap-1.5 shrink-0 ${
                activeTab === 'info'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>شناسنامه و سئو</span>
            </button>
          </div>

          {/* TAB 1: SUMMARY & KEY POINTS */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold mb-2 flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                  <BookOpen className="w-4 h-4" />
                  <span>درباره این کتاب</span>
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 text-justify">
                  {book.summary}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold mb-2.5 flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                  <Sparkles className="w-4 h-4" />
                  <span>آموزه‌های کلیدی که در این کتاب می‌آموزید</span>
                </h4>
                <ul className="space-y-2">
                  {book.keyPoints.map((point, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-normal p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800"
                    >
                      <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: CHAPTERS LIST */}
          {activeTab === 'chapters' && (
            <div className="space-y-2.5">
              <h4 className="text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                فهرست بخش‌های خلاصه کتاب
              </h4>
              {(book.chapters && book.chapters.length > 0
                ? book.chapters
                : [
                    {
                      id: 1,
                      title: 'فصل اول: چارچوب و ایده مرکزی',
                      content: book.summary,
                    },
                  ]
              ).map((ch, idx) => (
                <div
                  key={ch.id || idx}
                  className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-bold truncate">{ch.title}</span>
                  </div>
                  <span className="text-[11px] text-neutral-400 shrink-0">خلاصه اختصاصی</span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: USER REVIEWS & RATINGS */}
          {activeTab === 'reviews' && (
            <BookReviewsSection
              bookId={book.id}
              bookTitle={book.title}
              reviews={book.reviews}
              onAddReview={(rev) => onAddReview && onAddReview(book.id, rev)}
              onLikeReview={(revId) => onLikeReview && onLikeReview(revId)}
              isDarkMode={isDarkMode}
            />
          )}

          {/* TAB 4: BOOK SPECIFICATIONS & SEO METRICS */}
          {activeTab === 'info' && (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 space-y-2">
                <h5 className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>اطلاعات شناسنامه‌ای اثر</span>
                </h5>
                <div className="grid grid-cols-2 gap-2 text-neutral-600 dark:text-neutral-300">
                  <div>
                    <span className="text-neutral-400">نام کتاب:</span> {book.title}
                  </div>
                  <div>
                    <span className="text-neutral-400">نویسنده:</span> {book.author}
                  </div>
                  <div>
                    <span className="text-neutral-400">دسته‌بندی:</span> {book.category}
                  </div>
                  <div>
                    <span className="text-neutral-400">سال انتشار اثر اصلی:</span> {book.publishYear}
                  </div>
                  <div>
                    <span className="text-neutral-400">زمان تخمینی مطالعه:</span> {book.readTime}
                  </div>
                  <div>
                    <span className="text-neutral-400">هزینه دسترسی:</span> رایگان (آزاد)
                  </div>
                </div>
              </div>

              {/* Dynamic SEO details */}
              <div className="p-3 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 text-neutral-600 dark:text-neutral-300 space-y-1">
                <span className="font-bold text-blue-700 dark:text-blue-300 block">
                  وضعیت سئو (Schema.org / Book & OpenGraph)
                </span>
                <p className="text-[11px] leading-relaxed">
                  صفحه دارای متاتگ‌های داینامیک عنوان، توضیحات، و اسکیما است و لینک اشتراک‌گذاری مستقیم این کتاب در شبکه‌های اجتماعی برای ایندکس کامل فعال است.
                </p>
              </div>
            </div>
          )}

          {/* SIMILAR BOOKS SECTION (پایین هر صفحه از کتاب) */}
          <SimilarBooks
            currentBook={book}
            allBooks={allBooks}
            onSelectBook={(selected) => onSelectRelatedBook(selected)}
            onToggleWantToRead={onToggleWantToRead ? (id, e) => { e.stopPropagation(); onToggleWantToRead(id); } : undefined}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-neutral-200/60 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/80 shrink-0 flex items-center gap-2">
          <button
            id="modal-primary-read-btn"
            onClick={() => onOpenReader(book)}
            className="flex-1 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
          >
            <BookOpen className="w-5 h-5" />
            <span>{book.progress > 0 ? 'ادامه مطالعه خلاصه' : 'شروع مطالعه رایگان'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
