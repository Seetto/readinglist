import type { BookResult } from "@/app/lib/types";

export type FontFamily = "serif" | "sans";
export type TextAlign = "left" | "center" | "right";

export type BaseElement = {
  id: string;
  type: "text" | "shape" | "image";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  zIndex: number;
};

export type TextElement = BaseElement & {
  type: "text";
  text: string;
  fontFamily: FontFamily;
  fontSize: number;
  fontWeight: "normal" | "bold";
  color: string;
  align: TextAlign;
  lineHeight: number;
};

export type ShapeElement = BaseElement & {
  type: "shape";
  shape: "rect" | "pill" | "circle";
  fill: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
};

export type ImageElement = BaseElement & {
  type: "image";
  src: string;
  alt: string;
  borderRadius: number;
};

export type Element = TextElement | ShapeElement | ImageElement;

export type Page = {
  id: string;
  width: number;
  height: number;
  backgroundColor: string;
  elements: Element[];
};

export type Document = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  pages: Page[];
};

export function createId() {
  return Math.random().toString(36).slice(2, 10);
}

function fontSizeFromPreset(preset: "sm" | "md" | "lg" | undefined): number {
  if (preset === "sm") return 28;
  if (preset === "md") return 36;
  return 44;
}

export function createDefaultDocumentFromCurrentReport(
  books: BookResult[]
): Document {
  const page: Page = {
    id: createId(),
    width: 900,
    height: 1400,
    backgroundColor: "#ffffff",
    elements: [],
  };

  const elements: Element[] = [];

  // Cover heading
  elements.push({
    id: createId(),
    type: "text",
    x: 80,
    y: 80,
    width: 400,
    height: 120,
    text: "READING LISTS",
    fontFamily: "serif",
    fontSize: 64,
    fontWeight: "bold",
    color: "#12172F",
    align: "left",
    lineHeight: 1.1,
    zIndex: 10,
  });

  // Pink circle
  elements.push({
    id: createId(),
    type: "shape",
    x: 550,
    y: 40,
    width: 220,
    height: 220,
    shape: "circle",
    fill: "#F7AECB1A",
    borderColor: "#F7AECB",
    borderWidth: 6,
    borderRadius: 999,
    zIndex: 2,
  });

  // Intro band
  elements.push({
    id: createId(),
    type: "shape",
    x: 0,
    y: 260,
    width: 900,
    height: 260,
    shape: "rect",
    fill: "#F7AECB",
    borderColor: "#F7AECB",
    borderWidth: 0,
    borderRadius: 0,
    zIndex: 1,
  });

  // Intro text
  elements.push({
    id: createId(),
    type: "text",
    x: 360,
    y: 290,
    width: 460,
    height: 200,
    text:
      "Our reading lists serve as a recommended reading guide, highlighting high-quality, engaging books that broaden perspectives, build critical thinking skills, and strengthen the literacy foundations that underpin academic success across all subject areas.\n\n" +
      "These lists have been mindfully created and curated to inspire a love of reading for life and to support students as they grow as readers.\n\n" +
      "Happy reading!",
    fontFamily: "sans",
    fontSize: 14,
    fontWeight: "normal",
    color: "#3D3040",
    align: "left",
    lineHeight: 1.5,
    zIndex: 11,
  });

  // Small navy book block
  elements.push({
    id: createId(),
    type: "shape",
    x: 120,
    y: 310,
    width: 90,
    height: 130,
    shape: "rect",
    fill: "#12172F",
    borderColor: "#12172F",
    borderWidth: 0,
    borderRadius: 18,
    zIndex: 11,
  });

  // LOWER SECONDARY band
  elements.push({
    id: createId(),
    type: "shape",
    x: 0,
    y: 520,
    width: 900,
    height: 48,
    shape: "rect",
    fill: "#F7AECB",
    borderColor: "#F7AECB",
    borderWidth: 0,
    borderRadius: 0,
    zIndex: 1,
  });

  elements.push({
    id: createId(),
    type: "text",
    x: 350,
    y: 532,
    width: 200,
    height: 24,
    text: "LOWER SECONDARY",
    fontFamily: "sans",
    fontSize: 11,
    fontWeight: "bold",
    color: "#12172F",
    align: "center",
    lineHeight: 1.2,
    zIndex: 11,
  });

  // Hero cards (simplified)
  const cardWidth = 260;
  const cardHeight = 200;
  const cardY = 590;
  const cardGap = 20;
  const cardX1 = 40;
  const cardX2 = cardX1 + cardWidth + cardGap;
  const cardX3 = cardX2 + cardWidth + cardGap;

  const heroCards = [
    { x: cardX1, title: "TRADITIONAL CLASSICS" },
    { x: cardX2, title: "MODERN CLASSICS" },
    { x: cardX3, title: "POPULAR CHOICE" },
  ];

  heroCards.forEach((card, idx) => {
    const baseZ = 5 + idx * 2;
    elements.push({
      id: createId(),
      type: "shape",
      x: card.x,
      y: cardY,
      width: cardWidth,
      height: cardHeight,
      shape: "rect",
      fill: idx === 1 ? "#FFF7F0" : "#0B1035",
      borderColor: "#F7AECB",
      borderWidth: 1,
      borderRadius: 18,
      zIndex: baseZ,
    });
    elements.push({
      id: createId(),
      type: "text",
      x: card.x + 24,
      y: cardY + 26,
      width: cardWidth - 48,
      height: 32,
      text: card.title,
      fontFamily: "serif",
      fontSize: 12,
      fontWeight: "bold",
      color: idx === 1 ? "#0B1035" : "#FFFFFF",
      align: "left",
      lineHeight: 1.2,
      zIndex: baseZ + 1,
    });
  });

  // First list section heading and body
  elements.push({
    id: createId(),
    type: "text",
    x: 80,
    y: 840,
    width: 300,
    height: 32,
    text: "TRADITIONAL CLASSICS",
    fontFamily: "serif",
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    align: "left",
    lineHeight: 1.2,
    zIndex: 11,
  });

  elements.push({
    id: createId(),
    type: "text",
    x: 80,
    y: 874,
    width: 200,
    height: 24,
    text: "YEAR 7 – 9",
    fontFamily: "sans",
    fontSize: 11,
    fontWeight: "bold",
    color: "#FFFFFF",
    align: "left",
    lineHeight: 1.2,
    zIndex: 11,
  });

  elements.push({
    id: createId(),
    type: "text",
    x: 80,
    y: 910,
    width: 480,
    height: 210,
    text:
      "A traditional classic is a book that has been written in the past, yet has remained meaningful across time. These books endure because they explore shared human experiences — friendship, courage, change, and hope — and continue to resonate with new readers. Use this list to introduce students to timeless stories that invite reflection, spark conversation, and build a love of reading.",
    fontFamily: "sans",
    fontSize: 13,
    fontWeight: "normal",
    color: "#F3E7FF",
    align: "left",
    lineHeight: 1.5,
    zIndex: 11,
  });

  // First few books on the right
  const baseBookX = 580;
  const baseBookY = 930;
  const gapY = 260;
  books.slice(0, 3).forEach((book, idx) => {
    const y = baseBookY + idx * gapY;
    if (book.coverUrl) {
      elements.push({
        id: createId(),
        type: "image",
        x: baseBookX,
        y,
        width: 170,
        height: 230,
        src: book.coverUrl,
        alt: book.title,
        borderRadius: 12,
        zIndex: 11,
      });
    }
    elements.push({
      id: createId(),
      type: "text",
      x: baseBookX,
      y: y + 240,
      width: 170,
      height: 40,
      text: book.title,
      fontFamily: "serif",
      fontSize: 12,
      fontWeight: "bold",
      color: "#FFFFFF",
      align: "left",
      lineHeight: 1.2,
      zIndex: 11,
    });
  });

  page.elements = elements;

  const now = new Date().toISOString();
  return {
    id: createId(),
    title: "Reading List Report",
    createdAt: now,
    updatedAt: now,
    pages: [page],
  };
}

