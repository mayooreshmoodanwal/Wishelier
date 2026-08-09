import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "Wishelier | Handcrafted Birthday Website Generator & Personalised Birthday Gifts",
    template: "%s | Wishelier",
  },
  description:
    "Wishelier is India's #1 handcrafted 3D birthday website generator. Turn personal photos, memory notes, and custom music into personalized digital birthday surprise websites. Share instantly for ₹99.",
  keywords: [
    "birthday website generator",
    "personalised birthday gifts",
    "handcrafted birthday website",
    "3D birthday website studio",
    "animated birthday website",
    "digital birthday surprise link",
    "online birthday card website",
    "interactive birthday wish generator",
    "wishelier",
    "wishelier.in",
  ],
  metadataBase: new URL("https://wishelier.in"),
  openGraph: {
    title: "Wishelier | Handcrafted Birthday Website Generator & Personalised Birthday Gifts",
    description:
      "Wishelier is India's premier handcrafted 3D birthday website generator. Turn personal photos, memory notes, and music into custom interactive birthday surprise links for ₹99.",
    url: "https://wishelier.in",
    siteName: "Wishelier",
    type: "website",
    images: [
      {
        url: "https://wishelier.in/logo.png",
        width: 1200,
        height: 630,
        alt: "Wishelier Handcrafted Birthday Website Generator Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wishelier | Handcrafted Birthday Website Generator & Personalised Birthday Gifts",
    description: "Create & share magical animated birthday surprise websites from ₹99.",
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
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#0a0a0f" />
        {/* Google Favicon Guidelines Compliant Links */}
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="48x48" href="/icon-48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/icon-96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body
        className="min-h-full flex flex-col font-sans bg-[#0a0a0f] text-white"
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
