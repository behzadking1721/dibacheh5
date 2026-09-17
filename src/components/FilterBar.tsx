import React from 'react';
import { Search, X, SlidersHorizontal, Clock, ArrowUpDown, HardDriveDownload, Bookmark } from 'lucide-react';
import { TabType, SortOption } from '../types';

interface FilterBarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCommitSearch: (query: string) => void;
  recentSearches: string[];
  onSelectRecentSearch: (query: string) => void;
  onClearRecentSearches: () => void;
  showFilterPanel: boolean;
  onToggleFilterPanel: () => void;
  minRating: number;
  onSelectMinRating: (rating: number) => void;
  yearFrom: number;
  onYearFromChange: (year: number) => void;
  yearTo: number;
  onYearToChange: (year: number) => void;
  onClearAllFilters: () => void;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  sortBy: SortOption;
  onToggleSort: () => void;
  totalFiltered: number;
  totalFavorites: number;
  totalRead: number;
  totalDownloaded: number;
  totalWantToRead?: number;
  totalNotesAndHighlights?: number;
  isDarkMode: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  onCommitSearch,
  recentSearches,
  onSelectRecentSearch,
  onClearRecentSearches,
  showFilterPanel,
  onToggleFilterPanel,
  minRating,
  onSelectMinRating,
  yearFrom,
  onYearFromChange,
  yearTo,
  onYearToChange,
  onClearAllFilters,
  categories,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onToggleSort,
  totalFiltered,
  totalFavorites,
  totalRead,
  totalDownloaded,
  totalWantToRead = 0,
  totalNotesAndHighlights = 0,
  isDarkMode,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-3">
      {/* Tab Navigation */}
      <nav aria-label="بخش‌های کتابخانه" className="flex items-center gap-1.5 px-3 py-1.5 overflow-x-auto no-scrollbar">
        <button
          id="tab-home"
          onClick={() => onSelectTab('home')}
          className={`shrink-0 flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
            currentTab === 'home'
              ? 'bg-blue-600 text-white shadow-xs font-bold'
              : isDarkMode
              ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              : 'bg-white text-neutral-600 hover:bg-neutral-100 shadow-2xs'
          }`}
        >
          <span>🏠</span>
          <span>همه</span>
        </button>

        {/* Want to Read Tab (موضوع کتاب‌هایی که باید خوانده شود) */}
        <button
          id="tab-want-to-read"
          onClick={() => onSelectTab('wantToRead')}
          className={`shrink-0 flex items-center justify-center gap-1 py-2 px-3.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
            currentTab === 'wantToRead'
              ? 'bg-amber-500 text-white shadow-xs font-bold'
              : isDarkMode
              ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              : 'bg-white text-neutral-600 hover:bg-neutral-100 shadow-2xs'
          }`}
          title="کتاب‌هایی که در نوبت مطالعه قرار داده‌اید"
        >
          <span>🎯</span>
          <span>باید بخوانم</span>
          {totalWantToRead > 0 && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              currentTab === 'wantToRead' ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            }`}>
              {totalWantToRead}
            </span>
          )}
        </button>

        <button
          id="tab-offline"
          onClick={() => onSelectTab('offline')}
          className={`shrink-0 flex items-center justify-center gap-1 py-2 px-3.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
            currentTab === 'offline'
              ? 'bg-purple-600 text-white shadow-xs font-bold'
              : isDarkMode
              ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              : 'bg-white text-neutral-600 hover:bg-neutral-100 shadow-2xs'
          }`}
          title="کتاب‌های ذخیره شده برای استفاده بدون اینترنت"
        >
          <span>📥</span>
          <span>آفلاین</span>
          {totalDownloaded > 0 && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              currentTab === 'offline' ? 'bg-white/25 text-white' : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
            }`}>
              {totalDownloaded}
            </span>
          )}
        </button>

        <button
          id="tab-favorites"
          onClick={() => onSelectTab('favorites')}
          className={`shrink-0 flex items-center justify-center gap-1 py-2 px-3.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
            currentTab === 'favorites'
              ? 'bg-rose-600 text-white shadow-xs font-bold'
              : isDarkMode
              ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              : 'bg-white text-neutral-600 hover:bg-neutral-100 shadow-2xs'
          }`}
        >
          <span>❤️</span>
          <span>علاقه‌مندی</span>
          {totalFavorites > 0 && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              currentTab === 'favorites' ? 'bg-white/25 text-white' : 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300'
            }`}>
              {totalFavorites}
            </span>
          )}
        </button>

        <button
          id="tab-read"
          onClick={() => onSelectTab('read')}
          className={`shrink-0 flex items-center justify-center gap-1 py-2 px-3.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
            currentTab === 'read'
              ? 'bg-emerald-600 text-white shadow-xs font-bold'
              : isDarkMode
              ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              : 'bg-white text-neutral-600 hover:bg-neutral-100 shadow-2xs'
          }`}
        >
          <span>✅</span>
          <span>خوانده‌شده</span>
          {totalRead > 0 && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              currentTab === 'read' ? 'bg-white/25 text-white' : 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
            }`}>
              {totalRead}
            </span>
          )}
        </button>

        <button
          id="tab-notes"
          onClick={() => onSelectTab('notes')}
          className={`shrink-0 flex items-center justify-center gap-1 py-2 px-3.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
            currentTab === 'notes'
              ? 'bg-indigo-600 text-white shadow-xs font-bold'
              : isDarkMode
              ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              : 'bg-white text-neutral-600 hover:bg-neutral-100 shadow-2xs'
          }`}
        >
          <span>✍️</span>
          <span>یادداشت‌ها</span>
          {totalNotesAndHighlights > 0 && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              currentTab === 'notes' ? 'bg-white/25 text-white' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
            }`}>
              {totalNotesAndHighlights}
            </span>
          )}
        </button>
      </nav>

      {/* Search and Filter Toggle */}
      <div className="flex items-center gap-2 px-3">
        <div
          className={`flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-full border shadow-2xs transition-all ${
            isDarkMode
              ? 'bg-neutral-800 border-neutral-700 text-white focus-within:border-blue-500'
              : 'bg-white border-slate-200 text-neutral-800 focus-within:border-blue-500'
          }`}
        >
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            id="book-search-input"
            type="text"
            className="w-full bg-transparent border-none outline-none text-xs sm:text-sm placeholder-neutral-400"
            placeholder="جستجو در کتاب‌ها، نویسندگان، دسته‌ها..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onCommitSearch(searchQuery);
              }
            }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="text-neutral-400 hover:text-neutral-600 p-0.5 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          id="filter-panel-toggle-button"
          onClick={onToggleFilterPanel}
          className={`p-2.5 rounded-full border shadow-2xs transition-all ${
            showFilterPanel
              ? 'bg-blue-600 border-blue-600 text-white'
              : isDarkMode
              ? 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
              : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-100'
          }`}
          title="فیلترهای پیشرفته"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Recent Searches Chips */}
      {recentSearches.length > 0 && !searchQuery && (
        <div className="flex items-center gap-2 px-3 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-neutral-400 shrink-0 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>جستجوهای اخیر:</span>
          </span>
          {recentSearches.map((term, index) => (
            <button
              key={index}
              onClick={() => {
                onSearchChange(term);
                onSelectRecentSearch(term);
              }}
              className={`shrink-0 px-2.5 py-1 rounded-full border transition-all ${
                isDarkMode
                  ? 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              {term}
            </button>
          ))}
          <button
            onClick={onClearRecentSearches}
            className="shrink-0 text-red-500 hover:text-red-600 px-2 py-1 font-medium"
          >
            پاک کردن
          </button>
        </div>
      )}

      {/* Filter Panel (Collapsible) */}
      {showFilterPanel && (
        <div
          className={`mx-3 p-4 rounded-2xl border shadow-sm space-y-3.5 transition-all ${
            isDarkMode
              ? 'bg-neutral-800/90 border-neutral-700 text-white'
              : 'bg-white border-neutral-200 text-neutral-800'
          }`}
        >
          {/* Min Rating */}
          <div>
            <span className="block text-xs font-semibold mb-2">حداقل امتیاز:</span>
            <div className="flex flex-wrap gap-1.5">
              {[0, 3, 3.5, 4, 4.5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => onSelectMinRating(rating)}
                  className={`px-3 py-1 text-xs rounded-full border transition-all ${
                    minRating === rating
                      ? 'bg-blue-600 border-blue-600 text-white font-medium'
                      : isDarkMode
                      ? 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
                      : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {rating === 0 ? 'همه' : `⭐ ${rating}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Year Range */}
          <div>
            <span className="block text-xs font-semibold mb-2">بازه سال انتشار (میلادی):</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={yearFrom}
                onChange={(e) => onYearFromChange(Number(e.target.value) || 1900)}
                className={`w-24 text-center text-xs py-1.5 px-2 rounded-lg border outline-none ${
                  isDarkMode
                    ? 'bg-neutral-900 border-neutral-700 text-white'
                    : 'bg-neutral-100 border-neutral-200 text-neutral-800'
                }`}
                placeholder="از سال"
              />
              <span className="text-xs text-neutral-400">تا</span>
              <input
                type="number"
                value={yearTo}
                onChange={(e) => onYearToChange(Number(e.target.value) || currentYear)}
                className={`w-24 text-center text-xs py-1.5 px-2 rounded-lg border outline-none ${
                  isDarkMode
                    ? 'bg-neutral-900 border-neutral-700 text-white'
                    : 'bg-neutral-100 border-neutral-200 text-neutral-800'
                }`}
                placeholder="تا سال"
              />
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between border-t border-neutral-200/40 dark:border-neutral-700/60">
            <button
              onClick={onClearAllFilters}
              className="text-xs text-red-500 hover:text-red-600 font-medium py-1"
            >
              پاک کردن همه فیلترها
            </button>
            <button
              onClick={onToggleFilterPanel}
              className="text-xs text-blue-600 dark:text-blue-400 font-medium py-1"
            >
              بستن پنل فیلتر
            </button>
          </div>
        </div>
      )}

      {/* Categories & Sorting Row */}
      <div className="flex items-center justify-between gap-2 px-3">
        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar flex-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : isDarkMode
                  ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200/80 shadow-2xs'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sort Button */}
        <button
          id="sort-by-toggle-button"
          onClick={onToggleSort}
          className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium border shadow-2xs transition-all ${
            isDarkMode
              ? 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
              : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-100'
          }`}
          title="تغییر نحوه مرتب‌سازی"
        >
          <ArrowUpDown className="w-3 h-3 text-neutral-400" />
          <span>
            {sortBy === 'title' ? 'نام' : sortBy === 'rating' ? 'امتیاز' : 'سال'}
          </span>
        </button>
      </div>

      {/* Stats Counter Bar */}
      <div className="px-4 py-1 text-center">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {totalFiltered} کتاب &nbsp;|&nbsp; {totalWantToRead} در نوبت مطالعه &nbsp;|&nbsp; {totalDownloaded} آفلاین &nbsp;|&nbsp; {totalFavorites} نشان‌شده &nbsp;|&nbsp; {totalRead} خوانده‌شده
        </p>
      </div>
    </div>
  );
};
