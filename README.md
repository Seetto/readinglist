# Reading List

A Next.js app to search for books by **title** and **genre**, then (later) add them to a reading list with cover and description.

## Book data

Book search uses the [Open Library API](https://openlibrary.org/developers/api), which provides similar data to Goodreads (covers, authors, descriptions, subjects). Goodreads no longer offers a public API, so Open Library is a free, reliable alternative.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Search by title** – e.g. “The Lord of the Rings”
- **Search by genre** – e.g. fantasy, mystery, nonfiction
- **Combine both** – e.g. title “dune” + genre “science fiction”
- Results show cover, author(s), year, subjects, and a short description

## Next steps (your goal)

- Add “Add to reading list” on each book card
- Persist the list (e.g. localStorage or a database)
- A dedicated page or section showing your list with covers and “what the book is about”

## Tech

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Open Library Search API
