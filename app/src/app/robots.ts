import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/contact", "/privacy", "/terms", "/refund", "/create/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/api/", "/checkout/"],
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot", "Google-Extended", "Applebot", "CCBot", "Amazonbot"],
        allow: ["/", "/about", "/contact", "/create/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/api/", "/checkout/"],
      },
    ],
    sitemap: "https://wishelier.in/sitemap.xml",
  };
}
