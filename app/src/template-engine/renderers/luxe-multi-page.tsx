"use client";

import React, { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";
import confetti from "canvas-confetti";
import type { RendererProps } from "@/types";

const SECTIONS = ["hero", "memories", "reasons", "letter", "cake", "final"] as const;
type Section = (typeof SECTIONS)[number];

const DEFAULT_HERO = "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200&auto=format&fit=crop";

const DEFAULT_PHOTOS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop",
];

const DEFAULT_CAPTIONS = [
  "Summer Sunset",
  "City Lights",
  "Coffee Morning",
  "Laughter",
  "Starry Night",
  "Forever Smile",
];

const DEFAULT_REASONS = [
  "Your kindness illuminates every room.",
  "You make simple moments unforgettable.",
  "Your grace and positivity inspire me daily.",
  "You listen with your whole heart.",
  "Your happiness is infectious.",
  "You are truly one of a kind.",
  "You always know how to comfort my heart.",
  "Your smile feels like warm golden hour.",
  "You turn regular days into beautiful stories.",
  "You are loved more than words could ever say.",
];

const DEFAULT_LETTER = `Dearest Akanksha,

Happy Birthday! Creating this digital haven for you is just a small gesture to reflect how much light, kindness, and beauty you bring into my world every day.

May this year be filled with warm smiles, boundless joy, and unforgettable adventures. Thank you for simply being you.

With infinite love & admiration.`;

const DEFAULT_FINAL_IMAGE = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200&auto=format&fit=crop";

export default function LuxeMultiPageRenderer({ data = {}, theme }: RendererProps) {
  const [currentSection, setCurrentSection] = useState<Section>("hero");
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [randomReason, setRandomReason] = useState<number | null>(null);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [typedLetter, setTypedLetter] = useState("");
  const [cakeStage, setCakeStage] = useState<"blow" | "cut" | "slice" | "done">("blow");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Extract data with full fallbacks
  const name = (typeof data.birthdayPerson === "string" && data.birthdayPerson.trim()) || "You";
  const heroImage = (typeof data.heroImage === "string" && data.heroImage.trim()) || DEFAULT_HERO;
  const heroTagline = (typeof data.heroTagline === "string" && data.heroTagline.trim()) || "a little universe made just for you ✨";
  const heroDescription =
    (typeof data.heroDescription === "string" && data.heroDescription.trim()) ||
    "Today is wrapped in blush light, tiny stars, warm memories, and all the love you deserve.";

  const countdownDate = typeof data.countdownDate === "string" ? data.countdownDate.trim() : "";

  const rawPhotos = Array.isArray(data.memoryPhotos)
    ? (data.memoryPhotos as string[]).filter((p) => typeof p === "string" && p.trim().length > 0)
    : [];
  const memoryPhotos = rawPhotos.length > 0 ? rawPhotos : DEFAULT_PHOTOS;

  const rawCaptions = Array.isArray(data.memoryCaptions) ? (data.memoryCaptions as string[]) : [];
  const memoryCaptions = rawCaptions.length > 0 ? rawCaptions : DEFAULT_CAPTIONS;

  const memoryVideo = typeof data.memoryVideo === "string" ? data.memoryVideo.trim() : "";

  const rawReasons = Array.isArray(data.reasons)
    ? (data.reasons as string[]).filter((r) => typeof r === "string" && r.trim().length > 0)
    : [];
  const reasons = rawReasons.length > 0 ? rawReasons : DEFAULT_REASONS;

  const rawReasonImages = Array.isArray(data.reasonImages)
    ? (data.reasonImages as string[]).filter((img) => typeof img === "string" && img.trim().length > 0)
    : [];
  const reasonImages = rawReasonImages;

  const letterContent =
    (typeof data.letterContent === "string" && data.letterContent.trim()) || DEFAULT_LETTER;

  const finalMessage =
    (typeof data.finalMessage === "string" && data.finalMessage.trim()) || "You'll always be my favorite chapter.";

  const finalImage =
    (typeof data.finalImage === "string" && data.finalImage.trim()) || DEFAULT_FINAL_IMAGE;

  const colors = theme?.colors || {
    bg: "#fdf2f8",
    card: "rgba(255,255,255,0.75)",
    glass: "rgba(255,255,255,0.45)",
    accent: "#e8a0bf",
    accent2: "#d4a0c0",
    accent3: "#c9b1d0",
    text: "#2d1b2d",
    textMuted: "rgba(45,27,45,0.65)",
    glow: "rgba(232,160,191,0.35)",
  };

  const nightColors = ((theme as unknown as Record<string, unknown>)?.nightColors as Record<string, string>) || {
    bg: "#1a0a1a",
    card: "rgba(255,255,255,0.08)",
    glass: "rgba(255,255,255,0.05)",
    text: "#ffffff",
    textMuted: "rgba(255,255,255,0.6)",
  };

  const isNightSection = currentSection === "cake" || currentSection === "final";
  const activeColors = isNightSection
    ? {
        ...colors,
        bg: nightColors.bg,
        card: nightColors.card,
        glass: nightColors.glass || "rgba(255,255,255,0.05)",
        text: nightColors.text,
        textMuted: nightColors.textMuted,
      }
    : colors;

  const sectionIndex = SECTIONS.indexOf(currentSection);

  // Safe countdown timer calculation (prevents NaN)
  useEffect(() => {
    let targetTime: number;
    if (countdownDate) {
      const parsed = new Date(countdownDate).getTime();
      targetTime = isNaN(parsed) ? Date.now() + 7 * 86400000 : parsed;
    } else {
      // Default: 7 days in the future
      targetTime = Date.now() + 7 * 86400000;
    }

    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, targetTime - now);
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    };

    update();
    const interval = setInterval(update, 1000);
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
    }, 35);
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
    setTimeout(() => setRandomReason(null), 3500);
  };

  const triggerCakeDone = () => {
    setCakeStage("done");
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#e8a0bf", "#d4a0c0", "#fbcfe8", "#fbbf24"],
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <div
      className="relative min-h-screen transition-colors duration-700"
      style={{ backgroundColor: activeColors.bg, color: activeColors.text }}
    >
      {/* Glassmorphism Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-center gap-1.5 px-4 py-3 backdrop-blur-xl"
        style={{
          backgroundColor: isNightSection ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.6)",
          borderBottom: `1px solid ${isNightSection ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"}`,
        }}
      >
        {SECTIONS.map((s) => (
          <button
            key={s}
            onClick={() => goTo(s)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer"
            style={{
              backgroundColor: s === currentSection ? activeColors.accent : "transparent",
              color: s === currentSection ? "#fff" : activeColors.textMuted,
              boxShadow: s === currentSection ? `0 0 15px ${activeColors.glow}` : "none",
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
              left: `${(i * 7) % 100}%`,
              top: `${(i * 13) % 100}%`,
            }}
            animate={{
              y: [-15, 15],
              opacity: [0.15, 0.45, 0.15],
              rotate: [0, 180],
            }}
            transition={{
              duration: 5 + (i % 5) * 2,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          >
            {i % 3 === 0 ? (
              <Star size={14} style={{ color: activeColors.accent }} />
            ) : i % 3 === 1 ? (
              <Heart size={12} style={{ color: activeColors.accent2 }} />
            ) : (
              <Sparkles size={10} style={{ color: activeColors.accent3 }} />
            )}
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
            <button className="absolute top-4 right-4 p-2 text-white" onClick={() => setLightboxImage(null)}>
              <X size={24} />
            </button>
            <motion.img
              src={lightboxImage}
              alt="Photo"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 pt-16">
        <AnimatePresence mode="wait">
          {/* HERO */}
          {currentSection === "hero" && (
            <motion.div
              key="hero"
              className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {heroImage && (
                <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
                  <img src={heroImage} alt="" className="w-full h-full object-cover blur-[2px]" />
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(to bottom, ${colors.bg}80, ${colors.bg})` }}
                  />
                </div>
              )}
              <div className="relative z-10 max-w-xl">
                <motion.p
                  className="text-sm uppercase tracking-[0.3em] mb-4 font-semibold"
                  style={{ color: activeColors.accent, fontFamily: theme?.fonts?.script || "Caveat, cursive" }}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {heroTagline}
                </motion.p>
                <motion.h1
                  className="text-4xl md:text-6xl font-bold mb-4 tracking-tight"
                  style={{ fontFamily: theme?.fonts?.heading || "Playfair Display, serif" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Happy Birthday, <span style={{ color: activeColors.accent }}>{name}</span>
                </motion.h1>
                <motion.p
                  className="text-sm md:text-base mb-8 leading-relaxed max-w-md mx-auto"
                  style={{ color: activeColors.textMuted }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {heroDescription}
                </motion.p>

                {/* Countdown */}
                <motion.div
                  className="flex items-center justify-center gap-3 sm:gap-4 mb-8"
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
                      className="rounded-2xl px-3 sm:px-4 py-3 text-center backdrop-blur-md shadow-md min-w-[64px]"
                      style={{ backgroundColor: activeColors.card, border: `1px solid ${activeColors.glass}` }}
                    >
                      <div className="text-xl sm:text-2xl font-bold" style={{ color: activeColors.accent }}>
                        {String(item.value || 0).padStart(2, "0")}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: activeColors.textMuted }}>
                        {item.label}
                      </div>
                    </div>
                  ))}
                </motion.div>

                <motion.button
                  onClick={goNext}
                  className="px-8 py-3.5 rounded-full font-semibold flex items-center gap-2 mx-auto shadow-lg cursor-pointer text-sm"
                  style={{ backgroundColor: activeColors.accent, color: "#fff", boxShadow: `0 0 25px ${activeColors.glow}` }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Explore Surprise <ChevronRight size={16} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* MEMORIES */}
          {currentSection === "memories" && (
            <motion.div
              key="memories"
              className="min-h-screen px-4 py-12 max-w-5xl mx-auto"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <h2
                className="text-2xl md:text-4xl font-bold text-center mb-2"
                style={{ fontFamily: theme?.fonts?.heading || "Playfair Display, serif" }}
              >
                <Camera size={24} className="inline mr-2" style={{ color: activeColors.accent }} />
                Our Memories
              </h2>
              <p className="text-center text-sm mb-10" style={{ color: activeColors.textMuted }}>
                Polaroids from our story
              </p>

              {/* Masonry Grid */}
              <div className="columns-2 md:columns-3 gap-4 space-y-4">
                {memoryPhotos.map((photo, i) => (
                  <motion.div
                    key={i}
                    className="break-inside-avoid group cursor-pointer"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => setLightboxImage(photo)}
                  >
                    <div
                      className="rounded-2xl overflow-hidden p-2.5 transition-transform group-hover:rotate-0 shadow-lg"
                      style={{
                        backgroundColor: activeColors.card,
                        border: `1px solid ${activeColors.glass}`,
                        transform: `rotate(${(i % 2 === 0 ? 1 : -1) * 2}deg)`,
                      }}
                    >
                      <img
                        src={photo}
                        alt={memoryCaptions[i] || `Memory ${i + 1}`}
                        className="w-full rounded-xl object-cover aspect-[4/3]"
                        loading="lazy"
                      />
                      <p
                        className="text-center text-sm mt-2.5 py-1 font-semibold"
                        style={{ fontFamily: theme?.fonts?.script || "Caveat, cursive", color: activeColors.text }}
                      >
                        {memoryCaptions[i] || `Memory ${i + 1}`}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Video if uploaded */}
              {memoryVideo && (
                <motion.div
                  className="mt-8 max-w-lg mx-auto rounded-2xl overflow-hidden shadow-2xl"
                  style={{ boxShadow: `0 0 30px ${activeColors.glow}` }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <video src={memoryVideo} controls className="w-full" poster={memoryPhotos[0]} />
                </motion.div>
              )}

              <SectionNav onPrev={goPrev} onNext={goNext} accent={activeColors.accent} glass={activeColors.glass} />
            </motion.div>
          )}

          {/* REASONS */}
          {currentSection === "reasons" && (
            <motion.div
              key="reasons"
              className="min-h-screen px-4 py-12 max-w-5xl mx-auto"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <h2
                className="text-2xl md:text-4xl font-bold text-center mb-2"
                style={{ fontFamily: theme?.fonts?.heading || "Playfair Display, serif" }}
              >
                <Heart size={24} className="inline mr-2" style={{ color: activeColors.accent }} />
                {reasons.length} Reasons Why You&apos;re Amazing
              </h2>
              <p className="text-center text-sm mb-6" style={{ color: activeColors.textMuted }}>
                Tap any card to reveal what&apos;s on the other side
              </p>

              {/* Random Reason Button */}
              <div className="flex justify-center mb-8">
                <motion.button
                  onClick={showRandomReason}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-md cursor-pointer"
                  style={{ backgroundColor: activeColors.accent, color: "#fff" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Shuffle size={14} /> Reveal Random Reason
                </motion.button>
              </div>

              {/* Random overlay modal */}
              <AnimatePresence>
                {randomReason !== null && (
                  <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setRandomReason(null)}
                  >
                    <motion.div
                      className="max-w-sm w-full p-8 rounded-3xl text-center shadow-2xl"
                      style={{ backgroundColor: activeColors.card, border: `1px solid ${activeColors.glass}` }}
                      initial={{ scale: 0.8, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.8, y: 20 }}
                    >
                      <span className="text-3xl font-extrabold block mb-3" style={{ color: activeColors.accent }}>
                        #{randomReason + 1}
                      </span>
                      <p className="text-base sm:text-lg font-medium leading-relaxed">{reasons[randomReason]}</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Flip Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {reasons.map((reason, i) => (
                  <motion.div
                    key={i}
                    className="aspect-square cursor-pointer"
                    onClick={() => flipCard(i)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: Math.min(i * 0.04, 0.8) }}
                  >
                    <motion.div
                      className="w-full h-full relative"
                      style={{ transformStyle: "preserve-3d" }}
                      animate={{ rotateY: flippedCards.has(i) ? 180 : 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* Front */}
                      <div
                        className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-4 shadow-md text-center"
                        style={{
                          backgroundColor: activeColors.card,
                          border: `1px solid ${activeColors.glass}`,
                          backfaceVisibility: "hidden",
                        }}
                      >
                        {reasonImages[i] && (
                          <img src={reasonImages[i]} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 rounded-2xl" />
                        )}
                        <span className="text-2xl sm:text-3xl font-extrabold" style={{ color: activeColors.accent }}>
                          {i + 1}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider mt-1 opacity-50">Tap to flip</span>
                      </div>
                      {/* Back */}
                      <div
                        className="absolute inset-0 rounded-2xl flex items-center justify-center p-4 text-center shadow-lg"
                        style={{
                          backgroundColor: activeColors.accent,
                          color: "#fff",
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                        }}
                      >
                        <p className="text-xs sm:text-sm font-medium leading-relaxed">{reason}</p>
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
              className="min-h-screen flex flex-col items-center justify-center px-4 py-12 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2
                className="text-2xl md:text-4xl font-bold mb-8 flex items-center gap-2"
                style={{ fontFamily: theme?.fonts?.heading || "Playfair Display, serif" }}
              >
                <Mail size={24} style={{ color: activeColors.accent }} /> A Letter for You
              </h2>

              {!envelopeOpen ? (
                <motion.div
                  className="relative cursor-pointer"
                  onClick={() => setEnvelopeOpen(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div
                    className="w-72 sm:w-80 h-48 rounded-3xl flex items-center justify-center shadow-2xl"
                    style={{
                      backgroundColor: activeColors.card,
                      border: `2px dashed ${activeColors.accent}`,
                      boxShadow: `0 0 35px ${activeColors.glow}`,
                    }}
                  >
                    <div className="text-center">
                      <Mail size={52} style={{ color: activeColors.accent }} className="mx-auto mb-3" />
                      <p className="text-sm font-semibold" style={{ color: activeColors.text }}>
                        Tap to open your letter 💌
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="w-full rounded-3xl p-8 sm:p-12 shadow-2xl"
                  style={{
                    backgroundColor: activeColors.card,
                    border: `1px solid ${activeColors.glass}`,
                    boxShadow: `0 0 45px ${activeColors.glow}`,
                  }}
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p
                    className="text-base sm:text-xl leading-relaxed whitespace-pre-line font-medium"
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
              className="min-h-screen flex flex-col items-center justify-center px-4 py-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2
                className="text-2xl md:text-4xl font-bold mb-8 flex items-center gap-2"
                style={{ fontFamily: theme?.fonts?.heading || "Playfair Display, serif" }}
              >
                <Cake size={24} style={{ color: activeColors.accent }} /> Time to Celebrate!
              </h2>

              <div className="relative flex flex-col items-center gap-6">
                <motion.div
                  className="relative w-48 h-48 flex items-center justify-center rounded-3xl shadow-2xl"
                  style={{
                    backgroundColor: activeColors.card,
                    boxShadow: cakeStage === "blow" ? `0 0 80px ${activeColors.glow}` : "0 0 20px rgba(0,0,0,0.3)",
                  }}
                  animate={cakeStage === "done" ? { scale: [1, 1.1, 1] } : {}}
                >
                  {cakeStage === "blow" && (
                    <motion.div
                      className="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-8 rounded-full"
                      style={{ backgroundColor: activeColors.accent }}
                      animate={{ opacity: [1, 0.4, 1], height: [32, 24, 32] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                  <Cake size={80} style={{ color: cakeStage === "done" ? activeColors.textMuted : activeColors.accent }} />
                </motion.div>

                {cakeStage === "blow" && (
                  <motion.button
                    onClick={() => setCakeStage("cut")}
                    className="px-6 py-3 rounded-full font-semibold cursor-pointer shadow-lg text-sm"
                    style={{ backgroundColor: activeColors.accent, color: "#fff" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🌬️ Blow the Candle!
                  </motion.button>
                )}
                {cakeStage === "cut" && (
                  <motion.button
                    onClick={() => setCakeStage("slice")}
                    className="px-6 py-3 rounded-full font-semibold cursor-pointer shadow-lg text-sm"
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
                    onClick={triggerCakeDone}
                    className="px-6 py-3 rounded-full font-semibold cursor-pointer shadow-lg text-sm"
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
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <p className="text-2xl sm:text-3xl font-bold mb-2">🎉 Happy Birthday {name}! 🎉</p>
                    <p className="text-sm opacity-70">Enjoy every sweet second of this beautiful year ahead!</p>
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
                <div className="absolute inset-0 z-0 opacity-40">
                  <img src={finalImage} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60" />
                </div>
              )}
              <div className="relative z-10 max-w-lg">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                  <Heart size={54} style={{ color: activeColors.accent }} fill={activeColors.accent} className="mx-auto mb-6" />
                </motion.div>
                <motion.p
                  className="text-2xl sm:text-3xl md:text-4xl font-bold leading-relaxed mb-8"
                  style={{ fontFamily: theme?.fonts?.script || "Caveat, cursive" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {finalMessage}
                </motion.p>
                <p className="text-xs uppercase tracking-widest opacity-60">Made with ❤️ for {name}</p>

                <button
                  onClick={() => setCurrentSection("hero")}
                  className="mt-8 text-xs underline opacity-60 hover:opacity-100 transition-opacity cursor-pointer block mx-auto"
                  style={{ color: activeColors.accent }}
                >
                  ← Return to Beginning
                </button>
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
    <div className="flex items-center gap-4 mt-12 justify-center">
      <motion.button
        onClick={onPrev}
        className="px-5 py-2.5 rounded-full flex items-center gap-1.5 text-xs font-semibold backdrop-blur-md cursor-pointer border border-white/20 hover:bg-white/10"
        style={{ color: accent }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft size={14} /> Back
      </motion.button>
      <motion.button
        onClick={onNext}
        className="px-6 py-2.5 rounded-full flex items-center gap-1.5 text-xs font-semibold shadow-lg cursor-pointer"
        style={{ backgroundColor: accent, color: "#fff" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Next <ChevronRight size={14} />
      </motion.button>
    </div>
  );
}
