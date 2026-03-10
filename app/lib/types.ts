// Open Library search response types
export interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name?: string[];
  author_key?: string[];
  first_publish_year?: number;
  cover_i?: number;
  edition_count?: number;
  number_of_pages_median?: number;
  subject?: string[];
  isbn?: string[];
  publisher?: string[];
  language?: string[];
  description?: string | { type: string; value: string };
  first_sentence?: { type: string; value: string };
}

export interface OpenLibrarySearchResponse {
  start: number;
  num_found: number;
  numFoundExact?: boolean;
  docs: OpenLibraryDoc[];
}

// Normalized book for our UI
export interface BookResult {
  id: string;
  title: string;
  authors: string[];
  firstPublishYear?: number;
  coverUrl: string | null;
  subject?: string[];
  description?: string;
  pageCount?: number;
}

export function toBookResult(doc: OpenLibraryDoc): BookResult {
  const description =
    typeof doc.description === "string"
      ? doc.description
      : doc.description?.value;
  return {
    id: doc.key.replace("/works/", ""),
    title: doc.title,
    authors: doc.author_name ?? [],
    firstPublishYear: doc.first_publish_year,
    coverUrl: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
      : null,
    subject: doc.subject,
    description: description?.slice(0, 500),
    pageCount: doc.number_of_pages_median,
  };
}
