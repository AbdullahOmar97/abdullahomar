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
        { name: "LangChain & LangGraph", category: "ai_ml", proficiency: 95, icon: "bot", orderIndex: 1 },
        { name: "Retrieval-Augmented Gen (RAG)", category: "ai_ml", proficiency: 92, icon: "brain", orderIndex: 2 },
        { name: "Google Gemini & OpenAI APIs", category: "ai_ml", proficiency: 96, icon: "sparkles", orderIndex: 3 },
        { name: "Computer Vision (YOLO/OpenCV)", category: "ai_ml", proficiency: 88, icon: "eye", orderIndex: 4 },
        { name: "PyTorch & TensorFlow", category: "ai_ml", proficiency: 85, icon: "cpu", orderIndex: 5 },
        // Web & Backend
        { name: "Next.js 15/16 & React 19", category: "web_backend", proficiency: 95, icon: "layout", orderIndex: 1 },
        { name: "Django & Django REST", category: "web_backend", proficiency: 92, icon: "server", orderIndex: 2 },
        { name: "FastAPI", category: "web_backend", proficiency: 90, icon: "zap", orderIndex: 3 },
        { name: "Tailwind CSS", category: "web_backend", proficiency: 95, icon: "palette", orderIndex: 4 },
        { name: "Node.js", category: "web_backend", proficiency: 88, icon: "terminal", orderIndex: 5 },
        // Databases
        { name: "PostgreSQL & Drizzle ORM", category: "databases", proficiency: 92, icon: "database", orderIndex: 1 },
        { name: "Redis", category: "databases", proficiency: 86, icon: "layers", orderIndex: 2 },
        { name: "MongoDB", category: "databases", proficiency: 84, icon: "hard-drive", orderIndex: 3 },
        // DevOps & Automation
        { name: "Docker & Docker Compose", category: "devops_cloud", proficiency: 90, icon: "box", orderIndex: 1 },
        { name: "n8n Workflow Automation", category: "devops_cloud", proficiency: 94, icon: "git-merge", orderIndex: 2 },
        { name: "ComfyUI Pipeline Orchestration", category: "devops_cloud", proficiency: 92, icon: "sliders", orderIndex: 3 },
        { name: "Git & GitHub CI/CD", category: "devops_cloud", proficiency: 92, icon: "git-branch", orderIndex: 4 },
        { name: "Linux & Cloud Infrastructure", category: "devops_cloud", proficiency: 88, icon: "cloud", orderIndex: 5 },
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
          roleEn: "Software Engineer",
          roleAr: "مهندس برمجيات",
          locationEn: "Amman, Jordan",
          locationAr: "عمّان، الأردن",
          periodEn: "Dec 2024 – Present",
          periodAr: "ديسمبر 2024 – حتى الآن",
          startDate: new Date("2024-12-01"),
          isCurrent: true,
          descriptionEn:
            "Designing and engineering enterprise AI solutions, autonomous agent bots, and full-stack web platforms.",
          descriptionAr:
            "تصميم وهندسة حلول الذكاء الاصطناعي للمؤسسات، روبوتات الوكلاء المستقلين، ومنصات الويب المتكاملة.",
          highlightsEn: [
            "Designed and developed multiple end-to-end AI-driven applications using Python, ComfyUI, and n8n.",
            "Optimized an AI-driven avatar system supporting real-time multilingual voice conversation with lip-sync alignment.",
            "Built a Next.js + Django customer order management platform with real-time tracking.",
            "Engineered an autonomous voice-based product ordering AI agent using LangGraph.",
            "Developed computer vision product recognition and barcode scanning automation pipelines.",
          ],
          highlightsAr: [
            "تصميم وتطوير تطبيقات ذكاء اصطناعي متكاملة وسير عمل مؤتمت باستخدام Python و ComfyUI و n8n.",
            "تحسين نظام أفاتار ذكي يدعم المحادثة الصوتية الفورية متعددة اللغات مع مطابقة حركة الشفاه بدقة.",
            "بناء منصة متكاملة باستخدام Next.js و Django لإدارة طلبات العملاء وتتبع المبيعات.",
            "تطوير وكيل ذكاء اصطناعي مستقل بالصوت باستخدام LangGraph لطلب المنتجات مباشرة من المحادثة.",
            "بناء نظام رؤية حاسوبية للتعرف الذكي على المنتجات وقراءة الباركود بدقة عالية.",
          ],
          orderIndex: 1,
        },
        {
          companyEn: "ASAC - Abdul Aziz Al Ghurair School of Advanced Computing",
          companyAr: "كلية عبد العزيز الغرير للحوسبة المتقدمة (ASAC)",
          roleEn: "Full-Stack Developer",
          roleAr: "مطور برمجيات متكامل (Full-Stack)",
          locationEn: "Amman, Jordan",
          locationAr: "عمّان، الأردن",
          periodEn: "Jun 2024 – Sep 2024",
          periodAr: "يونيو 2024 – سبتمبر 2024",
          startDate: new Date("2024-06-01"),
          endDate: new Date("2024-09-30"),
          isCurrent: false,
          descriptionEn:
            "Engineered scalable web applications and modernized full-stack platforms.",
          descriptionAr:
            "تطوير تطبيقات ويب قابلة للتوسع وتحديث المنصات البرمجية المتكاملة.",
          highlightsEn: [
            "Designed and developed a comprehensive Property Management System using Next.js and Django.",
            "Integrated modules for rental applications, lease tracking, payment processing, and maintenance ticketing.",
            "Streamlined interactions between property owners and tenants with modern UX workflows.",
          ],
          highlightsAr: [
            "تصميم وتطوير نظام شامل لإدارة العقارات باستخدام Next.js و Django.",
            "دمج وحدات لطلبات الإيجار، وتتبع العقود، ومعالجة الدفع، وإدارة تذاكر الصيانة.",
            "تبسيط تجربة المستخدم وتعزيز التفاعل بين الملاك والمستأجرين.",
          ],
          orderIndex: 2,
        },
      ])
      .onConflictDoNothing();

    // 4. Seed Education & Certifications
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
          yearEn: "2024",
          yearAr: "2024",
          descriptionEn:
            "Intensive curriculum covering modern software architectures, algorithms, data structures, React/Next.js, Django, databases, and DevOps.",
          descriptionAr:
            "منهاج مكثف في هندسة البرمجيات، هياكل البيانات والخوارزميات، React/Next.js، Django، قواعد البيانات، و DevOps.",
          orderIndex: 1,
        },
        {
          institutionEn: "Jazan University",
          institutionAr: "جامعة جازان",
          degreeEn: "Bachelor of Science in Civil Engineering",
          degreeAr: "بكالوريوس العلوم في الهندسة المدنية",
          fieldEn: "Civil Engineering",
          fieldAr: "الهندسة المدنية",
          yearEn: "2022",
          yearAr: "2022",
          descriptionEn:
            "Solid quantitative foundation in structural analysis, mathematical modeling, project lifecycle management, and problem solving.",
          descriptionAr:
            "أساس تحليلي وهندسي قوي في النمذجة الرياضية، إدارة دورة حياة المشاريع، وحل المشكلات المعقدة.",
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
          slug: "ai-avatar-order-system",
          titleEn: "Real-Time Multilingual AI Avatar & Order Platform",
          titleAr: "منصة الأفاتار الذكي الفوري ونظام إدارة الطلبات",
          summaryEn:
            "Real-time voice conversational avatar with lip-sync alignment integrated with an order management ecosystem.",
          summaryAr:
            "أفاتار ذكي للمحادثة الصوتية الفورية متعددة اللغات مع مطابقة حركة الشفاه متصل بنظام إدارة الطلبات.",
          descriptionEn:
            "A cutting-edge solution merging real-time generative speech with responsive avatar rendering, automated order parsing, and live dashboard management.",
          descriptionAr:
            "حل مبتكر يدمج المعالجة الصوتية التوليدية الفورية مع حركة الأفاتار، واستخراج الطلبات آلياً وإدارتها عبر لوحة تحكم فورية.",
          category: "ai_agent",
          technologies: ["Python", "ComfyUI", "Next.js", "Django", "WebSockets", "n8n"],
          featured: true,
          orderIndex: 1,
          published: true,
        },
        {
          slug: "property-management-system",
          titleEn: "Full-Stack Property Management System",
          titleAr: "نظام شامل لإدارة العقارات والمستأجرين",
          summaryEn:
            "End-to-end platform for rental contracts, lease tracking, payment processing, and maintenance dispatching.",
          summaryAr:
            "منصة متكاملة لإدارة عقود الإيجار، وتتبع الدفعات، والصيانة، والتواصل بين الملاك والمستأجرين.",
          descriptionEn:
            "Engineered with Next.js and Django REST Framework, providing secure multi-tenant role-based access for property owners and tenants.",
          descriptionAr:
            "تم بناؤها باستخدام Next.js و Django REST Framework، موفرة وصولاً آمناً متعدد الصلاحيات للملاك والمستأجرين.",
          category: "fullstack",
          technologies: ["Next.js", "React", "Django", "PostgreSQL", "Tailwind CSS"],
          featured: true,
          orderIndex: 2,
          published: true,
        },
        {
          slug: "voice-ai-agent-langgraph",
          titleEn: "Autonomous Voice Product Ordering Agent",
          titleAr: "وكيل صوتي ذكي مستقل للطلب بالصوت",
          summaryEn:
            "Stateful AI agent powered by LangGraph that handles natural voice ordering and catalog navigation.",
          summaryAr:
            "وكيل ذكاء اصطناعي متطور مبني بـ LangGraph لمعالجة الطلبات الصوتية والتنقل في كتالوج المنتجات.",
          descriptionEn:
            "Utilizes structured graphs, state checkpoints, and dynamic tool calls to complete multi-step checkout processes conversationally.",
          descriptionAr:
            "يعتمد على الرسوم البيانية المنطقية ونقاط الحفظ واستدعاء الأدوات لإتمام عمليات الشراء بالكامل عبر الصوت.",
          category: "ai_agent",
          technologies: ["LangGraph", "LangChain", "Python", "FastAPI", "Gemini API"],
          featured: true,
          orderIndex: 3,
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
