"use client";

import Image from "next/image";
import Link from "next/link";
import { useReadingList } from "@/app/context/ReadingListContext";
import type { BookResult } from "@/app/lib/types";
import { useEffect, useState } from "react";

export default function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string | null>(null);
  const [book, setBook] = useState<{
    title: string;
    description: string;
    coverUrl: string | null;
    firstPublishDate: string | null;
    authors: string[];
    subjects: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addBook, isInList } = useReadingList();

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetch(`/api/book/${encodeURIComponent(id)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Book not found");
        return res.json();
      })
      .then((data) => setBook(data))
      .catch(() => setError("Could not load this book."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !id) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center text-muted">
        Loading…
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-red-600">{error ?? "Book not found."}</p>
        <Link href="/" className="mt-4 inline-block text-accent hover:underline">
          ← Back to search
        </Link>
      </div>
    );
  }

  const inList = isInList(id);
  const bookForList: BookResult = {
    id,
    title: book.title,
    authors: book.authors,
    coverUrl: book.coverUrl,
    description: book.description || undefined,
    subject: book.subjects,
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-muted hover:text-accent"
      >
        ← Back to search
      </Link>

      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="shrink-0 mx-auto sm:mx-0">
          <div className="h-64 w-40 overflow-hidden rounded-lg border border-stone-200 bg-stone-200 sm:h-80 sm:w-52">
            {book.coverUrl ? (
              <Image
                src={book.coverUrl}
                alt={`Cover for ${book.title}`}
                width={208}
                height={320}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-stone-400 font-serif text-sm">
                No cover
              </div>
            )}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-serif text-2xl font-bold text-ink sm:text-3xl">
            {book.title}
          </h1>
          {book.authors.length > 0 && (
            <p className="mt-1 text-muted">
              {book.authors.join(", ")}
            </p>
          )}
          {book.firstPublishDate && (
            <p className="mt-1 text-sm text-muted">
              First published: {book.firstPublishDate}
            </p>
          )}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => addBook(bookForList)}
              disabled={inList}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {inList ? "In reading list" : "Add to reading list"}
            </button>
          </div>
        </div>
      </div>

      {book.subjects.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-medium text-muted">Subjects</h2>
          <p className="mt-1 text-ink">
            {book.subjects.slice(0, 15).join(" · ")}
          </p>
        </div>
      )}

      {book.description && (
        <div className="mt-8">
          <h2 className="font-serif text-lg font-semibold text-ink">
            About this book
          </h2>
          <div className="mt-2 whitespace-pre-wrap text-muted leading-relaxed">
            {book.description.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n")}
          </div>
        </div>
      )}
    </article>
  );
}
