import { Book } from '../../types';

export interface BookRepository {
  getAll(): Promise<Book[]>;
  getById(id: number): Promise<Book | null>;
  saveAll(books: Book[]): Promise<void>;
}
