import { useState } from "react";
import { X, ChevronRight, ChevronLeft, Images, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WorkMediaItem } from "@workspace/api-client-react";

interface ImageGalleryProps {
  images: WorkMediaItem[] | string[];
}

function normalizeItems(images: WorkMediaItem[] | string[]): WorkMediaItem[] {
  return images.map(item =>
    typeof item === "string"
      ? { url: item, caption: "", type: "image" as const }
      : item
  );
}

function isVideo(item: WorkMediaItem) {
  return item.type === "video" || /\.(mp4|webm|ogg|mov)$/i.test(item.url);
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const items = normalizeItems(images).filter(i => i.url);
  if (items.length === 0) return null;

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);
  const prev = () => setLightboxIdx(i => (i !== null && i > 0 ? i - 1 : items.length - 1));
  const next = () => setLightboxIdx(i => (i !== null && i < items.length - 1 ? i + 1 : 0));

  return (
    <>
      <div className="mt-20 pt-16 border-t border-border/40">
        <div className="flex items-center gap-3 mb-12">
          <Images className="w-6 h-6 text-primary shrink-0" />
          <h3 className="text-2xl font-black text-foreground">معرض المشروع</h3>
          <span className="text-base font-normal text-muted-foreground">({items.length} وسيط)</span>
        </div>

        <div className="space-y-16">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div
                className="w-full rounded-2xl overflow-hidden cursor-zoom-in group relative bg-muted"
                onClick={() => openLightbox(idx)}
              >
                {isVideo(item) ? (
                  <div className="relative">
                    <video
                      src={item.url}
                      className="w-full"
                      muted
                      playsInline
                      preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                      <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                        <Play className="w-7 h-7 text-white fill-white ml-1" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={item.url}
                      alt={item.caption || `وسيط ${idx + 1}`}
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="bg-black/60 text-white text-sm px-5 py-2.5 rounded-full backdrop-blur-md font-bold">
                        عرض كامل
                      </span>
                    </div>
                  </>
                )}
              </div>

              {item.caption && (
                <p className="mt-4 text-center text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto font-medium">
                  {item.caption}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/97 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeLightbox}
          >
            <button
              onClick={e => { e.stopPropagation(); prev(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/25 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <button
              onClick={e => { e.stopPropagation(); next(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/25 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/25 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div
              className="max-w-5xl w-full mx-4 flex flex-col items-center gap-4"
              onClick={e => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={lightboxIdx}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  {isVideo(items[lightboxIdx]) ? (
                    <video
                      src={items[lightboxIdx].url}
                      className="max-w-full max-h-[80vh] mx-auto rounded-xl"
                      controls
                      autoPlay
                    />
                  ) : (
                    <img
                      src={items[lightboxIdx].url}
                      alt={items[lightboxIdx].caption || `وسيط ${lightboxIdx + 1}`}
                      className="max-w-full max-h-[80vh] object-contain rounded-xl mx-auto"
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {items[lightboxIdx].caption && (
                <p className="text-white/70 text-sm text-center max-w-xl leading-relaxed">
                  {items[lightboxIdx].caption}
                </p>
              )}
              <p className="text-white/40 text-xs">
                {lightboxIdx + 1} / {items.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
