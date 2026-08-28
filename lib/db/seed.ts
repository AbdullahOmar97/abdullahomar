import { db, conn } from "./index.ts";
import {
  services,
  skills,
  experiences,
  education,
  projects,
} from "./schema.ts";

export async function seedDatabase() {
  console.log("🌱 Starting database seed...");

  try {
    // Clean old profile seed data
    console.log("Refreshing profile seed tables...");
    await db.delete(experiences);
    await db.delete(projects);
    await db.delete(skills);
    await db.delete(education);
    await db.delete(services);

    // 1. Seed Services
    console.log("Seeding services...");
    await db
      .insert(services)
      .values([
        {
          id: "web-dev",
          titleKey: "webDev",
          titleEn: "Full-Stack Web Development",
          titleAr: "تطوير الويب المتكامل",
          descriptionEn:
            "Custom web applications built with Next.js and Django/FastAPI. Scalable, secure, and high-performance solutions.",
          descriptionAr:
            "تطبيقات ويب مخصصة مبنية باستخدام Next.js و Django/FastAPI. حلول قابلة للتوسع، آمنة، وعالية الأداء.",
          detailsEn:
            "Complete web solutions including frontend design, backend development, database management, and cloud deployment.",
          detailsAr:
            "حلول ويب متكاملة تشمل تصميم الواجهة الأمامية، تطوير الخلفية، إدارة قواعد البيانات، والنشر السحابي.",
          featuresEn: [
            "Next.js & React 19",
            "Django & FastAPI",
            "Database Design & Optimization",
            "Secure Authentication & Authorization",
            "SEO & Performance Optimization",
          ],
          featuresAr: [
            "Next.js و React 19",
            "Django و FastAPI",
            "تصميم وتحسين قواعد البيانات",
            "المصادقة والتفويض الآمن",
            "تحسين محركات البحث والأداء العالي",
          ],
          price: "500",
          imageSrc: "/web-dev-placeholder.jpg",
          active: true,
          orderIndex: 1,
        },
        {
          id: "ai-integration",
          titleKey: "aiIntegration",
          titleEn: "AI Integration & Automation",
          titleAr: "دمج الذكاء الاصطناعي والأتمتة",
          descriptionEn:
            "Integrate advanced AI agents and workflows into your business processes. Automate tasks and enhance decision-making.",
          descriptionAr:
            "دمج وكلاء الذكاء الاصطناعي وسير العمل في عملياتك التجارية. أتمتة المهام وتعزيز اتخاذ القرار.",
          detailsEn:
            "Custom AI solutions using LLMs, RAG, LangChain, LangGraph, and workflow automation tools like n8n and ComfyUI.",
          detailsAr:
            "حلول ذكاء اصطناعي مخصصة باستخدام LLMs، RAG، LangChain، LangGraph، وأدوات أتمتة سير العمل مثل n8n و ComfyUI.",
          featuresEn: [
            "Autonomous AI Agents (LangGraph)",
            "Retrieval-Augmented Generation (RAG)",
            "Computer Vision & Multimodal AI",
            "Workflow Automation with n8n",
            "Real-Time Speech & Live Voice Agents",
          ],
          featuresAr: [
            "وكلاء الذكاء الاصطناعي المستقلون (LangGraph)",
            "التوليد المعزز بالاسترجاع (RAG)",
            "رؤية الحاسوب والذكاء متعدد الوسائط",
            "أتمتة سير العمل عبر n8n",
            "معالجة الصوت في الوقت الفعلي والوكلاء الصوتيون",
          ],
          price: "800",
          imageSrc: "/ai-placeholder.jpg",
          active: true,
          orderIndex: 2,
        },
        {
          id: "consultation",
          titleKey: "consultation",
          titleEn: "Technical Consultation",
          titleAr: "استشارات تقنية",
          descriptionEn:
            "Expert advice on software architecture, technology stack selection, and digital transformation strategies.",
          descriptionAr:
            "نصائح متخصصة حول بنية البرمجيات، اختيار حزمة التقنيات، واستراتيجيات التحول الرقمي.",
          detailsEn:
            "In-depth architectural analysis, AI feasibility evaluation, code reviews, and performance tuning.",
          detailsAr:
            "تحليل معماري معمق، تقييم جدوى الذكاء الاصطناعي، مراجعة الأكواد، وضبط الأداء.",
          featuresEn: [
            "Architecture & System Design",
            "AI & Automation Feasibility",
            "Tech Stack Selection",
            "Code & Security Review",
            "Performance & Scalability Optimization",
          ],
          featuresAr: [
            "تصميم وهندسة النظم البرمجية",
            "دراسة جدوى الذكاء الاصطناعي والأتمتة",
            "اختيار حزمة التقنيات المناسبة",
            "مراجعة الأكواد والأمان",
            "تحسين الأداء وقابلية التوسع",
          ],
          price: "100",
          imageSrc: "/consulting-placeholder.jpg",
          active: true,
          orderIndex: 3,
        },
      ])
      .onConflictDoNothing();

    // 2. Seed Technical Skills
    console.log("Seeding skills...");
    await db
      .insert(skills)
      .values([
        // Languages
        { name: "Python", category: "languages", proficiency: 95, icon: "python", orderIndex: 1 },
        { name: "TypeScript", category: "languages", proficiency: 92, icon: "typescript", orderIndex: 2 },
        { name: "JavaScript", category: "languages", proficiency: 94, icon: "javascript", orderIndex: 3 },
        { name: "SQL", category: "languages", proficiency: 90, icon: "database", orderIndex: 4 },
        { name: "HTML5 / CSS3", category: "languages", proficiency: 95, icon: "code", orderIndex: 5 },
        // AI & Machine Learning
        { name: "AI Agents (LangGraph / LangChain)", category: "ai_ml", proficiency: 95, icon: "bot", orderIndex: 1 },
        { name: "Retrieval-Augmented Generation (RAG)", category: "ai_ml", proficiency: 92, icon: "brain", orderIndex: 2 },
        { name: "LLMs & Generative AI", category: "ai_ml", proficiency: 95, icon: "sparkles", orderIndex: 3 },
        { name: "Computer Vision & YOLO", category: "ai_ml", proficiency: 90, icon: "eye", orderIndex: 4 },
        { name: "PyTorch & TensorFlow", category: "ai_ml", proficiency: 88, icon: "cpu", orderIndex: 5 },
        { name: "Scikit-learn & Predictive Modeling", category: "ai_ml", proficiency: 90, icon: "activity", orderIndex: 6 },
        { name: "OpenAI API & Gemini API", category: "ai_ml", proficiency: 95, icon: "zap", orderIndex: 7 },
        // Web & Backend
        { name: "Next.js & React 19", category: "web_backend", proficiency: 95, icon: "layout", orderIndex: 1 },
        { name: "Django & Django REST Framework", category: "web_backend", proficiency: 95, icon: "server", orderIndex: 2 },
        { name: "FastAPI", category: "web_backend", proficiency: 92, icon: "zap", orderIndex: 3 },
        { name: "Tailwind CSS & Modern UI", category: "web_backend", proficiency: 95, icon: "palette", orderIndex: 4 },
        { name: "Node.js", category: "web_backend", proficiency: 88, icon: "terminal", orderIndex: 5 },
        { name: "django-tenants (Multi-Tenant)", category: "web_backend", proficiency: 92, icon: "layers", orderIndex: 6 },
        // Databases
        { name: "PostgreSQL", category: "databases", proficiency: 94, icon: "database", orderIndex: 1 },
        { name: "Redis & Caching", category: "databases", proficiency: 90, icon: "layers", orderIndex: 2 },
        { name: "MySQL", category: "databases", proficiency: 88, icon: "hard-drive", orderIndex: 3 },
        // DevOps & Automation
        { name: "Docker & Docker Compose", category: "devops_cloud", proficiency: 92, icon: "box", orderIndex: 1 },
        { name: "n8n Workflow Automation", category: "devops_cloud", proficiency: 94, icon: "git-merge", orderIndex: 2 },
        { name: "ComfyUI Orchestration", category: "devops_cloud", proficiency: 92, icon: "sliders", orderIndex: 3 },
        { name: "Git & GitHub CI/CD", category: "devops_cloud", proficiency: 92, icon: "git-branch", orderIndex: 4 },
        { name: "Linux, AWS & GCP", category: "devops_cloud", proficiency: 90, icon: "cloud", orderIndex: 5 },
      ])
      .onConflictDoNothing();

    // 3. Seed Experiences
    console.log("Seeding experiences...");
    await db
      .insert(experiences)
      .values([
        {
          companyEn: "UBitc Group",
          companyAr: "مجموعة UBitc",
          roleEn: "Full-Stack Software Engineer / AI Engineer",
          roleAr: "مهندس برمجيات Full-Stack / مهندس ذكاء اصطناعي",
          locationEn: "Amman, Jordan",
          locationAr: "عمّان، الأردن",
          periodEn: "Dec 2024 – Present",
          periodAr: "ديسمبر 2024 – حتى الآن",
          startDate: new Date("2024-12-01"),
          isCurrent: true,
          descriptionEn:
            "Designing and engineering enterprise AI solutions, digital customs transformation, and multi-tenant commerce systems.",
          descriptionAr:
            "تصميم وتطوير حلول التحول الرقمي للجمارك، أنظمة التجارة بالذكاء الاصطناعي، وتفاعل الإنسان الرقمي الفوري.",
          highlightsEn: [
            "Contributed to developing a bilingual digital customs platform for the Libyan Customs Authority digitizing end-to-end import/export clearance workflows with React, FastAPI, PostgreSQL, and AI capabilities (shipment risk analysis, OCR, document analysis, forgery detection).",
            "Optimized an AI-powered digital-human system for real-time multilingual voice interaction, improving frame-accurate lip synchronization and natural facial behavior.",
            "Architected and independently developed a multi-tenant, bilingual AI-powered commerce platform (Next.js, TypeScript, Django, DRF, PostgreSQL, Redis, Celery, WebSockets) with LangGraph/Gemini AI ordering, vector search, and YOLO barcode recognition.",
          ],
          highlightsAr: [
            "المساهمة في تطوير منصة جمركية رقمية ثنائية اللغة لمصلحة الجمارك الليبية لأتمتة عمليات الاستيراد والتصدير مع React و FastAPI و PostgreSQL ودمج تحليل مخاطر الشحنات بـ AI و OCR وكشف التزوير.",
            "تحسين نظام إنسان رقمي ذكي للمحادثة الصوتية متعددة اللغات الفورية مع مزامنة دقيقة لحركة الشفاه وتعبيرات الوجه الطبيعية.",
            "تصميم وتطوير منصة تجارة متعددة المستأجرين وثنائية اللغة (Next.js, TypeScript, Django, DRF, PostgreSQL, Redis, Celery, WebSockets) مع طلب محادثة ذكي بـ LangGraph وبحث متجهي وتعرف بـ YOLO.",
          ],
          orderIndex: 1,
        },
        {
          companyEn: "Asrar Al-Thiqah",
          companyAr: "أسرار الثقة",
          roleEn: "AI & Computer Vision Software Engineer",
          roleAr: "مهندس برمجيات ورؤية حاسوبية",
          locationEn: "Amman, Jordan",
          locationAr: "عمّان، الأردن",
          periodEn: "Sep 2024 – Dec 2024",
          periodAr: "سبتمبر 2024 – ديسمبر 2024",
          startDate: new Date("2024-09-01"),
          endDate: new Date("2024-12-01"),
          isCurrent: false,
          descriptionEn:
            "Designed and developed an AI-powered vehicle inspection and customs assessment platform.",
          descriptionAr:
            "تصميم وتطوير منصة فحص وتقييم المركبات بالذكاء الاصطناعي والرؤية الحاسوبية.",
          highlightsEn: [
            "Designed and developed an AI-powered vehicle inspection platform that transforms uploaded video into structured inspection reports combining computer vision and AI models.",
            "Automated vehicle identification (VIN, license plate, make, model, color) and visible damage classification by type and location.",
          ],
          highlightsAr: [
            "تصميم وتطوير منصة فحص مركبات تحول الفيديو إلى تقارير فحص مهيكلة بدمج الرؤية الحاسوبية والذكاء الاصطناعي.",
            "استخراج بيانات المركبات (VIN، اللوحة، الموديل، اللون) وكشف وتصنيف أضرار المركبات الظاهرة تلقائياً حسب النوع والموقع.",
          ],
          orderIndex: 2,
        },
        {
          companyEn: "Freelance Software Engineering",
          companyAr: "عمل هندسي مستقل (Freelance)",
          roleEn: "Freelance Software Engineer & Product Developer",
          roleAr: "مهندس برمجيات ومطور منتجات مستقل",
          locationEn: "Remote / Jordan",
          locationAr: "عن بُعد / الأردن",
          periodEn: "2024 – Present",
          periodAr: "2024 – حتى الآن",
          startDate: new Date("2024-01-01"),
          isCurrent: true,
          descriptionEn:
            "Architecting multi-tenant SaaS applications and predictive machine learning models.",
          descriptionAr:
            "هندسة وتطوير منصات SaaS متعددة المستأجرين ونماذج التعلم الآلي التنبؤية.",
          highlightsEn: [
            "Maidan Multi-Tenant Martial Arts SaaS: Engineered a schema-per-tenant PostgreSQL SaaS platform using django-tenants, Next.js/TypeScript, DRF, Celery, Redis, MinIO/S3, and Docker.",
            "Medical Classification Robustness: Trained KNN and SVM classifiers on breast cancer data with Gaussian noise simulation, achieving 97.1% accuracy and minimizing critical false-negative errors to 1.17%.",
          ],
          highlightsAr: [
            "ميدان (Maidan): منصة SaaS متعددة المستأجرين لأكاديميات الفنون القتالية بهيكلية schema-per-tenant مع django-tenants و Next.js و DRF و Celery و Redis و MinIO و Docker.",
            "تقييم نماذج التصنيف الطبي: تدريب مصنفات KNN و SVM على بيانات سرطان الثدي مع محاكاة ضوضاء Gaussian لتقييم المتانة، محققاً 97.1% دقة وتقليل الخطأ الحرج للسلبيات الكاذبة إلى 1.17%.",
          ],
          orderIndex: 3,
        },
        {
          companyEn: "ASAC - Abdul Aziz Al Ghurair School of Advanced Computing",
          companyAr: "كلية عبد العزيز الغرير للحوسبة المتقدمة (ASAC)",
          roleEn: "Full-Stack Developer — Capstone Project",
          roleAr: "مطور برمجيات متكامل (Full-Stack) — مشروع التخرج",
          locationEn: "Amman, Jordan",
          locationAr: "عمّان، الأردن",
          periodEn: "Jun 2024 – Sep 2024",
          periodAr: "يونيو 2024 – سبتمبر 2024",
          startDate: new Date("2024-06-01"),
          endDate: new Date("2024-09-30"),
          isCurrent: false,
          descriptionEn:
            "Engineered full-stack property management platform.",
          descriptionAr:
            "تطوير منصة شاملة لإدارة العقارات والمستأجرين.",
          highlightsEn: [
            "Designed and developed a comprehensive Property Management System using Next.js, Django REST Framework, and PostgreSQL.",
            "Implemented rental applications, lease tracking, payment processing, maintenance ticketing, and role-based access.",
          ],
          highlightsAr: [
            "تصميم وتطوير نظام متكامل لإدارة العقارات باستخدام Next.js و Django REST Framework و PostgreSQL.",
            "تنفيذ طلبات الإيجار، وتتبع العقود، ومعالجة المدفوعات، وإدارة الصيانة بصلاحيات وصول مخصصة.",
          ],
          orderIndex: 4,
        },
      ])
      .onConflictDoNothing();

    // 4. Seed Education & Credentials
    console.log("Seeding education & credentials...");
    await db
      .insert(education)
      .values([
        {
          institutionEn: "ASAC - Luminus Technical University College",
          institutionAr: "كلية لومينوس الجامعية التقنية - ASAC",
          degreeEn: "Professional Diploma in Full-Stack Engineering",
          degreeAr: "دبلوم مهني في هندسة البرمجيات الشاملة",
          fieldEn: "Python & JavaScript",
          fieldAr: "بايثون وجافاسكريبت",
          yearEn: "September 2024",
          yearAr: "سبتمبر 2024",
          descriptionEn:
            "Intensive software engineering curriculum covering modern web stacks, algorithms, Next.js, React, Django, PostgreSQL, and cloud deployments.",
          descriptionAr:
            "منهاج مكثف في هندسة البرمجيات وتطوير الويب الحديث، Next.js، React، Django، PostgreSQL، والنشر السحابي.",
          orderIndex: 1,
        },
        {
          institutionEn: "Jazan University",
          institutionAr: "جامعة جازان",
          degreeEn: "Bachelor of Science in Civil Engineering",
          degreeAr: "بكالوريوس العلوم في الهندسة المدنية",
          fieldEn: "Civil Engineering",
          fieldAr: "الهندسة المدنية",
          yearEn: "November 2022",
          yearAr: "نوفمبر 2022",
          descriptionEn:
            "Strong quantitative and analytical engineering foundation in structural analysis, mathematical modeling, and complex problem-solving.",
          descriptionAr:
            "أساس هندسي وتحليلي قوي في النمذجة الرياضية، إدارة دورة حياة المشاريع، وحل المشكلات المعقدة.",
          orderIndex: 2,
        },
      ])
      .onConflictDoNothing();

    // 5. Seed Portfolio Projects
    console.log("Seeding projects...");
    await db
      .insert(projects)
      .values([
        {
          slug: "digital-customs-platform",
          titleEn: "Digital Customs Platform — Libyan Customs Authority",
          titleAr: "منصة الجمارك الرقمية — مصلحة الجمارك الليبية",
          summaryEn:
            "Bilingual digital customs platform digitizing import/export clearance with React, FastAPI, PostgreSQL, and AI shipment risk analysis, OCR, and forgery detection.",
          summaryAr:
            "منصة جمركية رقمية ثنائية اللغة لأتمتة عمليات الاستيراد والتصدير مع React و FastAPI و PostgreSQL ودمج الذكاء الاصطناعي لتحليل المخاطر واستخراج البيانات بـ OCR وكشف التزوير.",
          descriptionEn:
            "Digitizes end-to-end import/export clearance workflows from cargo declarations and manifests through inspection, valuation, duty payment, release, and audit with AI-driven risk scoring and OCR document analysis.",
          descriptionAr:
            "رقمنة شاملة لمسارات التخليص الجمركي من إقرارات الشحن والمنافست حتى التفتيش والتقييم والدفع والتدقيق مع تقييم المخاطر بالذكاء الاصطناعي واستخراج وثائق OCR.",
          category: "fullstack",
          technologies: ["React", "FastAPI", "PostgreSQL", "AI Risk Analysis", "OCR", "Document AI"],
          featured: true,
          orderIndex: 1,
          published: true,
        },
        {
          slug: "ai-commerce-platform",
          titleEn: "Multi-Tenant AI-Powered Commerce Platform",
          titleAr: "منصة تجارة إلكترونية متعددة المستأجرين بالذكاء الاصطناعي",
          summaryEn:
            "Full-stack commerce platform with Next.js, Django, PostgreSQL, LangGraph/Gemini conversational AI ordering, POS workflows, vector search, and real-time kitchen tracking.",
          summaryAr:
            "منصة تجارة متكاملة بـ Next.js و Django و PostgreSQL مع طلب ذكي عبر LangGraph و Gemini، وسير عمل POS، وبحث متجهي، وتتبع فوري للطلبات.",
          descriptionEn:
            "Multi-tenant bilingual commerce platform uniting merchant administration, autonomous voice/conversational AI ordering, barcode scanning, POS operations, and WebSocket live order status.",
          descriptionAr:
            "منصة تجارة ذكية متعددة المستأجرين تجمع إدارة التجار، الطلب الصوتي والمحادثة الذكية، مسح الباركود، عمليات نقاط البيع، وتتبع الطلبات المباشر عبر WebSockets.",
          category: "ai_agent",
          technologies: ["Next.js", "TypeScript", "Django", "LangGraph", "PostgreSQL", "Redis", "YOLO", "WebSockets"],
          featured: true,
          orderIndex: 2,
          published: true,
        },
        {
          slug: "ai-vehicle-inspection",
          titleEn: "AI-Powered Vehicle Inspection Platform",
          titleAr: "منصة فحص المركبات الذكية بالرؤية الحاسوبية",
          summaryEn:
            "Automates vehicle identification (VIN, plate, make, model) and detects visible damage from video using computer vision models.",
          summaryAr:
            "أتمتة التعرف على المركبات (VIN، اللوحة، الموديل، اللون) وكشف الأضرار الظاهرة وتصنيفها من الفيديو باستخدام الرؤية الحاسوبية.",
          descriptionEn:
            "Combines computer vision and deep learning models to process uploaded video feeds into structured inspection reports with VIN extraction and localized damage classification.",
          descriptionAr:
            "دمج نماذج الرؤية الحاسوبية والتعلم العميق لمعالجة مقاطع الفيديو المرفوعة إلى تقارير فحص مهيكلة مع استخراج VIN وتصنيف مواضع وأنواع الأضرار.",
          category: "ai_agent",
          technologies: ["Python", "Computer Vision", "YOLO", "FastAPI", "Video Processing", "AI Damage Classification"],
          featured: true,
          orderIndex: 3,
          published: true,
        },
        {
          slug: "maidan-martial-arts-saas",
          titleEn: "Maidan — Multi-Tenant Martial Arts Academy SaaS",
          titleAr: "ميدان — منصة SaaS متعددة المستأجرين لأكاديميات الفنون القتالية",
          summaryEn:
            "Schema-per-tenant SaaS architecture using django-tenants, Next.js, DRF, Celery, Redis, MinIO/S3, and Docker for martial arts academy operations and billing.",
          summaryAr:
            "بنية SaaS متعددة المستأجرين باستخدام django-tenants و Next.js و DRF و Celery و Redis و MinIO و Docker لإدارة الأكاديميات والفوترة الآلية.",
          descriptionEn:
            "Complete multi-tenant solution with isolated schema architecture, automated membership billing, belt progression tracking, attendance logging, and dynamic tenant routing.",
          descriptionAr:
            "حل متكامل متعدد المستأجرين بعزل كامل لقواعد البيانات عبر الـ Schemas، وفوترة الاشتراكات المؤتمتة، وتتبع تدرج الأحزمة، والتوجيه الديناميكي للمستأجرين.",
          category: "fullstack",
          technologies: ["Next.js", "TypeScript", "Django", "django-tenants", "PostgreSQL", "Celery", "Redis", "Docker"],
          featured: true,
          orderIndex: 4,
          published: true,
        },
        {
          slug: "ai-digital-human-interaction",
          titleEn: "Real-Time Multilingual AI Digital Human",
          titleAr: "الإنسان الرقمي التفاعلي بالذكاء الاصطناعي الفوري",
          summaryEn:
            "Optimized digital human avatar for real-time multilingual voice conversation, frame-accurate lip sync, and natural facial behavior.",
          summaryAr:
            "نظام إنسان رقمي ذكي للمحادثة الصوتية التفاعلية متعددة اللغات مع مطابقة دقيقة لحركة الشفاه وتعابير الوجه في الوقت الفعلي.",
          descriptionEn:
            "Real-time bidirectional speech orchestration combining ComfyUI pipelines, low-latency audio processing, and avatar animation.",
          descriptionAr:
            "تنسيق فوري للمحادثات الصوتية التفاعلية بدمج خطوط أنابيب ComfyUI، ومعالجة الصوت فائقة السرعة، ومطابقة حركة الشفاه بدقة متناهية.",
          category: "ai_agent",
          technologies: ["Python", "ComfyUI", "WebSockets", "Lip-Sync AI", "TTS / STT", "n8n"],
          featured: true,
          orderIndex: 5,
          published: true,
        },
        {
          slug: "medical-classification-robustness",
          titleEn: "Medical ML Classification & Noise Robustness",
          titleAr: "تقييم ومتانة نماذج التعلم الآلي للتصنيف الطبي",
          summaryEn:
            "Supervised KNN and SVM classification on breast cancer data with Gaussian noise simulation, achieving 97.1% SVM accuracy and 1.17% critical error rate.",
          summaryAr:
            "تطبيق وتدريب مصنفات KNN و SVM على بيانات طبية حقيقية مع محاكاة ضوضاء Gaussian لتقييم المتانة، محققاً دقة 97.1% وخفض معدل الخطأ الحرج.",
          descriptionEn:
            "Evaluated confusion matrices and classification metrics under simulated degraded data conditions to minimize dangerous false-negative diagnosis errors.",
          descriptionAr:
            "تحليل وتقييم مصفوفات الالتباس ومقاييس التصنيف في ظل ظروف بيانات مشوهة عمداً لتقليل مخاطر أخطاء التشخيص للسلبيات الكاذبة.",
          category: "ai_agent",
          technologies: ["Python", "Scikit-learn", "SVM", "KNN", "Noise Simulation", "Data Analysis"],
          featured: true,
          orderIndex: 6,
          published: true,
        },
        {
          slug: "property-management-system",
          titleEn: "Full-Stack Property Management System",
          titleAr: "نظام شامل لإدارة العقارات والمستأجرين",
          summaryEn:
            "End-to-end platform for rental contracts, lease tracking, payment processing, and maintenance dispatching using Next.js and Django.",
          summaryAr:
            "منصة متكاملة لإدارة عقود الإيجار، وتتبع الدفعات، وتذاكر الصيانة، والتواصل بين الملاك والمستأجرين بـ Next.js و Django.",
          descriptionEn:
            "Engineered with Next.js and Django REST Framework, featuring secure role-based access control, lease lifecycle tracking, and maintenance resolution.",
          descriptionAr:
            "تم بناؤها باستخدام Next.js و Django REST Framework، موفرة وصولاً آمناً متعدد الصلاحيات للملاك والمستأجرين مع إدارة دورة حياة العقود.",
          category: "fullstack",
          technologies: ["Next.js", "React", "Django REST Framework", "PostgreSQL", "Tailwind CSS"],
          featured: true,
          orderIndex: 7,
          published: true,
        },
      ])
      .onConflictDoNothing();

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Auto-run if executed directly
if (process.argv[1]?.includes("seed")) {
  seedDatabase()
    .then(() => {
      console.log("Seed finished. Exiting...");
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
