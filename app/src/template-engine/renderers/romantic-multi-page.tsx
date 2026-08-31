"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, ChevronRight, X, ArrowLeft } from "lucide-react";
import type { RendererProps } from "@/types";

const DEFAULT_REASONS = [
  "Your laugh is literally my favorite sound in the whole world.",
  "You always know how to make me smile even on my worst days.",
  "You have the kindest heart and sweetest soul.",
  "Every memory with you feels like a beautiful scene from a movie.",
];

const DEFAULT_PHOTOS = [
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&auto=format&fit=crop",
];

const DEFAULT_CAPTIONS = ["First Date", "Weekend Getaway", "Sunset Walks", "Forever Us"];
const DEFAULT_DESCRIPTIONS = [
  "A magical evening under the twinkling fairy lights",
  "Endless laughter and breeze by the beach",
  "Holding hands as the golden hour faded",
  "Here's to a lifetime of love, warmth, and joy",
];

const DEFAULT_GIFS = [
  "https://media4.giphy.com/media/v1.Y2lkPTZjMDliOTUyeXBzMDZ3djd6ZnAxZjJkcmVoZ28weGlrYzl5M3ZrbTFraWZ4Y3J6dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYt5jPR6QX5pnqM/giphy.gif",
];

export default function RomanticMultiPageRenderer({ data = {}, theme }: RendererProps) {
  const [currentPage, setCurrentPage] = useState<"landing" | "reasons" | "memories">("landing");
  const [typedText, setTypedText] = useState("");
  const [showReasons, setShowReasons] = useState(false);
  const [revealedReasons, setRevealedReasons] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const name = (typeof data.birthdayPerson === "string" && data.birthdayPerson.trim()) || "You";
  const greetingMessage =
    (typeof data.greetingMessage === "string" && data.greetingMessage.trim()) ||
    "You're the most adorable human I have ever met! 💕";
  const entryButtonText =
    (typeof data.entryButtonText === "string" && data.entryButtonText.trim()) ||
    "Click to Enter Our World 💕";

  const rawReasons = Array.isArray(data.reasons)
    ? (data.reasons as string[]).filter((r) => typeof r === "string" && r.trim().length > 0)
    : [];
  const reasons = rawReasons.length > 0 ? rawReasons : DEFAULT_REASONS;

  const rawGifs = Array.isArray(data.reasonGifs)
    ? (data.reasonGifs as string[]).filter((g) => typeof g === "string" && g.trim().length > 0)
    : [];
  const reasonGifs = rawGifs.length > 0 ? rawGifs : DEFAULT_GIFS;

  const rawPhotos = Array.isArray(data.memoryPhotos)
    ? (data.memoryPhotos as string[]).filter((p) => typeof p === "string" && p.trim().length > 0)
    : [];
  const memoryPhotos = rawPhotos.length > 0 ? rawPhotos : DEFAULT_PHOTOS;

  const rawCaptions = Array.isArray(data.memoryCaptions) ? (data.memoryCaptions as string[]) : [];
  const memoryCaptions = rawCaptions.length > 0 ? rawCaptions : DEFAULT_CAPTIONS;

  const rawDescriptions = Array.isArray(data.memoryDescriptions) ? (data.memoryDescriptions as string[]) : [];
  const memoryDescriptions = rawDescriptions.length > 0 ? rawDescriptions : DEFAULT_DESCRIPTIONS;

  const finalMessage =
    (typeof data.finalMessage === "string" && data.finalMessage.trim()) ||
    "Happy Birthday my love! May this year bring you all the magic, happiness, and peace you bring into my life every single day. 💖";

  const endingImage =
    (typeof data.endingImage === "string" && data.endingImage.trim()) ||
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&auto=format&fit=crop";

  const colors = theme?.colors || {
    bg: "#1a0a1a",
    accent: "#ff69b4",
    accent2: "#ff1493",
    accent3: "#ffb6c1",
    text: "#ffffff",
    textMuted: "rgba(255,255,255,0.7)",
    glow: "rgba(255,105,180,0.4)",
    card: "rgba(255,182,193,0.12)",
    glass: "rgba(255,105,180,0.15)",
  };

  const floatingEmojis = ["💕", "🌸", "💝", "🦋", "✨", "💗", "🌷"];

  // Typing effect for landing page
  useEffect(() => {
    if (currentPage !== "landing") return;
    setTypedText("");
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < greetingMessage.length) {
        setTypedText(greetingMessage.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [currentPage, greetingMessage]);

  // Progressive reason reveal
  useEffect(() => {
    if (!showReasons || revealedReasons >= reasons.length) return;
    const timer = setTimeout(() => {
      setRevealedReasons((prev) => prev + 1);
    }, 250);
    return () => clearTimeout(timer);
  }, [showReasons, revealedReasons, reasons.length]);

  const enterReasons = () => {
    setCurrentPage("reasons");
    setShowReasons(true);
    setRevealedReasons(1);
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: colors.bg, color: colors.text }}>
      {/* Floating Emojis */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {floatingEmojis.map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            style={{ left: `${8 + i * 14}%`, top: "100%" }}
            animate={{
              y: [0, -900],
              x: [0, Math.sin(i) * 40],
              opacity: [0, 0.8, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 7 + i * 2,
              repeat: Infinity,
              delay: i * 1.2,
              ease: "linear",
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 cursor-pointer p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
          >
            <button
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white"
              onClick={() => setLightboxImage(null)}
            >
              <X size={24} />
            </button>
            <motion.img
              src={lightboxImage}
              alt="Memory"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {/* LANDING PAGE */}
          {currentPage === "landing" && (
            <motion.div
              key="landing"
              className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
              style={{
                background: `radial-gradient(circle at 50% 40%, rgba(255,105,180,0.15), transparent 70%), ${colors.bg}`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <motion.div
                className="mb-6"
                animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <Heart size={54} style={{ color: colors.accent }} fill={colors.accent} />
              </motion.div>

              <h1
                className="text-3xl md:text-6xl font-bold mb-4 tracking-tight"
                style={{ fontFamily: theme?.fonts?.heading || "Playfair Display, serif" }}
              >
                Happy Birthday, <span style={{ color: colors.accent }}>{name}</span>! 🎂
              </h1>

              <div className="min-h-[3.5rem] mb-8 max-w-xl">
                <p
                  className="text-xl md:text-2xl"
                  style={{
                    color: colors.textMuted,
                    fontFamily: theme?.fonts?.script || "Dancing Script, cursive",
                  }}
                >
                  {typedText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="ml-0.5"
                  >
                    |
                  </motion.span>
                </p>
              </div>

              <motion.button
                onClick={enterReasons}
                className="px-8 py-4 rounded-full text-base sm:text-lg font-semibold transition-all shadow-xl cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent2})`,
                  color: "#fff",
                  boxShadow: `0 0 35px ${colors.glow}`,
                }}
                whileHover={{ scale: 1.05, boxShadow: `0 0 50px ${colors.glow}` }}
                whileTap={{ scale: 0.95 }}
              >
                {entryButtonText}
              </motion.button>
            </motion.div>
          )}

          {/* REASONS PAGE */}
          {currentPage === "reasons" && (
            <motion.div
              key="reasons"
              className="min-h-screen flex flex-col items-center px-4 py-16 max-w-4xl mx-auto"
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
            >
              <h2
                className="text-2xl md:text-4xl font-bold mb-2 text-center"
                style={{ fontFamily: theme?.fonts?.heading || "Playfair Display, serif" }}
              >
                Why You&apos;re So <span style={{ color: colors.accent }}>Special</span> ✨
              </h2>
              <p className="text-sm mb-8" style={{ color: colors.textMuted }}>
                Every reason, straight from the heart
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-10">
                {reasons.map((reason, i) => {
                  const gifSrc = reasonGifs.length > 0 ? reasonGifs[i % reasonGifs.length] : null;
                  return (
                    <AnimatePresence key={i}>
                      {i < revealedReasons && (
                        <motion.div
                          className="relative rounded-2xl p-6 backdrop-blur-md overflow-hidden group shadow-lg"
                          style={{
                            backgroundColor: colors.card,
                            border: `1px solid ${colors.glass}`,
                          }}
                          initial={{ opacity: 0, y: 30, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.4 }}
                          whileHover={{ scale: 1.02, boxShadow: `0 0 25px ${colors.glow}` }}
                        >
                          <div className="flex items-start gap-3.5 relative z-10">
                            <span
                              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md"
                              style={{ backgroundColor: colors.accent, color: "#fff" }}
                            >
                              {i + 1}
                            </span>
                            <p className="text-sm md:text-base leading-relaxed pt-0.5 font-medium">{reason}</p>
                          </div>

                          {gifSrc && (
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-300 pointer-events-none">
                              <img src={gifSrc} alt="" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  );
                })}
              </div>

              <div className="flex items-center gap-4">
                <motion.button
                  onClick={() => setCurrentPage("landing")}
                  className="px-6 py-3 rounded-full flex items-center gap-2 text-sm font-medium border border-white/20 backdrop-blur-md cursor-pointer hover:bg-white/10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft size={16} /> Back
                </motion.button>

                <motion.button
                  onClick={() => setCurrentPage("memories")}
                  className="px-8 py-3 rounded-full flex items-center gap-2 text-sm font-semibold shadow-lg cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent2})`,
                    color: "#fff",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  See Our Memories <ChevronRight size={16} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* MEMORIES PAGE */}
          {currentPage === "memories" && (
            <motion.div
              key="memories"
              className="min-h-screen flex flex-col items-center px-4 py-16 max-w-5xl mx-auto"
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
            >
              <h2
                className="text-2xl md:text-4xl font-bold mb-2 text-center"
                style={{ fontFamily: theme?.fonts?.heading || "Playfair Display, serif" }}
              >
                Our Beautiful <span style={{ color: colors.accent }}>Memories</span> 📸
              </h2>
              <p className="text-sm mb-10" style={{ color: colors.textMuted }}>
                Moments that light up our story
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full mb-12">
                {memoryPhotos.map((photo, i) => (
                  <motion.div
                    key={i}
                    className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-xl border border-white/10"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setLightboxImage(photo)}
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-black/20">
                      <img
                        src={photo}
                        alt={memoryCaptions[i] || `Memory ${i + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                      <h3 className="text-lg font-bold text-white">
                        {memoryCaptions[i] || `Memory ${i + 1}`}
                      </h3>
                      {memoryDescriptions[i] && (
                        <p className="text-xs sm:text-sm text-white/80 mt-1 leading-relaxed">
                          {memoryDescriptions[i]}
                        </p>
                      )}
                    </div>

                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Sparkles size={20} style={{ color: colors.accent }} />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Final Message Card */}
              {finalMessage && (
                <motion.div
                  className="max-w-2xl w-full text-center rounded-3xl p-8 backdrop-blur-md mb-8 shadow-2xl"
                  style={{
                    backgroundColor: colors.card,
                    border: `1px solid ${colors.glass}`,
                    boxShadow: `0 0 35px ${colors.glow}`,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Heart size={36} style={{ color: colors.accent }} fill={colors.accent} className="mx-auto mb-4" />
                  <p
                    className="text-lg md:text-xl leading-relaxed whitespace-pre-line font-medium"
                    style={{ fontFamily: theme?.fonts?.script || "Dancing Script, cursive" }}
                  >
                    {finalMessage}
                  </p>
                </motion.div>
              )}

              {endingImage && (
                <motion.div
                  className="max-w-md w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 mb-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <img src={endingImage} alt="Ending" className="w-full h-auto object-cover" />
                </motion.div>
              )}

              <div className="flex items-center gap-4 mt-6">
                <button
                  onClick={() => setCurrentPage("reasons")}
                  className="px-6 py-2.5 rounded-full flex items-center gap-1.5 text-xs font-medium border border-white/20 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back to Reasons
                </button>
                <button
                  onClick={() => setCurrentPage("landing")}
                  className="px-6 py-2.5 rounded-full text-xs font-medium underline opacity-70 hover:opacity-100 transition-all cursor-pointer"
                  style={{ color: colors.accent }}
                >
                  Start Over
                </button>
              </div>

              <footer className="text-center mt-12 py-4">
                <p className="text-xs flex items-center justify-center gap-1.5 opacity-60">
                  Made with <Heart size={12} style={{ color: colors.accent }} fill={colors.accent} /> for {name}
                </p>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
