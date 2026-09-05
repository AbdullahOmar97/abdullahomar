import { normalizeQuery } from "./normalizer.ts";

export interface IntentMatchResult {
  matched: boolean;
  intent?: string;
  response?: string;
}

/**
 * Pre-compiled deterministic answers for high-frequency portfolio queries.
 * Bypasses database and external LLM APIs completely (<1ms latency).
 * Formatted cleanly adhering to CV_SYSTEM_INSTRUCTION rules.
 */
export function matchStaticFaq(rawQuery: string, language: string = "en"): IntentMatchResult {
  const norm = normalizeQuery(rawQuery);
  if (!norm) return { matched: false };

  const isAr = language === "ar" || /[\u0600-\u06FF]/.test(rawQuery);

  // 1. Greetings
  const greetingAr = /^(مرحبا|اهلا|اهلين|السلام عليكم|سلام|صباح الخير|مساء الخير|هلا)$/;
  const greetingEn = /^(hi|hello|hey|greetings|good morning|good evening|howdy)$/;
  if (isAr && greetingAr.test(norm)) {
    return {
      matched: true,
      intent: "greeting",
      response:
`أهلاً وسهلاً بك! أنا المساعد الذكي الخاص بالمهندس عبدالله عمر.

هل تود معرفة تفاصيل أكثر عن أبرز مشاريعه وخبراته في هندسة البرمجيات والذكاء الاصطناعي؟`,
    };
  }
  if (!isAr && greetingEn.test(norm)) {
    return {
      matched: true,
      intent: "greeting",
      response:
`Hello! I am Abdullah Omar's AI Assistant.

Would you like to explore the details of his featured software engineering and AI projects?`,
    };
  }

  // 2. Contact Information (Email, Phone, WhatsApp, Reach out)
  const contactAr = /(تواصل|اتواصل|رقم|هاتف|جوال|ايميل|بريد|لينكد|لينكد ان|واتس|واتساب|طرق التواصل)/;
  const contactEn = /(contact|reach|email|phone|mobile|whatsapp|linkedin|get in touch)/;
  if (isAr && contactAr.test(norm) && (norm.length < 50 || norm.includes("كيف") || norm.includes("ما هو"))) {
    return {
      matched: true,
      intent: "contact_info",
      response:
`يمكنك التواصل مع المهندس عبدالله عمر مباشرة عبر القنوات التالية:
• البريد الإلكتروني: AbdullahOmar@outlook.com
• الهاتف: 962787900948+
• لينكد إن: linkedin.com/in/AbdullahOmar97
• جيت هب: github.com/AbdullahOmar97
• الموقع: عمّان، الأردن

هل تود معرفة تفاصيل حول مدى توفره الحالي لمشاريع العمل الحر أو الوظائف الكاملة؟`,
    };
  }
  if (!isAr && contactEn.test(norm) && (norm.length < 50 || norm.includes("how") || norm.includes("what"))) {
    return {
      matched: true,
      intent: "contact_info",
      response:
`You can contact Abdullah Omar Salman directly via:
• Email: AbdullahOmar@outlook.com
• Phone: +962787900948
• LinkedIn: linkedin.com/in/AbdullahOmar97
• GitHub: github.com/AbdullahOmar97
• Location: Amman, Jordan

Would you like to know more about his current availability for freelance or full-time opportunities?`,
    };
  }

  // 3. Resume / CV Download
  const cvAr = /(سيره ذاتيه|سيرة ذاتية|سي في|cv|resume|تحميل السيره|رابط السيره)/;
  const cvEn = /(cv|resume|curriculum vitae|download cv|view cv)/;
  if (isAr && cvAr.test(norm) && norm.length < 40) {
    return {
      matched: true,
      intent: "cv_download",
      response:
`يمكنك الاطلاع على السيرة الذاتية المفصلة للمهندس عبدالله عمر وتحميلها مباشرة من زر "تحميل السيرة الذاتية (CV)" الموجود في الصفحة الرئيسية للموقع، أو التواصل معه عبر البريد: AbdullahOmar@outlook.com لإرسال نسخة محدثة.

هل تود معرفة تفاصيل محددة حول مؤهلاته الأكاديمية والشهادات المهنية؟`,
    };
  }
  if (!isAr && cvEn.test(norm) && norm.length < 40) {
    return {
      matched: true,
      intent: "cv_download",
      response:
`You can review and download Abdullah Omar's complete CV directly using the "Download CV" button on the portfolio homepage, or reach out to him via AbdullahOmar@outlook.com.

Would you like to know details about his academic qualifications and specialized certifications?`,
    };
  }

  // 4. Bio / Who is Abdullah
  const bioAr = /^(من هو عبدالله|من انت|عرف عن نفسك|من عبدالله عمر|نبذه عن عبدالله|من عبدالله)$/;
  const bioEn = /^(who is abdullah|who are you|tell me about yourself|about abdullah|introduce yourself)$/;
  if (isAr && bioAr.test(norm)) {
    return {
      matched: true,
      intent: "bio_summary",
      response:
`عبدالله عمر سلمان هو مهندس برمجيات Full-Stack متخصص في بناء التطبيقات والحلول المدعومة بالذكاء الاصطناعي (AI-Powered Applications). يمتلك خبرة متقدمة في بناء الأنظمة المعقدة باستخدام Django وFastAPI وNext.js وPostgreSQL، وقام بتطوير مشاريع حيوية كمنصة الجمارك الرقمية لمصلحة الجمارك الليبية، وتطبيقات التجارة المدعومة بالوكلاء الأذكياء (AI Agents)، ورؤية الحاسوب (Computer Vision).

هل تود معرفة تفاصيل أكثر عن دوره في بناء منصة الجمارك الرقمية أو الأنظمة الذكية الأخرى؟`,
    };
  }
  if (!isAr && bioEn.test(norm)) {
    return {
      matched: true,
      intent: "bio_summary",
      response:
`Abdullah Omar Salman is a Full-Stack Software Engineer specializing in AI-powered applications. He builds scalable digital platforms utilizing Django, FastAPI, Next.js (TypeScript), and PostgreSQL. His track record includes architecting enterprise platforms such as the digital customs system for the Libyan Customs Authority, conversational commerce platforms with LangGraph/Gemini, and computer vision systems.

Would you like to know more details about his architectural work on the Libyan Customs platform or his AI agents?`,
    };
  }

  // 5. Tech Stack Summary
  const skillsAr = /^(ما هي مهاراتك|ما هي التقنيات|المهارات التقنيه|تقنياتك|اللغات البرمجيه|ما هي لغات البرمجه)$/;
  const skillsEn = /^(what are your skills|what is your stack|tech stack|technologies|programming languages)$/;
  if (isAr && skillsAr.test(norm)) {
    return {
      matched: true,
      intent: "skills_summary",
      response:
`تشمل المهارات والتقنيات الأساسية للمهندس عبدالله عمر:
• اللغات: Python, TypeScript, JavaScript, SQL
• الذكاء الاصطناعي: AI Agents, LangGraph, RAG, Computer Vision (YOLO), LLM Integration, Prompt Engineering
• الواجهات الخلفية: FastAPI, Django, Django REST Framework, Node.js, PostgreSQL, Redis, WebSockets
• الواجهات الأمامية: Next.js, React, TailwindCSS
• السحابة والـ DevOps: Docker, Docker Compose, CI/CD, Git, Linux, Nginx, GCP, AWS

هل تود معرفة تفاصيل عملية حول كيفية توظيفه لتقنيات AI Agents و LangGraph في مشاريعه الإنتاجية؟`,
    };
  }
  if (!isAr && skillsEn.test(norm)) {
    return {
      matched: true,
      intent: "skills_summary",
      response:
`Abdullah Omar's core technical stack includes:
• Languages: Python, TypeScript, JavaScript, SQL
• AI & ML: AI Agents, LangGraph, RAG, Computer Vision (YOLO), LLM Integration, Prompt Engineering
• Backend & Databases: FastAPI, Django, DRF, Node.js, PostgreSQL, Redis, WebSockets
• Frontend: Next.js, React, TailwindCSS
• DevOps & Cloud: Docker, Docker Compose, CI/CD, Git, Linux, Nginx, GCP, AWS

Would you like to know more about how he applies AI Agents and LangGraph in production architectures?`,
    };
  }

  return { matched: false };
}
