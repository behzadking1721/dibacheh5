import React, { useState } from 'react';
import { BookReview } from '../types';
import { Star, MessageSquare, ThumbsUp, Send, CheckCircle2, User } from 'lucide-react';

interface BookReviewsSectionProps {
  bookId: number;
  bookTitle: string;
  reviews?: BookReview[];
  onAddReview: (review: Omit<BookReview, 'id' | 'createdAt' | 'likesCount'>) => void;
  onLikeReview: (reviewId: string) => void;
  isDarkMode: boolean;
}

export const BookReviewsSection: React.FC<BookReviewsSectionProps> = ({
  bookId,
  bookTitle,
  reviews = [],
  onAddReview,
  onLikeReview,
  isDarkMode,
}) => {
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '۵.۰';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    onAddReview({
      bookId,
      userName: authorName.trim() || 'کاربر خلاصه کده',
      rating: newRating,
      comment: commentText.trim(),
    });

    setCommentText('');
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setShowForm(false);
    }, 2000);
  };

  return (
    <div className="pt-6 border-t border-slate-200/80 dark:border-neutral-800 space-y-4">
      {/* Header and Average */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-base font-bold flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
            <MessageSquare className="w-4 h-4 text-amber-500" />
            <span>نظرات و دیدگاه‌های خوانندگان</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-normal">
              {reviews.length} دیدگاه
            </span>
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            تجربه خود را پس از خواندن این خلاصه با دیگران به اشتراک بگذارید
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all self-start sm:self-auto shadow-xs active:scale-95"
        >
          {showForm ? 'بستن فرم نظر' : 'ثبت نظر و امتیاز شما'}
        </button>
      </div>

      {/* Review submission form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className={`p-4 rounded-2xl border transition-all space-y-3 ${
            isDarkMode
              ? 'bg-neutral-800/80 border-neutral-700 text-white'
              : 'bg-slate-50 border-slate-200 text-neutral-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold">امتیاز شما به خلاصه «{bookTitle}»:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-amber-400 focus:outline-none transition-transform active:scale-125"
                >
                  <Star
                    className={`w-5 h-5 ${
                      (hoverRating || newRating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-neutral-300 dark:text-neutral-600'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-black mr-1 text-amber-600 dark:text-amber-400">
                {hoverRating || newRating} از ۵
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              type="text"
              placeholder="نام شما (اختیاری)"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className={`w-full px-3 py-2 text-xs rounded-xl border outline-none transition-all ${
                isDarkMode
                  ? 'bg-neutral-900 border-neutral-700 text-white focus:border-blue-500'
                  : 'bg-white border-slate-200 text-neutral-900 focus:border-blue-500'
              }`}
            />
          </div>

          <textarea
            required
            rows={3}
            placeholder="دیدگاه خود، نکته‌ای که یاد گرفتید یا تأثیر این کتاب بر زندگی‌تان را بنویسید..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className={`w-full px-3 py-2 text-xs rounded-xl border outline-none transition-all resize-none leading-relaxed ${
              isDarkMode
                ? 'bg-neutral-900 border-neutral-700 text-white focus:border-blue-500'
                : 'bg-white border-slate-200 text-neutral-900 focus:border-blue-500'
            }`}
          />

          <div className="flex items-center justify-between pt-1">
            {isSubmitted ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>دیدگاه شما با موفقیت ثبت شد و به نمایش درآمد.</span>
              </div>
            ) : <div />}

            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-4 py-2 rounded-xl bg-blue-600 disabled:opacity-50 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>ارسال دیدگاه</span>
            </button>
          </div>
        </form>
      )}

      {/* Reviews list */}
      <div className="space-y-2.5">
        {reviews.length > 0 ? (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                isDarkMode
                  ? 'bg-neutral-800/50 border-neutral-700/60'
                  : 'bg-white border-slate-200/70 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-bold">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
                      {rev.userName}
                    </span>
                    <span className="text-[10px] text-neutral-400 mr-2">
                      {rev.createdAt}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < rev.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-neutral-300 dark:text-neutral-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed pr-9 text-justify">
                {rev.comment}
              </p>

              <div className="mt-2 pr-9 flex items-center justify-end">
                <button
                  onClick={() => onLikeReview(rev.id)}
                  className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full transition-all ${
                    rev.isLiked
                      ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 font-bold'
                      : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                  title="مفید بود"
                >
                  <ThumbsUp className="w-3 h-3" fill={rev.isLiked ? 'currentColor' : 'none'} />
                  <span>{rev.likesCount || 0}</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-xs text-neutral-400">
            هنوز دیدگاهی برای این کتاب ثبت نشده است. شما اولین نفری باشید که نظر می‌دهد!
          </div>
        )}
      </div>
    </div>
  );
};
