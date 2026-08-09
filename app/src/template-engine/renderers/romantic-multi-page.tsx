"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, ChevronRight, X } from "lucide-react";
import type { RendererProps } from "@/types";

export default function RomanticMultiPageRenderer({ data, theme }: RendererProps) {
  const [currentPage, setCurrentPage] = useState<"landing" | "reasons" | "memories">("landing");
  const [typedText, setTypedText] = useState("");
  const [showReasons, setShowReasons] = useState(false);
  const [revealedReasons, setRevealedReasons] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const name = (data.birthdayPerson as string) || "You";
  const greetingMessage = (data.greetingMessage as string) || "You're the most adorable human I ever met!";
  const entryButtonText = (data.entryButtonText as string) || "Click to Enter Our World 💕";
  const reasons = (data.reasons as string[]) || [];
  const reasonGifs = (data.reasonGifs as string[]) || [];

  const rawMemories = (Array.isArray(data.memoryPhotos) && data.memoryPhotos.length > 0
    ? data.memoryPhotos
    : Array.isArray(data.photos) && data.photos.length > 0
    ? data.photos
    : Array.isArray(data.gallery) && data.gallery.length > 0
    ? data.gallery
    : [
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop",
      ]) as any[];

  const memoryPhotos: string[] = rawMemories
    .map((item: any) => (typeof item === "string" ? item : item?.url || ""))
    .filter((url: string) => url.trim().length > 0);

  const memoryCaptions: string[] = rawMemories.map((item: any, i: number) =>
    typeof item === "object" && item?.caption
      ? item.caption
      : Array.isArray(data.memoryCaptions) && data.memoryCaptions[i]
      ? data.memoryCaptions[i]
      : `Memory ${i + 1}`
  );

  const memoryDescriptions = (data.memoryDescriptions as string[]) || [];
  const finalMessage = (data.finalMessage as string) || "";
  const endingImage =
    (typeof data.endingImage === "string" && data.endingImage.length > 0 ? data.endingImage : "") ||
    memoryPhotos[0] ||
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop";

  const colors = theme?.colors || {
    bg: "#1a0a1a",
    accent: "#ff69b4",
    accent2: "#ff1493",
    accent3: "#ffb6c1",
    text: "#ffffff",
    textMuted: "rgba(255,255,255,0.7)",
    glow: "rgba(255,105,180,0.4)",
    card: "rgba(255,182,193,0.1)",
    glass: "rgba(255,105,180,0.08)",
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
    }, 80);
    return () => clearInterval(interval);
  }, [currentPage, greetingMessage]);

  // Progressive reason reveal
  useEffect(() => {
    if (!showReasons || revealedReasons >= reasons.length) return;
    const timer = setTimeout(() => {
      setRevealedReasons((prev) => prev + 1);
    }, 300);
    return () => clearTimeout(timer);
  }, [showReasons, revealedReasons, reasons.length]);

  const enterReasons = () => {
    setCurrentPage("reasons");
    setShowReasons(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: colors.bg, color: colors.text }}>
      {/* Floating Emojis */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {floatingEmojis.map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            style={{ left: `${10 + i * 13}%`, top: "100%" }}
            animate={{
              y: [0, -window?.innerHeight || -800],
              x: [0, Math.sin(i) * 50],
              opacity: [0, 0.8, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 cursor-pointer p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
          >
            <button className="absolute top-4 right-4 p-2" onClick={() => setLightboxImage(null)}>
              <X size={24} className="text-white" />
            </button>
            <motion.img
              src={lightboxImage}
              alt="Memory"
              className="max-w-full max-h-[90vh] object-contain rounded-xl"
              initial={{ scale: 0.8 }}
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
                background: `linear-gradient(135deg, ${colors.bg} 0%, #2d1b2d 50%, ${colors.bg} 100%)`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <motion.div
                className="mb-4"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart size={48} style={{ color: colors.accent }} fill={colors.accent} />
              </motion.div>

              <h1
                className="text-3xl md:text-5xl font-bold mb-4"
                style={{ fontFamily: theme?.fonts?.heading || "Poppins, sans-serif" }}
              >
                Happy Birthday,{" "}
                <span style={{ color: colors.accent }}>{name}</span>! 🎂
              </h1>

              <div className="min-h-[3rem] mb-8">
                <p
                  className="text-lg md:text-xl"
                  style={{ color: colors.textMuted, fontFamily: theme?.fonts?.script || "Dancing Script, cursive" }}
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
                className="px-8 py-4 rounded-full text-lg font-semibold transition-all"
                style={{
                  background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent2})`,
                  color: "#fff",
                  boxShadow: `0 0 30px ${colors.glow}`,
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
              className="min-h-screen flex flex-col items-center px-4 py-16"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <h2
                className="text-2xl md:text-3xl font-bold mb-2 text-center"
                style={{ fontFamily: theme?.fonts?.heading }}
              >
                Why You&apos;re So{" "}
                <span style={{ color: colors.accent }}>Special</span> ✨
              </h2>
              <p className="text-sm mb-10" style={{ color: colors.textMuted }}>
                Every reason, from the heart
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto w-full mb-10">
                {reasons.map((reason, i) => (
                  <AnimatePresence key={i}>
                    {i < revealedReasons && (
                      <motion.div
                        className="relative rounded-2xl p-6 backdrop-blur-md overflow-hidden group"
                        style={{
                          background: `linear-gradient(135deg, ${colors.card}, rgba(147,51,234,0.1))`,
                          border: `1px solid ${colors.glass}`,
                        }}
                        initial={{ opacity: 0, y: 30, rotateY: -90 }}
                        animate={{ opacity: 1, y: 0, rotateY: 0 }}
                        transition={{ delay: 0.1, type: "spring" }}
                        whileHover={{ scale: 1.03, boxShadow: `0 0 20px ${colors.glow}` }}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                            style={{ backgroundColor: colors.accent, color: "#fff" }}
                          >
                            {i + 1}
                          </span>
                          <p className="text-sm leading-relaxed">{reason}</p>
                        </div>

                        {/* GIF overlay on hover */}
                        {reasonGifs[i % reasonGifs.length] && (
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity">
                            <img
                              src={reasonGifs[i % reasonGifs.length]}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}
              </div>

              <motion.button
                onClick={() => setCurrentPage("memories")}
                className="px-8 py-3 rounded-full flex items-center gap-2 font-medium"
                style={{
                  background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent2})`,
                  color: "#fff",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                See Our Memories <ChevronRight size={16} />
              </motion.button>
            </motion.div>
          )}

          {/* MEMORIES PAGE */}
          {currentPage === "memories" && (
            <motion.div
              key="memories"
              className="min-h-screen flex flex-col items-center px-4 py-16"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <h2
                className="text-2xl md:text-3xl font-bold mb-2 text-center"
                style={{ fontFamily: theme?.fonts?.heading }}
              >
                Our Beautiful{" "}
                <span style={{ color: colors.accent }}>Memories</span> 📸
              </h2>
              <p className="text-sm mb-10" style={{ color: colors.textMuted }}>
                Moments that light up our story
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full mb-12">
                {memoryPhotos.filter((p) => typeof p === "string" && p.trim().length > 0).map((photo, i) => (
                  <motion.div
                    key={i}
                    className="group relative rounded-2xl overflow-hidden cursor-pointer"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setLightboxImage(photo)}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={photo}
                        alt={memoryCaptions[i] || `Memory ${i + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4"
                    >
                      <h3 className="text-lg font-semibold text-white">
                        {memoryCaptions[i] || `Memory ${i + 1}`}
                      </h3>
                      {memoryDescriptions[i] && (
                        <p className="text-sm text-white/70 mt-1">
                          {memoryDescriptions[i]}
                        </p>
                      )}
                    </div>

                    {/* Sparkle effect on hover */}
                    <motion.div
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Sparkles size={20} style={{ color: colors.accent }} />
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {/* Final Message */}
              {finalMessage && (
                <motion.div
                  className="max-w-2xl mx-auto text-center rounded-2xl p-8 backdrop-blur-md mb-8"
                  style={{
                    backgroundColor: colors.card,
                    border: `1px solid ${colors.glass}`,
                    boxShadow: `0 0 30px ${colors.glow}`,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Heart
                    size={32}
                    style={{ color: colors.accent }}
                    fill={colors.accent}
                    className="mx-auto mb-4"
                  />
                  <p
                    className="text-lg leading-relaxed whitespace-pre-line"
                    style={{ fontFamily: theme?.fonts?.script || "cursive" }}
                  >
                    {finalMessage}
                  </p>
                </motion.div>
              )}

              {endingImage && (
                <motion.div
                  className="max-w-md mx-auto rounded-2xl overflow-hidden"
                  style={{ boxShadow: `0 0 40px ${colors.glow}` }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <img src={endingImage} alt="Ending" className="w-full h-auto" />
                </motion.div>
              )}

              {/* Footer */}
              <motion.footer
                className="text-center mt-12 py-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <p className="text-sm flex items-center justify-center gap-1.5" style={{ color: colors.textMuted }}>
                  Made with <Heart size={12} style={{ color: colors.accent }} fill={colors.accent} /> for {name}
                </p>
              </motion.footer>

              <button
                onClick={() => setCurrentPage("landing")}
                className="mt-4 text-sm underline opacity-50 hover:opacity-100 transition-opacity"
                style={{ color: colors.accent }}
              >
                ← Back to start
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
