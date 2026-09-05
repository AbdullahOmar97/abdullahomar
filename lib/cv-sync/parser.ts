import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

export const ParsedExperienceSchema = z.object({
  companyEn: z.string().nullish().transform((v) => v?.trim() || "Company"),
  companyAr: z.string().nullish().transform((v) => v?.trim() || "الشركة"),
  roleEn: z.string().nullish().transform((v) => v?.trim() || "Software Engineer"),
  roleAr: z.string().nullish().transform((v) => v?.trim() || "مهندس برمجيات"),
  locationEn: z.string().nullish().transform((v) => v || "Amman, Jordan"),
  locationAr: z.string().nullish().transform((v) => v || "عمّان، الأردن"),
  periodEn: z.string().nullish().transform((v) => v?.trim() || "Present"),
  periodAr: z.string().nullish().transform((v) => v?.trim() || "حتى الآن"),
  startDate: z.string().nullish(), // YYYY-MM-DD
  endDate: z.string().nullish(), // YYYY-MM-DD
  isCurrent: z.boolean().nullish().transform((v) => v ?? false),
  descriptionEn: z.string().nullish(),
  descriptionAr: z.string().nullish(),
  highlightsEn: z.array(z.string()).nullish().transform((v) => v ?? []),
  highlightsAr: z.array(z.string()).nullish().transform((v) => v ?? []),
  orderIndex: z.number().int().nullish().transform((v) => v ?? 0),
});

export const ParsedEducationSchema = z.object({
  institutionEn: z.string().nullish().transform((v) => v?.trim() || "Institution"),
  institutionAr: z.string().nullish().transform((v) => v?.trim() || "المؤسسة التعليمية"),
  degreeEn: z.string().nullish().transform((v) => v?.trim() || "Certificate / Degree"),
  degreeAr: z.string().nullish().transform((v) => v?.trim() || "شهادة / درجة"),
  fieldEn: z.string().nullish(),
  fieldAr: z.string().nullish(),
  yearEn: z.string().nullish().transform((v) => v?.trim() || "2024"),
  yearAr: z.string().nullish().transform((v) => v?.trim() || "2024"),
  descriptionEn: z.string().nullish(),
  descriptionAr: z.string().nullish(),
  orderIndex: z.number().int().nullish().transform((v) => v ?? 0),
});

export const SkillCategorySchema = z.enum([
  "languages",
  "ai_ml",
  "web_backend",
  "databases",
  "devops_cloud",
]);

export const ParsedSkillSchema = z.object({
  name: z.string().min(1),
  category: SkillCategorySchema,
  proficiency: z.number().int().min(50).max(100).default(90),
  icon: z.string().nullish(),
  featured: z.boolean().default(true),
  orderIndex: z.number().int().default(0),
});

export const ParsedProfileSummarySchema = z.object({
  nameEn: z.string().nullish().transform((v) => v?.trim() || "Abdullah Omar Salman"),
  nameAr: z.string().nullish().transform((v) => v?.trim() || "عبدالله عمر سلمان"),
  titleEn: z.string().nullish().transform((v) => v?.trim() || "Full-Stack Software Engineer"),
  titleAr: z.string().nullish().transform((v) => v?.trim() || "مهندس برمجيات متكامل"),
  summaryEn: z.string().nullish().transform((v) => v?.trim() || ""),
  summaryAr: z.string().nullish().transform((v) => v?.trim() || ""),
  locationEn: z.string().nullish().transform((v) => v?.trim() || "Amman, Jordan, 11623"),
  locationAr: z.string().nullish().transform((v) => v?.trim() || "عمّان، الأردن، 11623"),
  email: z.string().nullish().transform((v) => v?.trim() || "AbdullahOmar@outlook.com"),
  phone: z.string().nullish().transform((v) => v?.trim() || "+962787900948"),
  linkedin: z.string().nullish().transform((v) => v?.trim() || "linkedin.com/in/AbdullahOmar97"),
  github: z.string().nullish().transform((v) => v?.trim() || "github.com/AbdullahOmar97"),
});

export const ParsedCVSchema = z.object({
  profile: ParsedProfileSummarySchema,
  experiences: z.array(ParsedExperienceSchema),
  education: z.array(ParsedEducationSchema),
  skills: z.array(ParsedSkillSchema),
});

export type ParsedCV = z.infer<typeof ParsedCVSchema>;

const CV_PARSER_SYSTEM_PROMPT = `
You are an expert resume parsing and localization AI engine.
Your task is to take raw, unstructured resume text (typically in English) and convert it into a strictly structured, bilingual (English & Arabic) JSON document.

Rules:
1. Extract all work experiences, internships, projects, technical skills, education, certifications, and contact details.
2. For every English text entry (company, role, descriptions, highlights, degrees, institutions, summary), provide a professional, accurate, and fluent Arabic translation (Ar fields).
3. Experience Highlights: Convert bullet points into clear string arrays for highlightsEn and highlightsAr.
4. Categorize each skill strictly into one of: "languages", "ai_ml", "web_backend", "databases", "devops_cloud".
5. For dates:
   - Provide clean period strings (e.g. periodEn: "Dec 2024 – Present", periodAr: "ديسمبر 2024 – حتى الآن").
   - Extract approximate startDate (YYYY-MM-01) and endDate if applicable. If currently working, set isCurrent: true and endDate: null.
6. Education & Certifications: Include university degrees and major industry/professional certifications into the education array.
7. Output strictly valid JSON matching the schema without markdown tags or wrappers.
`;

export async function parseResumeTextWithGemini(rawCvText: string): Promise<ParsedCV> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Parse the following resume text into the required bilingual JSON schema:

=== RESUME TEXT START ===
${rawCvText}
=== RESUME TEXT END ===

Return ONLY valid JSON matching this schema:
{
  "profile": {
    "nameEn": string,
    "nameAr": string,
    "titleEn": string,
    "titleAr": string,
    "summaryEn": string,
    "summaryAr": string,
    "locationEn": string,
    "locationAr": string,
    "email": string,
    "phone": string,
    "linkedin": string,
    "github": string
  },
  "experiences": [
    {
      "companyEn": string,
      "companyAr": string,
      "roleEn": string,
      "roleAr": string,
      "locationEn": string,
      "locationAr": string,
      "periodEn": string,
      "periodAr": string,
      "startDate": string (YYYY-MM-DD or null),
      "endDate": string (YYYY-MM-DD or null),
      "isCurrent": boolean,
      "descriptionEn": string,
      "descriptionAr": string,
      "highlightsEn": string[],
      "highlightsAr": string[],
      "orderIndex": number
    }
  ],
  "education": [
    {
      "institutionEn": string,
      "institutionAr": string,
      "degreeEn": string,
      "degreeAr": string,
      "fieldEn": string,
      "fieldAr": string,
      "yearEn": string,
      "yearAr": string,
      "descriptionEn": string,
      "descriptionAr": string,
      "orderIndex": number
    }
  ],
  "skills": [
    {
      "name": string,
      "category": "languages" | "ai_ml" | "web_backend" | "databases" | "devops_cloud",
      "proficiency": number (between 70 and 95),
      "icon": string (e.g. "code", "bot", "database", "server", "cloud", "cpu"),
      "featured": boolean,
      "orderIndex": number
    }
  ]
}
`;

  let response;
  try {
    response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: CV_PARSER_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });
  } catch (err) {
    console.warn("Gemini 2.5 Flash parsing failed, attempting fallback to gemini-2.0-flash:", err);
    response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction: CV_PARSER_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });
  }

  const rawJson = response.text;
  if (!rawJson) {
    throw new Error("Received empty response from Gemini parser");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch (parseError) {
    console.error("Failed to parse Gemini output as JSON:", rawJson);
    throw new Error("Gemini output could not be parsed as JSON");
  }

  const validated = ParsedCVSchema.parse(parsed);
  return validated;
}
