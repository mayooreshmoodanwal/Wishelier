"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Sparkles,
  Star,
  ChevronRight,
  ChevronLeft,
  Camera,
  Mail,
  Cake,
  X,
  Shuffle,
  Play,
} from "lucide-react";
import type { RendererProps } from "@/types";

const SECTIONS = ["hero", "memories", "reasons", "letter", "cake", "final"] as const;
type Section = (typeof SECTIONS)[number];

export default function LuxeMultiPageRenderer({ data, theme }: RendererProps) {
  const [currentSection, setCurrentSection] = useState<Section>("hero");
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [randomReason, setRandomReason] = useState<number | null>(null);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [typedLetter, setTypedLetter] = useState("");
  const [cakeStage, setCakeStage] = useState<"blow" | "cut" | "slice" | "done">("blow");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Extract data
  const name = (data.birthdayPerson as string) || "You";
  const heroImage =
    (typeof data.heroImage === "string" && data.heroImage.length > 0 ? data.heroImage : "") ||
    (typeof data.heroPhoto === "string" && data.heroPhoto.length > 0 ? data.heroPhoto : "") ||
    (Array.isArray(data.polaroids) && data.polaroids[0]?.url ? data.polaroids[0].url : "") ||
    (Array.isArray(data.photos) && data.photos[0]?.url ? data.photos[0].url : "") ||
    (Array.isArray(data.photos) && typeof data.photos[0] === "string" ? data.photos[0] : "") ||
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop";

  const heroTagline = (data.heroTagline || data.subtitle || "a little universe made just for you") as string;
  const heroDescription = (data.heroDescription as string) || "Today is wrapped in blush light, tiny stars, warm memories, and all the love you deserve.";
  const countdownDate = data.countdownDate as string;

  const rawMemories = (Array.isArray(data.memoryPhotos) && data.memoryPhotos.length > 0
    ? data.memoryPhotos
    : Array.isArray(data.polaroids) && data.polaroids.length > 0
    ? data.polaroids
    : Array.isArray(data.photos) && data.photos.length > 0
    ? data.photos
    : Array.isArray(data.gallery) && data.gallery.length > 0
    ? data.gallery
    : [
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop",
      ]) as any[];

  const memoryPhotos: string[] = rawMemories
    .map((item: any) => (typeof item === "string" ? item : item?.url || ""))
    .filter((url: string) => url.trim().length > 0);

  const memoryVideo = data.memoryVideo as string;
  const memoryCaptions: string[] = rawMemories.map((item: any, i: number) =>
    typeof item === "object" && item?.caption
      ? item.caption
      : Array.isArray(data.memoryCaptions) && data.memoryCaptions[i]
      ? data.memoryCaptions[i]
      : `Memory ${i + 1}`
  );

  const reasons = (Array.isArray(data.reasons) ? data.reasons.map((r: any) => typeof r === "string" ? r : r.title ? `${r.title}: ${r.detail || ""}` : "") : []) as string[];
  const reasonImages = (data.reasonImages as string[]) || [];
  const letterContent = (data.letterContent || data.letterBody || data.specialMessage || "") as string;
  const finalMessage = (data.finalMessage as string) || "You'll always be my favorite chapter.";
  const finalImage =
    (typeof data.finalImage === "string" && data.finalImage.length > 0 ? data.finalImage : "") ||
    heroImage ||
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop";

  const colors = theme?.colors || {
    bg: "#fdf2f8",
    card: "rgba(255,255,255,0.7)",
    glass: "rgba(255,255,255,0.4)",
    accent: "#e8a0bf",
    accent2: "#d4a0c0",
    accent3: "#c9b1d0",
    text: "#2d1b2d",
    textMuted: "rgba(45,27,45,0.6)",
    glow: "rgba(232,160,191,0.3)",
  };

  const nightColors = ((theme as unknown as Record<string, unknown>)?.nightColors as Record<string, string>) || {
    bg: "#1a0a1a",
    card: "rgba(255,255,255,0.08)",
    text: "#ffffff",
    textMuted: "rgba(255,255,255,0.6)",
  };

  const isNightSection = currentSection === "cake" || currentSection === "final";
  const activeColors = isNightSection
    ? { ...colors, bg: nightColors.bg, card: nightColors.card, text: nightColors.text, textMuted: nightColors.textMuted }
    : colors;

  const sectionIndex = SECTIONS.indexOf(currentSection);

  // Countdown timer
  useEffect(() => {
    if (!countdownDate) return;
    const target = new Date(countdownDate).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [countdownDate]);

  // Typewriter for letter
  useEffect(() => {
    if (currentSection !== "letter" || !envelopeOpen) return;
    setTypedLetter("");
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < letterContent.length) {
        setTypedLetter(letterContent.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [currentSection, envelopeOpen, letterContent]);

  const goTo = useCallback((section: Section) => setCurrentSection(section), []);
  const goNext = () => {
    const next = SECTIONS[sectionIndex + 1];
    if (next) setCurrentSection(next);
  };
  const goPrev = () => {
    const prev = SECTIONS[sectionIndex - 1];
    if (prev) setCurrentSection(prev);
  };

  const flipCard = (i: number) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const showRandomReason = () => {
    const idx = Math.floor(Math.random() * reasons.length);
    setRandomReason(idx);
    setTimeout(() => setRandomReason(null), 3000);
  };

  return (
    <div className="relative min-h-screen transition-colors duration-700" style={{ backgroundColor: activeColors.bg, color: activeColors.text }}>
      {/* Glassmorphism Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-center gap-1 px-4 py-3 backdrop-blur-xl"
        style={{
          backgroundColor: isNightSection ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)",
          borderBottom: `1px solid ${isNightSection ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
        }}
      >
        {SECTIONS.map((s) => (
          <button
            key={s}
            onClick={() => goTo(s)}
            className="px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all"
            style={{
              backgroundColor: s === currentSection ? activeColors.accent : "transparent",
              color: s === currentSection ? "#fff" : activeColors.textMuted,
            }}
          >
            {s}
          </button>
        ))}
      </nav>

      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {Array.from({ length: 15 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-10, 10],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 180],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            {i % 3 === 0 ? (
              <Star size={12} style={{ color: activeColors.accent }} />
            ) : i % 3 === 1 ? (
              <Heart size={10} style={{ color: activeColors.accent2 }} />
            ) : (
              <Sparkles size={8} style={{ color: activeColors.accent3 }} />
            )}
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
              alt="Photo"
              className="max-w-full max-h-[90vh] object-contain rounded-xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 pt-14">
        <AnimatePresence mode="wait">
          {/* HERO */}
          {currentSection === "hero" && (
            <motion.div
              key="hero"
              className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {heroImage && typeof heroImage === "string" && heroImage.trim().length > 0 && (
                <div className="absolute inset-0 z-0">
                  <img src={heroImage} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${colors.bg}80, ${colors.bg}cc)` }} />
                </div>
              )}
              <div className="relative z-10 max-w-xl">
                <motion.p
                  className="text-sm uppercase tracking-[0.3em] mb-4"
                  style={{ color: activeColors.accent, fontFamily: theme?.fonts?.script }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {heroTagline}
                </motion.p>
                <motion.h1
                  className="text-4xl md:text-6xl font-bold mb-4"
                  style={{ fontFamily: theme?.fonts?.heading }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Happy Birthday,{" "}
                  <span style={{ color: activeColors.accent }}>{name}</span>
                </motion.h1>
                <motion.p
                  className="text-sm md:text-base mb-8"
                  style={{ color: activeColors.textMuted }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {heroDescription}
                </motion.p>

                {/* Countdown */}
                {countdownDate && (
                  <motion.div
                    className="flex items-center justify-center gap-4 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    {[
                      { label: "Days", value: countdown.days },
                      { label: "Hours", value: countdown.hours },
                      { label: "Mins", value: countdown.mins },
                      { label: "Secs", value: countdown.secs },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl px-4 py-3 text-center backdrop-blur-md"
                        style={{ backgroundColor: activeColors.card, border: `1px solid ${activeColors.glass}` }}
                      >
                        <div className="text-2xl font-bold" style={{ color: activeColors.accent }}>
                          {String(item.value).padStart(2, "0")}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider" style={{ color: activeColors.textMuted }}>
                          {item.label}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                <motion.button
                  onClick={goNext}
                  className="px-8 py-3 rounded-full font-medium flex items-center gap-2 mx-auto"
                  style={{ backgroundColor: activeColors.accent, color: "#fff" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Explore <ChevronRight size={16} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* MEMORIES */}
          {currentSection === "memories" && (
            <motion.div
              key="memories"
              className="min-h-screen px-4 py-16 max-w-5xl mx-auto"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-2" style={{ fontFamily: theme?.fonts?.heading }}>
                <Camera size={20} className="inline mr-2" style={{ color: activeColors.accent }} />
                Our Memories
              </h2>
              <p className="text-center text-sm mb-10" style={{ color: activeColors.textMuted }}>
                Polaroids from our story
              </p>

              {/* Masonry Grid */}
              <div className="columns-2 md:columns-3 gap-4 space-y-4">
                {memoryPhotos.filter((p) => typeof p === "string" && p.trim().length > 0).map((photo, i) => (
                  <motion.div
                    key={i}
                    className="break-inside-avoid group cursor-pointer"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setLightboxImage(photo)}
                  >
                    <div
                      className="rounded-xl overflow-hidden p-2 transition-transform group-hover:rotate-0"
                      style={{
                        backgroundColor: activeColors.card,
                        border: `1px solid ${activeColors.glass}`,
                        transform: `rotate(${(i % 2 === 0 ? 1 : -1) * 2}deg)`,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      }}
                    >
                      <img
                        src={photo}
                        alt={memoryCaptions[i] || `Memory ${i + 1}`}
                        className="w-full rounded-lg object-cover"
                        loading="lazy"
                      />
                      <p
                        className="text-center text-sm mt-2 py-1"
                        style={{ fontFamily: theme?.fonts?.script || "Caveat, cursive", color: activeColors.textMuted }}
                      >
                        {memoryCaptions[i] || `Memory ${i + 1}`}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Video */}
              {memoryVideo && (
                <motion.div
                  className="mt-8 max-w-lg mx-auto rounded-xl overflow-hidden"
                  style={{ boxShadow: `0 0 30px ${activeColors.glow}` }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <video
                    src={memoryVideo}
                    controls
                    className="w-full"
                    preload="metadata"
                    poster={memoryPhotos[0]}
                  />
                </motion.div>
              )}

              <SectionNav onPrev={goPrev} onNext={goNext} accent={activeColors.accent} glass={activeColors.glass} />
            </motion.div>
          )}

          {/* REASONS */}
          {currentSection === "reasons" && (
            <motion.div
              key="reasons"
              className="min-h-screen px-4 py-16 max-w-5xl mx-auto"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-2" style={{ fontFamily: theme?.fonts?.heading }}>
                <Heart size={20} className="inline mr-2" style={{ color: activeColors.accent }} />
                {reasons.length} Reasons I Love You
              </h2>
              <p className="text-center text-sm mb-6" style={{ color: activeColors.textMuted }}>
                Tap a card to flip it
              </p>

              {/* Random Reason Button */}
              <div className="flex justify-center mb-8">
                <motion.button
                  onClick={showRandomReason}
                  className="px-5 py-2 rounded-full text-sm flex items-center gap-2"
                  style={{ backgroundColor: activeColors.accent, color: "#fff" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Shuffle size={14} /> Random Reason
                </motion.button>
              </div>

              {/* Random overlay */}
              <AnimatePresence>
                {randomReason !== null && (
                  <motion.div
                    className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setRandomReason(null)}
                  >
                    <motion.div
                      className="max-w-sm p-8 rounded-2xl text-center"
                      style={{ backgroundColor: activeColors.card, boxShadow: `0 0 40px ${activeColors.glow}` }}
                      initial={{ scale: 0.5, rotateY: 180 }}
                      animate={{ scale: 1, rotateY: 0 }}
                      exit={{ scale: 0.5, rotateY: -180 }}
                    >
                      <span className="text-4xl font-bold block mb-3" style={{ color: activeColors.accent }}>
                        #{randomReason + 1}
                      </span>
                      <p className="text-lg">{reasons[randomReason]}</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Flip Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {reasons.map((reason, i) => (
                  <motion.div
                    key={i}
                    className="aspect-square cursor-pointer perspective-500"
                    onClick={() => flipCard(i)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: Math.min(i * 0.03, 1) }}
                  >
                    <motion.div
                      className="w-full h-full relative"
                      style={{ transformStyle: "preserve-3d" }}
                      animate={{ rotateY: flippedCards.has(i) ? 180 : 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      {/* Front */}
                      <div
                        className="absolute inset-0 rounded-xl flex items-center justify-center backface-hidden overflow-hidden"
                        style={{
                          backgroundColor: activeColors.card,
                          border: `1px solid ${activeColors.glass}`,
                          backfaceVisibility: "hidden",
                        }}
                      >
                        {reasonImages[i] ? (
                          <>
                            <img src={reasonImages[i]} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                            <span className="relative text-3xl font-bold" style={{ color: activeColors.accent }}>
                              {i + 1}
                            </span>
                          </>
                        ) : (
                          <span className="text-3xl font-bold" style={{ color: activeColors.accent }}>
                            {i + 1}
                          </span>
                        )}
                      </div>
                      {/* Back */}
                      <div
                        className="absolute inset-0 rounded-xl flex items-center justify-center p-4 text-center backface-hidden"
                        style={{
                          backgroundColor: activeColors.accent,
                          color: "#fff",
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                        }}
                      >
                        <p className="text-xs md:text-sm leading-relaxed">{reason}</p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              <SectionNav onPrev={goPrev} onNext={goNext} accent={activeColors.accent} glass={activeColors.glass} />
            </motion.div>
          )}

          {/* LETTER */}
          {currentSection === "letter" && (
            <motion.div
              key="letter"
              className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2" style={{ fontFamily: theme?.fonts?.heading }}>
                <Mail size={20} style={{ color: activeColors.accent }} /> A Letter for You
              </h2>

              {!envelopeOpen ? (
                <motion.div
                  className="relative cursor-pointer"
                  onClick={() => setEnvelopeOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className="w-72 h-48 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: activeColors.card,
                      border: `2px solid ${activeColors.accent}`,
                      boxShadow: `0 0 30px ${activeColors.glow}`,
                    }}
                  >
                    <div className="text-center">
                      <Mail size={48} style={{ color: activeColors.accent }} className="mx-auto mb-3" />
                      <p className="text-sm" style={{ color: activeColors.textMuted }}>
                        Tap to open
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="max-w-2xl w-full rounded-2xl p-8 md:p-12"
                  style={{
                    backgroundColor: activeColors.card,
                    border: `1px solid ${activeColors.glass}`,
                    boxShadow: `0 0 40px ${activeColors.glow}`,
                  }}
                  initial={{ scale: 0.5, opacity: 0, rotateX: -30 }}
                  animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                  transition={{ type: "spring", duration: 0.8 }}
                >
                  <p
                    className="text-base md:text-lg leading-relaxed whitespace-pre-line"
                    style={{ fontFamily: theme?.fonts?.script || "Caveat, cursive" }}
                  >
                    {typedLetter}
                    <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>
                      |
                    </motion.span>
                  </p>
                </motion.div>
              )}

              <SectionNav onPrev={goPrev} onNext={goNext} accent={activeColors.accent} glass={activeColors.glass} />
            </motion.div>
          )}

          {/* CAKE */}
          {currentSection === "cake" && (
            <motion.div
              key="cake"
              className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2" style={{ fontFamily: theme?.fonts?.heading }}>
                <Cake size={20} style={{ color: activeColors.accent }} /> Time to Celebrate!
              </h2>

              <div className="relative flex flex-col items-center gap-6">
                {/* 3D CSS Cake representation */}
                <motion.div
                  className="relative w-48 h-48 flex items-center justify-center rounded-3xl"
                  style={{
                    backgroundColor: activeColors.card,
                    boxShadow: cakeStage === "blow" ? `0 0 80px ${activeColors.glow}` : "0 0 20px rgba(0,0,0,0.2)",
                  }}
                  animate={cakeStage === "done" ? { scale: [1, 1.1, 1] } : {}}
                >
                  {cakeStage === "blow" && (
                    <motion.div
                      className="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-8 rounded-full"
                      style={{ backgroundColor: activeColors.accent }}
                      animate={{ opacity: [1, 0.5, 1], height: [32, 24, 32] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                  <Cake size={72} style={{ color: cakeStage === "done" ? activeColors.textMuted : activeColors.accent }} />
                </motion.div>

                {cakeStage === "blow" && (
                  <motion.button
                    onClick={() => setCakeStage("cut")}
                    className="px-6 py-3 rounded-full font-medium"
                    style={{ backgroundColor: activeColors.accent, color: "#fff" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🌬️ Blow the Candles!
                  </motion.button>
                )}
                {cakeStage === "cut" && (
                  <motion.button
                    onClick={() => setCakeStage("slice")}
                    className="px-6 py-3 rounded-full font-medium"
                    style={{ backgroundColor: activeColors.accent, color: "#fff" }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🔪 Cut the Cake!
                  </motion.button>
                )}
                {cakeStage === "slice" && (
                  <motion.button
                    onClick={() => setCakeStage("done")}
                    className="px-6 py-3 rounded-full font-medium"
                    style={{ backgroundColor: activeColors.accent, color: "#fff" }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🍰 Take a Slice!
                  </motion.button>
                )}
                {cakeStage === "done" && (
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <p className="text-2xl font-bold mb-2">🎉 Happy Birthday! 🎉</p>
                    <p className="text-sm" style={{ color: activeColors.textMuted }}>
                      Enjoy every bite of this beautiful year ahead!
                    </p>
                  </motion.div>
                )}
              </div>

              <SectionNav onPrev={goPrev} onNext={goNext} accent={activeColors.accent} glass={activeColors.glass} />
            </motion.div>
          )}

          {/* FINAL */}
          {currentSection === "final" && (
            <motion.div
              key="final"
              className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {finalImage && (
                <div className="absolute inset-0 z-0">
                  <img src={finalImage} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60" />
                </div>
              )}
              <div className="relative z-10 max-w-lg">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.3 }}
                >
                  <Heart size={48} style={{ color: activeColors.accent }} fill={activeColors.accent} className="mx-auto mb-6" />
                </motion.div>
                <motion.p
                  className="text-2xl md:text-3xl font-bold leading-relaxed mb-8"
                  style={{ fontFamily: theme?.fonts?.script || "Caveat, cursive" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {finalMessage}
                </motion.p>
                <motion.p
                  className="text-sm"
                  style={{ color: activeColors.textMuted }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Made with ❤️ for {name}
                </motion.p>

                <motion.button
                  onClick={() => setCurrentSection("hero")}
                  className="mt-8 text-sm underline opacity-50 hover:opacity-100 transition-opacity"
                  style={{ color: activeColors.accent }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  ← Start over
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function SectionNav({
  onPrev,
  onNext,
  accent,
  glass,
}: {
  onPrev: () => void;
  onNext: () => void;
  accent: string;
  glass: string;
}) {
  return (
    <div className="flex items-center gap-4 mt-10 justify-center">
      <motion.button
        onClick={onPrev}
        className="px-5 py-2.5 rounded-full flex items-center gap-2 text-sm backdrop-blur-md"
        style={{ backgroundColor: glass, border: `1px solid ${glass}`, color: accent }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft size={14} /> Back
      </motion.button>
      <motion.button
        onClick={onNext}
        className="px-5 py-2.5 rounded-full flex items-center gap-2 text-sm"
        style={{ backgroundColor: accent, color: "#fff" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Next <ChevronRight size={14} />
      </motion.button>
    </div>
  );
}
