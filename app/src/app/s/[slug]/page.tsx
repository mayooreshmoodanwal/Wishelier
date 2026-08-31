import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db/client";
import { projects, templateVersions, templates } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import type { TemplateTheme } from "@/types";
import { Sparkles, Clock, Lock } from "lucide-react";
import Link from "next/link";

// Dynamic Imports for renderers
const ElegantSinglePageRenderer = dynamic(
  () => import("@/template-engine/renderers/elegant-single-page")
);
const RomanticMultiPageRenderer = dynamic(
  () => import("@/template-engine/renderers/romantic-multi-page")
);
const LuxeMultiPageRenderer = dynamic(
  () => import("@/template-engine/renderers/luxe-multi-page")
);

interface SharePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { slug } = await params;
  const [project] = await db
    .select({ data: projects.data })
    .from(projects)
    .where(eq(projects.slug, slug))
    .limit(1);

  const birthdayPerson =
    ((project?.data as Record<string, unknown>)?.birthdayPerson as string) || "You";

  return {
    title: `Happy Birthday ${birthdayPerson}! 🎉 | Wishelier Surprise`,
    description: `A special personalized 3D animated birthday website made with love for ${birthdayPerson}. Tap to explore memories, wishes, and celebrations!`,
    openGraph: {
      title: `Happy Birthday ${birthdayPerson}! 🎉`,
      description: `A special birthday surprise website made with love on Wishelier 💖`,
      url: `https://wishelier.in/s/${slug}`,
      siteName: "Wishelier",
    },
    twitter: {
      card: "summary_large_image",
      title: `Happy Birthday ${birthdayPerson}! 🎉`,
      description: `A special birthday surprise website made with love on Wishelier 💖`,
    },
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const { slug } = await params;

  const [project] = await db
    .select({
      id: projects.id,
      slug: projects.slug,
      data: projects.data,
      status: projects.status,
      rendererKey: templates.rendererKey,
      theme: templateVersions.theme,
    })
    .from(projects)
    .innerJoin(templates, eq(templates.id, projects.templateId))
    .innerJoin(templateVersions, eq(templateVersions.id, projects.templateVersionId))
    .where(eq(projects.slug, slug))
    .limit(1);

  if (!project) {
    notFound();
  }

  // If project is not yet live (pending payment or draft)
  if (project.status !== "live") {
    const birthdayPerson =
      ((project.data as Record<string, unknown>)?.birthdayPerson as string) || "Birthday Surprise";
    return (
      <div className="min-h-screen bg-[#faf7f2] text-[#1e1b2e] flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-3xl bg-white border border-[#e6cb9c]/60 p-8 shadow-xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#d97706] via-[#c026d3] to-[#0f766e]" />
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4 text-[#d97706]">
            {project.status === "pending_payment" ? <Clock size={32} /> : <Lock size={32} />}
          </div>

          <h1 className="text-2xl font-extrabold mb-2 text-[#1e1b2e]">
            Surprise for {birthdayPerson}
          </h1>

          <span className="inline-block text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 mb-4 font-bold capitalize">
            {project.status === "pending_payment" ? "Payment Pending" : "Draft Website"}
          </span>

          <p className="text-xs sm:text-sm text-[#4a4458] mb-6 leading-relaxed">
            This birthday surprise website has been customized and saved, but is not published live yet. If you are the creator, please complete payment on your dashboard to publish it!
          </p>

          <Link href="/dashboard">
            <button className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#c026d3] font-bold text-sm flex items-center justify-center gap-2 text-white shadow-md cursor-pointer">
              <Sparkles size={16} />
              <span>Go to My Dashboard</span>
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const renderers: Record<
    string,
    React.ComponentType<{ data: Record<string, unknown>; theme: TemplateTheme }>
  > = {
    "elegant-single-page": ElegantSinglePageRenderer,
    "romantic-multi-page": RomanticMultiPageRenderer,
    "luxe-multi-page": LuxeMultiPageRenderer,
  };

  const RendererComponent = renderers[project.rendererKey] || ElegantSinglePageRenderer;

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <RendererComponent
        data={project.data as Record<string, unknown>}
        theme={project.theme as TemplateTheme}
      />
    </div>
  );
}
