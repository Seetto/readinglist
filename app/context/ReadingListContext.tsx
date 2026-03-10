"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { BookResult } from "@/app/lib/types";

const STORAGE_KEY = "readinglist-books";

type ReadingListContextValue = {
  books: BookResult[];
  addBook: (book: BookResult) => void;
  removeBook: (id: string) => void;
  isInList: (id: string) => boolean;
};

const ReadingListContext = createContext<ReadingListContextValue | null>(null);

function loadFromStorage(): BookResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BookResult[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(books: BookResult[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  } catch {
    // ignore
  }
}

export function ReadingListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [books, setBooks] = useState<BookResult[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setBooks(loadFromStorage());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) saveToStorage(books);
  }, [mounted, books]);

  const addBook = useCallback((book: BookResult) => {
    setBooks((prev) => {
      if (prev.some((b) => b.id === book.id)) return prev;
      return [...prev, book];
    });
  }, []);

  const removeBook = useCallback((id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const isInList = useCallback(
    (id: string) => books.some((b) => b.id === id),
    [books]
  );

  return (
    <ReadingListContext.Provider
      value={{ books, addBook, removeBook, isInList }}
    >
      {children}
    </ReadingListContext.Provider>
  );
}

export function useReadingList() {
  const ctx = useContext(ReadingListContext);
  if (!ctx)
    throw new Error("useReadingList must be used within ReadingListProvider");
  return ctx;
}
