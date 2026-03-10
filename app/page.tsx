import { Search } from "./components/Search";

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6">
      <header className="text-center mb-12">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink mb-2">
          Reading List
        </h1>
        <p className="text-muted max-w-lg mx-auto">
          Search by book title or genre. Results are powered by Open Library
          (similar data to Goodreads).
        </p>
      </header>
      <Search />
    </main>
  );
}
