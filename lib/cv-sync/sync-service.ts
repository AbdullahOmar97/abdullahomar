import { syncProfileData } from "../db/index.ts";
import { parseResumeTextWithGemini, type ParsedCV } from "./parser.ts";
import type { NewExperience, NewEducation, NewSkill } from "../db/schema.ts";

const DEFAULT_DOC_ID = "12xqyy8FcXRNRNAFbrTG0OrNwciBWKp4C1o6pOP3JzPo";

export async function fetchGoogleDocText(docId?: string): Promise<string> {
  const targetId = (docId || process.env.GOOGLE_DOC_ID || DEFAULT_DOC_ID).trim();

  // Strict regex check on Google Doc ID to prevent path traversal / SSRF
  if (!/^[a-zA-Z0-9_-]{20,100}$/.test(targetId)) {
    throw new Error("Invalid Google Doc ID format");
  }

  const exportUrl = `https://docs.google.com/document/d/${targetId}/export?format=txt`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(exportUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Portfolio-CV-Sync/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Google Doc text: HTTP ${response.status} ${response.statusText}`
      );
    }

    const text = await response.text();
    if (!text || text.trim().length < 50) {
      throw new Error("Exported Google Doc content is empty or too short");
    }

    return text;
  } finally {
    clearTimeout(timeoutId);
  }
}

export interface SyncResult {
  success: boolean;
  docId: string;
  counts: {
    experiences: number;
    education: number;
    skills: number;
  };
  parsedPreview: {
    name: string;
    title: string;
    experienceCompanies: string[];
    skillsCount: number;
  };
  syncedAt: string;
}

export async function executeCvSync(options?: {
  docId?: string;
  rawText?: string;
}): Promise<SyncResult> {
  const targetDocId = (options?.docId || process.env.GOOGLE_DOC_ID || DEFAULT_DOC_ID).trim();

  // 1. Obtain raw text
  let rawCvText = options?.rawText;
  if (!rawCvText || rawCvText.trim().length < 50) {
    rawCvText = await fetchGoogleDocText(targetDocId);
  }

  // 2. Parse text with Gemini structured extraction
  const parsed: ParsedCV = await parseResumeTextWithGemini(rawCvText);

  // 3. Format into database entities
  const newExperiences: NewExperience[] = parsed.experiences.map((exp, idx) => ({
    companyEn: exp.companyEn,
    companyAr: exp.companyAr,
    roleEn: exp.roleEn,
    roleAr: exp.roleAr,
    locationEn: exp.locationEn || null,
    locationAr: exp.locationAr || null,
    periodEn: exp.periodEn,
    periodAr: exp.periodAr,
    startDate: exp.startDate ? new Date(exp.startDate) : null,
    endDate: exp.endDate ? new Date(exp.endDate) : null,
    isCurrent: exp.isCurrent ?? false,
    descriptionEn: exp.descriptionEn || null,
    descriptionAr: exp.descriptionAr || null,
    highlightsEn: exp.highlightsEn ?? [],
    highlightsAr: exp.highlightsAr ?? [],
    orderIndex: exp.orderIndex ?? idx + 1,
  }));

  const newEducation: NewEducation[] = parsed.education.map((edu, idx) => ({
    institutionEn: edu.institutionEn,
    institutionAr: edu.institutionAr,
    degreeEn: edu.degreeEn,
    degreeAr: edu.degreeAr,
    fieldEn: edu.fieldEn || null,
    fieldAr: edu.fieldAr || null,
    yearEn: edu.yearEn,
    yearAr: edu.yearAr,
    descriptionEn: edu.descriptionEn || null,
    descriptionAr: edu.descriptionAr || null,
    orderIndex: edu.orderIndex ?? idx + 1,
  }));

  const newSkills: NewSkill[] = parsed.skills.map((sk, idx) => ({
    name: sk.name,
    category: sk.category,
    proficiency: sk.proficiency ?? 90,
    icon: sk.icon || null,
    featured: sk.featured ?? true,
    orderIndex: sk.orderIndex ?? idx + 1,
  }));

  // 4. Update database atomically
  const dbCounts = await syncProfileData({
    newExperiences,
    newEducation,
    newSkills,
  });

  // 5. Revalidate Next.js static and dynamic paths
  try {
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/");
    revalidatePath("/api/profile");
  } catch {
    // Gracefully ignore when executed outside Next.js runtime (e.g. standalone CLI)
  }

  return {
    success: true,
    docId: targetDocId,
    counts: {
      experiences: dbCounts.experiencesCount,
      education: dbCounts.educationCount,
      skills: dbCounts.skillsCount,
    },
    parsedPreview: {
      name: parsed.profile.nameEn,
      title: parsed.profile.titleEn,
      experienceCompanies: parsed.experiences.map((e) => e.companyEn),
      skillsCount: parsed.skills.length,
    },
    syncedAt: new Date().toISOString(),
  };
}
