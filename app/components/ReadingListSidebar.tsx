"use client";

import Image from "next/image";
import Link from "next/link";
import { useReadingList } from "@/app/context/ReadingListContext";
import type { BookResult } from "@/app/lib/types";

export function ReadingListSidebar() {
  const { books, removeBook } = useReadingList();

  return (
    <aside className="w-full lg:w-72 shrink-0 border-t lg:border-t-0 lg:border-l border-stone-200 bg-white/60 lg:min-h-[calc(100vh-2rem)]">
      <div className="sticky top-4 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-semibold text-ink">Current reading list</h2>
        </div>
        {books.length === 0 ? (
          <p className="text-sm text-muted">No books added yet. Search and add some.</p>
        ) : (
          <ul className="space-y-3">
            {books.map((book) => (
              <li key={book.id} className="group">
                <div className="flex gap-2 rounded-lg border border-stone-200 bg-white p-2">
                  <Link
                    href={`/book/${book.id}`}
                    className="flex min-w-0 flex-1 gap-2 no-underline text-inherit hover:opacity-90"
                  >
                    <div className="h-14 w-10 shrink-0 overflow-hidden rounded bg-stone-200">
                      {book.coverUrl ? (
                        <Image
                          src={book.coverUrl}
                          alt=""
                          width={40}
                          height={56}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="h-full w-full bg-stone-200" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink line-clamp-2 leading-tight">
                        {book.title}
                      </p>
                      {book.authors.length > 0 && (
                        <p className="text-xs text-muted line-clamp-1">
                          {book.authors[0]}
                        </p>
                      )}
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeBook(book.id)}
                    className="shrink-0 self-start rounded p-1 text-muted hover:bg-stone-200 hover:text-ink"
                    title="Remove from list"
                    aria-label={`Remove ${book.title} from list`}
                  >
                    <span aria-hidden>×</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {books.length > 0 && (
          <div className="space-y-2 pt-1">
            <Link
              href="/report"
              className="block w-full rounded-lg bg-accent px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-accent/90"
            >
              Generate report
            </Link>
            <Link
              href="/editor"
              className="block w-full rounded-lg border border-accent/40 bg-white px-4 py-2 text-center text-xs font-medium text-accent hover:bg-accent/5"
            >
              Open design editor (beta)
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
