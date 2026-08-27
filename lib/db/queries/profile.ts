import { eq, desc, asc } from "drizzle-orm";
import { db } from "../index.ts";
import {
  experiences,
  education,
  skills,
  type Experience,
  type NewExperience,
  type Education,
  type NewEducation,
  type Skill,
  type NewSkill,
} from "../schema.ts";

export async function getAllExperiences(): Promise<Experience[]> {
  return await db
    .select()
    .from(experiences)
    .orderBy(asc(experiences.orderIndex), desc(experiences.startDate));
}

export async function createExperience(data: NewExperience): Promise<Experience> {
  const [result] = await db.insert(experiences).values(data).returning();
  return result;
}

export async function getAllEducation(): Promise<Education[]> {
  return await db
    .select()
    .from(education)
    .orderBy(asc(education.orderIndex), desc(education.createdAt));
}

export async function createEducation(data: NewEducation): Promise<Education> {
  const [result] = await db.insert(education).values(data).returning();
  return result;
}

export async function getAllSkills(
  category?: "languages" | "ai_ml" | "web_backend" | "databases" | "devops_cloud"
): Promise<Skill[]> {
  if (category) {
    return await db
      .select()
      .from(skills)
      .where(eq(skills.category, category))
      .orderBy(asc(skills.orderIndex));
  }
  return await db
    .select()
    .from(skills)
    .orderBy(asc(skills.orderIndex));
}

export async function getFeaturedSkills(): Promise<Skill[]> {
  return await db
    .select()
    .from(skills)
    .where(eq(skills.featured, true))
    .orderBy(asc(skills.orderIndex));
}

export async function createSkill(data: NewSkill): Promise<Skill> {
  const [result] = await db.insert(skills).values(data).returning();
  return result;
}
