"use client";

import Image from "next/image";
import Link from "next/link";
import { useReadingList } from "@/app/context/ReadingListContext";
import { useEffect, useState } from "react";

type ReportMeta = {
  yearGroupTitle: string;
  listTitle: string;
  listSubtitle: string;
  listDescription: string;
};

const META_STORAGE_KEY = "readinglist-report-meta-v1";

const defaultMeta: ReportMeta = {
  yearGroupTitle: "LOWER SECONDARY",
  listTitle: "TRADITIONAL CLASSICS",
  listSubtitle: "YEAR 7 – 9",
  listDescription:
    "A traditional classic is a book that has been written in the past, yet has remained meaningful across time. These books endure because they explore shared human experiences — friendship, courage, change, and hope — and continue to resonate with new readers. Use this list to introduce students to timeless stories that invite reflection, spark conversation, and build a love of reading.",
};

export default function ReportPage() {
  const { books } = useReadingList();
  const [meta, setMeta] = useState<ReportMeta>(defaultMeta);
  const [showEditor, setShowEditor] = useState(false);

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

  // Load saved meta on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(META_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<ReportMeta>;
      setMeta((prev) => ({ ...prev, ...parsed }));
    } catch {
      // ignore
    }
  }, []);

  // Persist meta when it changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(META_STORAGE_KEY, JSON.stringify(meta));
    } catch {
      // ignore
    }
  }, [meta]);

  const handlePrint = () => window.print();

  const reportDate = new Date().toLocaleDateString("en-US", {
    dateStyle: "long",
  });

  if (books.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
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
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Controls (not printed) */}
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="text-accent hover:underline">
          ← Back to search
        </Link>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowEditor((v) => !v)}
            className="rounded-lg border border-stone-300 bg-white/80 px-3 py-1.5 text-xs font-medium text-muted hover:bg-stone-50"
          >
            {showEditor ? "Hide text options" : "Edit headings & write-up"}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90"
          >
            Print / Save as PDF
          </button>
        </div>
      </div>

      {showEditor && (
        <div className="no-print mb-8 rounded-xl border border-stone-200 bg-white/80 p-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-[0.18em]">
              Year group heading
            </label>
            <input
              type="text"
              value={meta.yearGroupTitle}
              onChange={(e) =>
                setMeta((m) => ({ ...m, yearGroupTitle: e.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-[0.18em]">
                List title
              </label>
              <input
                type="text"
                value={meta.listTitle}
                onChange={(e) =>
                  setMeta((m) => ({ ...m, listTitle: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-[0.18em]">
                List subtitle (e.g. year group)
              </label>
              <input
                type="text"
                value={meta.listSubtitle}
                onChange={(e) =>
                  setMeta((m) => ({ ...m, listSubtitle: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-[0.18em]">
              Write-up about this list
            </label>
            <textarea
              value={meta.listDescription}
              onChange={(e) =>
                setMeta((m) => ({ ...m, listDescription: e.target.value }))
              }
              rows={5}
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      )}

      {/* Printable content */}
      <div
        id="report-print-area"
        className="overflow-hidden rounded-xl bg-[#0b1035] text-white shadow-md"
      >
        {/* Top band with year group title */}
        <header className="bg-[#f7aecd] px-6 py-4 text-center uppercase tracking-[0.35em] text-xs font-semibold text-[#0b1035]">
          {meta.yearGroupTitle || "READING LIST"}
        </header>

        {/* Hero cards row inspired by Canva design */}
        <section className="flex flex-col gap-4 border-b border-[#f7aecd]/30 bg-[#0b1035] px-6 py-8 md:flex-row">
          <HeroCard
            title="Traditional Classics"
            accent="View list"
            shape="diamond"
          />
          <HeroCard
            title="Modern Classics"
            accent="View list"
            variant="light"
          />
          <HeroCard
            title="Popular Choice"
            accent="View list"
            shape="bars"
          />
        </section>

        {/* List write-up block */}
        <section className="border-b border-[#f7aecd]/30 bg-[#0b1035] px-6 py-8 md:px-10">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="md:w-1/3">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f7aecd]">
                {meta.listTitle || "Reading List"}
              </p>
              {meta.listSubtitle && (
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
                  {meta.listSubtitle}
                </p>
              )}
              <div className="mt-6 h-24 w-24 rounded-[40%] border border-[#f7aecd]/60 bg-[#151b4d]" />
            </div>
            <div className="md:flex-1 text-sm leading-relaxed text-[#f9eaf5] whitespace-pre-wrap">
              {meta.listDescription}
            </div>
          </div>
          <p className="mt-4 text-xs text-[#f9eaf5]/70">
            {books.length} book{books.length !== 1 ? "s" : ""} · Generated on{" "}
            {reportDate}
          </p>
        </section>

        {/* Books list */}
        <section id="reading-list">
          {books.map((book, index) => {
            const isDark = index % 2 === 1;
            const sectionBase =
              "break-inside-avoid px-6 py-8 md:px-10 flex flex-col gap-6 md:flex-row";
            const sectionColors = isDark
              ? " bg-[#0b1035] text-white"
              : " bg-[#fff7f0] text-[#0b1035]";
            const headingColor = isDark ? "text-[#f7aecd]" : "text-[#1c7c4d]";
            const authorColor = isDark
              ? "text-white/80"
              : "text-[#0b1035]/80";
            const bodyColor = isDark ? "text-[#f3e7ff]" : "text-[#4b3f3a]";

            return (
              <section
                key={book.id}
                className={sectionBase + sectionColors}
              >
                <div className="shrink-0 md:basis-1/3">
                  <div className="mx-auto h-40 w-28 overflow-hidden rounded-lg border border-black/10 bg-black/10 md:mx-0 md:h-52 md:w-36">
                    {book.coverUrl ? (
                      <Image
                        src={book.coverUrl}
                        alt=""
                        width={144}
                        height={208}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-white/70">
                        No cover
                      </div>
                    )}
                  </div>
                </div>
                <div className="min-w-0 md:flex-1">
                  <h2
                    className={
                      "font-serif text-xl font-bold tracking-wide " +
                      headingColor
                    }
                  >
                    {book.title}
                  </h2>
                  {book.authors.length > 0 && (
                    <p className={"mt-1 text-sm font-medium " + authorColor}>
                      {book.authors.join(", ")}
                    </p>
                  )}
                  {book.firstPublishYear && (
                    <p className={"mt-1 text-xs " + authorColor}>
                      First published: {book.firstPublishYear}
                    </p>
                  )}
                  {book.subject && book.subject.length > 0 && (
                    <p className={"mt-2 text-xs uppercase " + authorColor}>
                      {book.subject.slice(0, 5).join(" · ")}
                    </p>
                  )}
                  {book.description && (
                    <p className={"mt-3 text-sm leading-relaxed " + bodyColor}>
                      {book.description}
                    </p>
                  )}
                </div>
              </section>
            );
          })}
        </section>
      </div>

      <footer className="no-print mt-6 pt-4 text-center text-xs text-muted">
        <p>
          Use &quot;Print / Save as PDF&quot; to share this reading list design
          with colleagues, students, or friends.
        </p>
      </footer>
    </div>
  );
}

function HeroCard({
  title,
  accent,
  variant = "dark",
  shape = "diamond",
}: {
  title: string;
  accent: string;
  variant?: "dark" | "light";
  shape?: "diamond" | "bars";
}) {
  const isLight = variant === "light";
  const base =
    "flex-1 rounded-xl px-6 py-7 text-center flex flex-col items-center justify-between gap-4";
  const colors = isLight
    ? " bg-[#fff7f0] text-[#0b1035] border border-[#f7aecd]"
    : " bg-[#0b1035] text-white border border-[#f7aecd]/40";

  return (
    <div className={base + " " + colors}>
      <h2 className="font-serif text-sm font-semibold uppercase tracking-[0.2em]">
        {title}
      </h2>
      <div className="mt-4 flex h-20 w-24 items-center justify-center">
        {shape === "bars" ? (
          <div className="flex h-16 w-16 items-end gap-1">
            <div className="h-5 w-3 bg-[#f7aecd]" />
            <div className="h-8 w-3 bg-[#f7aecd]" />
            <div className="h-11 w-3 bg-[#f7aecd]" />
            <div className="h-14 w-3 bg-[#f7aecd]" />
          </div>
        ) : (
          <div className="h-16 w-16 rotate-45 rounded-[40%] border border-[#f7aecd]/70 bg-[#151b4d]" />
        )}
      </div>
      <div className="mt-4">
        <span className="inline-block rounded-full border border-[#f7aecd] px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#f7aecd]">
          {accent}
        </span>
      </div>
    </div>
  );
}
