import React from 'react';
import { X, Sparkles, Headphones, Megaphone, Smartphone, HelpCircle, Bell, Share2 } from 'lucide-react';

interface SuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const SuggestionsModal: React.FC<SuggestionsModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  const suggestions = [
    {
      icon: <Headphones className="w-5 h-5 text-indigo-500" />,
      title: '۱. تولید خلاصه صوتی هوشمند (Audio Summaries & AI TTS)',
      desc: 'بیش از ۷۰٪ کاربران در حال پیاده‌روی، رانندگی یا ورزش به خلاصه‌ها گوش می‌دهند. می‌توان با استفاده از تبدیل متن به گفتار روان هوش مصنوعی یا ضبط صدای گویندگان، برای هر کتاب پلیر صوتی با قابلیت کنترل سرعت (۱.۲x، ۱.۵x) و تایمر خواب قرار داد.'
    },
    {
      icon: <Megaphone className="w-5 h-5 text-amber-500" />,
      title: '۲. شبکه تبلیغات پاداشی (Rewarded Ads & AdMob / Tapsell)',
      desc: 'برای درآمدزایی بدون افت تجربه کاربری، می‌توانید سیستم تبلیغات ویدیویی جایزه‌دار (مثلاً مشاهده ۳۰ ثانیه ویدیو برای حذف بنرها تا ۲۴ ساعت یا دریافت سکه/XP گیمیفیکیشن) را با شبکه‌های تپسل، یکتانت یا گوگل ادموب متصل کنید.'
    },
    {
      icon: <HelpCircle className="w-5 h-5 text-emerald-500" />,
      title: '۳. کوییز و آزمون ۳ سوالی تثبیت یادگیری پس از مطالعه',
      desc: 'اضافه کردن ۳ سوال چندگزینه‌ای کوتاه در انتهای هر خلاصه که آموخته‌های کلیدی کتاب را در ذهن کاربر تثبیت کند و با پاسخ درست، نشان و امتیاز تعلق گیرد. این کار ماندگاری کاربر (Retention) را دوچندان می‌کند.'
    },
    {
      icon: <Bell className="w-5 h-5 text-purple-500" />,
      title: '۴. اعلان‌های وب و پوش نوتیفیکیشن PWA (Push Notifications)',
      desc: 'با فعال‌سازی Push Notification در PWA، می‌توانید هر روز ساعت ۸ صبح نوتیفیکیشن یادآوری مطالعه ۱۵ دقیقه‌ای و معرفی کتاب روز را به گوشی کاربران بفرستید، حتی وقتی برنامه بسته است.'
    },
    {
      icon: <Share2 className="w-5 h-5 text-rose-500" />,
      title: '۵. کارت تصویری نقل‌قول روز (Quote Card Generator)',
      desc: 'امکان ذخیره هایلایت‌ها و جملات قصار کتاب‌ها در قالب یک کارت گرافیکی باکیفیت و آماده برای استوری اینستاگرام و تلگرام به همراه لوگو و نام اپلیکیشن شما جهت جذب ارگانیک و ویروسی کاربر.'
    },
    {
      icon: <Smartphone className="w-5 h-5 text-blue-500" />,
      title: '۶. ساخت نسخه نیتیو با Capacitor یا React Native',
      desc: 'با ابزار Capacitor می‌توانید همین سورس‌کد PWA وب را بدون نیاز به بازنویسی، به صورت مستقیم به یک خروجی فایل APK اندروید و IPA آیفون تبدیل کرده و در کافه‌بازار، مایکت و گوگل‌پلی منتشر کنید.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-xl max-h-[85vh] flex flex-col rounded-3xl shadow-2xl border overflow-hidden ${
          isDarkMode
            ? 'bg-neutral-900 border-neutral-800 text-white'
            : 'bg-white border-neutral-100 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200/60 dark:border-neutral-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">پیشنهادات تخصصی برای آینده و توسعه این اپلیکیشن</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">نقشه راه و ایده‌های کلیدی برای ارتقای نسخه بعدی</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center text-neutral-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of suggestions */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {suggestions.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl border border-neutral-200/60 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 space-y-1.5"
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <h4 className="text-sm font-bold">{item.title}</h4>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed pr-7 text-justify">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200/60 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
          >
            بستن پنجره پیشنهادات
          </button>
        </div>
      </div>
    </div>
  );
};
