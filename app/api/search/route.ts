import { NextRequest, NextResponse } from "next/server";
import { toBookResult, type BookResult, type OpenLibraryDoc } from "@/app/lib/types";

const OPEN_LIBRARY_SEARCH = "https://openlibrary.org/search.json";
const USER_AGENT = "ReadingList (https://github.com/Seetto/readinglist)";

function buildSearchParams(request: NextRequest): URLSearchParams {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title")?.trim();
  const genre = searchParams.get("genre")?.trim();
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));

  const params = new URLSearchParams();
  params.set("limit", "24");
  params.set("page", String(page));
  params.set("fields", "key,title,author_name,first_publish_year,cover_i,subject,description,number_of_pages_median");

  // Genre only: use subject param. Title only: use q. Both: q + subject.
  if (title) {
    params.set("q", title);
  }
  if (genre) {
    params.set("subject", genre);
  }

  return params;
}

export async function GET(request: NextRequest) {
  const params = buildSearchParams(request);
  const hasQuery = params.get("q") || params.get("subject");
  if (!hasQuery) {
    return NextResponse.json(
      { error: "Provide at least one of: title, genre" },
      { status: 400 }
    );
  }

  const url = `${OPEN_LIBRARY_SEARCH}?${params.toString()}`;
  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
      },
      next: { revalidate: 300 },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Search request failed", details: String(err) },
      { status: 502 }
    );
  }

  const raw = await res.text();
  if (!res.ok) {
    return NextResponse.json(
      { error: "Search failed", details: raw.slice(0, 200) },
      { status: 502 }
    );
  }

  let data: { num_found?: number; start?: number; docs?: unknown[] };
  try {
    data = raw.length ? JSON.parse(raw) : { num_found: 0, start: 0, docs: [] };
  } catch {
    return NextResponse.json(
      { error: "Invalid response from search service" },
      { status: 502 }
    );
  }

  const docs = data.docs ?? [];
  const page = Math.max(1, parseInt(new URL(request.url).searchParams.get("page") ?? "1", 10));
  const results: BookResult[] = docs.map((d) => toBookResult(d as OpenLibraryDoc));

  return NextResponse.json({
    total: data.num_found ?? 0,
    start: data.start ?? 0,
    limit: 24,
    page,
    books: results,
  });
}
