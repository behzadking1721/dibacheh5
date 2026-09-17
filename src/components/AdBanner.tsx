import React, { useState } from 'react';
import { AdItem } from '../types';
import { Megaphone, ExternalLink, X, Sparkles } from 'lucide-react';

interface AdBannerProps {
  ad: AdItem;
  variant?: 'banner' | 'infeed' | 'compact';
  isDarkMode: boolean;
}

export const AdBanner: React.FC<AdBannerProps> = ({ ad, variant = 'infeed', isDarkMode }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !ad.active) return null;

  if (variant === 'compact') {
    return (
      <div
        className={`mx-3 sm:mx-4 my-2 px-3 py-2 rounded-xl border flex items-center justify-between gap-2 text-xs relative ${
          isDarkMode
            ? 'bg-neutral-800/80 border-neutral-700 text-neutral-300'
            : 'bg-neutral-100 border-neutral-200 text-neutral-700'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-[10px]">
            آگهی
          </span>
          <span className="font-semibold truncate">{ad.title}</span>
        </div>
        <a
          href={ad.ctaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span>{ad.ctaText}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  return (
    <div className="mx-3 sm:mx-4 my-3">
      <div
        className={`rounded-2xl p-4 sm:p-5 relative overflow-hidden border shadow-xs transition-all ${
          isDarkMode
            ? 'bg-gradient-to-r from-neutral-900 via-neutral-850 to-neutral-900 border-neutral-700/70 text-white'
            : 'bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-slate-50 border-blue-200/80 text-neutral-900'
        }`}
      >
        {/* Ad Header with Dismiss button */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-500 dark:text-neutral-400">
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-black text-[10px] flex items-center gap-1 border border-amber-500/30">
              <Megaphone className="w-3 h-3" />
              <span>{ad.badge || 'آگهی اسپانسر'}</span>
            </span>
            <span className="text-[10px] opacity-75">• اسپانسر شده توسط {ad.sponsorName}</span>
          </div>

          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
            title="بستن این آگهی"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Ad Content */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1 flex-1">
            <h4 className="text-sm sm:text-base font-bold leading-snug">
              {ad.title}
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {ad.description}
            </p>
          </div>

          <a
            href={ad.ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{ad.ctaText}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
