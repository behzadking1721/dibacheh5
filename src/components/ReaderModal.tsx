import React, { useState, useEffect, useRef } from 'react';
import { Book, ReaderTheme, Highlight, Note } from '../types';
import { SimilarBooks } from './SimilarBooks';
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  BookmarkCheck,
  Info,
  Highlighter,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Plus,
  Trash2,
  Sparkles,
  EyeOff,
  Minimize2,
  Glasses
} from 'lucide-react';

interface ReaderModalProps {
  book: Book | null;
  allBooks?: Book[];
  isOpen: boolean;
  onClose: (finalProgress?: number) => void;
  onSaveProgress: (bookId: number, progress: number) => void;
  highlights: Highlight[];
  notes: Note[];
  onAddHighlight: (highlight: Omit<Highlight, 'id' | 'createdAt'>) => void;
  onDeleteHighlight: (id: string) => void;
  onAddNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  onDeleteNote: (id: string) => void;
  onLogReadingMinutes?: (minutes: number) => void;
  onSelectRelatedBook?: (book: Book) => void;
  onToggleWantToRead?: (id: number) => void;
}

export const ReaderModal: React.FC<ReaderModalProps> = ({
  book,
  allBooks = [],
  isOpen,
  onClose,
  onSaveProgress,
  highlights,
  notes,
  onAddHighlight,
  onDeleteHighlight,
  onAddNote,
  onDeleteNote,
  onLogReadingMinutes,
  onSelectRelatedBook,
  onToggleWantToRead,
}) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [readerTheme, setReaderTheme] = useState<ReaderTheme>('light');
  const [progress, setProgress] = useState(0);
  const [showInfoBanner, setShowInfoBanner] = useState(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);
  const [newNoteInput, setNewNoteInput] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null);
  const [drmWatermarkVisible, setDrmWatermarkVisible] = useState(true);
  const [isZenMode, setIsZenMode] = useState(false);
  const [zenToastVisible, setZenToastVisible] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const readingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle escape key and arrow navigation in Zen mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isZenMode) {
        setIsZenMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZenMode]);

  const toggleZenMode = () => {
    const next = !isZenMode;
    setIsZenMode(next);
    if (next) {
      setZenToastVisible(true);
      setShowNotesDrawer(false);
      setShowInfoBanner(false);
      setTimeout(() => {
        setZenToastVisible(false);
      }, 3200);
    }
  };

  useEffect(() => {
    if (book) {
      const initialProgress = book.progress || 0;
      setProgress(initialProgress);
      const chaptersCount = book.chapters?.length || 1;
      const calculatedChapter = Math.min(
        Math.floor(initialProgress * chaptersCount),
        chaptersCount - 1
      );
      setCurrentChapterIndex(Math.max(0, calculatedChapter));
    }
  }, [book]);

  // Track reading time every 60 seconds of active reading
  useEffect(() => {
    if (isOpen && onLogReadingMinutes) {
      readingTimerRef.current = setInterval(() => {
        onLogReadingMinutes(1);
      }, 60000);
    }
    return () => {
      if (readingTimerRef.current) clearInterval(readingTimerRef.current);
    };
  }, [isOpen, onLogReadingMinutes]);

  // Text selection handler for highlighting
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setSelectionPosition(null);
      setSelectedText('');
      return;
    }

    const text = selection.toString().trim();
    if (text.length > 2) {
      setSelectedText(text);
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectionPosition({
        x: Math.max(10, rect.left + rect.width / 2 - 100),
        y: Math.max(10, rect.top - 45),
      });
    } else {
      setSelectionPosition(null);
      setSelectedText('');
    }
  };

  if (!isOpen || !book) return null;

  const chapters = book.chapters || [
    {
      id: 1,
      title: 'خلاصه و دیدگاه کلی',
      content: book.summary,
    },
  ];

  const currentChapter = chapters[currentChapterIndex] || chapters[0];

  const handleNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      const nextIndex = currentChapterIndex + 1;
      setCurrentChapterIndex(nextIndex);
      const newProgress = Math.min(1, Math.round(((nextIndex + 1) / chapters.length) * 100) / 100);
      setProgress(newProgress);
      onSaveProgress(book.id, newProgress);
      if (contentRef.current) contentRef.current.scrollTop = 0;
    } else {
      setProgress(1.0);
      onSaveProgress(book.id, 1.0);
    }
    setSelectionPosition(null);
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      const prevIndex = currentChapterIndex - 1;
      setCurrentChapterIndex(prevIndex);
      const newProgress = Math.round((prevIndex / chapters.length) * 100) / 100;
      setProgress(newProgress);
      onSaveProgress(book.id, newProgress);
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }
    setSelectionPosition(null);
  };

  const handleFinish = () => {
    setProgress(1.0);
    onSaveProgress(book.id, 1.0);
    onClose(1.0);
  };

  const handleCreateHighlight = (color: 'yellow' | 'green' | 'blue' | 'purple') => {
    if (!selectedText) return;
    onAddHighlight({
      bookId: book.id,
      bookTitle: book.title,
      text: selectedText,
      color,
      chapterTitle: currentChapter.title,
    });
    setSelectionPosition(null);
    setSelectedText('');
    window.getSelection()?.removeAllRanges();
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteInput.trim()) return;
    onAddNote({
      bookId: book.id,
      bookTitle: book.title,
      text: newNoteInput.trim(),
      chapterTitle: currentChapter.title,
    });
    setNewNoteInput('');
  };

  const currentBookHighlights = highlights.filter(
    (h) => h.bookId === book.id && (!h.chapterTitle || h.chapterTitle === currentChapter.title)
  );

  const currentBookNotes = notes.filter(
    (n) => n.bookId === book.id && (!n.chapterTitle || n.chapterTitle === currentChapter.title)
  );

  const themeClasses = {
    light: 'bg-white text-neutral-850 border-neutral-200',
    sepia: 'bg-[#fcf7ed] text-[#433422] border-[#e8ddca]',
    dark: 'bg-[#18181b] text-neutral-200 border-neutral-800',
  }[readerTheme];

  const fontSizes = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-loose',
    lg: 'text-lg leading-[2.2rem]',
  }[fontSize];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 select-text">
      {/* Selection Floating Toolbar for Highlighting */}
      {selectionPosition && selectedText && (
        <div
          style={{ top: `${selectionPosition.y}px`, left: `${selectionPosition.x}px` }}
          className="fixed z-[60] flex items-center gap-1.5 p-1.5 rounded-2xl bg-neutral-900 text-white shadow-2xl border border-neutral-700 animate-in fade-in zoom-in-95 duration-150"
        >
          <span className="text-[11px] font-bold px-1.5 text-neutral-400">هایلایت:</span>
          <button
            onClick={() => handleCreateHighlight('yellow')}
            className="w-5 h-5 rounded-full bg-amber-400 hover:scale-110 transition-transform shadow-xs"
            title="زرد"
          />
          <button
            onClick={() => handleCreateHighlight('green')}
            className="w-5 h-5 rounded-full bg-emerald-400 hover:scale-110 transition-transform shadow-xs"
            title="سبز"
          />
          <button
            onClick={() => handleCreateHighlight('blue')}
            className="w-5 h-5 rounded-full bg-blue-400 hover:scale-110 transition-transform shadow-xs"
            title="آبی"
          />
          <button
            onClick={() => handleCreateHighlight('purple')}
            className="w-5 h-5 rounded-full bg-purple-400 hover:scale-110 transition-transform shadow-xs"
            title="بنفش"
          />
        </div>
      )}

      <div
        className={`flex-1 flex flex-col w-full transition-all duration-300 mx-auto my-0 ${
          isZenMode ? 'max-w-4xl sm:my-1 sm:rounded-2xl' : 'max-w-3xl sm:my-3 sm:rounded-3xl'
        } shadow-2xl overflow-hidden border relative ${themeClasses}`}
      >
        {/* Anti-Piracy / DRM Dynamic Watermark layer (Technical & Security Optimization) */}
        {!isZenMode && drmWatermarkVisible && (
          <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-around opacity-[0.035] dark:opacity-[0.05] overflow-hidden select-none">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="transform -rotate-12 whitespace-nowrap text-xs font-mono font-bold tracking-widest text-center"
              >
                کپی‌رایت اختصاصی خلاصه کده • UID-{book.id}9824 • محافظت‌شده در برابر سرقت محتوا
              </div>
            ))}
          </div>
        )}

        {/* Minimal Subtle Zen Mode Top Progress Bar */}
        {isZenMode && (
          <div className="absolute top-0 inset-x-0 h-1 bg-black/5 dark:bg-white/5 z-40">
            <div
              className="h-full bg-indigo-500 dark:bg-indigo-400 transition-all duration-300"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        )}

        {/* Floating Zen Controls Bar */}
        {isZenMode && (
          <>
            {/* Transient Toast Notification on entering Zen mode */}
            {zenToastVisible && (
              <div className="absolute top-16 inset-x-0 mx-auto w-fit z-50 px-4 py-2 rounded-2xl bg-neutral-900/90 text-white text-xs font-semibold backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300 flex items-center gap-2 border border-white/10">
                <EyeOff className="w-4 h-4 text-indigo-400" />
                <span>حالت مطالعه عمیق و بدون حواس‌پرتی فعال شد. فقط متن اصلی نمایش داده می‌شود.</span>
              </div>
            )}

            {/* Subtle floating control pill */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-40 flex items-center gap-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/80 hover:bg-neutral-900 text-white backdrop-blur-md shadow-xl border border-white/10 text-xs transition-all">
                <button
                  id="exit-zen-mode-btn"
                  type="button"
                  onClick={() => setIsZenMode(false)}
                  className="flex items-center gap-1.5 hover:text-indigo-300 font-bold transition-colors cursor-pointer"
                  title="خروج از حالت مطالعه عمیق و نمایش مجدد تمام ابزارها (Esc)"
                >
                  <Minimize2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>خروج از تمرکز</span>
                  <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white/15 rounded border border-white/20">
                    Esc
                  </kbd>
                </button>

                <span className="w-px h-3.5 bg-white/20" />

                <span className="text-[11px] text-white/80 font-medium">
                  {chapters.length > 1 ? `بخش ${currentChapterIndex + 1} از ${chapters.length}` : ''} ({Math.round(progress * 100)}٪)
                </span>

                {chapters.length > 1 && (
                  <div className="flex items-center gap-0.5 mr-1">
                    <button
                      onClick={handlePrevChapter}
                      disabled={currentChapterIndex === 0}
                      className="p-1 rounded-full hover:bg-white/20 disabled:opacity-25 disabled:pointer-events-none transition-colors"
                      title="فصل قبلی"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleNextChapter}
                      disabled={currentChapterIndex >= chapters.length - 1}
                      className="p-1 rounded-full hover:bg-white/20 disabled:opacity-25 disabled:pointer-events-none transition-colors"
                      title="فصل بعدی"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Quick font toggle in Zen mode */}
                <div className="hidden sm:flex items-center gap-1 border-r border-white/20 pr-1.5 mr-1">
                  <button
                    onClick={() => setFontSize(fontSize === 'sm' ? 'base' : fontSize === 'base' ? 'lg' : 'sm')}
                    className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] font-bold"
                    title="تغییر اندازه فونت"
                  >
                    فونت: {fontSize === 'sm' ? 'کوچک' : fontSize === 'base' ? 'عادی' : 'بزرگ'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Top Header (Hidden in Zen mode) */}
        {!isZenMode && (
          <header className="px-4 py-3 border-b flex items-center justify-between gap-2 shrink-0 border-inherit bg-inherit/90 backdrop-blur-xs relative z-20">
            <button
              id="close-reader-btn"
              onClick={() => onClose(progress)}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>بستن ریدر</span>
            </button>

            <div className="text-center flex-1 min-w-0 px-2">
              <h3 className="text-sm font-bold truncate">{book.title}</h3>
              <p className="text-[11px] opacity-70 truncate">{book.author}</p>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Deep Reading / Zen Mode Toggle Button */}
              <button
                id="toggle-zen-mode-btn"
                type="button"
                onClick={toggleZenMode}
                className="p-1.5 rounded-xl border border-inherit hover:bg-black/5 dark:hover:bg-white/10 transition-all text-xs flex items-center gap-1 text-purple-600 dark:text-purple-400 font-bold hover:scale-105 active:scale-95"
                title="حالت مطالعه عمیق و بدون حواس‌پرتی (مخفی‌سازی ابزارها و دکمه‌ها)"
              >
                <EyeOff className="w-4 h-4" />
                <span className="hidden sm:inline">مطالعه عمیق</span>
              </button>

              {/* Notes & Highlights Drawer Toggle */}
              <button
                onClick={() => setShowNotesDrawer(!showNotesDrawer)}
                className={`p-1.5 rounded-xl border transition-all text-xs flex items-center gap-1 ${
                  showNotesDrawer
                    ? 'bg-blue-600 text-white border-blue-600 font-bold'
                    : 'border-inherit hover:bg-black/5 dark:hover:bg-white/10'
                }`}
                title="یادداشت‌ها و هایلایت‌های این بخش"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">یادداشت</span>
                {(currentBookHighlights.length > 0 || currentBookNotes.length > 0) && (
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                )}
              </button>

              {/* Font size toggler */}
              <div className="flex items-center rounded-lg bg-black/5 dark:bg-white/10 p-0.5 text-xs">
                <button
                  onClick={() => setFontSize('sm')}
                  className={`px-1.5 py-0.5 rounded ${fontSize === 'sm' ? 'bg-blue-600 text-white font-bold' : 'opacity-70'}`}
                  title="فونت کوچک"
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSize('base')}
                  className={`px-1.5 py-0.5 rounded ${fontSize === 'base' ? 'bg-blue-600 text-white font-bold' : 'opacity-70'}`}
                  title="فونت عادی"
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('lg')}
                  className={`px-1.5 py-0.5 rounded ${fontSize === 'lg' ? 'bg-blue-600 text-white font-bold' : 'opacity-70'}`}
                  title="فونت بزرگ"
                >
                  A+
                </button>
              </div>

              {/* Reading theme toggler */}
              <div className="flex items-center rounded-lg bg-black/5 dark:bg-white/10 p-0.5">
                <button
                  onClick={() => setReaderTheme('light')}
                  className={`w-5 h-5 rounded-full border border-neutral-300 mr-1 ${readerTheme === 'light' ? 'ring-2 ring-blue-500' : ''}`}
                  style={{ backgroundColor: '#ffffff' }}
                  title="پوسته سفید"
                />
                <button
                  onClick={() => setReaderTheme('sepia')}
                  className={`w-5 h-5 rounded-full border border-[#d6c7b0] mr-1 ${readerTheme === 'sepia' ? 'ring-2 ring-amber-600' : ''}`}
                  style={{ backgroundColor: '#f5ebd7' }}
                  title="پوسته کاغذی سپیا"
                />
                <button
                  onClick={() => setReaderTheme('dark')}
                  className={`w-5 h-5 rounded-full border border-neutral-700 ${readerTheme === 'dark' ? 'ring-2 ring-blue-400' : ''}`}
                  style={{ backgroundColor: '#202023' }}
                  title="پوسته تاریک"
                />
              </div>
            </div>
          </header>
        )}

        {/* Reading Progress Indicator (Hidden in Zen mode) */}
        {!isZenMode && (
          <div className="px-4 py-2 bg-black/3 dark:bg-white/5 border-b border-inherit flex items-center gap-3 text-xs shrink-0 relative z-20">
            <div className="flex-1 h-1.5 bg-black/10 dark:bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <span className="font-bold opacity-80 shrink-0">
              {Math.round(progress * 100)}٪ مطالعه‌شده
            </span>
            <button
              onClick={() => setShowInfoBanner(!showInfoBanner)}
              className="text-blue-500 hover:opacity-80 p-0.5 flex items-center gap-1"
              title="اطلاعات فنی و امنیتی DRM"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] hidden sm:inline">امنیت محتوا</span>
            </button>
          </div>
        )}

        {/* Info banner about Technical Security & DRM (Hidden in Zen mode) */}
        {!isZenMode && showInfoBanner && (
          <div className="mx-4 mt-3 p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2 animate-in fade-in relative z-20">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <div className="flex-1 leading-relaxed">
              <p className="font-bold mb-0.5">بهینه‌سازی فنی و معماری امنیت محتوا (DRM & Security):</p>
              <p>
                در اپلیکیشن نهایی، متون خلاصه با کلید متغیر رمزنگاری (AES-GCM) محافظت شده و تنها در رم (RAM) دستگاه کاربر دکریپت می‌شوند. قابلیت واترپارک نامرئی و ثبت لاگ مطالعه به جلوگیری از سرقت محتوا و بازنشر غیرمجاز کمک می‌نماید.
              </p>
            </div>
            <button
              onClick={() => setShowInfoBanner(false)}
              className="text-blue-500 hover:text-blue-700 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Reader Chapters Selector (Hidden in Zen mode) */}
        {!isZenMode && chapters.length > 1 && (
          <div className="px-4 py-2 border-b border-inherit flex gap-2 overflow-x-auto no-scrollbar shrink-0 text-xs relative z-20">
            {chapters.map((chap, idx) => (
              <button
                key={chap.id}
                onClick={() => {
                  setCurrentChapterIndex(idx);
                  const newProgress = Math.round(((idx + 1) / chapters.length) * 100) / 100;
                  setProgress(newProgress);
                  onSaveProgress(book.id, newProgress);
                }}
                className={`shrink-0 px-3 py-1 rounded-full border transition-all ${
                  currentChapterIndex === idx
                    ? 'bg-blue-600 text-white font-semibold border-blue-600'
                    : 'border-inherit hover:bg-black/5 dark:hover:bg-white/10 opacity-80'
                }`}
              >
                {chap.title.split(':')[0] || `بخش ${idx + 1}`}
              </button>
            ))}
          </div>
        )}

        {/* Main Content Area: Text + Collapsible Notes Drawer */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Scrollable Reader Text Content */}
          <div
            ref={contentRef}
            onMouseUp={handleMouseUp}
            className={`flex-1 overflow-y-auto ${
              isZenMode ? 'px-6 sm:px-16 py-12 sm:py-16' : 'px-6 sm:px-10 py-6 sm:py-8'
            } space-y-6 transition-all duration-300`}
          >
            <div className={`${isZenMode ? 'max-w-3xl' : 'max-w-2xl'} mx-auto`}>
              {/* Highlight instruction helper (Hidden in Zen mode for total immersion) */}
              {!isZenMode && (
                <div className="mb-4 text-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 text-[11px] opacity-75">
                    <Highlighter className="w-3 h-3 text-amber-500" />
                    <span>برای هایلایت کردن، متن دلخواه خود را در صفحه با ماوس یا لمس انتخاب کنید</span>
                  </span>
                </div>
              )}

              {/* Chapter Heading */}
              <div className="mb-8 pb-4 border-b border-inherit text-center">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 block mb-1">
                  بخش {currentChapterIndex + 1} از {chapters.length}
                </span>
                <h2 className="text-xl sm:text-2xl font-black">
                  {currentChapter.title}
                </h2>
              </div>

              {/* Chapter Paragraphs */}
              <div className={`${fontSizes} text-justify space-y-5 font-normal tracking-normal select-text`}>
                {currentChapter.content.split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx} className="indent-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Key Points Recap within Reader */}
              {currentChapterIndex === chapters.length - 1 && book.keyPoints.length > 0 && (
                <div className="mt-10 p-5 rounded-2xl border border-inherit bg-black/3 dark:bg-white/5 space-y-3">
                  <h4 className="font-bold text-base flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <BookmarkCheck className="w-5 h-5" />
                    <span>جمع‌بندی و آموزه‌های کلیدی کتاب</span>
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {book.keyPoints.map((point, kIdx) => (
                      <li key={kIdx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Similar Books Suggestion at the end of reader */}
              {allBooks.length > 1 && onSelectRelatedBook && (
                <div className="mt-10 pt-6 border-t border-inherit">
                  <SimilarBooks
                    currentBook={book}
                    allBooks={allBooks}
                    onSelectBook={(b) => {
                      onSelectRelatedBook(b);
                    }}
                    onToggleWantToRead={onToggleWantToRead ? (id, e) => {
                      e.stopPropagation();
                      onToggleWantToRead(id);
                    } : undefined}
                    isDarkMode={readerTheme === 'dark'}
                    title="پیشنهاد مطالعه بعدی شما (کتاب‌های مشابه)"
                    subtitle="پس از اتمام این خلاصه، این کتاب‌های پرطرفدار را در اولویت مطالعه خود قرار دهید"
                  />
                </div>
              )}
              {/* In-text Zen Mode Completion & Navigation Actions */}
              {isZenMode && (
                <div className="mt-12 pt-8 border-t border-inherit flex flex-wrap items-center justify-between gap-4 pb-6">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevChapter}
                      disabled={currentChapterIndex === 0}
                      className="flex items-center gap-1 px-3.5 py-2 rounded-xl border border-inherit text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                      <span>فصل قبلی</span>
                    </button>
                    {currentChapterIndex < chapters.length - 1 ? (
                      <button
                        onClick={handleNextChapter}
                        className="flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold transition-all active:scale-95"
                      >
                        <span>فصل بعدی</span>
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleFinish}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>پایان و ثبت خوانده‌شده (+۵۰ XP)</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsZenMode(false)}
                    className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>خروج از حالت مطالعه عمیق (Esc)</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right/Left Drawer for Section Notes & Highlights */}
          {showNotesDrawer && (
            <div className="w-72 sm:w-80 border-r border-inherit bg-inherit/95 backdrop-blur-md p-4 flex flex-col shrink-0 z-30 shadow-lg animate-in slide-in-from-right duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-inherit">
                <h4 className="font-bold text-sm flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span>یادداشت‌ها و نشانه‌ها</span>
                </h4>
                <button
                  onClick={() => setShowNotesDrawer(false)}
                  className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNoteSubmit} className="mt-3 space-y-2">
                <textarea
                  rows={3}
                  value={newNoteInput}
                  onChange={(e) => setNewNoteInput(e.target.value)}
                  placeholder="نکته یا برداشت خود از این بخش را بنویسید..."
                  className="w-full text-xs p-2.5 rounded-xl border border-inherit bg-black/3 dark:bg-white/5 outline-none resize-none"
                />
                <button
                  type="submit"
                  disabled={!newNoteInput.trim()}
                  className="w-full py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold transition-all flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ثبت یادداشت</span>
                </button>
              </form>

              {/* List of current notes & highlights */}
              <div className="flex-1 overflow-y-auto mt-4 space-y-3 no-scrollbar">
                {/* Highlights */}
                {currentBookHighlights.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block">
                      هایلایت‌های این بخش:
                    </span>
                    {currentBookHighlights.map((hl) => (
                      <div
                        key={hl.id}
                        className="p-2.5 rounded-xl text-xs bg-amber-500/10 border border-amber-500/30 space-y-1 relative group"
                      >
                        <p className="italic text-[11px] leading-relaxed line-clamp-3">
                          «{hl.text}»
                        </p>
                        <button
                          onClick={() => onDeleteHighlight(hl.id)}
                          className="absolute top-1.5 left-1.5 p-1 text-red-500 hover:bg-red-500/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                          title="حذف هایلایت"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Notes */}
                {currentBookNotes.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 block">
                      یادداشت‌های ثبت‌شده:
                    </span>
                    {currentBookNotes.map((nt) => (
                      <div
                        key={nt.id}
                        className="p-2.5 rounded-xl text-xs bg-black/5 dark:bg-white/5 border border-inherit space-y-1 relative group"
                      >
                        <p className="text-[11px] leading-relaxed">{nt.text}</p>
                        <button
                          onClick={() => onDeleteNote(nt.id)}
                          className="absolute top-1.5 left-1.5 p-1 text-red-500 hover:bg-red-500/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                          title="حذف یادداشت"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {currentBookHighlights.length === 0 && currentBookNotes.length === 0 && (
                  <div className="text-center py-8 text-neutral-400 text-xs">
                    هنوز هایلایت یا یادداشتی برای این فصل ثبت نشده است.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar (Hidden in Zen mode) */}
        {!isZenMode && (
          <footer className="px-4 py-3 border-t flex items-center justify-between border-inherit bg-inherit/90 backdrop-blur-xs shrink-0 relative z-20">
            <button
              onClick={handlePrevChapter}
              disabled={currentChapterIndex === 0}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentChapterIndex === 0
                  ? 'opacity-30 cursor-not-allowed'
                  : 'hover:bg-black/5 dark:hover:bg-white/10 active:scale-95'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
              <span>فصل قبلی</span>
            </button>

            {/* Center: Mark Completed or Done */}
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>پایان و ثبت خوانده‌شده (+۵۰ XP)</span>
            </button>

            <button
              onClick={handleNextChapter}
              disabled={currentChapterIndex >= chapters.length - 1}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentChapterIndex >= chapters.length - 1
                  ? 'opacity-30 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs active:scale-95'
              }`}
            >
              <span>فصل بعدی</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};
