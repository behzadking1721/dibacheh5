import React, { useState } from 'react';
import { Book } from '../types';
import { X, CheckCircle, CreditCard, ShieldCheck, Tag } from 'lucide-react';

interface PurchaseModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPurchase: (book: Book) => void;
  isDarkMode: boolean;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  book,
  isOpen,
  onClose,
  onConfirmPurchase,
  isDarkMode,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !book) return null;

  const handleApplyCoupon = () => {
    if (couponCode.trim().toLowerCase() === 'takhfif' || couponCode.trim() === 'تخفیف' || couponCode.trim() === '100') {
      setDiscountPercent(100);
    } else if (couponCode.trim()) {
      setDiscountPercent(30);
    }
  };

  const finalPrice = Math.max(0, Math.round(book.price * (1 - discountPercent / 100)));

  const handlePurchase = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirmPurchase(book);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-md rounded-3xl shadow-2xl border p-6 overflow-hidden ${
          isDarkMode
            ? 'bg-neutral-900 border-neutral-800 text-white'
            : 'bg-white border-neutral-100 text-neutral-900'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <CreditCard className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold">تایید و خرید کتاب</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            دسترسی دائمی و نامحدود به متن کامل خلاصه و نکات کلیدی
          </p>
        </div>

        {/* Book summary item */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/50 dark:border-neutral-700/50 mb-4">
          <img
            src={book.cover}
            alt={book.title}
            className="w-14 h-18 object-cover rounded-xl shadow-xs"
          />
          <div className="flex-1 min-w-0 text-right">
            <h4 className="font-bold text-sm line-clamp-1">{book.title}</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {book.author}
            </p>
            <span className="inline-block mt-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
              {book.category}
            </span>
          </div>
        </div>

        {/* Coupon simulation */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
            کد تخفیف (کد آزمایشی: <span className="font-bold text-blue-600 cursor-pointer" onClick={() => setCouponCode('تخفیف')}>تخفیف</span>)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="مثال: تخفیف"
              className={`flex-1 text-xs px-3 py-2 rounded-xl border outline-none ${
                isDarkMode
                  ? 'bg-neutral-800 border-neutral-700 text-white'
                  : 'bg-neutral-100 border-neutral-200 text-neutral-800'
              }`}
            />
            <button
              onClick={handleApplyCoupon}
              className="px-3 py-2 text-xs rounded-xl bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 font-medium transition-colors"
            >
              اعمال کد
            </button>
          </div>
          {discountPercent > 0 && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>تخفیف {discountPercent}٪ با موفقیت اعمال شد!</span>
            </p>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-1.5 py-3 border-t border-b border-neutral-200/60 dark:border-neutral-800 text-xs mb-5">
          <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
            <span>قیمت اصلی:</span>
            <span>{book.price.toLocaleString('fa-IR')} تومان</span>
          </div>
          {discountPercent > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
              <span>تخفیف:</span>
              <span>- {(book.price - finalPrice).toLocaleString('fa-IR')} تومان</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-bold text-neutral-900 dark:text-white pt-1">
            <span>مبلغ نهایی قابل پرداخت:</span>
            <span className="text-blue-600 dark:text-blue-400">
              {finalPrice === 0 ? 'رایگان' : `${finalPrice.toLocaleString('fa-IR')} تومان`}
            </span>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500 mb-4">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>تراکنش آزمایشی امن با تحویل فوری</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            انصراف
          </button>
          <button
            id="confirm-purchase-button"
            disabled={isProcessing}
            onClick={handlePurchase}
            className="flex-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            {isProcessing ? (
              <span className="animate-spin text-sm">⏳</span>
            ) : (
              <>
                <Tag className="w-3.5 h-3.5" />
                <span>پرداخت و بازگشایی کتاب</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
