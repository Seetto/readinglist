"use client";

import { useState, FormEvent, useCallback } from "react";
import { BookCard } from "./BookCard";
import type { BookResult } from "@/app/lib/types";

const GENRES = [
  "fiction",
  "fantasy",
  "science fiction",
  "mystery",
  "romance",
  "thriller",
  "nonfiction",
  "biography",
  "history",
  "self help",
  "young adult",
  "horror",
  "poetry",
  "comics",
  "cookbooks",
];

const PAGE_SIZE = 24;

export function Search() {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [books, setBooks] = useState<BookResult[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (pageNum: number) => {
      if (!title.trim() && !genre.trim()) return;
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (title.trim()) params.set("title", title.trim());
        if (genre.trim()) params.set("genre", genre.trim());
        params.set("page", String(pageNum));
        const res = await fetch(`/api/search?${params.toString()}`);
        const text = await res.text();
        let data: { error?: string; books?: BookResult[]; total?: number };
        try {
          data = text.length ? JSON.parse(text) : { books: [], total: 0 };
        } catch {
          setError("Search returned invalid data. Please try again.");
          setBooks([]);
          setTotal(0);
          return;
        }
        if (!res.ok) throw new Error(data.error ?? "Search failed");
        setBooks(data.books ?? []);
        setTotal(data.total ?? 0);
        setPage(pageNum);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setBooks([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [title, genre]
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() && !genre.trim()) {
      setError("Enter a title and/or choose a genre.");
      return;
    }
    await fetchPage(1);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-10">
        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex-1 min-w-0">
            <span className="block text-sm font-medium text-muted mb-1">
              Book title
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Lord of the Rings"
              className="w-full px-4 py-3 rounded-lg border border-stone-300 bg-white text-ink placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
            />
          </label>
          <label className="sm:w-52">
            <span className="block text-sm font-medium text-muted mb-1">
              Genre (optional)
            </span>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-stone-300 bg-white text-ink focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
            >
              <option value="">Any</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Searching…" : "Search"}
            </button>
          </div>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </form>

      {total > 0 && (
        <p className="text-muted text-sm mb-4">
          Found {total.toLocaleString()} result{total !== 1 ? "s" : ""}. Page{" "}
          {page} of {totalPages}.
        </p>
      )}

      {books.length > 0 ? (
        <>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <li key={book.id}>
                <BookCard book={book} />
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <nav
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
              aria-label="Search results pagination"
            >
              <button
                type="button"
                onClick={() => fetchPage(page - 1)}
                disabled={!hasPrev || loading}
                className="px-4 py-2 rounded-lg border border-stone-300 bg-white text-ink font-medium hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-muted text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => fetchPage(page + 1)}
                disabled={!hasNext || loading}
                className="px-4 py-2 rounded-lg border border-stone-300 bg-white text-ink font-medium hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </nav>
          )}
        </>
      ) : !loading && (title || genre) && !error ? (
        <p className="text-muted text-center py-12">
          No books found. Try a different title or genre.
        </p>
      ) : null}
    </div>
  );
}
