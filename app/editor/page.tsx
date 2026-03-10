"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { Rnd } from "react-rnd";
import Link from "next/link";
import { useReadingList } from "@/app/context/ReadingListContext";

type ElementType = "text" | "shape" | "image";

type CanvasElementBase = {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
};

type TextElement = CanvasElementBase & {
  type: "text";
  text: string;
  fontSize: number;
  fontFamily: "serif" | "sans";
  fontWeight: "normal" | "bold";
  color: string;
  align: "left" | "center" | "right";
};

type ShapeElement = CanvasElementBase & {
  type: "shape";
  variant: "rect" | "pill" | "circle";
  fill: string;
  borderColor: string;
};

type ImageElement = CanvasElementBase & {
  type: "image";
  src: string;
  alt: string;
  borderRadius: number;
};

type CanvasElement = TextElement | ShapeElement | ImageElement;

const STORAGE_KEY = "readinglist-editor-v1";

function createId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function EditorPage() {
  const { books } = useReadingList();
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState<string>("#fff7f0");

  // Load saved design
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        elements?: CanvasElement[];
        bgColor?: string;
      };
      if (parsed.elements) setElements(parsed.elements);
      if (parsed.bgColor) setBgColor(parsed.bgColor);
    } catch {
      // ignore
    }
  }, []);

  // Persist design
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ elements, bgColor })
      );
    } catch {
      // ignore
    }
  }, [elements, bgColor]);

  const selected = elements.find((el) => el.id === selectedId) ?? null;

  function addText() {
    const el: TextElement = {
      id: createId(),
      type: "text",
      x: 80,
      y: 80,
      width: 260,
      height: 80,
      text: "Double-click to edit",
      fontSize: 20,
      fontFamily: "serif",
      fontWeight: "bold",
      color: "#0b1035",
      align: "left",
    };
    setElements((prev) => [...prev, el]);
    setSelectedId(el.id);
  }

  function addShape(variant: ShapeElement["variant"]) {
    const el: ShapeElement = {
      id: createId(),
      type: "shape",
      x: 120,
      y: 120,
      width: 160,
      height: 90,
      variant,
      fill: "#f7aecd",
      borderColor: "#f7aecd",
    };
    setElements((prev) => [...prev, el]);
    setSelectedId(el.id);
  }

  function addCoverFromFirstBook() {
    const first = books[0];
    if (!first || !first.coverUrl) return;
    const el: ImageElement = {
      id: createId(),
      type: "image",
      x: 60,
      y: 140,
      width: 160,
      height: 230,
      src: first.coverUrl,
      alt: first.title,
      borderRadius: 8,
    };
    setElements((prev) => [...prev, el]);
    setSelectedId(el.id);
  }

  function updateElement(id: string, patch: Partial<CanvasElement>) {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...patch } as CanvasElement : el))
    );
  }

  function deleteSelected() {
    if (!selectedId) return;
    setElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  }

  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col gap-4 px-4 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm text-muted">
          <Link href="/" className="text-accent hover:underline">
            ← Back to search
          </Link>
          <span className="hidden text-xs md:inline">
            Experimental editor — drag, resize, and customise elements. Layout
            is saved in your browser.
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <label className="flex items-center gap-1 rounded-lg border border-stone-300 bg-white/80 px-2 py-1">
            <span className="text-muted">Canvas</span>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0"
            />
          </label>
          {selected && (
            <button
              type="button"
              onClick={deleteSelected}
              className="rounded-lg border border-stone-300 bg-white/80 px-3 py-1 text-xs font-medium text-muted hover:bg-stone-50"
            >
              Delete selected
            </button>
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-4">
        {/* Left tools */}
        <aside className="w-48 shrink-0 rounded-xl border border-stone-200 bg-white/80 p-3 text-xs">
          <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">
            Elements
          </p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={addText}
              className="flex w-full items-center justify-between rounded-lg border border-stone-300 bg-white px-3 py-2 text-left text-xs hover:bg-stone-50"
            >
              <span>Heading</span>
              <span className="font-serif text-[0.7rem]">T</span>
            </button>
            <button
              type="button"
              onClick={() => addShape("rect")}
              className="flex w-full items-center justify-between rounded-lg border border-stone-300 bg-white px-3 py-2 text-left text-xs hover:bg-stone-50"
            >
              <span>Rectangle</span>
              <span className="h-3 w-4 rounded-sm bg-[#f7aecd]" />
            </button>
            <button
              type="button"
              onClick={() => addShape("pill")}
              className="flex w-full items-center justify-between rounded-lg border border-stone-300 bg-white px-3 py-2 text-left text-xs hover:bg-stone-50"
            >
              <span>Pill</span>
              <span className="h-2 w-5 rounded-full bg-[#f7aecd]" />
            </button>
            <button
              type="button"
              onClick={() => addShape("circle")}
              className="flex w-full items-center justify-between rounded-lg border border-stone-300 bg-white px-3 py-2 text-left text-xs hover:bg-stone-50"
            >
              <span>Circle</span>
              <span className="h-4 w-4 rounded-full bg-[#f7aecd]" />
            </button>
          </div>

          <p className="mt-4 mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">
            From reading list
          </p>
          <button
            type="button"
            onClick={addCoverFromFirstBook}
            disabled={!books[0]?.coverUrl}
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-left text-xs hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Insert first book cover
          </button>
        </aside>

        {/* Canvas */}
        <main className="relative flex-1 overflow-auto rounded-xl border border-stone-200 bg-stone-100">
          <div
            className="relative mx-auto my-6 h-[700px] w-[900px] max-w-full"
            style={{ backgroundColor: bgColor }}
          >
            {elements.map((el) => (
              <Rnd
                key={el.id}
                size={{ width: el.width, height: el.height }}
                position={{ x: el.x, y: el.y }}
                bounds="parent"
                onDragStop={(_, d) =>
                  updateElement(el.id, { x: d.x, y: d.y })
                }
                onResizeStop={(_, __, ref, ___, pos) =>
                  updateElement(el.id, {
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                    x: pos.x,
                    y: pos.y,
                  })
                }
                onClick={(e: MouseEvent) => {
                  e.stopPropagation();
                  setSelectedId(el.id);
                }}
                className={
                  "group cursor-move " +
                  (selectedId === el.id
                    ? "outline outline-2 outline-accent/70"
                    : "outline outline-1 outline-transparent hover:outline-stone-400")
                }
              >
                <ElementContent
                  el={el}
                  isSelected={selectedId === el.id}
                  onChange={(patch) => updateElement(el.id, patch)}
                />
              </Rnd>
            ))}
            {/* Click empty canvas to clear selection */}
            <button
              type="button"
              className="absolute inset-0 -z-10 h-full w-full cursor-default"
              onClick={() => setSelectedId(null)}
              aria-label="Canvas background"
            />
          </div>
        </main>

        {/* Inspector */}
        <aside className="w-64 shrink-0 rounded-xl border border-stone-200 bg-white/80 p-3 text-xs">
          <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">
            Properties
          </p>
          {selected ? (
            <Inspector el={selected} onUpdate={(patch) => updateElement(selected.id, patch)} />
          ) : (
            <p className="text-muted text-xs">
              Select an element on the canvas to edit its properties.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

function ElementContent({
  el,
  isSelected,
  onChange,
}: {
  el: CanvasElement;
  isSelected: boolean;
  onChange: (patch: Partial<CanvasElement>) => void;
}) {
  if (el.type === "text") {
    const textEl = el as TextElement;
    return (
      <div
        className="h-full w-full cursor-text px-2 py-1"
        style={{
          color: textEl.color,
          fontSize: textEl.fontSize,
          fontFamily:
            textEl.fontFamily === "serif" ? "var(--font-literata)" : "var(--font-dm-sans)",
          fontWeight: textEl.fontWeight,
          textAlign: textEl.align,
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          const value = window.prompt("Edit text", textEl.text);
          if (value != null) {
            onChange({ text: value } as Partial<CanvasElement>);
          }
        }}
      >
        {textEl.text}
        {!textEl.text && isSelected && (
          <span className="text-[0.65rem] text-muted">Double-click to edit text</span>
        )}
      </div>
    );
  }

  if (el.type === "shape") {
    const shapeEl = el as ShapeElement;
    const radius =
      shapeEl.variant === "pill"
        ? Math.min(shapeEl.height, shapeEl.width) / 2
        : shapeEl.variant === "circle"
        ? "999px"
        : 12;
    return (
      <div
        className="h-full w-full"
        style={{
          backgroundColor: shapeEl.fill,
          borderRadius: radius,
          border: `2px solid ${shapeEl.borderColor}`,
        }}
      />
    );
  }

  if (el.type === "image") {
    const imgEl = el as ImageElement;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imgEl.src}
        alt={imgEl.alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: imgEl.borderRadius,
        }}
      />
    );
  }

  return null;
}

function Inspector({
  el,
  onUpdate,
}: {
  el: CanvasElement;
  onUpdate: (patch: Partial<CanvasElement>) => void;
}) {
  if (el.type === "text") {
    const t = el as TextElement;
    return (
      <div className="space-y-3">
        <div>
          <label className="block text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted">
            Text
          </label>
          <textarea
            value={t.text}
            onChange={(e) =>
              onUpdate({ text: e.target.value } as Partial<CanvasElement>)
            }
            rows={4}
            className="mt-1 w-full rounded-lg border border-stone-300 px-2 py-1 text-xs"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[0.65rem] text-muted">Size</label>
            <input
              type="number"
              value={t.fontSize}
              min={8}
              max={96}
              onChange={(e) =>
                onUpdate({
                  fontSize: Number(e.target.value) || t.fontSize,
                } as Partial<CanvasElement>)
              }
              className="mt-1 w-full rounded-lg border border-stone-300 px-2 py-1 text-xs"
            />
          </div>
          <div>
            <label className="block text-[0.65rem] text-muted">Weight</label>
            <select
              value={t.fontWeight}
              onChange={(e) =>
                onUpdate({
                  fontWeight: e.target.value as TextElement["fontWeight"],
                } as Partial<CanvasElement>)
              }
              className="mt-1 w-full rounded-lg border border-stone-300 px-2 py-1 text-xs"
            >
              <option value="normal">Regular</option>
              <option value="bold">Bold</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-[1.2fr_0.8fr] gap-2">
          <div>
            <label className="block text-[0.65rem] text-muted">Font</label>
            <select
              value={t.fontFamily}
              onChange={(e) =>
                onUpdate({
                  fontFamily: e.target.value as TextElement["fontFamily"],
                } as Partial<CanvasElement>)
              }
              className="mt-1 w-full rounded-lg border border-stone-300 px-2 py-1 text-xs"
            >
              <option value="serif">Serif (Literata)</option>
              <option value="sans">Sans (DM Sans)</option>
            </select>
          </div>
          <div>
            <label className="block text-[0.65rem] text-muted">Color</label>
            <input
              type="color"
              value={t.color}
              onChange={(e) =>
                onUpdate({
                  color: e.target.value,
                } as Partial<CanvasElement>)
              }
              className="mt-1 h-8 w-full cursor-pointer rounded-lg border border-stone-300 bg-transparent p-1"
            />
          </div>
        </div>
        <div>
          <label className="block text-[0.65rem] text-muted">Align</label>
          <div className="mt-1 flex gap-1">
            {(["left", "center", "right"] as const).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() =>
                  onUpdate({ align: a } as Partial<CanvasElement>)
                }
                className={
                  "flex-1 rounded-lg border px-2 py-1 text-[0.65rem]" +
                  (t.align === a
                    ? " border-accent bg-accent/10 text-accent"
                    : " border-stone-300 text-muted hover:bg-stone-50")
                }
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (el.type === "shape") {
    const s = el as ShapeElement;
    return (
      <div className="space-y-3">
        <div>
          <label className="block text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted">
            Shape style
          </label>
          <select
            value={s.variant}
            onChange={(e) =>
              onUpdate({
                variant: e.target.value as ShapeElement["variant"],
              } as Partial<CanvasElement>)
            }
            className="mt-1 w-full rounded-lg border border-stone-300 px-2 py-1 text-xs"
          >
            <option value="rect">Rectangle</option>
            <option value="pill">Pill</option>
            <option value="circle">Circle</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[0.65rem] text-muted">Fill</label>
            <input
              type="color"
              value={s.fill}
              onChange={(e) =>
                onUpdate({
                  fill: e.target.value,
                } as Partial<CanvasElement>)
              }
              className="mt-1 h-8 w-full cursor-pointer rounded-lg border border-stone-300 bg-transparent p-1"
            />
          </div>
          <div>
            <label className="block text-[0.65rem] text-muted">Border</label>
            <input
              type="color"
              value={s.borderColor}
              onChange={(e) =>
                onUpdate({
                  borderColor: e.target.value,
                } as Partial<CanvasElement>)
              }
              className="mt-1 h-8 w-full cursor-pointer rounded-lg border border-stone-300 bg-transparent p-1"
            />
          </div>
        </div>
      </div>
    );
  }

  if (el.type === "image") {
    const i = el as ImageElement;
    return (
      <div className="space-y-3">
        <div>
          <label className="block text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted">
            Alt text
          </label>
          <input
            type="text"
            value={i.alt}
            onChange={(e) =>
              onUpdate({ alt: e.target.value } as Partial<CanvasElement>)
            }
            className="mt-1 w-full rounded-lg border border-stone-300 px-2 py-1 text-xs"
          />
        </div>
        <div>
          <label className="block text-[0.65rem] text-muted">
            Corner radius
          </label>
          <input
            type="range"
            min={0}
            max={48}
            value={i.borderRadius}
            onChange={(e) =>
              onUpdate({
                borderRadius: Number(e.target.value) || i.borderRadius,
              } as Partial<CanvasElement>)
            }
            className="mt-1 w-full"
          />
        </div>
      </div>
    );
  }

  return null;
}

