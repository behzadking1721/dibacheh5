import React, { useState, useEffect, useMemo } from 'react';
import { initialBooks, categories, initialUserStats } from './data/sampleBooks';
import { initialAds } from './data/sampleAds';
import { Book, TabType, SortOption, Highlight, Note, UserStats, AdItem } from './types';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { BookCard } from './components/BookCard';
import { BookDetailsModal } from './components/BookDetailsModal';
import { ReaderModal } from './components/ReaderModal';
import { SuggestionsModal } from './components/SuggestionsModal';
import { BookOfDayBanner } from './components/BookOfDayBanner';
import { BookCuratedSections } from './components/BookCuratedSections';
import { GamificationBanner } from './components/GamificationBanner';
import { ChallengesModal } from './components/ChallengesModal';
import { NotesHighlightsView } from './components/NotesHighlightsView';
import { UserProfileView } from './components/UserProfileView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AdBanner } from './components/AdBanner';
import { OfflineIndicator } from './components/OfflineIndicator';
import { RotateCcw, BookOpen, HardDriveDownload, Sparkles } from 'lucide-react';

const Storage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Storage unavailable or quota exceeded
    }
  },
};

const initialSampleHighlights: Highlight[] = [
  {
    id: 'hl-1',
    bookId: 1,
    bookTitle: 'عادات اتمی',
    chapterTitle: 'فصل اول: قدرت شگفت‌انگیز عادات کوچک',
    text: 'اگر هر روز فقط ۱ درصد بهتر شوید، در پایان یک سال ۳۷ برابر رشد خواهید کرد.',
    color: 'yellow',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'hl-2',
    bookId: 1,
    bookTitle: 'عادات اتمی',
    chapterTitle: 'فصل دوم: تغییر هویت به جای تغییر نتیجه',
    text: 'هر کنش و عادتی که در طول روز انجام می‌دهید، در واقع رأیی است که به هویت آینده خود می‌دهید.',
    color: 'green',
    createdAt: new Date().toISOString(),
  },
];

const initialSampleNotes: Note[] = [
  {
    id: 'nt-1',
    bookId: 1,
    bookTitle: 'عادات اتمی',
    chapterTitle: 'فصل اول: قدرت شگفت‌انگیز عادات کوچک',
    text: 'قانون اثر مرکب در زندگی کاری من: روزانه ۲۰ دقیقه تمرکز عمیق و مطالعه مستمر نتایج بزرگی خلق می‌کند.',
    createdAt: new Date().toISOString(),
  },
];

export default function App() {
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = Storage.getItem('books');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure all books have free access and downloaded boolean
        return parsed.map((b: Book) => ({
          ...b,
          isPurchased: true,
          price: 0,
          isDownloaded: b.isDownloaded || false,
        }));
      } catch {
        // ignore
      }
    }
    return initialBooks.map((b) => ({
      ...b,
      isPurchased: true,
      price: 0,
      isDownloaded: b.id === 1, // sample downloaded
    }));
  });

  const [ads, setAds] = useState<AdItem[]>(() => {
    const saved = Storage.getItem('app_ads');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return initialAds;
  });

  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = Storage.getItem('userStats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialUserStats;
      }
    }
    return initialUserStats;
  });

  const [highlights, setHighlights] = useState<Highlight[]>(() => {
    const saved = Storage.getItem('highlights');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialSampleHighlights;
      }
    }
    return initialSampleHighlights;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = Storage.getItem('notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialSampleNotes;
      }
    }
    return initialSampleNotes;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('همه');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = Storage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [sortBy, setSortBy] = useState<SortOption>('title');
  const [minRating, setMinRating] = useState(0);
  const [yearFrom, setYearFrom] = useState(1900);
  const [yearTo, setYearTo] = useState(new Date().getFullYear());
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = Storage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : ['عادات اتمی', 'روان‌شناسی', 'کانمن'];
  });

  const [readerVisible, setReaderVisible] = useState(false);
  const [readerBook, setReaderBook] = useState<Book | null>(null);

  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [challengesVisible, setChallengesVisible] = useState(false);
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);

  // Sync dark mode class on <html> document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle URL hash for Direct Book Sharing & SEO (e.g. #book-1)
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#book-')) {
        const bookId = parseInt(hash.replace('#book-', ''), 10);
        const target = books.find((b) => b.id === bookId);
        if (target) {
          setSelectedBook(target);
          setShowModal(true);
        }
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [books]);

  // Persist helpers
  const persistBooks = (updatedBooks: Book[]) => {
    setBooks(updatedBooks);
    Storage.setItem('books', JSON.stringify(updatedBooks));
  };

  const persistAds = (updatedAds: AdItem[]) => {
    setAds(updatedAds);
    Storage.setItem('app_ads', JSON.stringify(updatedAds));
  };

  const persistStats = (updatedStats: UserStats) => {
    setUserStats(updatedStats);
    Storage.setItem('userStats', JSON.stringify(updatedStats));
  };

  const persistHighlights = (updatedHighlights: Highlight[]) => {
    setHighlights(updatedHighlights);
    Storage.setItem('highlights', JSON.stringify(updatedHighlights));
  };

  const persistNotes = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    Storage.setItem('notes', JSON.stringify(updatedNotes));
  };

  // Toggle Download for Offline Mode
  const toggleDownload = (bookId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = books.map((b) => {
      if (b.id === bookId) {
        const nextDownloaded = !b.isDownloaded;
        return {
          ...b,
          isDownloaded: nextDownloaded,
          downloadsCount: (b.downloadsCount || 120) + (nextDownloaded ? 1 : -1),
        };
      }
      return b;
    });
    persistBooks(updated);

    if (selectedBook?.id === bookId) {
      setSelectedBook((prev) =>
        prev ? { ...prev, isDownloaded: !prev.isDownloaded } : null
      );
    }
  };

  // Remove downloaded book
  const handleRemoveDownloadedBook = (bookId: number) => {
    const updated = books.map((b) =>
      b.id === bookId ? { ...b, isDownloaded: false } : b
    );
    persistBooks(updated);
  };

  // Gamification: Add reading minutes and award XP
  const handleLogReadingMinutes = (mins: number) => {
    setUserStats((prev) => {
      const newMinutes = prev.todayMinutesRead + mins;
      const addedXp = mins * 5;
      const newXp = prev.xpPoints + addedXp;
      const newLevel = Math.floor(newXp / 150) + 1;

      const updated = {
        ...prev,
        todayMinutesRead: newMinutes,
        xpPoints: newXp,
        level: newLevel,
      };
      persistStats(updated);
      return updated;
    });
  };

  // Update Daily goal
  const handleUpdateDailyGoal = (minutes: number) => {
    const updated = {
      ...userStats,
      dailyGoalMinutes: minutes,
    };
    persistStats(updated);
  };

  // Toggle favorite
  const toggleFavorite = (bookId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = books.map((b) =>
      b.id === bookId ? { ...b, isFavorite: !b.isFavorite } : b
    );
    persistBooks(updated);
    if (selectedBook?.id === bookId) {
      setSelectedBook((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  // Toggle read status + XP award
  const toggleRead = (bookId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let becameCompleted = false;
    const updated = books.map((b) => {
      if (b.id === bookId) {
        const nextRead = !b.isRead;
        if (nextRead) becameCompleted = true;
        return {
          ...b,
          isRead: nextRead,
          progress: nextRead ? Math.max(b.progress, 1) : 0,
        };
      }
      return b;
    });
    persistBooks(updated);

    if (becameCompleted) {
      setUserStats((prev) => {
        const newCompleted = prev.completedBooksThisMonth + 1;
        const newXp = prev.xpPoints + 50;
        const updatedStats = {
          ...prev,
          completedBooksThisMonth: newCompleted,
          xpPoints: newXp,
          level: Math.floor(newXp / 150) + 1,
        };
        persistStats(updatedStats);
        return updatedStats;
      });
    }

    if (selectedBook?.id === bookId) {
      setSelectedBook((prev) =>
        prev
          ? {
              ...prev,
              isRead: !prev.isRead,
              progress: !prev.isRead ? Math.max(prev.progress, 1) : 0,
            }
          : null
      );
    }
  };

  // Toggle Want to Read (نوبت مطالعه / موضوع کتاب‌هایی که باید خوانده شود)
  const toggleWantToRead = (bookId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = books.map((b) =>
      b.id === bookId ? { ...b, isWantToRead: !b.isWantToRead } : b
    );
    persistBooks(updated);
    if (selectedBook?.id === bookId) {
      setSelectedBook((prev) => (prev ? { ...prev, isWantToRead: !prev.isWantToRead } : null));
    }
  };

  // Add User Review and recalculate average rating
  const handleAddReview = (
    bookId: number,
    reviewData: { userName: string; rating: number; comment: string }
  ) => {
    const newReview = {
      id: `rev-${Date.now()}`,
      bookId,
      userName: reviewData.userName,
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: 'لحظاتی پیش',
      likesCount: 0,
      isLiked: false,
    };

    const updated = books.map((b) => {
      if (b.id === bookId) {
        const existingReviews = b.reviews || [];
        const newReviews = [newReview, ...existingReviews];
        const avg = Number(
          (newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length).toFixed(1)
        );
        return {
          ...b,
          reviews: newReviews,
          rating: avg,
          ratingCount: (b.ratingCount || 0) + 1,
        };
      }
      return b;
    });

    persistBooks(updated);
    if (selectedBook?.id === bookId) {
      const updatedTarget = updated.find((b) => b.id === bookId);
      if (updatedTarget) setSelectedBook(updatedTarget);
    }
  };

  // Like or unlike a review
  const handleLikeReview = (bookId: number, reviewId: string) => {
    const updated = books.map((b) => {
      if (b.id === bookId && b.reviews) {
        const newReviews = b.reviews.map((r) => {
          if (r.id === reviewId) {
            const isLiked = !r.isLiked;
            return {
              ...r,
              isLiked,
              likesCount: isLiked ? r.likesCount + 1 : Math.max(0, r.likesCount - 1),
            };
          }
          return r;
        });
        return { ...b, reviews: newReviews };
      }
      return b;
    });

    persistBooks(updated);
    if (selectedBook?.id === bookId) {
      const updatedTarget = updated.find((b) => b.id === bookId);
      if (updatedTarget) setSelectedBook(updatedTarget);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    Storage.setItem('darkMode', JSON.stringify(newMode));
  };

  // Open in-app reader (100% Free)
  const handleOpenReader = (book: Book) => {
    setReaderBook(book);
    setReaderVisible(true);
    setShowModal(false);
  };

  // Save reading progress
  const handleSaveProgress = (bookId: number, progressValue: number) => {
    let completedNow = false;
    const updated = books.map((b) => {
      if (b.id === bookId) {
        const isNowFinished = progressValue >= 0.98 && !b.isRead;
        if (isNowFinished) completedNow = true;
        return {
          ...b,
          progress: progressValue,
          isRead: isNowFinished ? true : b.isRead,
        };
      }
      return b;
    });
    persistBooks(updated);

    if (completedNow) {
      setUserStats((prev) => {
        const newStats = {
          ...prev,
          completedBooksThisMonth: prev.completedBooksThisMonth + 1,
          xpPoints: prev.xpPoints + 50,
          level: Math.floor((prev.xpPoints + 50) / 150) + 1,
        };
        persistStats(newStats);
        return newStats;
      });
    }

    if (readerBook?.id === bookId) {
      setReaderBook((prev) =>
        prev ? { ...prev, progress: progressValue, isRead: progressValue >= 0.98 } : null
      );
    }
  };

  // Close reader
  const handleCloseReader = (finalProgress?: number) => {
    if (readerBook && finalProgress !== undefined) {
      handleSaveProgress(readerBook.id, finalProgress);
    }
    setReaderVisible(false);
    setReaderBook(null);
  };

  // Add / delete highlight
  const handleAddHighlight = (highlightData: Omit<Highlight, 'id' | 'createdAt'>) => {
    const newHighlight: Highlight = {
      ...highlightData,
      id: `hl-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    persistHighlights([newHighlight, ...highlights]);
  };

  const handleDeleteHighlight = (id: string) => {
    persistHighlights(highlights.filter((h) => h.id !== id));
  };

  // Add / delete note
  const handleAddNote = (noteData: Omit<Note, 'id' | 'createdAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: `nt-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    persistNotes([newNote, ...notes]);
  };

  const handleDeleteNote = (id: string) => {
    persistNotes(notes.filter((n) => n.id !== id));
  };

  // Search commit
  const handleCommitSearch = (query: string) => {
    if (!query.trim()) return;
    const updated = [query, ...recentSearches.filter((q) => q !== query)].slice(0, 6);
    setRecentSearches(updated);
    Storage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    Storage.setItem('recentSearches', JSON.stringify([]));
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('همه');
    setMinRating(0);
    setYearFrom(1900);
    setYearTo(new Date().getFullYear());
  };

  const handleToggleSort = () => {
    setSortBy((prev) => (prev === 'title' ? 'rating' : prev === 'rating' ? 'year' : 'title'));
  };

  // Admin Actions
  const handleAddBook = (newBook: Book) => {
    const updated = [newBook, ...books];
    persistBooks(updated);
  };

  const handleUpdateBook = (updatedBook: Book) => {
    const updated = books.map((b) => (b.id === updatedBook.id ? updatedBook : b));
    persistBooks(updated);
  };

  const handleDeleteBook = (bookId: number) => {
    const updated = books.filter((b) => b.id !== bookId);
    persistBooks(updated);
  };

  const handleSetBookOfDay = (bookId: number) => {
    const updated = books.map((b) => ({
      ...b,
      isBookOfDay: b.id === bookId,
    }));
    persistBooks(updated);
  };

  const handleToggleAd = (adId: string) => {
    const updated = ads.map((a) => (a.id === adId ? { ...a, active: !a.active } : a));
    persistAds(updated);
  };

  const handleUpdateAd = (updatedAd: AdItem) => {
    const updated = ads.map((a) => (a.id === updatedAd.id ? updatedAd : a));
    persistAds(updated);
  };

  // Reset demo books
  const handleResetData = () => {
    if (window.confirm('آیا مایل به بازنشانی اطلاعات به حالت اولیه نمونه هستید؟')) {
      const reset = initialBooks.map((b) => ({
        ...b,
        isPurchased: true,
        price: 0,
        isDownloaded: b.id === 1,
      }));
      persistBooks(reset);
      persistAds(initialAds);
      persistStats(initialUserStats);
      persistHighlights(initialSampleHighlights);
      persistNotes(initialSampleNotes);
    }
  };

  // Book of the Day item
  const bookOfDay = useMemo(() => {
    return books.find((b) => b.isBookOfDay) || books[0];
  }, [books]);

  // Filtered and sorted books
  const filteredBooks = useMemo(() => {
    const filtered = books.filter((book) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.summary.toLowerCase().includes(q);

      const matchesCategory = selectedCategory === 'همه' || book.category === selectedCategory;
      const matchesRating = book.rating >= minRating;
      const matchesYear = book.publishYear >= yearFrom && book.publishYear <= yearTo;

      let matchesTab = true;
      if (currentTab === 'favorites') matchesTab = book.isFavorite;
      else if (currentTab === 'read') matchesTab = book.isRead;
      else if (currentTab === 'offline') matchesTab = !!book.isDownloaded;
      else if (currentTab === 'wantToRead') matchesTab = !!book.isWantToRead;

      return matchesSearch && matchesCategory && matchesTab && matchesRating && matchesYear;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'year':
          return b.publishYear - a.publishYear;
        default:
          return a.title.localeCompare(b.title, 'fa');
      }
    });

    return filtered;
  }, [books, searchQuery, selectedCategory, minRating, yearFrom, yearTo, currentTab, sortBy]);

  const totalFavorites = books.filter((b) => b.isFavorite).length;
  const totalRead = books.filter((b) => b.isRead).length;
  const totalDownloaded = books.filter((b) => b.isDownloaded).length;
  const totalWantToRead = books.filter((b) => b.isWantToRead).length;
  const activeAd = ads.find((a) => a.active);

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? 'bg-neutral-950 text-neutral-100' : 'bg-neutral-100 text-neutral-900'
      }`}
    >
      {/* Offline Status Real-time Notification */}
      <OfflineIndicator />

      {/* Outer wrapper - optionally in Phone Frame or full-width responsive */}
      <div
        className={`mx-auto transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-md my-4 sm:my-8 rounded-[40px] shadow-2xl border-8 border-neutral-800 dark:border-neutral-700 overflow-hidden bg-neutral-50 dark:bg-neutral-900 min-h-[780px]'
            : 'w-full max-w-4xl min-h-screen bg-neutral-50 dark:bg-neutral-900 shadow-xs'
        }`}
      >
        {/* Header with PWA button, profile & admin nav */}
        <Header
          currentTab={currentTab}
          onChangeTab={setCurrentTab}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          isPhoneFrame={isPhoneFrame}
          onTogglePhoneFrame={() => setIsPhoneFrame(!isPhoneFrame)}
          onOpenSuggestions={() => setSuggestionsVisible(true)}
        />

        {/* Gamification & Daily Goal Bar (Shown on Home and reading tabs) */}
        {currentTab !== 'admin' && currentTab !== 'profile' && (
          <div className="pt-3">
            <GamificationBanner
              stats={userStats}
              onOpenChallenges={() => setChallengesVisible(true)}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {/* Sponsor Ad Banner (Compact Top) */}
        {activeAd && currentTab === 'home' && !searchQuery && (
          <AdBanner ad={activeAd} variant="compact" isDarkMode={isDarkMode} />
        )}

        {/* Render Views Based on Tab */}
        {currentTab === 'profile' ? (
          <UserProfileView
            stats={userStats}
            books={books}
            onOpenBook={(book) => {
              setSelectedBook(book);
              setShowModal(true);
            }}
            onRemoveDownloadedBook={handleRemoveDownloadedBook}
            onToggleWantToRead={toggleWantToRead}
            isDarkMode={isDarkMode}
          />
        ) : currentTab === 'admin' ? (
          <AdminDashboardView
            books={books}
            ads={ads}
            onAddBook={handleAddBook}
            onUpdateBook={handleUpdateBook}
            onDeleteBook={handleDeleteBook}
            onSetBookOfDay={handleSetBookOfDay}
            onToggleAd={handleToggleAd}
            onUpdateAd={handleUpdateAd}
            isDarkMode={isDarkMode}
          />
        ) : (
          <>
            {/* Filter and navigation bar */}
            <FilterBar
              currentTab={currentTab}
              onSelectTab={setCurrentTab}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onCommitSearch={handleCommitSearch}
              recentSearches={recentSearches}
              onSelectRecentSearch={(term) => setSearchQuery(term)}
              onClearRecentSearches={handleClearRecentSearches}
              showFilterPanel={showFilterPanel}
              onToggleFilterPanel={() => setShowFilterPanel(!showFilterPanel)}
              minRating={minRating}
              onSelectMinRating={setMinRating}
              yearFrom={yearFrom}
              onYearFromChange={setYearFrom}
              yearTo={yearTo}
              onYearToChange={setYearTo}
              onClearAllFilters={handleClearAllFilters}
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              sortBy={sortBy}
              onToggleSort={handleToggleSort}
              totalFiltered={filteredBooks.length}
              totalFavorites={totalFavorites}
              totalRead={totalRead}
              totalDownloaded={totalDownloaded}
              totalWantToRead={totalWantToRead}
              totalNotesAndHighlights={highlights.length + notes.length}
              isDarkMode={isDarkMode}
            />

            {/* Book of the Day Banner - Shown on Home tab when no search query is active */}
            {currentTab === 'home' && !searchQuery && selectedCategory === 'همه' && bookOfDay && (
              <BookOfDayBanner
                book={bookOfDay}
                onSelect={(b) => {
                  setSelectedBook(b);
                  setShowModal(true);
                }}
                onOpenReader={handleOpenReader}
                isDarkMode={isDarkMode}
              />
            )}

            {/* Curated Recommendations by Subject / Topic (جدید، ترند، پیشنهادی، مشهور، باید بخوانم) */}
            {currentTab === 'home' && !searchQuery && selectedCategory === 'همه' && (
              <div className="px-3 sm:px-4 pt-2">
                <BookCuratedSections
                  books={books}
                  onSelectBook={(b) => {
                    setSelectedBook(b);
                    setShowModal(true);
                  }}
                  onToggleFavorite={toggleFavorite}
                  onToggleWantToRead={toggleWantToRead}
                  onToggleDownload={toggleDownload}
                  isDarkMode={isDarkMode}
                />
              </div>
            )}

            {/* Main View: Book Grid OR Notes & Highlights Tab */}
            <main className="px-3 sm:px-4 py-3">
              {currentTab === 'notes' ? (
                <NotesHighlightsView
                  highlights={highlights}
                  notes={notes}
                  onDeleteHighlight={handleDeleteHighlight}
                  onDeleteNote={handleDeleteNote}
                  onOpenBook={(bookId) => {
                    const target = books.find((b) => b.id === bookId);
                    if (target) {
                      setSelectedBook(target);
                      setShowModal(true);
                    }
                  }}
                  isDarkMode={isDarkMode}
                />
              ) : filteredBooks.length > 0 ? (
                <div className="space-y-4 pb-8">
                  {/* Category / Library Heading when on Home */}
                  {currentTab === 'home' && !searchQuery && selectedCategory === 'همه' && (
                    <div className="flex items-center justify-between pt-2 pb-1 border-b border-neutral-200/60 dark:border-neutral-800">
                      <h3 className="text-sm sm:text-base font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                        <span>📚</span>
                        <span>تمامی خلاصه‌های کتاب موجود در کتابخانه</span>
                      </h3>
                      <span className="text-xs text-neutral-400">
                        {filteredBooks.length} کتاب
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredBooks.slice(0, 4).map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        onSelect={(b) => {
                          setSelectedBook(b);
                          setShowModal(true);
                        }}
                        onToggleFavorite={toggleFavorite}
                        onToggleWantToRead={toggleWantToRead}
                        onToggleRead={toggleRead}
                        onToggleDownload={toggleDownload}
                        isDarkMode={isDarkMode}
                      />
                    ))}
                  </div>

                  {/* Mid-feed In-Feed Ad Banner */}
                  {ads[1] && ads[1].active && currentTab === 'home' && (
                    <AdBanner ad={ads[1]} variant="infeed" isDarkMode={isDarkMode} />
                  )}

                  {/* Rest of the books */}
                  {filteredBooks.length > 4 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {filteredBooks.slice(4).map((book) => (
                        <BookCard
                          key={book.id}
                          book={book}
                          onSelect={(b) => {
                            setSelectedBook(b);
                            setShowModal(true);
                          }}
                          onToggleFavorite={toggleFavorite}
                          onToggleWantToRead={toggleWantToRead}
                          onToggleRead={toggleRead}
                          onToggleDownload={toggleDownload}
                          isDarkMode={isDarkMode}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-16 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto text-2xl">
                    {currentTab === 'favorites'
                      ? '❤️'
                      : currentTab === 'read'
                      ? '📖'
                      : currentTab === 'offline'
                      ? '📥'
                      : currentTab === 'wantToRead'
                      ? '🎯'
                      : '🔍'}
                  </div>
                  <p className="text-base font-medium text-neutral-600 dark:text-neutral-300">
                    {currentTab === 'favorites'
                      ? 'هیچ کتابی در لیست علاقه‌مندی‌ها وجود ندارد.'
                      : currentTab === 'read'
                      ? 'هنوز کتابی را به عنوان خوانده‌شده ثبت نکرده‌اید.'
                      : currentTab === 'offline'
                      ? 'هنوز کتابی را برای مطالعه آفلاین ذخیره نکرده‌اید. برای دانلود، روی آیکون دانلود در هر کارت کتاب کلیک کنید.'
                      : currentTab === 'wantToRead'
                      ? 'هیچ کتابی در نوبت مطالعه شما قرار ندارد. با کلیک روی نشانک هر کتاب، آن را به لیست «باید بخوانم» اضافه کنید.'
                      : 'کتابی مطابق با جستجو و فیلترهای شما یافت نشد.'}
                  </p>
                  {(searchQuery || selectedCategory !== 'همه' || minRating > 0) && (
                    <button
                      onClick={handleClearAllFilters}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                    >
                      پاک کردن همه فیلترها و مشاهده همه کتاب‌ها
                    </button>
                  )}
                </div>
              )}

              {/* Quick Footer toolbar */}
              <div className="mt-4 pt-4 pb-8 border-t border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
                <button
                  onClick={handleResetData}
                  className="flex items-center gap-1 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                  title="بارگذاری مجدد داده‌های نمونه اولیه"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>بازنشانی اطلاعات نمونه</span>
                </button>

                <button
                  onClick={() => setSuggestionsVisible(true)}
                  className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  <span>مشاهده معماری و پیشنهادات توسعه</span>
                </button>
              </div>
            </main>
          </>
        )}

        {/* Book Details Modal & Dynamic SEO */}
        <BookDetailsModal
          book={selectedBook}
          allBooks={books}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            if (window.location.hash.startsWith('#book-')) {
              history.replaceState(null, '', window.location.pathname);
            }
          }}
          onToggleFavorite={(id) => toggleFavorite(id)}
          onToggleRead={(id) => toggleRead(id)}
          onToggleDownload={(id) => toggleDownload(id)}
          onToggleWantToRead={(id) => toggleWantToRead(id)}
          onAddReview={(bookId, review) => handleAddReview(bookId, review)}
          onLikeReview={(bookId, reviewId) => handleLikeReview(bookId, reviewId)}
          onOpenReader={handleOpenReader}
          onSelectRelatedBook={(b) => setSelectedBook(b)}
          isDarkMode={isDarkMode}
        />

        {/* In-App Reader Modal with Highlighting, Notes, DRM security, and Similar Books */}
        <ReaderModal
          book={readerBook}
          allBooks={books}
          isOpen={readerVisible}
          onClose={handleCloseReader}
          onSaveProgress={handleSaveProgress}
          highlights={highlights}
          notes={notes}
          onAddHighlight={handleAddHighlight}
          onDeleteHighlight={handleDeleteHighlight}
          onAddNote={handleAddNote}
          onDeleteNote={handleDeleteNote}
          onLogReadingMinutes={handleLogReadingMinutes}
          onSelectRelatedBook={(b) => {
            handleCloseReader();
            setSelectedBook(b);
            setShowModal(true);
          }}
          onToggleWantToRead={(id) => toggleWantToRead(id)}
        />

        {/* Challenges & Daily Goals Modal */}
        <ChallengesModal
          stats={userStats}
          isOpen={challengesVisible}
          onClose={() => setChallengesVisible(false)}
          onUpdateDailyGoal={handleUpdateDailyGoal}
          isDarkMode={isDarkMode}
        />

        {/* Architectural Suggestions Modal */}
        <SuggestionsModal
          isOpen={suggestionsVisible}
          onClose={() => setSuggestionsVisible(false)}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
}
