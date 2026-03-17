"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import JSZip from "jszip";
import {
  UploadCloud,
  Download,
  RefreshCcw,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  LoaderCircle,
  AlertTriangle,
  WandSparkles,
  Palette,
  ImagePlus,
} from "lucide-react";

type EngineState = "loading" | "ready" | "error";
type BgMode = "transparent" | "color" | "image";
type CardTab = "result" | "original";
type CardStatus = "pending" | "processing" | "done" | "error";

type BgCard = {
  id: string;
  fileName: string;
  originalUrl: string;
  outputUrl: string | null;
  foregroundBlob: Blob | null;
  status: CardStatus;
  tab: CardTab;
  progress: number;
  error: string | null;
  processMs: number | null;
  composeMs: number | null;
  totalMs: number | null;
};

type RemoveBackgroundFn = (blob: Blob, options: Record<string, unknown>) => Promise<Blob>;

let removeBackgroundFnPromise: Promise<RemoveBackgroundFn> | null = null;

async function getRemoveBackgroundFn(): Promise<RemoveBackgroundFn> {
  if (!removeBackgroundFnPromise) {
    removeBackgroundFnPromise = import("@imgly/background-removal").then(
      (mod) => mod.removeBackground as RemoveBackgroundFn,
    );
  }

  return removeBackgroundFnPromise;
}

async function blobToImage(blob: Blob): Promise<HTMLImageElement> {
  const image = new Image();
  const objectUrl = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to decode processed foreground image."));
    };
    image.src = objectUrl;
  });
}

async function dataUrlToImage(dataUrl: string): Promise<HTMLImageElement> {
  const image = new Image();

  return new Promise((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to decode custom background image."));
    image.src = dataUrl;
  });
}

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Failed to create PNG output."));
        return;
      }
      resolve(blob);
    }, "image/png");
  });
}

function drawCoverImage(ctx: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  const x = (width - drawWidth) / 2;
  const y = (height - drawHeight) / 2;

  ctx.drawImage(image, x, y, drawWidth, drawHeight);
}

async function composeOutputBlob(
  foregroundBlob: Blob,
  bgMode: BgMode,
  bgColor: string,
  bgImageDataUrl: string | null,
): Promise<Blob> {
  if (bgMode === "transparent") {
    return foregroundBlob;
  }

  const foreground = await blobToImage(foregroundBlob);
  const canvas = document.createElement("canvas");
  canvas.width = foreground.naturalWidth;
  canvas.height = foreground.naturalHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Your browser could not initialize a 2D drawing context.");
  }

  if (bgMode === "color") {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (bgMode === "image" && bgImageDataUrl) {
    const bgImage = await dataUrlToImage(bgImageDataUrl);
    drawCoverImage(ctx, bgImage, canvas.width, canvas.height);
  }

  ctx.drawImage(foreground, 0, 0, canvas.width, canvas.height);
  return canvasToPngBlob(canvas);
}

function createWarmupBlob(): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = 4;
  canvas.height = 4;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return Promise.reject(new Error("Unable to initialize model warmup canvas."));
  }

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 4, 4);

  return canvasToPngBlob(canvas);
}

export default function BackgroundRemover() {
  const [engineState, setEngineState] = useState<EngineState>("loading");
  const [engineMessage, setEngineMessage] = useState("Loading AI engine...");
  const [engineProgress, setEngineProgress] = useState(0);
  const [cards, setCards] = useState<BgCard[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isReprocessing, setIsReprocessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [bgMode, setBgMode] = useState<BgMode>("transparent");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [bgImageDataUrl, setBgImageDataUrl] = useState<string | null>(null);
  const [toolError, setToolError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const cardsRef = useRef<BgCard[]>([]);
  const bgSignatureRef = useRef<string>("transparent|#ffffff|none");

  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  const cleanupCards = useCallback((target: BgCard[]) => {
    target.forEach((card) => {
      URL.revokeObjectURL(card.originalUrl);
      if (card.outputUrl) {
        URL.revokeObjectURL(card.outputUrl);
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      cleanupCards(cardsRef.current);
    };
  }, [cleanupCards]);

  const replaceOutputUrl = useCallback((cardId: string, nextOutputUrl: string) => {
    setCards((prev) =>
      prev.map((card) => {
        if (card.id !== cardId) {
          return card;
        }

        if (card.outputUrl) {
          URL.revokeObjectURL(card.outputUrl);
        }

        return {
          ...card,
          outputUrl: nextOutputUrl,
        };
      }),
    );
  }, []);

  const updateCard = useCallback((cardId: string, updater: (card: BgCard) => BgCard) => {
    setCards((prev) => prev.map((card) => (card.id === cardId ? updater(card) : card)));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootEngine() {
      try {
        const removeBackground = await getRemoveBackgroundFn();
        const warmupBlob = await createWarmupBlob();

        await removeBackground(warmupBlob, {
          model: "isnet",
          output: { format: "image/png", type: "foreground" },
          progress: (_key: unknown, current: number, total: number) => {
            if (cancelled || total <= 0) {
              return;
            }

            const percent = Math.min(100, Math.max(0, Math.round((current / total) * 100)));
            setEngineProgress(percent);
            setEngineMessage(`Downloading AI model... ${percent}%`);
          },
        });

        if (!cancelled) {
          setEngineProgress(100);
          setEngineMessage("Ready. Drop your images to remove backgrounds.");
          setEngineState("ready");
        }
      } catch (error) {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : "Failed to load AI model.";
          setEngineMessage(message);
          setEngineState("error");
        }
      }
    }

    void bootEngine();

    return () => {
      cancelled = true;
    };
  }, []);

  const processOneFile = useCallback(
    async (file: File, cardId: string) => {
      const startedAt = performance.now();
      const removeBackground = await getRemoveBackgroundFn();
      const sourceBlob = new Blob([await file.arrayBuffer()], { type: file.type || "image/png" });

      const processStartedAt = performance.now();
      const foregroundBlob = await removeBackground(sourceBlob, {
        model: "isnet",
        output: { format: "image/png", type: "foreground" },
        progress: (_key: unknown, current: number, total: number) => {
          if (total > 0) {
            const percent = Math.min(100, Math.max(0, Math.round((current / total) * 100)));
            updateCard(cardId, (card) => ({ ...card, progress: percent }));
          }
        },
      });
      const processMs = Math.round(performance.now() - processStartedAt);

      const composeStartedAt = performance.now();
      const merged = await composeOutputBlob(foregroundBlob, bgMode, bgColor, bgImageDataUrl);
      const composeMs = Math.round(performance.now() - composeStartedAt);
      const totalMs = Math.round(performance.now() - startedAt);
      const outputUrl = URL.createObjectURL(merged);

      updateCard(cardId, (card) => {
        if (card.outputUrl) {
          URL.revokeObjectURL(card.outputUrl);
        }

        return {
          ...card,
          status: "done",
          progress: 100,
          foregroundBlob,
          outputUrl,
          tab: "result",
          processMs,
          composeMs,
          totalMs,
        };
      });
    },
    [bgColor, bgImageDataUrl, bgMode, updateCard],
  );

  const handleFiles = useCallback(
    async (incomingFiles: FileList | File[]) => {
      const imageFiles = Array.from(incomingFiles).filter((file) => file.type.startsWith("image/"));
      if (!imageFiles.length) {
        setToolError("Please choose valid image files (PNG, JPG, WEBP, GIF, BMP, TIFF).");
        return;
      }

      if (engineState !== "ready") {
        setToolError("AI model is still loading. Please wait a few seconds.");
        return;
      }

      setToolError(null);

      const preparedCards = imageFiles.map((file) => {
        const id = `card-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const originalUrl = URL.createObjectURL(file);

        return {
          card: {
            id,
            fileName: file.name,
            originalUrl,
            outputUrl: null,
            foregroundBlob: null,
            status: "pending" as const,
            tab: "result" as const,
            progress: 0,
            error: null,
            processMs: null,
            composeMs: null,
            totalMs: null,
          },
          file,
        };
      });

      setCards((prev) => [...preparedCards.map((entry) => entry.card), ...prev]);

      for (const entry of preparedCards) {
        updateCard(entry.card.id, (card) => ({ ...card, status: "processing", progress: 0, error: null }));

        try {
          await processOneFile(entry.file, entry.card.id);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Processing failed.";
          updateCard(entry.card.id, (card) => ({ ...card, status: "error", error: message }));
        }
      }
    },
    [engineState, processOneFile, updateCard],
  );

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      void handleFiles(event.dataTransfer.files);
    },
    [handleFiles],
  );

  const onBrowse = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onClearAll = useCallback(() => {
    cleanupCards(cardsRef.current);
    setCards([]);
    setToolError(null);
    setBgImageDataUrl(null);
    setBgMode("transparent");
    setBgColor("#ffffff");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (bgInputRef.current) {
      bgInputRef.current.value = "";
    }
  }, [cleanupCards]);

  const downloadCard = useCallback((card: BgCard) => {
    if (!card.outputUrl) {
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = card.outputUrl;
    anchor.download = `${card.fileName.replace(/\.[^.]+$/, "")}_nobg.png`;
    anchor.click();
  }, []);

  const downloadZip = useCallback(async () => {
    const doneCards = cardsRef.current.filter((card) => card.status === "done" && card.outputUrl);
    if (!doneCards.length) {
      return;
    }

    setIsZipping(true);

    try {
      const zip = new JSZip();
      const folder = zip.folder("removebanana-background-remover");
      if (!folder) {
        throw new Error("Failed to initialize ZIP folder.");
      }

      for (const card of doneCards) {
        const response = await fetch(card.outputUrl as string);
        const blob = await response.blob();
        folder.file(`${card.fileName.replace(/\.[^.]+$/, "")}_nobg.png`, blob);
      }

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "removebanana_background_export.zip";
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1200);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create ZIP export.";
      setToolError(message);
    } finally {
      setIsZipping(false);
    }
  }, []);

  const reprocessAll = useCallback(async () => {
    const doneCards = cardsRef.current.filter((card) => card.status === "done" && card.foregroundBlob);
    if (!doneCards.length) {
      return;
    }

    setIsReprocessing(true);

    try {
      for (const card of doneCards) {
        updateCard(card.id, (current) => ({ ...current, status: "processing", progress: 100 }));
        const composeStartedAt = performance.now();
        const outputBlob = await composeOutputBlob(card.foregroundBlob as Blob, bgMode, bgColor, bgImageDataUrl);
        const composeMs = Math.round(performance.now() - composeStartedAt);
        const outputUrl = URL.createObjectURL(outputBlob);
        replaceOutputUrl(card.id, outputUrl);
        updateCard(card.id, (current) => ({
          ...current,
          status: "done",
          tab: "result",
          composeMs,
          totalMs: current.processMs !== null ? current.processMs + composeMs : current.totalMs,
        }));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to apply selected background.";
      setToolError(message);
      setCards((prev) =>
        prev.map((card) => (card.status === "processing" ? { ...card, status: "done" } : card)),
      );
    } finally {
      setIsReprocessing(false);
    }
  }, [bgColor, bgImageDataUrl, bgMode, replaceOutputUrl, updateCard]);

  const onChangeBackgroundImage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;
      setBgImageDataUrl(result);
      setBgMode("image");
      setToolError(null);
    };
    reader.onerror = () => {
      setToolError("Failed to load selected background image.");
    };
    reader.readAsDataURL(file);
  }, []);

  const completedCards = cards.filter((card) => card.status === "done");

  useEffect(() => {
    const signature = `${bgMode}|${bgColor}|${bgImageDataUrl ?? "none"}`;
    if (bgSignatureRef.current === signature) {
      return;
    }

    bgSignatureRef.current = signature;
    if (cardsRef.current.some((card) => card.status === "done" && card.foregroundBlob)) {
      void reprocessAll();
    }
  }, [bgMode, bgColor, bgImageDataUrl, reprocessAll]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          if (event.target.files) {
            void handleFiles(event.target.files);
          }
        }}
      />

      <input
        ref={bgInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onChangeBackgroundImage}
      />

      <div className="glass rounded-3xl p-5 md:p-7 border border-white/10">
        <div className="flex items-center gap-3">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              engineState === "ready"
                ? "bg-emerald-400"
                : engineState === "error"
                  ? "bg-red-400"
                  : "bg-blue-400 animate-pulse"
            }`}
          />
          <div className="flex-1">
            <p className="text-sm md:text-base text-white font-semibold">{engineState === "ready" ? "AI Engine Ready" : "AI Engine Loading"}</p>
            <p className="text-xs md:text-sm text-gray-400">{engineMessage}</p>
            {engineState === "loading" && (
              <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${engineProgress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="glass rounded-3xl p-5 md:p-8 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[280px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 blur-[100px] rounded-full mix-blend-screen" />
        </div>

        <div
          className={`relative rounded-2xl border border-dashed transition-all duration-200 ${
            engineState !== "ready"
              ? "border-white/15 bg-black/30 opacity-60"
              : isDragging
                ? "border-emerald-400 bg-emerald-500/10"
                : "border-white/20 bg-black/30 hover:border-emerald-400"
          }`}
          onDragOver={(event) => {
            event.preventDefault();
            if (engineState === "ready") {
              setIsDragging(true);
            }
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={onDrop}
          onClick={() => {
            if (engineState === "ready") {
              onBrowse();
            }
          }}
        >
          <div className="px-5 py-14 md:py-16 text-center">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onBrowse();
              }}
              disabled={engineState !== "ready"}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-500 text-white font-semibold disabled:opacity-60"
            >
              <UploadCloud className="w-5 h-5" />
              Drop images or click to upload
            </button>

            <p className="mt-5 text-gray-300 text-lg">Background removal runs in your browser. No uploads. No server processing.</p>

            <div className="mt-4 flex items-center justify-center flex-wrap gap-2 text-xs text-gray-400">
              {[
                "jpg",
                "png",
                "webp",
                "gif",
                "bmp",
                "tiff",
              ].map((format) => (
                <span key={format} className="px-2.5 py-1 rounded-md border border-white/15 uppercase tracking-wider">
                  {format}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-300">
            <span className="text-white font-semibold">{cards.length}</span> image{cards.length === 1 ? "" : "s"} • {completedCards.length}/{cards.length} done
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClearAll}
              disabled={cards.length === 0}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-400/20 text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Clear all
            </button>
            <button
              type="button"
              onClick={onBrowse}
              disabled={engineState !== "ready"}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/20 text-gray-200 hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <ImageIcon className="w-4 h-4" />
              Add more
            </button>
            <button
              type="button"
              onClick={() => void downloadZip()}
              disabled={completedCards.length === 0 || isZipping}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-400 text-black font-semibold hover:bg-emerald-300 transition-colors disabled:opacity-50"
            >
              {isZipping ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Download ZIP
            </button>
          </div>
        </div>

        {toolError && (
          <div className="relative mt-4 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-red-300 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {toolError}
          </div>
        )}
      </div>

      {cards.length > 0 && (
        <div className="glass rounded-3xl p-4 md:p-5 border border-white/10 space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Background</span>

            <button
              type="button"
              onClick={() => setBgMode("transparent")}
              className={`h-8 w-8 rounded-md border ${bgMode === "transparent" ? "border-emerald-400" : "border-white/20"}`}
              style={{
                backgroundImage:
                  "repeating-conic-gradient(#1f2937 0% 25%, #111827 0% 50%)",
                backgroundSize: "10px 10px",
              }}
              title="Transparent"
            />

            {[
              "#ffffff",
              "#000000",
              "#f3f4f6",
              "#c8f135",
              "#1a1a2e",
              "#ff6b6b",
              "#3bf0a0",
            ].map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  setBgColor(color);
                  setBgMode("color");
                }}
                className={`h-8 w-8 rounded-md border ${bgMode === "color" && bgColor === color ? "border-emerald-400" : "border-white/20"}`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}

            <label className="inline-flex items-center gap-2 px-3 py-1.5 text-[11px] border border-white/20 rounded-md text-gray-200 cursor-pointer hover:border-emerald-400 transition-colors">
              <Palette className="w-3.5 h-3.5" />
              Custom color
              <input
                type="color"
                value={bgColor}
                onChange={(event) => {
                  setBgColor(event.target.value);
                  setBgMode("color");
                }}
                className="h-0 w-0 opacity-0"
              />
            </label>

            <button
              type="button"
              onClick={() => bgInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-[11px] border border-white/20 rounded-md text-gray-200 hover:border-emerald-400 transition-colors"
            >
              <ImagePlus className="w-3.5 h-3.5" />
              Use image
            </button>

            <button
              type="button"
              onClick={() => void reprocessAll()}
              disabled={isReprocessing || completedCards.length === 0}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-[11px] border border-white/20 rounded-md text-gray-200 hover:border-emerald-400 transition-colors disabled:opacity-50 disabled:hover:border-white/20"
            >
              <RefreshCcw className={`w-3.5 h-3.5 ${isReprocessing ? "animate-spin" : ""}`} />
              {isReprocessing ? "Applying..." : "Re-apply all"}
            </button>
          </div>
          <p className="text-[11px] text-gray-400">Background controls are now directly above the result image cards.</p>
        </div>
      )}

      {cards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {cards.map((card) => (
            <article key={card.id} className="glass rounded-xl border border-white/10 overflow-hidden">
              <div className="flex border-b border-white/10">
                <button
                  type="button"
                  onClick={() => updateCard(card.id, (current) => ({ ...current, tab: "result" }))}
                  className={`flex-1 py-2 text-[11px] uppercase tracking-[0.15em] ${
                    card.tab === "result" ? "text-emerald-300 bg-emerald-500/10" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  Result
                </button>
                <button
                  type="button"
                  onClick={() => updateCard(card.id, (current) => ({ ...current, tab: "original" }))}
                  className={`flex-1 py-2 text-[11px] uppercase tracking-[0.15em] ${
                    card.tab === "original" ? "text-emerald-300 bg-emerald-500/10" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  Original
                </button>
              </div>

              <div
                className="relative aspect-square"
                style={{
                  backgroundImage: "repeating-conic-gradient(#1f2937 0% 25%, #111827 0% 50%)",
                  backgroundSize: "16px 16px",
                }}
              >
                {card.tab === "result" && card.outputUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={card.outputUrl} alt={card.fileName} className="absolute inset-0 w-full h-full object-contain" />
                )}

                {card.tab === "original" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={card.originalUrl} alt={`${card.fileName} original`} className="absolute inset-0 w-full h-full object-contain" />
                )}

                {(card.status === "pending" || card.status === "processing") && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                    <LoaderCircle className="w-9 h-9 text-emerald-300 animate-spin" />
                    <p className="text-[11px] uppercase tracking-[0.16em] text-gray-300">
                      {card.status === "pending" ? "Queued" : "Processing"}
                    </p>
                    <p className="text-2xl font-bold text-emerald-300">{card.progress > 0 ? `${card.progress}%` : "--"}</p>
                  </div>
                )}

                {card.status === "error" && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm p-5 flex flex-col items-center justify-center text-center gap-2">
                    <AlertTriangle className="w-8 h-8 text-red-300" />
                    <p className="text-sm text-red-300">{card.error ?? "Processing failed."}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-white/10">
                <div className="min-w-0">
                  <p className="text-xs text-gray-300 truncate" title={card.fileName}>{card.fileName}</p>
                  <p className="text-[11px] text-gray-500">
                    {card.status === "done"
                      ? "Ready to download"
                      : card.status === "error"
                        ? "Processing failed"
                        : card.status === "processing"
                          ? "Running model..."
                          : "Waiting in queue"}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={card.status !== "done" || !card.outputUrl}
                  onClick={() => downloadCard(card)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-emerald-400 text-black text-xs font-semibold disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" /> PNG
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="glass rounded-3xl p-6 border border-white/10">
        <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">How It Works</h3>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/10 p-4 bg-black/20">
            <p className="text-xs tracking-[0.16em] text-emerald-300">01 / MODEL</p>
            <p className="mt-2 text-lg text-white">Downloads once, cached locally</p>
            <p className="mt-2 text-sm text-gray-400">The AI model loads once and stays cached by your browser.</p>
          </div>
          <div className="rounded-2xl border border-white/10 p-4 bg-black/20">
            <p className="text-xs tracking-[0.16em] text-emerald-300">02 / INFERENCE</p>
            <p className="mt-2 text-lg text-white">Runs on your device</p>
            <p className="mt-2 text-sm text-gray-400">Images are processed in-browser, so your files stay private.</p>
          </div>
          <div className="rounded-2xl border border-white/10 p-4 bg-black/20">
            <p className="text-xs tracking-[0.16em] text-emerald-300">03 / OUTPUT</p>
            <p className="mt-2 text-lg text-white">PNG export, single or ZIP</p>
            <p className="mt-2 text-sm text-gray-400">Export transparent PNGs or apply custom backgrounds to all.</p>
          </div>
        </div>
        <p className="mt-5 text-sm text-gray-400 flex items-center gap-2">
          <WandSparkles className="w-4 h-4 text-emerald-300" />
          Powered by @imgly/background-removal with local browser inference.
        </p>
      </div>

      <div className="px-1 text-sm text-gray-400">
        <p className="inline-flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-300" />
          Tip: Click any background swatch or image and all finished cards update automatically.
        </p>
      </div>
    </div>
  );
}
