import { NextRequest, NextResponse } from "next/server";

const USER_AGENT = "ReadingList (https://github.com/Seetto/readinglist)";

type WorkResponse = {
  title?: string;
  description?: string | { type: string; value: string };
  covers?: number[];
  first_publish_date?: string;
  authors?: { author: { key: string } }[];
  subjects?: string[];
};

type AuthorResponse = { name?: string };

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id?.trim();
  if (!id) {
    return NextResponse.json({ error: "Missing book id" }, { status: 400 });
  }

  const workKey = id.startsWith("/works/") ? id : `/works/${id}`;
  const workUrl = `https://openlibrary.org${workKey}.json`;

  let workRes: Response;
  try {
    workRes = await fetch(workUrl, {
      headers: { "User-Agent": USER_AGENT },
      next: { revalidate: 3600 },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch book", details: String(err) },
      { status: 502 }
    );
  }

  if (!workRes.ok) {
    return NextResponse.json(
      { error: "Book not found" },
      { status: workRes.status === 404 ? 404 : 502 }
    );
  }

  const raw = await workRes.text();
  let work: WorkResponse;
  try {
    work = raw.length ? JSON.parse(raw) : {};
  } catch {
    return NextResponse.json(
      { error: "Invalid book data" },
      { status: 502 }
    );
  }

  const authorKeys = (work.authors ?? [])
    .map((a) => a.author?.key)
    .filter(Boolean) as string[];
  const authorNames: string[] = [];

  if (authorKeys.length > 0) {
    const authorPromises = authorKeys.slice(0, 5).map((key) =>
      fetch(`https://openlibrary.org${key}.json`, {
        headers: { "User-Agent": USER_AGENT },
        next: { revalidate: 3600 },
      }).then((r) => r.json() as Promise<AuthorResponse>)
    );
    const authorResults = await Promise.all(authorPromises);
    authorNames.push(
      ...authorResults.map((a) => a.name || "Unknown").filter(Boolean)
    );
  }

  const description =
    typeof work.description === "string"
      ? work.description
      : work.description?.value ?? "";
  const coverId = work.covers?.[0];
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : null;

  return NextResponse.json({
    id: workKey.replace("/works/", ""),
    title: work.title ?? "Unknown",
    description,
    coverUrl,
    firstPublishDate: work.first_publish_date ?? null,
    authors: authorNames,
    subjects: work.subjects ?? [],
  });
}
