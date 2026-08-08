import { NextRequest } from "next/server";
import { apiSuccess, apiError, getAuthUser } from "@/lib/api-helpers";
import { db } from "@/lib/db/client";
import { users, projects, payments, templates } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const authUser = await getAuthUser(request);

  if (!authUser) {
    return apiSuccess({ authenticated: false, user: null, projects: [], transactions: [] });
  }

  try {
    // 1. User info
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, authUser.sub))
      .limit(1);

    if (!user) {
      return apiSuccess({ authenticated: false, user: null, projects: [], transactions: [] });
    }

    // 2. User's generated projects
    const userProjects = await db
      .select({
        id: projects.id,
        slug: projects.slug,
        status: projects.status,
        data: projects.data,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
        expiresAt: projects.expiresAt,
        templateName: templates.name,
        templateSlug: templates.slug,
        templateCategory: templates.category,
      })
      .from(projects)
      .innerJoin(templates, eq(templates.id, projects.templateId))
      .where(eq(projects.userId, user.id))
      .orderBy(desc(projects.createdAt));

    // 3. User's transactions history
    const userPayments = await db
      .select({
        id: payments.id,
        orderId: payments.providerOrderId,
        amount: payments.amount,
        currency: payments.currency,
        status: payments.status,
        createdAt: payments.createdAt,
        projectId: payments.projectId,
      })
      .from(payments)
      .where(eq(payments.userId, user.id))
      .orderBy(desc(payments.createdAt));

    return apiSuccess({
      authenticated: true,
      user,
      projects: userProjects,
      transactions: userPayments,
    });
  } catch (error) {
    console.error("Profile API error:", error);
    return apiError("INTERNAL_ERROR", "Failed to fetch profile data", 500);
  }
}
