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
    default: "Wishelier — Create & Share Animated Birthday Websites",
    template: "%s | Wishelier",
  },
  description:
    "Create magical, interactive animated birthday websites with custom music, photo galleries, and personalized greetings. Share instantly with a unique link for ₹99.",
  keywords: [
    "birthday website",
    "birthday surprise link",
    "personalized birthday wish",
    "animated birthday website",
    "birthday card online",
    "wishelier",
  ],
  metadataBase: new URL("https://wishelier.in"),
  openGraph: {
    title: "Wishelier — Create & Share Animated Birthday Websites",
    description:
      "Create magical, interactive animated birthday websites with custom music, photo galleries, and personalized greetings. Share instantly for ₹99.",
    url: "https://wishelier.in",
    siteName: "Wishelier",
    type: "website",
    images: [
      {
        url: "https://wishelier.in/logo.png",
        width: 1200,
        height: 630,
        alt: "Wishelier Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wishelier — Create & Share Animated Birthday Websites",
    description: "Create & share magical animated birthday websites from ₹99.",
    images: ["https://wishelier.in/logo.png"],
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/logo.png",
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
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" href="/logo.png" />
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
