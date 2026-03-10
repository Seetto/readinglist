import type { Metadata } from "next";
import { Literata, DM_Sans } from "next/font/google";
import { AppLayout } from "./components/AppLayout";
import "./globals.css";

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reading List — Find & save books",
  description: "Search books by title and genre, then build your reading list.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${literata.variable} ${dmSans.variable}`}>
      <body className="min-h-screen font-sans antialiased bg-paper text-ink">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
