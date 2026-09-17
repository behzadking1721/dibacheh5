export interface Chapter {
  id: number;
  title: string;
  content: string;
}

export interface Highlight {
  id: string;
  bookId: number;
  bookTitle: string;
  text: string;
  color: 'yellow' | 'green' | 'blue' | 'purple';
  chapterTitle?: string;
  createdAt: string;
}

export interface Note {
  id: string;
  bookId: number;
  bookTitle: string;
  text: string;
  chapterTitle?: string;
  createdAt: string;
}

export interface BookReview {
  id: string;
  bookId: number;
  userName: string;
  avatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  accentColor?: string;
  category: string;
  readTime: string;
  rating: number;
  publishYear: number;
  isFavorite: boolean;
  isRead: boolean;
  isPurchased: boolean;
  isDownloaded?: boolean; // For offline mode
  isWantToRead?: boolean; // For "Books to read" queue
  isTrending?: boolean; // Trending hot books
  isEditorChoice?: boolean; // Recommended books
  isClassic?: boolean; // Famous all-time classics
  isNew?: boolean; // New releases
  price: number;
  progress: number; // 0 to 1
  epubUrl?: string;
  summary: string;
  keyPoints: string[];
  chapters?: Chapter[];
  isBookOfDay?: boolean;
  downloadsCount?: number;
  reviews?: BookReview[];
}

export interface UserStats {
  streakDays: number;
  lastReadDate: string; // YYYY-MM-DD
  dailyGoalMinutes: number;
  todayMinutesRead: number;
  monthlyChallengeGoal: number; // e.g. 4 books
  completedBooksThisMonth: number;
  xpPoints: number;
  level: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  joinedDate: string;
  membershipType: 'free' | 'premium';
  notificationsEnabled: boolean;
  offlineSyncEnabled: boolean;
}

export interface AdItem {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  sponsorName: string;
  badge: string;
  imageUrl?: string;
  bgColor?: string;
  active: boolean;
}

export type TabType = 'home' | 'wantToRead' | 'favorites' | 'read' | 'notes' | 'offline' | 'profile' | 'admin';
export type SortOption = 'title' | 'rating' | 'year' | 'popular';
export type ReaderTheme = 'light' | 'sepia' | 'dark';
