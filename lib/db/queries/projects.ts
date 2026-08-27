import { eq, desc, asc, and } from "drizzle-orm";
import { db } from "../index.ts";
import { projects, type Project, type NewProject } from "../schema.ts";

export async function getPublishedProjects(): Promise<Project[]> {
  return await db
    .select()
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(asc(projects.orderIndex), desc(projects.createdAt));
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return await db
    .select()
    .from(projects)
    .where(and(eq(projects.published, true), eq(projects.featured, true)))
    .orderBy(asc(projects.orderIndex), desc(projects.createdAt));
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug))
    .limit(1);
  return project;
}

export async function getProjectsByCategory(
  category: "ai_agent" | "fullstack" | "computer_vision" | "automation" | "data_science" | "other"
): Promise<Project[]> {
  return await db
    .select()
    .from(projects)
    .where(and(eq(projects.published, true), eq(projects.category, category)))
    .orderBy(asc(projects.orderIndex));
}

export async function createProject(data: NewProject): Promise<Project> {
  const [project] = await db
    .insert(projects)
    .values({
      ...data,
      updatedAt: new Date(),
    })
    .returning();
  return project;
}

export async function updateProject(
  id: string,
  data: Partial<NewProject>
): Promise<Project | undefined> {
  const [updated] = await db
    .update(projects)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id))
    .returning();
  return updated;
}

export async function deleteProject(id: string): Promise<boolean> {
  const result = await db
    .delete(projects)
    .where(eq(projects.id, id))
    .returning({ id: projects.id });
  return result.length > 0;
}
