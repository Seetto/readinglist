"use client";

import Image from "next/image";
import Link from "next/link";
import { useReadingList } from "@/app/context/ReadingListContext";
import { useEffect } from "react";

export default function ReportPage() {
  const { books } = useReadingList();

  useEffect(() => {
    const style = document.createElement("style");
    style.id = "report-print-styles";
    style.textContent = `
      @media print {
        body * { visibility: hidden; }
        #report-print-area, #report-print-area * { visibility: visible; }
        #report-print-area { position: absolute; left: 0; top: 0; width: 100%; }
        .no-print { display: none !important; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.getElementById("report-print-styles")?.remove();
    };
  }, []);

  const handlePrint = () => window.print();

  if (books.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link href="/" className="text-accent hover:underline">
          ← Back to search
        </Link>
        <p className="mt-6 text-muted">
          Your reading list is empty. Add some books from search or book pages,
          then come back to generate a report.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="no-print mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="text-accent hover:underline">
          ← Back to search
        </Link>
        <button
          type="button"
          onClick={handlePrint}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90"
        >
          Print / Save as PDF
        </button>
      </div>

      <div id="report-print-area" className="space-y-10">
        <header className="border-b border-stone-300 pb-6">
          <h1 className="font-serif text-3xl font-bold text-ink">
            Reading List Report
          </h1>
          <p className="mt-2 text-muted">
            {books.length} book{books.length !== 1 ? "s" : ""} in your list
          </p>
          <p className="mt-1 text-sm text-muted">
            Generated from Reading List · {new Date().toLocaleDateString("en-US", { dateStyle: "long" })}
          </p>
        </header>

        {books.map((book, index) => (
          <section
            key={book.id}
            className="break-inside-avoid border-b border-stone-200 pb-8 last:border-0"
          >
            <div className="flex gap-6">
              <div className="shrink-0">
                <div className="h-36 w-24 overflow-hidden rounded border border-stone-200 bg-stone-100">
                  {book.coverUrl ? (
                    <Image
                      src={book.coverUrl}
                      alt=""
                      width={96}
                      height={144}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-stone-400 text-xs">
                      No cover
                    </div>
                  )}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-muted">
                  {index + 1}. {book.title}
                </p>
                {book.authors.length > 0 && (
                  <p className="mt-1 text-sm text-ink">
                    {book.authors.join(", ")}
                  </p>
                )}
                {book.firstPublishYear && (
                  <p className="mt-0.5 text-sm text-muted">
                    First published: {book.firstPublishYear}
                  </p>
                )}
                {book.subject && book.subject.length > 0 && (
                  <p className="mt-1 text-xs text-muted">
                    {book.subject.slice(0, 5).join(" · ")}
                  </p>
                )}
                {book.description && (
                  <p className="mt-3 text-sm text-muted leading-relaxed">
                    {book.description}
                  </p>
                )}
              </div>
            </div>
          </section>
        ))}
      </div>

      <footer className="no-print mt-12 pt-6 text-center text-sm text-muted">
        <p>
          Share this report by using &quot;Print / Save as PDF&quot; and choosing
          &quot;Save as PDF&quot; or &quot;Microsoft Print to PDF&quot; as the
          destination.
        </p>
      </footer>
    </div>
  );
}
