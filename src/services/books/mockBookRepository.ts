import { initialBooks } from '../../data/sampleBooks';
import { Book } from '../../types';
import { localStorageService } from '../storage/localStorageService';
import { BookRepository } from './bookRepository';

const STORAGE_KEY = 'books';

const normalizeBook = (book: Book): Book => ({
  ...book,
  isPurchased: true,
  price: 0,
  isDownloaded: Boolean(book.isDownloaded),
});

export class MockBookRepository implements BookRepository {
  async getAll(): Promise<Book[]> {
    const stored = localStorageService.get<Book[] | null>(STORAGE_KEY, null);
    if (stored) return stored.map(normalizeBook);

    return initialBooks.map(normalizeBook);
  }

  async getById(id: number): Promise<Book | null> {
    const books = await this.getAll();
    return books.find((book) => book.id === id) ?? null;
  }

  async saveAll(books: Book[]): Promise<void> {
    localStorageService.set(STORAGE_KEY, books.map(normalizeBook));
  }
}

export const mockBookRepository = new MockBookRepository();
