import React, { useState } from 'react';
import { Highlight, Note } from '../types';
import { Highlighter, FileText, Trash2, BookOpen, Quote, Clock, Search } from 'lucide-react';

interface NotesHighlightsViewProps {
  highlights: Highlight[];
  notes: Note[];
  onDeleteHighlight: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onOpenBook: (bookId: number) => void;
  isDarkMode: boolean;
}

export const NotesHighlightsView: React.FC<NotesHighlightsViewProps> = ({
  highlights,
  notes,
  onDeleteHighlight,
  onDeleteNote,
  onOpenBook,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'highlights' | 'notes'>('highlights');
  const [filterQuery, setFilterQuery] = useState('');

  const filteredHighlights = highlights.filter(
    (h) =>
      h.text.toLowerCase().includes(filterQuery.toLowerCase()) ||
      h.bookTitle.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const filteredNotes = notes.filter(
    (n) =>
      n.text.toLowerCase().includes(filterQuery.toLowerCase()) ||
      n.bookTitle.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const highlightColorClasses = {
    yellow: 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100',
    green: 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100',
    blue: 'bg-blue-100 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-950 dark:text-blue-100',
    purple: 'bg-purple-100 dark:bg-purple-950/60 border-purple-300 dark:border-purple-800 text-purple-950 dark:text-purple-100',
  };

  return (
    <div className="space-y-4 px-3 sm:px-4 py-2">
      {/* Top Toggle & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center rounded-2xl bg-neutral-200 dark:bg-neutral-800 p-1 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('highlights')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'highlights'
                ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <Highlighter className="w-3.5 h-3.5" />
            <span>هایلایت‌ها ({highlights.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'notes'
                ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>یادداشت‌ها ({notes.length})</span>
          </button>
        </div>

        {/* Filter Input */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs w-full sm:w-64 ${
            isDarkMode
              ? 'bg-neutral-800 border-neutral-700 text-white'
              : 'bg-white border-neutral-200 text-neutral-800'
          }`}
        >
          <Search className="w-3.5 h-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder="جستجو در متن یا نام کتاب..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-xs"
          />
        </div>
      </div>

      {/* Highlights Tab Content */}
      {activeTab === 'highlights' && (
        <div className="space-y-3">
          {filteredHighlights.length > 0 ? (
            filteredHighlights.map((hl) => (
              <div
                key={hl.id}
                className={`p-4 rounded-2xl border transition-all ${
                  highlightColorClasses[hl.color] || highlightColorClasses.yellow
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2 text-xs font-bold">
                  <span
                    onClick={() => onOpenBook(hl.bookId)}
                    className="flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{hl.bookTitle}</span>
                    {hl.chapterTitle && (
                      <span className="opacity-75 font-normal text-[11px]">
                        • {hl.chapterTitle}
                      </span>
                    )}
                  </span>

                  <button
                    onClick={() => onDeleteHighlight(hl.id)}
                    className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-neutral-400 hover:text-red-500 transition-colors"
                    title="حذف این هایلایت"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-start gap-2">
                  <Quote className="w-4 h-4 shrink-0 opacity-40 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed italic">
                    «{hl.text}»
                  </p>
                </div>

                <div className="mt-2 text-left">
                  <span className="text-[10px] opacity-60">
                    {new Date(hl.createdAt).toLocaleDateString('fa-IR')}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 space-y-2">
              <Highlighter className="w-10 h-10 mx-auto text-neutral-300 dark:text-neutral-600" />
              <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                هنوز هیچ جمله‌ای را هایلایت نکرده‌اید.
              </p>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                هنگام مطالعه کتاب در ریدر، می‌توانید جملات آموزنده را انتخاب و ذخیره کنید.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Notes Tab Content */}
      {activeTab === 'notes' && (
        <div className="space-y-3">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className={`p-4 rounded-2xl border shadow-xs transition-all ${
                  isDarkMode
                    ? 'bg-neutral-800/80 border-neutral-700/80 text-white'
                    : 'bg-white border-neutral-200/80 text-neutral-900'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                  <span
                    onClick={() => onOpenBook(note.bookId)}
                    className="flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{note.bookTitle}</span>
                    {note.chapterTitle && (
                      <span className="opacity-75 font-normal text-[11px] text-neutral-500">
                        • {note.chapterTitle}
                      </span>
                    )}
                  </span>

                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-400 hover:text-red-500 transition-colors"
                    title="حذف یادداشت"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-sm leading-relaxed whitespace-pre-wrap text-justify">
                  {note.text}
                </p>

                <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-700/50">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(note.createdAt).toLocaleDateString('fa-IR')}</span>
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 space-y-2">
              <FileText className="w-10 h-10 mx-auto text-neutral-300 dark:text-neutral-600" />
              <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                هنوز یادداشتی ثبت نکرده‌اید.
              </p>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                در صفحه ریدر می‌توانید افکار، بینش‌ها و خلاصه‌نویسی‌های خود را برای هر بخش ثبت کنید.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
