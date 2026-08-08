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
    default: "Wishelier — Birthday Surprise Websites",
    template: "%s | Wishelier",
  },
  description: "Create stunning animated birthday websites and share them with a unique link. Premium templates, custom music, beautiful animations.",
  metadataBase: new URL("https://wishelier.in"),
  openGraph: {
    title: "Wishelier — Birthday Surprise Websites",
    description: "Create & share animated birthday websites. From ₹99.",
    url: "https://wishelier.in",
    siteName: "Wishelier",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wishelier — Birthday Surprise Websites",
    description: "Create & share animated birthday websites. From ₹99.",
  },
  icons: {
    icon: "/favicon.ico",
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
      </head>
      <body className="min-h-full flex flex-col font-sans" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
