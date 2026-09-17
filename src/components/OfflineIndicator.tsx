import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff, HardDriveDownload } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:left-6 z-50 flex items-center justify-between sm:justify-start gap-2.5 rounded-2xl bg-amber-600 dark:bg-amber-700 text-white px-4 py-2.5 shadow-xl text-xs font-semibold animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-amber-200 animate-pulse" />
        <span>حالت آفلاین — کتاب‌های ذخیره‌شده بدون اینترنت در دسترس هستند</span>
      </div>
      <HardDriveDownload className="w-4 h-4 opacity-80 shrink-0" />
    </div>
  );
};
