import { AdItem } from '../types';

export const initialAds: AdItem[] = [
  {
    id: 'ad-1',
    title: 'کامل‌ترین دوره صوتی مدیریت زمان و تمرکز عمیق',
    description: 'یاد بگیرید چگونه در دنیای پر از حواس‌پرتی، کارهای ۴ روز را در ۱ روز با کیفیت بالا انجام دهید.',
    ctaText: 'مشاهده دوره با تخفیف ۵۰٪',
    ctaLink: 'https://example.com/course',
    sponsorName: 'آکادمی رشد و تحول فردی',
    badge: 'اسپانسر ویژه',
    bgColor: 'from-blue-600 to-indigo-700',
    active: true,
  },
  {
    id: 'ad-2',
    title: 'کتابخوان الکترونیک با جوهر الکترونیک ضد خستگی چشم',
    description: 'تجربه مطالعه طبیعی با صفحه بدون نور آبی و ماندگاری شارژ تا یک ماه کامل.',
    ctaText: 'دریافت کد تخفیف اختصاصی',
    ctaLink: 'https://example.com/ereader',
    sponsorName: 'دیجی‌ریدر ایران',
    badge: 'پیشنهاد ویژه کتاب‌خوان‌ها',
    bgColor: 'from-emerald-600 to-teal-700',
    active: true,
  },
  {
    id: 'ad-3',
    title: 'نرم‌افزار مدیریت کارهای روزانه و عادات ماندگار',
    description: 'برنامه‌ریزی هوشمند، ردیابی اهداف سالانه و ساخت عادات با همراهی هوش مصنوعی.',
    ctaText: 'دانلود و نصب رایگان',
    ctaLink: 'https://example.com/habit-app',
    sponsorName: 'اپلیکیشن تسک‌میت',
    badge: 'تبلیغ منتخب',
    bgColor: 'from-purple-600 to-violet-700',
    active: true,
  },
];
