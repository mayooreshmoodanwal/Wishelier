"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cake,
  Sparkles,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Mail,
  Camera,
  Gift,
  PartyPopper,
  Heart,
  Wind,
  Sun,
  Trophy,
  Flower2,
  Laugh,
  Feather,
  Smile,
  X,
} from "lucide-react";
import type { RendererProps } from "@/types";

const WISH_ICONS = [Sun, Trophy, Feather, Flower2, Laugh, Heart];
const GALLERY_ICONS = [Smile, Sun, Laugh, Star, Sparkles, Heart];

export default function ElegantSinglePageRenderer({
  data,
  theme,
}: RendererProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const name = (data.birthdayPerson as string) || "Birthday Person";

  // Robust hero photo extraction
  const heroPhoto =
    (typeof data.heroPhoto === "string" && data.heroPhoto.length > 0 ? data.heroPhoto : "") ||
    (typeof data.heroImage === "string" && data.heroImage.length > 0 ? data.heroImage : "") ||
    (Array.isArray(data.photos) && data.photos[0]?.url ? data.photos[0].url : "") ||
    (Array.isArray(data.photos) && typeof data.photos[0] === "string" ? data.photos[0] : "") ||
    (Array.isArray(data.gallery) && typeof data.gallery[0] === "string" ? data.gallery[0] : "") ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop";

  const specialMessage = (data.specialMessage || data.letterBody || "") as string;
  const signature = (data.senderSignature || data.letterClosing || "With all my love") as string;

  // Robust gallery photo & caption extraction
  const rawGallery =
    Array.isArray(data.gallery) && data.gallery.length > 0
      ? data.gallery
      : Array.isArray(data.photos) && data.photos.length > 0
      ? data.photos
      : [
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop",
        ];

  const gallery: string[] = rawGallery
    .map((item: any) => (typeof item === "string" ? item : item?.url || ""))
    .filter((url: string) => url.trim().length > 0);

  const captions: string[] = rawGallery.map((item: any, i: number) =>
    typeof item === "object" && item?.caption
      ? item.caption
      : Array.isArray(data.galleryCaptions) && data.galleryCaptions[i]
      ? data.galleryCaptions[i]
      : `Memory ${i + 1}`
  );

  // Robust wishes extraction
  const rawWishes = (Array.isArray(data.wishes) && data.wishes.length > 0
    ? data.wishes
    : [
        "Sending you tons of love and happiness on your birthday!",
        "May all your dreams and wishes come true this year!",
        "Wishing you endless success, health, and joy!",
      ]) as any[];

  const wishes: string[] = rawWishes.map((w: any) =>
    typeof w === "string"
      ? w
      : w?.text
      ? `${w.from ? `${w.from}: ` : ""}${w.text}`
      : "Happy Birthday!"
  );

  const gifs = (data.celebrationGifs as string[]) || [];
  const musicUrl = data.musicUpload as string;
  const musicChoice = data.musicChoice as string;

  const totalSections = 5 + (gifs.length > 0 ? 1 : 0);

  // Theme colors
  const colors = theme?.colors || {
    bg: "#0a0a1a",
    accent: "#d4af37",
    accent2: "#f5e6a3",
    text: "#ffffff",
    textMuted: "rgba(255,255,255,0.6)",
    glow: "rgba(212,175,55,0.3)",
    card: "rgba(255,255,255,0.05)",
    glass: "rgba(255,255,255,0.08)",
  };

  // Loading screen
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Particles
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; size: number; delay: number }>
  >([]);

  useEffect(() => {
    const p = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
    }));
    setParticles(p);
  }, []);

  const goToSection = useCallback(
    (idx: number) => {
      if (idx >= 0 && idx < totalSections) setCurrentSection(idx);
    },
    [totalSections]
  );

  const blowCandles = () => {
    setCandlesBlown(true);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isMusicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  const getMusicSrc = () => {
    if (musicUrl) return musicUrl;
    if (musicChoice && musicChoice !== "custom_upload") {
      return `/music/${musicChoice}.mp3`;
    }
    return null;
  };

  const musicSrc = getMusicSrc();

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown")
        goToSection(currentSection + 1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp")
        goToSection(currentSection - 1);
      if (e.key === "Escape") setLightboxImage(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentSection, goToSection]);

  if (isLoading) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6"
        style={{ backgroundColor: colors.bg }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Cake size={48} style={{ color: colors.accent }} />
        </motion.div>
        <p style={{ color: colors.textMuted }} className="text-sm tracking-widest uppercase">
          Preparing something special...
        </p>
        <div
          className="w-48 h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: colors.glass }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: colors.accent }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5 }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: colors.bg, color: colors.text }}>
      {/* Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              backgroundColor: colors.accent,
              opacity: 0.4,
            }}
            animate={{ y: [-20, 20], opacity: [0.2, 0.6, 0.2] }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 z-40 w-full h-0.5" style={{ backgroundColor: colors.glass }}>
        <motion.div
          className="h-full"
          style={{ backgroundColor: colors.accent }}
          animate={{ width: `${((currentSection + 1) / totalSections) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Nav Dots */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
        {Array.from({ length: totalSections }, (_, i) => (
          <button
            key={i}
            onClick={() => goToSection(i)}
            className="w-2.5 h-2.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i === currentSection ? colors.accent : colors.glass,
              transform: i === currentSection ? "scale(1.3)" : "scale(1)",
              boxShadow: i === currentSection ? `0 0 8px ${colors.glow}` : "none",
            }}
          />
        ))}
      </div>

      {/* Music Toggle */}
      {musicSrc && (
        <>
          <audio ref={audioRef} src={musicSrc} loop preload="none" />
          <button
            onClick={toggleMusic}
            className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center gap-0.5 backdrop-blur-md transition-all"
            style={{ backgroundColor: colors.glass, border: `1px solid ${colors.glass}` }}
          >
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-0.5 rounded-full"
                style={{ backgroundColor: colors.accent }}
                animate={
                  isMusicPlaying
                    ? { height: [4, 16, 8, 20, 4], transition: { duration: 0.8, repeat: Infinity, delay: i * 0.1 } }
                    : { height: 4 }
                }
              />
            ))}
          </button>
        </>
      )}

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
            <button
              className="absolute top-4 right-4 p-2"
              onClick={() => setLightboxImage(null)}
            >
              <X size={24} style={{ color: colors.text }} />
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

      {/* Sections */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {/* HERO */}
          {currentSection === 0 && (
            <motion.div
              key="hero"
              className="min-h-screen flex flex-col items-center justify-center text-center px-4 gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              {heroPhoto && (
                <motion.img
                  src={heroPhoto}
                  alt={name}
                  className="w-36 h-36 rounded-full object-cover border-2"
                  style={{ borderColor: colors.accent, boxShadow: `0 0 40px ${colors.glow}` }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                />
              )}
              <div
                className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs tracking-wider uppercase"
                style={{ backgroundColor: colors.glass, color: colors.accent }}
              >
                <Sparkles size={14} /> It&apos;s a Special Day!
              </div>
              <h1 className="text-4xl md:text-6xl font-bold" style={{ fontFamily: theme?.fonts?.heading || "serif" }}>
                Happy Birthday
                <br />
                <span style={{ color: colors.accent }}>{name}!</span>
              </h1>
              <p className="flex items-center gap-2" style={{ color: colors.textMuted }}>
                Wishing you the most magical day <Star size={14} style={{ color: colors.accent }} />
              </p>
              <motion.button
                onClick={() => goToSection(1)}
                className="mt-4 px-6 py-3 rounded-full flex items-center gap-2 font-medium transition-transform hover:scale-105"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.bg,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Begin the Journey <ArrowRight size={16} />
              </motion.button>
            </motion.div>
          )}

          {/* SPECIAL MESSAGE */}
          {currentSection === 1 && (
            <motion.div
              key="message"
              className="min-h-screen flex flex-col items-center justify-center px-4 py-16 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
            >
              <h2 className="flex items-center gap-3 text-2xl font-semibold mb-8" style={{ fontFamily: theme?.fonts?.heading }}>
                <Mail size={20} style={{ color: colors.accent }} /> A Special Message
              </h2>
              <motion.div
                className="rounded-2xl p-8 backdrop-blur-md w-full"
                style={{
                  backgroundColor: colors.card,
                  border: `1px solid ${colors.glass}`,
                  boxShadow: `0 0 30px ${colors.glow}`,
                }}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="whitespace-pre-line leading-relaxed" style={{ fontFamily: theme?.fonts?.body }}>
                  {specialMessage}
                </div>
                <div className="mt-6 flex items-center gap-2 italic" style={{ color: colors.accent, fontFamily: theme?.fonts?.script }}>
                  {signature} <Heart size={14} />
                </div>
              </motion.div>
              <NavButtons current={1} total={totalSections} go={goToSection} accent={colors.accent} glass={colors.glass} bg={colors.bg} />
            </motion.div>
          )}

          {/* PHOTOS */}
          {currentSection === 2 && (
            <motion.div
              key="photos"
              className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
            >
              <h2 className="flex items-center gap-3 text-2xl font-semibold mb-8" style={{ fontFamily: theme?.fonts?.heading }}>
                <Camera size={20} style={{ color: colors.accent }} /> Cherished Moments
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {gallery.filter((img) => typeof img === "string" && img.trim().length > 0).map((img, i) => {
                  const Icon = GALLERY_ICONS[i % GALLERY_ICONS.length];
                  return (
                    <motion.div
                      key={i}
                      className="relative group cursor-pointer rounded-xl overflow-hidden aspect-square"
                      onClick={() => setLightboxImage(img)}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.03 }}
                    >
                      <img src={img} alt={captions[i] || `Memory ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3"
                      >
                        <span className="flex items-center gap-1.5 text-sm text-white">
                          <Icon size={14} /> {captions[i] || `Memory ${i + 1}`}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <NavButtons current={2} total={totalSections} go={goToSection} accent={colors.accent} glass={colors.glass} bg={colors.bg} />
            </motion.div>
          )}

          {/* CAKE */}
          {currentSection === 3 && (
            <motion.div
              key="cake"
              className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
            >
              <h2 className="flex items-center gap-3 text-2xl font-semibold mb-8" style={{ fontFamily: theme?.fonts?.heading }}>
                <Cake size={20} style={{ color: colors.accent }} /> Make a Wish!
              </h2>
              <div className="relative flex flex-col items-center gap-6">
                <motion.div
                  className="relative w-40 h-40 flex items-center justify-center rounded-2xl"
                  style={{ backgroundColor: colors.card, boxShadow: candlesBlown ? "none" : `0 0 60px ${colors.glow}` }}
                  animate={candlesBlown ? { scale: [1, 1.1, 1] } : {}}
                >
                  {!candlesBlown && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      style={{ boxShadow: `0 0 80px ${colors.accent}` }}
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  <Cake size={64} style={{ color: candlesBlown ? colors.textMuted : colors.accent }} />
                </motion.div>

                <p style={{ color: colors.textMuted }} className="text-sm text-center">
                  Close your eyes, make a wish, and blow! <Wind size={14} className="inline" />
                </p>

                {!candlesBlown ? (
                  <motion.button
                    onClick={blowCandles}
                    className="px-6 py-3 rounded-full flex items-center gap-2 font-medium"
                    style={{ backgroundColor: colors.accent, color: colors.bg }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Wind size={16} /> Blow the Candles!
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <p className="text-lg font-semibold mb-2" style={{ color: colors.accent }}>
                      🎉 Woohoo! Happy Birthday! 🎉
                    </p>
                    <p className="text-sm" style={{ color: colors.textMuted }}>
                      May all your wishes come true!
                    </p>
                  </motion.div>
                )}
              </div>
              <NavButtons current={3} total={totalSections} go={goToSection} accent={colors.accent} glass={colors.glass} bg={colors.bg} />
            </motion.div>
          )}

          {/* WISHES */}
          {currentSection === 4 && (
            <motion.div
              key="wishes"
              className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
            >
              <h2 className="flex items-center gap-3 text-2xl font-semibold mb-8" style={{ fontFamily: theme?.fonts?.heading }}>
                <Gift size={20} style={{ color: colors.accent }} /> Birthday Wishes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {wishes.map((wish, i) => {
                  const Icon = WISH_ICONS[i % WISH_ICONS.length];
                  return (
                    <motion.div
                      key={i}
                      className="rounded-2xl p-6 backdrop-blur-md text-center"
                      style={{
                        backgroundColor: colors.card,
                        border: `1px solid ${colors.glass}`,
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{
                        scale: 1.03,
                        boxShadow: `0 0 20px ${colors.glow}`,
                      }}
                    >
                      <div className="mb-3 flex justify-center">
                        <Icon size={24} style={{ color: colors.accent }} />
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: colors.textMuted }}>
                        {wish}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
              <NavButtons current={4} total={totalSections} go={goToSection} accent={colors.accent} glass={colors.glass} bg={colors.bg} />
            </motion.div>
          )}

          {/* GIFs */}
          {gifs.length > 0 && currentSection === 5 && (
            <motion.div
              key="gifs"
              className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
            >
              <h2 className="flex items-center gap-3 text-2xl font-semibold mb-8" style={{ fontFamily: theme?.fonts?.heading }}>
                <PartyPopper size={20} style={{ color: colors.accent }} /> Celebration Vibes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {gifs.map((gif, i) => (
                  <motion.div
                    key={i}
                    className="rounded-xl overflow-hidden"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.15 }}
                  >
                    <img src={gif} alt={`Celebration ${i + 1}`} className="w-full h-auto" loading="lazy" />
                  </motion.div>
                ))}
              </div>
              <NavButtons current={5} total={totalSections} go={goToSection} accent={colors.accent} glass={colors.glass} bg={colors.bg} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        {currentSection === totalSections - 1 && (
          <motion.footer
            className="text-center py-8 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="flex items-center justify-center gap-1.5 text-sm" style={{ color: colors.textMuted }}>
              Made with <Heart size={12} style={{ color: colors.accent }} fill={colors.accent} /> just for you
            </p>
            <p className="mt-1 text-xs flex items-center justify-center gap-1" style={{ color: "rgba(255,255,255,0.2)" }}>
              <Cake size={10} /> Happy Birthday {name}!
            </p>
          </motion.footer>
        )}
      </main>
    </div>
  );
}

// Navigation buttons sub-component
function NavButtons({
  current,
  total,
  go,
  accent,
  glass,
  bg,
}: {
  current: number;
  total: number;
  go: (i: number) => void;
  accent: string;
  glass: string;
  bg: string;
}) {
  return (
    <div className="flex items-center gap-4 mt-10">
      {current > 0 && (
        <motion.button
          onClick={() => go(current - 1)}
          className="px-5 py-2.5 rounded-full flex items-center gap-2 text-sm transition-all"
          style={{ backgroundColor: glass, color: accent, border: `1px solid ${glass}` }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={14} /> Back
        </motion.button>
      )}
      {current < total - 1 && (
        <motion.button
          onClick={() => go(current + 1)}
          className="px-5 py-2.5 rounded-full flex items-center gap-2 text-sm transition-all"
          style={{ backgroundColor: accent, color: bg }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Next <ChevronRight size={14} />
        </motion.button>
      )}
    </div>
  );
}
