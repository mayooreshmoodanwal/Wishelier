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
    (project?.data as Record<string, unknown>)?.birthdayPerson as string || "Happy Birthday!";

  return {
    title: `Happy Birthday ${birthdayPerson}! 🎉`,
    description: `A special birthday surprise website made with love for ${birthdayPerson}`,
    openGraph: {
      title: `Happy Birthday ${birthdayPerson}! 🎉`,
      description: `A special birthday surprise page made with love 💖`,
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
      (project.data as Record<string, unknown>)?.birthdayPerson as string || "Birthday Person";
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-3xl bg-white/[0.03] border border-white/10 p-8 backdrop-blur-xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-amber-500 via-pink-500 to-purple-500" />
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 text-amber-400">
            {project.status === "pending_payment" ? <Clock size={32} /> : <Lock size={32} />}
          </div>

          <h1 className="text-2xl font-bold mb-2">
            Surprise for {birthdayPerson}
          </h1>

          <span className="inline-block text-xs px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4 font-medium capitalize">
            {project.status === "pending_payment" ? "Payment Pending" : "Draft Website"}
          </span>

          <p className="text-sm text-white/60 mb-6 leading-relaxed">
            This birthday surprise website has been customized and saved, but is not published live yet. If you are the creator, please complete payment on your dashboard to publish it!
          </p>

          <Link href="/dashboard">
            <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 font-semibold text-sm flex items-center justify-center gap-2 text-white">
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
    <div className="min-h-screen bg-[#0a0a0f]">
      <RendererComponent
        data={project.data as Record<string, unknown>}
        theme={project.theme as TemplateTheme}
      />
    </div>
  );
}
