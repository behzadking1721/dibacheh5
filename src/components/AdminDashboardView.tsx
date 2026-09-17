import React, { useState } from 'react';
import { Book, AdItem } from '../types';
import {
  LayoutDashboard,
  PlusCircle,
  BookOpen,
  Megaphone,
  BarChart3,
  Trash2,
  Edit3,
  Star,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Upload,
  Save,
  X,
  Eye,
  Sparkles
} from 'lucide-react';

interface AdminDashboardViewProps {
  books: Book[];
  ads: AdItem[];
  onAddBook: (newBook: Book) => void;
  onUpdateBook: (updatedBook: Book) => void;
  onDeleteBook: (bookId: number) => void;
  onSetBookOfDay: (bookId: number) => void;
  onToggleAd: (adId: string) => void;
  onUpdateAd: (updatedAd: AdItem) => void;
  isDarkMode: boolean;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  books,
  ads,
  onAddBook,
  onUpdateBook,
  onDeleteBook,
  onSetBookOfDay,
  onToggleAd,
  onUpdateAd,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'books' | 'ads'>('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Form state for new/edit book
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'توسعه فردی',
    readTime: '۱۵ دقیقه',
    rating: 4.8,
    publishYear: 2023,
    summary: '',
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
    keyPoint1: '',
    keyPoint2: '',
    keyPoint3: '',
    chapter1Title: 'فصل ۱: مقدمه و چارچوب ذهنی',
    chapter1Content: 'محتوای خلاصه شده این فصل برای مطالعه روان...',
  });

  const totalDownloads = books.reduce((sum, b) => sum + (b.downloadsCount || 120), 0);
  const activeAdsCount = ads.filter((a) => a.active).length;

  const handleOpenAdd = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      category: 'توسعه فردی',
      readTime: '۱۵ دقیقه',
      rating: 4.9,
      publishYear: 2024,
      summary: '',
      cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
      keyPoint1: 'نکته کلیدی اول کتاب',
      keyPoint2: 'نکته کلیدی دوم کتاب',
      keyPoint3: 'نکته کلیدی سوم کتاب',
      chapter1Title: 'فصل اول: چارچوب اصلی',
      chapter1Content: 'خلاصه کاربردی این فصل به زبانی ساده...',
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (b: Book) => {
    setEditingBook(b);
    setFormData({
      title: b.title,
      author: b.author,
      category: b.category,
      readTime: b.readTime,
      rating: b.rating,
      publishYear: b.publishYear,
      summary: b.summary,
      cover: b.cover,
      keyPoint1: b.keyPoints[0] || '',
      keyPoint2: b.keyPoints[1] || '',
      keyPoint3: b.keyPoints[2] || '',
      chapter1Title: b.chapters?.[0]?.title || 'فصل ۱',
      chapter1Content: b.chapters?.[0]?.content || '',
    });
    setShowAddModal(true);
  };

  const handleSubmitBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author) return;

    if (editingBook) {
      const updated: Book = {
        ...editingBook,
        title: formData.title,
        author: formData.author,
        category: formData.category,
        readTime: formData.readTime,
        rating: formData.rating,
        publishYear: formData.publishYear,
        summary: formData.summary,
        cover: formData.cover,
        keyPoints: [formData.keyPoint1, formData.keyPoint2, formData.keyPoint3].filter(Boolean),
        chapters: [
          {
            id: 1,
            title: formData.chapter1Title,
            content: formData.chapter1Content,
          },
        ],
      };
      onUpdateBook(updated);
    } else {
      const newBook: Book = {
        id: Date.now(),
        title: formData.title,
        author: formData.author,
        category: formData.category,
        readTime: formData.readTime,
        rating: formData.rating,
        publishYear: formData.publishYear,
        isFavorite: false,
        isRead: false,
        isPurchased: true,
        isDownloaded: false,
        price: 0,
        progress: 0,
        cover: formData.cover,
        summary: formData.summary || 'خلاصه مختصر این کتاب به زودی افزوده می‌شود.',
        keyPoints: [formData.keyPoint1, formData.keyPoint2, formData.keyPoint3].filter(Boolean),
        chapters: [
          {
            id: 1,
            title: formData.chapter1Title || 'فصل ۱',
            content: formData.chapter1Content || 'متن کامل خلاصه فصل...',
          },
        ],
        downloadsCount: 0,
      };
      onAddBook(newBook);
    }

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 px-3 sm:px-4 py-2 pb-12">
      {/* Admin Nav & Header */}
      <div
        className={`p-5 rounded-3xl border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isDarkMode
            ? 'bg-neutral-850/90 border-neutral-700/80 text-white'
            : 'bg-white border-neutral-200/80 text-neutral-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black flex items-center gap-1.5">
              <span>پنل مدیریت خلاصه کده</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                Admin
              </span>
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              مدیریت عناوین کتاب‌ها، بنرهای تبلیغاتی اسپانسرها و پایش سئو
            </p>
          </div>
        </div>

        {/* Subtabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900'
            }`}
          >
            داشبورد کلی
          </button>
          <button
            onClick={() => setActiveTab('books')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === 'books'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900'
            }`}
          >
            کتاب‌ها ({books.length})
          </button>
          <button
            onClick={() => setActiveTab('ads')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === 'ads'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900'
            }`}
          >
            تبلیغات ({ads.length})
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div
              className={`p-4 rounded-2xl border ${
                isDarkMode ? 'bg-neutral-800/60 border-neutral-700/80' : 'bg-white border-neutral-200/80'
              }`}
            >
              <div className="flex items-center gap-2 text-blue-500 mb-1">
                <BookOpen className="w-4 h-4" />
                <span className="text-xs font-bold">کل کتاب‌ها</span>
              </div>
              <p className="text-2xl font-black">{books.length}</p>
              <p className="text-[10px] text-neutral-400">۱۰۰٪ رایگان و آماده مطالعه</p>
            </div>

            <div
              className={`p-4 rounded-2xl border ${
                isDarkMode ? 'bg-neutral-800/60 border-neutral-700/80' : 'bg-white border-neutral-200/80'
              }`}
            >
              <div className="flex items-center gap-2 text-emerald-500 mb-1">
                <BarChart3 className="w-4 h-4" />
                <span className="text-xs font-bold">تعداد کل دانلودها</span>
              </div>
              <p className="text-2xl font-black">{totalDownloads.toLocaleString('fa-IR')}</p>
              <p className="text-[10px] text-neutral-400">کش آفلاین در دستگاه کاربران</p>
            </div>

            <div
              className={`p-4 rounded-2xl border ${
                isDarkMode ? 'bg-neutral-800/60 border-neutral-700/80' : 'bg-white border-neutral-200/80'
              }`}
            >
              <div className="flex items-center gap-2 text-amber-500 mb-1">
                <Megaphone className="w-4 h-4" />
                <span className="text-xs font-bold">آگهی‌های فعال</span>
              </div>
              <p className="text-2xl font-black">{activeAdsCount}</p>
              <p className="text-[10px] text-neutral-400">جایگاه درآمدزایی از اسپانسر</p>
            </div>

            <div
              className={`p-4 rounded-2xl border ${
                isDarkMode ? 'bg-neutral-800/60 border-neutral-700/80' : 'bg-white border-neutral-200/80'
              }`}
            >
              <div className="flex items-center gap-2 text-purple-500 mb-1">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold">وضعیت سئو و PWA</span>
              </div>
              <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-1">
                استاندارد کامل
              </p>
              <p className="text-[10px] text-neutral-400">Schema.org + JSON-LD</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div
            className={`p-4 rounded-3xl border space-y-3 ${
              isDarkMode ? 'bg-neutral-850/80 border-neutral-700/80' : 'bg-white border-neutral-200/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold">اقدامات سریع مدیر</h4>
              <button
                onClick={handleOpenAdd}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>افزودن خلاصه کتاب جدید</span>
              </button>
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              تمامی محتواهای ثبت‌شده بلافاصله در دسترس تمام کاربران قرار گرفته و در صورت درخواست آن‌ها به صورت آفلاین در دستگاه کش می‌شود.
            </p>
          </div>
        </div>
      )}

      {/* BOOKS TAB */}
      {activeTab === 'books' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold">فهرست کل کتاب‌های ثبت‌شده</h4>
            <button
              onClick={handleOpenAdd}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>افزودن کتاب جدید</span>
            </button>
          </div>

          <div
            className={`rounded-3xl border overflow-hidden divide-y divide-neutral-100 dark:divide-neutral-800 ${
              isDarkMode ? 'bg-neutral-850/90 border-neutral-700/80' : 'bg-white border-neutral-200/80'
            }`}
          >
            {books.map((b) => (
              <div
                key={b.id}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={b.cover}
                    alt={b.title}
                    referrerPolicy="no-referrer"
                    className="w-10 h-14 rounded-lg object-cover shadow-xs shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs sm:text-sm font-bold truncate">{b.title}</h5>
                      {b.isBookOfDay && (
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold shrink-0">
                          کتاب روز ★
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-400 truncate">
                      {b.author} • {b.category} • زمان مطالعه: {b.readTime}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-neutral-500 mt-0.5">
                      <span>امتیاز: {b.rating}★</span>
                      <span>•</span>
                      <span>دانلودها: {b.downloadsCount || 120}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {!b.isBookOfDay && (
                    <button
                      onClick={() => onSetBookOfDay(b.id)}
                      className="px-2.5 py-1.5 rounded-xl border border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-[11px] font-semibold transition"
                      title="انتخاب به عنوان کتاب رایگان امروز"
                    >
                      تنظیم کتاب روز
                    </button>
                  )}
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-1.5 rounded-xl text-neutral-400 hover:text-blue-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                    title="ویرایش مشخصات"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`آیا از حذف کتاب «${b.title}» اطمینان دارید؟`)) {
                        onDeleteBook(b.id);
                      }
                    }}
                    className="p-1.5 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                    title="حذف کتاب"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADS MANAGEMENT TAB */}
      {activeTab === 'ads' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold">جایگاه‌های تبلیغاتی اسپانسرها</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                این آگهی‌ها در میان لیست کتاب‌ها و هدر صفحات به صورت بنر جذاب نمایش داده می‌شوند.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {ads.map((ad) => (
              <div
                key={ad.id}
                className={`p-4 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isDarkMode ? 'bg-neutral-850/90 border-neutral-700/80' : 'bg-white border-neutral-200/80'
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-black">
                      {ad.badge}
                    </span>
                    <span className="text-xs text-neutral-400">اسپانسر: {ad.sponsorName}</span>
                  </div>
                  <h5 className="text-sm font-bold">{ad.title}</h5>
                  <p className="text-xs text-neutral-500 leading-relaxed">{ad.description}</p>
                  <a
                    href={ad.ctaLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-blue-500 hover:underline block pt-1"
                  >
                    لینک هدف: {ad.ctaLink}
                  </a>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => onToggleAd(ad.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-bold transition"
                  >
                    {ad.active ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-emerald-600 dark:text-emerald-400">فعال در برنامه</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-neutral-400" />
                        <span className="text-neutral-400">غیرفعال</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
          <div
            className={`w-full max-w-xl my-6 rounded-3xl p-6 border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto ${
              isDarkMode
                ? 'bg-neutral-900 border-neutral-700 text-white'
                : 'bg-white border-neutral-200 text-neutral-900'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-neutral-200 dark:border-neutral-800">
              <h3 className="text-base font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <span>{editingBook ? 'ویرایش مشخصات کتاب' : 'افزودن کتاب جدید به سامانه'}</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitBook} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">عنوان کتاب</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                    placeholder="مثلاً: اثر مرکب"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">نویسنده</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                    placeholder="مثلاً: دارن هاردی"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold block mb-1">دسته‌بندی</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  >
                    <option value="توسعه فردی">توسعه فردی</option>
                    <option value="مدیریت و رهبری">مدیریت و رهبری</option>
                    <option value="مالی و سرمایه‌گذاری">مالی و سرمایه‌گذاری</option>
                    <option value="روانشناسی">روانشناسی</option>
                    <option value="بهره‌وری و عادت‌ها">بهره‌وری و عادت‌ها</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">زمان مطالعه</label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                    placeholder="۱۵ دقیقه"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">امتیاز (از ۵)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">آدرس تصویر جلد کتاب (URL)</label>
                <input
                  type="url"
                  value={formData.cover}
                  onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="font-bold block mb-1">خلاصه کوتاه معرفی کتاب</label>
                <textarea
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  placeholder="توضیح مختصر درباره ایده اصلی کتاب..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold block">۳ نکته طلایی و کلیدی کتاب</label>
                <input
                  type="text"
                  value={formData.keyPoint1}
                  onChange={(e) => setFormData({ ...formData, keyPoint1: e.target.value })}
                  className="w-full p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 mb-1"
                  placeholder="نکته طلایی اول"
                />
                <input
                  type="text"
                  value={formData.keyPoint2}
                  onChange={(e) => setFormData({ ...formData, keyPoint2: e.target.value })}
                  className="w-full p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 mb-1"
                  placeholder="نکته طلایی دوم"
                />
                <input
                  type="text"
                  value={formData.keyPoint3}
                  onChange={(e) => setFormData({ ...formData, keyPoint3: e.target.value })}
                  className="w-full p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  placeholder="نکته طلایی سوم"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">متن خلاصه فصل اول (برای ریدر)</label>
                <textarea
                  rows={4}
                  value={formData.chapter1Content}
                  onChange={(e) => setFormData({ ...formData, chapter1Content: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  placeholder="متن کامل فصل اول..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 font-semibold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingBook ? 'ذخیره تغییرات' : 'افزودن به کتابخانه'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
