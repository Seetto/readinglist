"use client";

import Image from "next/image";
import Link from "next/link";
import { useReadingList } from "@/app/context/ReadingListContext";
import type { BookResult } from "@/app/lib/types";

interface BookCardProps {
  book: BookResult;
}

export function BookCard({ book }: BookCardProps) {
  const { addBook, isInList } = useReadingList();
  const inList = isInList(book.id);

  return (
    <article className="flex gap-4 p-4 rounded-xl bg-white/80 border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
      <Link
        href={`/book/${book.id}`}
        className="shrink-0 w-24 h-[10.5rem] rounded-md overflow-hidden bg-stone-200 block focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
      >
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt={`Cover for ${book.title}`}
            width={96}
            height={144}
            className="w-full h-full object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs font-serif">
            No cover
          </div>
        )}
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          href={`/book/${book.id}`}
          className="no-underline text-inherit hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded"
        >
          <h2 className="font-serif font-semibold text-ink line-clamp-2 leading-snug">
            {book.title}
          </h2>
        </Link>
        {book.authors.length > 0 && (
          <p className="text-sm text-muted mt-0.5">
            {book.authors.slice(0, 2).join(", ")}
            {book.authors.length > 2 && " et al."}
          </p>
        )}
        <div className="flex flex-wrap gap-2 mt-2">
          {book.firstPublishYear && (
            <span className="text-xs text-muted">
              {book.firstPublishYear}
            </span>
          )}
          {book.subject && book.subject.length > 0 && (
            <span className="text-xs text-muted truncate max-w-[10rem]">
              · {book.subject.slice(0, 2).join(", ")}
            </span>
          )}
        </div>
        {book.description && (
          <p className="text-sm text-muted mt-2 line-clamp-3">
            {book.description}
          </p>
        )}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => addBook(book)}
            disabled={inList}
            className="text-sm font-medium text-accent hover:underline disabled:opacity-60 disabled:cursor-not-allowed disabled:no-underline"
          >
            {inList ? "In reading list" : "Add to reading list"}
          </button>
        </div>
      </div>
    </article>
  );
}
