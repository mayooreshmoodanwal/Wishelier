import type { Metadata } from "next";
import { Inter, Playfair_Display, Caveat, Dancing_Script, Quicksand } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  display: "swap",
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Wishelier — #1 Best Birthday Website Builder & Generator",
    template: "%s | Wishelier",
  },
  description:
    "Wishelier is the #1 handcrafted 3D birthday website generator. Create personalized animated birthday websites with custom music, photo carousels, heartfelt love letters, flip reasons, and 3D candle blowing for just ₹99. Share your custom surprise link instantly.",
  keywords: [
    "best birthday website builder",
    "birthday website generator",
    "birthday website builder",
    "make birthday website online",
    "create birthday website",
    "personalised birthday gifts",
    "handcrafted birthday website",
    "3D birthday website studio",
    "animated birthday website",
    "digital birthday surprise link",
    "online birthday card website",
    "interactive birthday wish generator",
    "birthday surprise link for girlfriend",
    "birthday website for boyfriend",
    "wishelier",
    "wishelier.in",
  ],
  metadataBase: new URL("https://wishelier.in"),
  alternates: {
    canonical: "https://wishelier.in",
  },
  openGraph: {
    title: "Wishelier — #1 Best Birthday Website Builder & Generator",
    description:
      "Create personalized 3D animated birthday websites with custom music, photo carousels, memory flip-cards, love letters, and 3D interactive cakes. Share your custom link instantly for ₹99.",
    url: "https://wishelier.in",
    siteName: "Wishelier",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://wishelier.in/logo.png",
        width: 1200,
        height: 630,
        alt: "Wishelier — #1 Best Birthday Website Builder & Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wishelier — #1 Best Birthday Website Builder & Generator",
    description:
      "Create personalized 3D animated birthday websites with custom music, photo galleries, and personal notes. Share your surprise link for ₹99.",
    images: ["https://wishelier.in/logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${caveat.variable} ${dancingScript.variable} ${quicksand.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#faf7f2" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="48x48" href="/icon-48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/icon-96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body
        className="min-h-full flex flex-col font-sans bg-[#faf7f2] text-[#1e1b2e]"
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
