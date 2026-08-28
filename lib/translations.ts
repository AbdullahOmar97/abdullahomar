export type Language = "en" | "ar"

export const translations = {
  en: {
    // Navigation
    nav: {
      about: "About",
      experience: "Experience",
      projects: "Projects",
      skills: "Skills",
      education: "Education",
      contact: "Contact",
      services: "Services",
    },
    // Services
    services: {
      title: "My Services",
      description: "Professional services tailored to your needs, from web development to advanced AI integration.",
      currency: "JOD",
      subscribe: "Subscribe",
      details: "Details",
      modal: {
        title: "Subscribe to Service",
        description: "Please enter your phone number to receive more details about this service.",
        phoneLabel: "Phone Number",
        phonePlaceholder: "e.g., +962 79 123 4567",
        submit: "Send Request",
        cancel: "Cancel",
        success: "Request sent successfully! We will contact you soon.",
      },
      items: {
        webDev: {
          title: "Full-Stack Web Development",
          description: "Custom web applications built with Next.js and Django/FastAPI. Scalable, secure, and high-performance solutions.",
          details: "Complete web solutions including frontend design, backend development, database management, and deployment.",
        },
        aiIntegration: {
          title: "AI Integration & Automation",
          description: "Integrate advanced AI agents and workflows into your business processes. Automate tasks and enhance decision-making.",
          details: "Custom AI solutions using LLMs, RAG, and workflow automation tools like n8n to streamline your operations.",
        },
        consultation: {
          title: "Technical Consultation",
          description: "Expert advice on software architecture, technology stack selection, and digital transformation strategies.",
          details: "In-depth analysis of your technical needs and strategic planning to ensure your project's success.",
        },
      },
    },
    // Hero
    hero: {
      greeting: "Hello, I'm",
      name: "Abdullah Omar Salman",
      title: "Full-Stack Software Engineer",
      specialization: "AI-Powered Applications",
      description:
        "Building scalable digital platforms using Django, FastAPI, React/Next.js (TypeScript), and PostgreSQL. Developing enterprise digital transformation solutions, AI-powered commerce, computer vision, and multi-tenant SaaS systems.",
      location: "Amman, Jordan, 11623",
      getInTouch: "Get in Touch",
      viewExperience: "View Experience",
      viewServices: "My Services",
    },
    // About
    about: {
      title: "About Me",
      paragraph1:
        "I'm a Full-Stack Software Engineer specializing in AI-powered applications, experienced in building scalable digital platforms using Django, FastAPI, React/Next.js (TypeScript), and PostgreSQL.",
      paragraph2:
        "I develop enterprise digital transformation solutions — including a bilingual digital customs platform for the Libyan Customs Authority — alongside AI-powered commerce platforms, computer vision vehicle inspection, and multi-tenant SaaS architectures.",
      paragraph3:
        "Skilled in AI Agents, LLMs, RAG, Generative AI, Computer Vision, and workflow automation. Driven by analytical engineering rigor and modern AI systems to deliver high-impact, production-grade solutions.",
      highlights: {
        fullStack: {
          title: "Full-Stack Web Engineering",
          description: "Next.js, React, TypeScript, Django, FastAPI, PostgreSQL",
        },
        ai: {
          title: "AI & Machine Learning",
          description: "AI Agents, LLMs, RAG, YOLO, Computer Vision, Transformers",
        },
        saas: {
          title: "Multi-Tenant SaaS & Commerce",
          description: "django-tenants, schema-per-tenant, POS, WebSockets",
        },
        automation: {
          title: "Workflow Automation & MLOps",
          description: "n8n, ComfyUI, Docker, Celery, Redis, CI/CD",
        },
      },
    },
    // Experience
    experience: {
      title: "Experience",
      jobs: [
        {
          title: "Full-Stack Software Engineer / AI Engineer",
          company: "UBitc Group",
          location: "Jordan",
          period: "Dec 2024 – Present",
          skills: ["Next.js", "TypeScript", "FastAPI", "Django", "PostgreSQL", "LangGraph", "Computer Vision", "OCR", "Docker", "n8n"],
          description: [
            "Digital Customs Platform (Libyan Customs Authority): Contributed to developing a bilingual digital customs platform digitizing end-to-end clearance workflows (declarations, manifests, inspection, valuation, duty payment, release, audit) with React, FastAPI, PostgreSQL, and AI capabilities (shipment risk analysis, OCR data extraction, document analysis, forgery detection).",
            "AI Digital Human & Voice Interaction: Optimized an AI-powered digital-human system for real-time multilingual voice interaction, improving frame-accurate lip synchronization, natural eye movement, and facial behavior.",
            "AI-Powered Commerce Platform: Conceptualized, architected, and independently developed a multi-tenant, bilingual AI-powered commerce platform (Next.js, TypeScript, Django, DRF, PostgreSQL, Redis, Celery, WebSockets) with LangGraph/Gemini conversational AI, vector product search, YOLO/barcode recognition, POS workflows, and real-time tracking.",
          ],
        },
        {
          title: "AI & Computer Vision Software Engineer",
          company: "Asrar Al-Thiqah",
          location: "Jordan",
          period: "Sep 2024 – Dec 2024",
          skills: ["Python", "Computer Vision", "YOLO", "FastAPI", "Video Processing", "AI Damage Classification"],
          description: [
            "AI-Powered Vehicle Inspection & Customs Platform: Designed and developed an AI-powered vehicle inspection platform that transforms uploaded video into structured inspection reports by combining computer vision and AI models.",
            "Automated vehicle identification and extracted VIN, license plate, make, model, and color, while automatically detecting and classifying visible vehicle damage by type and location for reliable data-driven assessment.",
          ],
        },
        {
          title: "Freelance Software Engineer & Product Developer",
          company: "Freelance",
          location: "Remote / Jordan",
          period: "2024 – Present",
          skills: ["Next.js", "TypeScript", "Django", "django-tenants", "PostgreSQL", "Scikit-learn", "Docker", "MinIO"],
          description: [
            "Maidan — Multi-Tenant Martial Arts Academy SaaS: Engineered a schema-per-tenant PostgreSQL SaaS platform using django-tenants, Next.js/TypeScript, DRF, Celery, Redis, MinIO/S3, and Docker, covering member management, belt progression, attendance, scheduling, billing, and dynamic tenant routing.",
            "Medical Classification Models Evaluation & Robustness: Implemented and trained KNN and SVM classifiers on breast cancer data (benign vs malignant), simulated Gaussian random noise to evaluate resilience, and achieved 97.1% accuracy with SVM while minimizing critical false-negative errors to 1.17%.",
          ],
        },
        {
          title: "Full-Stack Developer — Capstone Project",
          company: "ASAC - Abdul Aziz Al Ghurair School of Advanced Computing",
          location: "Jordan",
          period: "Jun 2024 – Sep 2024",
          skills: ["Next.js", "React", "Django REST Framework", "PostgreSQL", "TailwindCSS"],
          description: [
            "Property Management System: Designed and developed a full-stack property management platform using Next.js, Django REST Framework, and PostgreSQL.",
            "Implemented rental applications, lease tracking, payment processing, maintenance workflows, authentication, RESTful APIs, and role-based access for property owners and tenants.",
          ],
        },
      ],
    },
    // Skills
    skills: {
      title: "Skills",
      categories: {
        languages: "Languages",
        aiMl: "AI & Machine Learning",
        backend: "Backend & Databases",
        frontend: "Frontend & UI",
        cloud: "Cloud & DevOps",
        automation: "Workflow Automation",
        softSkills: "Soft Skills",
      },
    },
    // Education, Certifications & Volunteer
    education: {
      title: "Education & Credentials",
      educationLabel: "Education",
      certificationsLabel: "Certifications & Training",
      volunteerLabel: "Volunteer Initiatives",
      degrees: [
        {
          degree: "Professional Diploma in Full-Stack Engineering",
          field: "Python & JavaScript",
          institution: "ASAC - Luminus Technical University College",
          location: "Amman, Jordan",
          period: "September 2024",
        },
        {
          degree: "Bachelor of Science in Civil Engineering",
          field: "Civil Engineering",
          institution: "Jazan University",
          location: "Jazan, Saudi Arabia",
          period: "November 2022",
        },
      ],
      certifications: [
        {
          title: "AI Applications in Energy Efficiency and Renewable Energy",
          institution: "National University College of Technology - Jordan",
          date: "June 2023",
          hours: "100 Hours",
        },
        {
          title: "E-Commerce Training Course",
          institution: "Miami Academy for Business Solution - Jordan",
          date: "April 2023 - May 2023",
          hours: "40 Hours",
        },
        {
          title: "Work Readiness and Idea to Business",
          institution: "Education for Employment - Jordan",
          date: "April 2023 - May 2023",
          hours: "Skilling for Increased Economic Participation of Youth",
        },
        {
          title: "English as a Foreign Language Program",
          institution: "ELC at Cape Town University - South Africa",
          date: "June 2019 - July 2019",
          hours: "4-Week EFL Program",
        },
        {
          title: "Training Diploma in Youth Leadership",
          institution: "Canada Global Centre - Saudi Arabia",
          date: "September 2017 - August 2019",
          hours: "300 Hours (International Standards of Instructional Design)",
        },
      ],
      volunteer: [
        {
          title: "Media Executive Team",
          organization: "SMAV Academy - Saudi Arabia",
          period: "2017 - 2018",
          description: "Managed media coverage, photography, content creation, and administered social media platforms during the Hajj period in Saudi Arabia.",
        },
        {
          title: "Independent Web Initiatives",
          organization: "Community & Educational Portals",
          period: "2008 – 2015",
          description: "Developed educational websites for secondary & middle schools, teachers, and an educational supervisor portal to support digital resource distribution.",
        },
      ],
    },
    // Contact
    contact: {
      title: "Get In Touch",
      description:
        "I'm currently open to new opportunities, collaborations, and engineering challenges. Whether you have a question, want to discuss a project, or just want to say hi, feel free to reach out!",
      info: {
        title: "Contact Information",
        email: "Email",
        phone: "Phone",
        location: "Location",
        connect: "Connect with me",
      },
      cta: {
        title: "Let's Work Together",
        description: "Interested in collaborating or have an AI/Full-Stack project in mind? I'd love to hear from you.",
        button: "Send Email",
      },
    },
    // Accessibility
    a11y: {
      skipLink: "Skip to main content",
      navAriaLabel: "Main navigation",
      openMenu: "Open navigation menu",
      closeMenu: "Close navigation menu",
      themeToggle: "Toggle theme, current theme:",
      newTab: "(opens in a new tab)",
      logoAria: "Abdullah Omar - Home",
      emailAria: "Send an email to Abdullah Omar",
      phoneAria: "Call Abdullah Omar",
      chatAria: {
        open: "Open AI Assistant",
        close: "Close AI Assistant",
        mute: "Mute voice responses",
        unmute: "Unmute voice responses",
        voiceStart: "Start voice input",
        voiceStop: "Stop voice input",
        send: "Send message",
        inputLabel: "Chat message input",
      },
    },
    chat: {
      title: "Abdullah Omar AI Assistant",
      liveVoiceTitle: "Live Voice Assistant",
      textMode: "Chat",
      liveMode: "Live Voice",
      placeholder: "Ask anything about Abdullah's experience & projects...",
      greeting: "Hello! I am Abdullah Omar's AI Assistant. How can I help you explore his profile and projects today?",
      startLive: "Start Live Voice",
      endLive: "End Voice Session",
      listening: "Listening to you...",
      speaking: "Assistant is speaking...",
      thinking: "Thinking...",
      connecting: "Connecting Live session...",
      connected: "Live Connected",
      disconnected: "Disconnected",
      micMuted: "Microphone Muted",
      micActive: "Microphone Active",
      muteMic: "Mute Microphone",
      unmuteMic: "Unmute Microphone",
      suggestedTitle: "Suggested Questions:",
      suggestions: [
        "What are Abdullah's core AI & Full-Stack skills?",
        "Tell me about the Libyan Customs Platform.",
        "Tell me about the AI-Powered Commerce Platform.",
        "How can I contact Abdullah Omar?",
      ],
      copy: "Copy",
      copied: "Copied!",
      clear: "Clear Chat",
      liveSubtitle: "Real-time bidirectional voice conversation with AI",
      micPermissionError: "Microphone access is required for Live voice mode.",
      connectionError: "Could not connect to Live voice session. Please try standard chat.",
    },
    // Footer
    footer: {
      rights: "All rights reserved.",
    },
  },
  ar: {
    // Navigation
    nav: {
      about: "نبذة عني",
      experience: "الخبرات",
      projects: "المشاريع",
      skills: "المهارات",
      education: "التعليم والشهادات",
      contact: "تواصل",
      services: "خدماتي",
    },
    // Services
    services: {
      title: "خدماتي",
      description: "خدمات احترافية مصممة خصيصًا لاحتياجاتك، من تطوير الويب إلى دمج الذكاء الاصطناعي المتقدم.",
      currency: "دأ",
      subscribe: "اشتراك",
      details: "التفاصيل",
      modal: {
        title: "الاشتراك في الخدمة",
        description: "يرجى إدخال رقم هاتفك لتلقي المزيد من التفاصيل حول هذه الخدمة.",
        phoneLabel: "رقم الهاتف",
        phonePlaceholder: "مثال: +962 78 790 0948",
        submit: "إرسال الطلب",
        cancel: "إلغاء",
        success: "تم إرسال الطلب بنجاح! سنتصل بك قريباً.",
      },
      items: {
        webDev: {
          title: "تطوير الويب المتكامل",
          description: "تطبيقات ويب مخصصة مبنية باستخدام Next.js و Django/FastAPI. حلول قابلة للتوسع، آمنة، وعالية الأداء.",
          details: "حلول ويب متكاملة تشمل تصميم الواجهة الأمامية، تطوير الخلفية، إدارة قواعد البيانات، والنشر.",
        },
        aiIntegration: {
          title: "دمج الذكاء الاصطناعي والأتمتة",
          description: "دمج وكلاء الذكاء الاصطناعي وسير العمل في عملياتك التجارية. أتمتة المهام وتعزيز اتخاذ القرار.",
          details: "حلول ذكاء اصطناعي مخصصة باستخدام LLMs، RAG، وأدوات أتمتة سير العمل مثل n8n لتبسيط عملياتك.",
        },
        consultation: {
          title: "استشارات تقنية",
          description: "مشورة الخبراء حول هندسة البرمجيات، اختيار التقنيات، واستراتيجيات التحول الرقمي.",
          details: "تحليل متعمق لاحتياجاتك التقنية وتخطيط استراتيجي لضمان نجاح مشروعك.",
        },
      },
    },
    // Hero
    hero: {
      greeting: "مرحباً، أنا",
      name: "عبدالله عمر سلمان",
      title: "مهندس برمجيات Full-Stack",
      specialization: "تطبيقات مدعومة بالذكاء الاصطناعي",
      description:
        "بناء منصات رقمية قابلة للتوسع باستخدام Django و FastAPI و React/Next.js (TypeScript) و PostgreSQL. تطوير حلول التحول الرقمي للمؤسسات، التجارة بالذكاء الاصطناعي، الرؤية الحاسوبية، وأنظمة SaaS متعددة المستأجرين.",
      location: "عمّان، الأردن، 11623",
      getInTouch: "تواصل معي",
      viewExperience: "عرض الخبرات",
      viewServices: "خدماتي",
    },
    // About
    about: {
      title: "نبذة عني",
      paragraph1:
        "أنا مهندس برمجيات Full-Stack متخصص في التطبيقات المدعومة بالذكاء الاصطناعي، ذو خبرة في بناء منصات رقمية قابلة للتوسع باستخدام Django و FastAPI و React/Next.js (TypeScript) و PostgreSQL.",
      paragraph2:
        "قمت بتطوير حلول تحول رقمي متقدمة للمؤسسات — بما في ذلك منصة جمارك رقمية ثنائية اللغة لمصلحة الجمارك الليبية — إلى جانب منصات تجارة إلكترونية بالذكاء الاصطناعي، فحص المركبات بالرؤية الحاسوبية، وأنظمة SaaS متعددة المستأجرين.",
      paragraph3:
        "ماهر في وكلاء الذكاء الاصطناعي (AI Agents)، ونماذج اللغة الكبيرة (LLMs)، و RAG، والذكاء الاصطناعي التوليدي، والرؤية الحاسوبية، وأتمتة سير العمل، مع دمج الدقة الهندسية التحليلية لبناء حلول إنتاجية متينة.",
      highlights: {
        fullStack: {
          title: "هندسة الويب المتكاملة",
          description: "Next.js, React, TypeScript, Django, FastAPI, PostgreSQL",
        },
        ai: {
          title: "الذكاء الاصطناعي وتعلم الآلة",
          description: "وكلاء AI, LLMs, RAG, YOLO, الرؤية الحاسوبية",
        },
        saas: {
          title: "أنظمة SaaS والتجارة الذكية",
          description: "django-tenants, هيكلية متعددة المستأجرين, POS",
        },
        automation: {
          title: "أتمتة سير العمل و MLOps",
          description: "n8n, ComfyUI, Docker, Celery, Redis, CI/CD",
        },
      },
    },
    // Experience
    experience: {
      title: "الخبرات المهنية",
      jobs: [
        {
          title: "مهندس برمجيات Full-Stack / مهندس ذكاء اصطناعي",
          company: "مجموعة UBitc",
          location: "الأردن",
          period: "ديسمبر 2024 – الحالي",
          skills: ["Next.js", "TypeScript", "FastAPI", "Django", "PostgreSQL", "LangGraph", "Computer Vision", "OCR", "Docker", "n8n"],
          description: [
            "منصة الجمارك الرقمية — مصلحة الجمارك الليبية: المساهمة في تطوير منصة جمركية رقمية ثنائية اللغة لأتمتة دورة التخليص الجمركي للاستيراد والتصدير من الإقرارات الجمركية والمنافست حتى التفتيش والتقييم والدفع والإفراج والتدقيق، مع دمج تحليل مخاطر الشحنات، استخراج البيانات بـ OCR، التحليل الذكي للوثائق، وكشف التزوير.",
            "الإنسان الرقمي والتفاعل الصوتي بالذكاء الاصطناعي: تحسين نظام إنسان رقمي ذكي للمحادثة الصوتية متعددة اللغات في الوقت الفعلي مع مزامنة دقيقة لحركة الشفاه وحركة العين وسلوكيات الوجه.",
            "منصة تجارة إلكترونية مدعومة بالذكاء الاصطناعي: تصميم وهندسة وتطوير منصة تجارة متعددة المستأجرين وثنائية اللغة (Next.js, TypeScript, Django, DRF, PostgreSQL, Redis, Celery, WebSockets) مع محادثة ذكية بـ LangGraph/Gemini، بحث متجهي، تعرف على المنتجات بـ YOLO، وسير عمل POS وتتبع فوري.",
          ],
        },
        {
          title: "مهندس برمجيات ورؤية حاسوبية",
          company: "أسرار الثقة",
          location: "الأردن",
          period: "سبتمبر 2024 – ديسمبر 2024",
          skills: ["Python", "Computer Vision", "YOLO", "FastAPI", "Video Processing", "AI Damage Classification"],
          description: [
            "منصة فحص المركبات والجمارك بالذكاء الاصطناعي: تصميم وتطوير منصة فحص مركبات تحول مقاطع الفيديو المرفوعة إلى تقارير فحص مهيكلة عبر دمج نماذج الرؤية الحاسوبية والذكاء الاصطناعي.",
            "التعرف الآلي على المركبات واستخراج رقم الهيكل (VIN)، لوحة الترخيص، الموديل واللون، مع الكشف التلقائي وتصنيف أضرار المركبات الظاهرة حسب النوع والموقع لتمكين تقييم موثوق ومبني على البيانات.",
          ],
        },
        {
          title: "مهندس برمجيات ومطور منتجات مستقل",
          company: "عمل مستقل (Freelance)",
          location: "عن بُعد / الأردن",
          period: "2024 – الحالي",
          skills: ["Next.js", "TypeScript", "Django", "django-tenants", "PostgreSQL", "Scikit-learn", "Docker", "MinIO"],
          description: [
            "ميدان (Maidan) — منصة SaaS متعددة المستأجرين لأكاديميات الفنون القتالية: هندسة منصة SaaS بهيكلية Schema-per-tenant باستخدام django-tenants و Next.js/TypeScript و DRF و Celery و Redis و MinIO/S3 و Docker لإدارة الطلاب والاشتراكات وتدرج الأحزمة والفوترة الآلية.",
            "مشروع تقييم ومتانة نماذج التصنيف الطبي: تطبيق وتدريب مصنفات KNN و SVM على بيانات حقيقية لتصنيف أورام سرطان الثدي، محاكاة ضوضاء Gaussian لتقييم المتانة، حيث حقق نموذج SVM دقة 97.1% وخفض معدل الخطأ الحرج للسلبيات الكاذبة إلى 1.17%.",
          ],
        },
        {
          title: "مطور برمجيات متكامل (Full-Stack) — مشروع التخرج",
          company: "كلية عبد العزيز الغرير للحوسبة المتقدمة (ASAC)",
          location: "الأردن",
          period: "يونيو 2024 – سبتمبر 2024",
          skills: ["Next.js", "React", "Django REST Framework", "PostgreSQL", "TailwindCSS"],
          description: [
            "نظام شامل لإدارة العقارات: تصميم وتطوير منصة متكاملة باستخدام Next.js و Django REST Framework و PostgreSQL لدعم طلبات الإيجار، تتبع العقود، معالجة المدفوعات، وإدارة الصيانة بصلاحيات مخصصة للملاك والمستأجرين.",
          ],
        },
      ],
    },
    // Skills
    skills: {
      title: "المهارات التقنية",
      categories: {
        languages: "لغات البرمجة",
        aiMl: "الذكاء الاصطناعي وتعلم الآلة",
        backend: "الخلفية وقواعد البيانات",
        frontend: "الواجهة الأمامية",
        cloud: "السحابة و DevOps",
        automation: "أتمتة سير العمل",
        softSkills: "المهارات الشخصية والمنهجيات",
      },
    },
    // Education, Certifications & Volunteer
    education: {
      title: "التعليم والمؤهلات والشهادات",
      educationLabel: "التعليم الأكاديمي",
      certificationsLabel: "الشهادات والتدريب",
      volunteerLabel: "المبادرات والعمل التطوعي",
      degrees: [
        {
          degree: "دبلوم مهني في هندسة البرمجيات الشاملة (Full-Stack)",
          field: "بايثون وجافاسكريبت (Python & JavaScript)",
          institution: "ASAC - كلية لومينوس الجامعية التقنية",
          location: "عمّان، الأردن",
          period: "سبتمبر 2024",
        },
        {
          degree: "بكالوريوس علوم في الهندسة المدنية",
          field: "الهندسة المدنية",
          institution: "جامعة جازان",
          location: "جازان، السعودية",
          period: "نوفمبر 2022",
        },
      ],
      certifications: [
        {
          title: "تطبيقات الذكاء الاصطناعي في كفاءة الطاقة والطاقة المتجددة",
          institution: "الكلية الوطنية الجامعية للتقنية - الأردن",
          date: "يونيو 2023",
          hours: "100 ساعة",
        },
        {
          title: "دورة تدريبية في التجارة الإلكترونية",
          institution: "أكاديمية ميامي لحلول الأعمال - الأردن",
          date: "أبريل 2023 - مايو 2023",
          hours: "40 ساعة",
        },
        {
          title: "الجاهزية للعمل ومن الفكرة إلى العمل",
          institution: "التعليم من أجل التوظيف - الأردن",
          date: "أبريل 2023 - مايو 2023",
          hours: "مشروع تعزيز المشاركة الاقتصادية للشباب",
        },
        {
          title: "برنامج اللغة الإنجليزية كلغة أجنبية",
          institution: "مركز اللغات بجامعة كيب تاون (ELC) - جنوب أفريقيا",
          date: "يونيو 2019 - يوليو 2019",
          hours: "برنامج مكثف مدة 4 أسابيع",
        },
        {
          title: "دبلوم تدريبي في القيادة الشبابية",
          institution: "مركز كندا العالمي - السعودية",
          date: "سبتمبر 2017 - أغسطس 2019",
          hours: "300 ساعة (وفق معايير التصميم التعليمي الدولية)",
        },
      ],
      volunteer: [
        {
          title: "فريق القيادة الإعلامية",
          organization: "أكاديمية SMAV - السعودية",
          period: "2017 - 2018",
          description: "إدارة التغطية الإعلامية، والتصوير الفوتوغرافي، وصناعة المحتوى، وإدارة منصات التواصل الاجتماعي خلال موسم الحج في المملكة العربية السعودية.",
        },
        {
          title: "مبادرات تطوعية مستقلة في تطوير المواقع",
          organization: "بوابات تعليمية ومجتمعية",
          period: "2008 – 2015",
          description: "تطوير مواقع ويب للمدرسة الثانوية والإعدادية، ومواقع للمعلمين، وبوابة تعليمية للمشرف التربوي الأستاذ محمود الشقيرات لتنظيم ونشر المواد التعليمية.",
        },
      ],
    },
    // Contact
    contact: {
      title: "تواصل معي",
      description:
        "أنا حالياً منفتح على فرص وتحديات هندسية وتعاونات جديدة. سواء كان لديك استفسار أو مشروع تريد مناقشته، لا تتردد في التواصل!",
      info: {
        title: "معلومات التواصل",
        email: "البريد الإلكتروني",
        phone: "الهاتف",
        location: "الموقع",
        connect: "تواصل معي على",
      },
      cta: {
        title: "لنعمل معاً",
        description: "مهتم بالتعاون أو لديك مشروع ذكاء اصطناعي أو تطوير برمجيات؟ يسعدني التواصل معك.",
        button: "أرسل بريداً إلكترونياً",
      },
    },
    // Accessibility
    a11y: {
      skipLink: "الانتقال إلى المحتوى الرئيسي",
      navAriaLabel: "التنقل الرئيسي",
      openMenu: "فتح قائمة التنقل",
      closeMenu: "إغلاق قائمة التنقل",
      themeToggle: "تبديل المظهر، المظهر الحالي:",
      newTab: "(يفتح في علامة تبويب جديدة)",
      logoAria: "عبدالله عمر - الصفحة الرئيسية",
      emailAria: "إرسال بريد إلكتروني إلى عبدالله عمر",
      phoneAria: "الاتصال بعبدالله عمر",
      chatAria: {
        open: "فتح المساعد الذكي",
        close: "إغلاق المساعد الذكي",
        mute: "كتم الردود الصوتية",
        unmute: "تفعيل الردود الصوتية",
        voiceStart: "بدء الإدخال الصوتي",
        voiceStop: "إيقاف الإدخال الصوتي",
        send: "إرسال الرسالة",
        inputLabel: "حقل كتابة الرسالة",
      },
    },
    chat: {
      title: "المساعد الذكي لـ عبدالله عمر",
      liveVoiceTitle: "المساعد الصوتي المباشر",
      textMode: "محادثة",
      liveMode: "صوتي مباشر",
      placeholder: "اسأل أي سؤال عن خبرات ومشاريع عبدالله...",
      greeting: "مرحباً! أنا المساعد الذكي للمهندس عبدالله عمر. كيف يمكنني مساعدتك في استكشاف خبراته ومشاريعه اليوم؟",
      startLive: "بدء المحادثة الصوتية",
      endLive: "إنهاء الجلسة الصوتية",
      listening: "جارٍ الاستماع إليك...",
      speaking: "جارٍ التحدث الآن...",
      thinking: "جارٍ التفكير...",
      connecting: "جارٍ الاتصال بالجلسة الحية...",
      connected: "متصل بالبث المباشر",
      disconnected: "غير متصل",
      micMuted: "تم كتم الميكروفون",
      micActive: "الميكروفون نشط",
      muteMic: "كتم الميكروفون",
      unmuteMic: "تفعيل الميكروفون",
      suggestedTitle: "أسئلة مقترحة:",
      suggestions: [
        "ما هي مهارات عبدالله في الذكاء الاصطناعي و Full-Stack؟",
        "حدثني عن منصة الجمارك الرقمية لمصلحة الجمارك الليبية.",
        "حدثني عن منصة التجارة الذكية بالذكاء الاصطناعي.",
        "كيف يمكنني التواصل مع عبدالله؟",
      ],
      copy: "نسخ",
      copied: "تم النسخ!",
      clear: "مسح المحادثة",
      liveSubtitle: "محادثة صوتية تفاعلية مباشرة وفورية بالذكاء الاصطناعي",
      micPermissionError: "يرجى السماح بالوصول إلى الميكروفون لاستخدام المحادثة الصوتية المباشرة.",
      connectionError: "تعذر الاتصال بالجلسة الصوتية المباشرة. يمكنك استخدام المحادثة النصية.",
    },
    // Footer
    footer: {
      rights: "جميع الحقوق محفوظة.",
    },
  },
}

export function getTranslation(lang: Language) {
  return translations[lang]
}
