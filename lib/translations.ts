export type Language = "en" | "ar"

export const translations = {
  en: {
    // Navigation
    nav: {
      about: "About",
      experience: "Experience",
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
      specialization: "Data Science & Artificial Intelligence",
      description:
        "Building end-to-end systems with React/Next.js and Django/FastAPI, integrating advanced AI solutions to drive digital transformation and efficiently automate operations.",
      location: "Amman, Jordan",
      getInTouch: "Get in Touch",
      viewExperience: "View Experience",
      viewServices: "My Services",
    },
    // About
    about: {
      title: "About Me",
      paragraph1:
        "I'm a Full-Stack Software Engineer specializing in Data Science & Artificial Intelligence with a Civil Engineering background. This unique combination allows me to approach problems with both analytical rigor and creative innovation.",
      paragraph2:
        "Experienced in building end-to-end systems with React/Next.js and Django/FastAPI, I integrate advanced AI solutions including AI Agents, LLM Orchestration, Workflow Automation, Generative AI, and Computer Vision to drive digital transformation.",
      paragraph3:
        "Skilled in data collection, cleaning, analysis, and predictive modeling using Python, SQL, Machine Learning, and Deep Learning techniques to extract insights and build intelligent, data-driven solutions.",
      highlights: {
        fullStack: {
          title: "Full-Stack Development",
          description: "React/Next.js & Django/FastAPI",
        },
        ai: {
          title: "AI & Machine Learning",
          description: "LLMs, RAG, Computer Vision",
        },
        data: {
          title: "Data Science",
          description: "Python, SQL, Predictive Modeling",
        },
        automation: {
          title: "Workflow Automation",
          description: "n8n, ComfyUI, AI Agents",
        },
      },
    },
    // Experience
    experience: {
      title: "Experience",
      jobs: [
        {
          title: "Software Engineer",
          company: "UBitc Group",
          location: "Jordan",
          period: "Dec 2024 – Present",
          description: [
            "Designed and developed multiple end-to-end AI-driven applications, orchestrating intelligent, automated workflows using Python, ComfyUI, and n8n.",
            "Optimized an AI-driven avatar system supporting real-time, multilingual voice conversation, achieving frame-accurate lip-sync alignment and natural eye movement.",
            "Designed and developed a Next.js + Django platform to manage customer orders from the avatar, featuring order tracking, product management, and store administration.",
            "Built an AI agent bot using LangGraph that seamlessly integrates with the product management system, enabling product ordering directly through voice conversation.",
            "Built an intelligent product recognition system using computer vision models and barcode scanning to automate product identification and streamline ordering.",
          ],
        },
        {
          title: "Full-Stack Development",
          company: "ASAC - Abdul Aziz Al Ghurair School",
          location: "Jordan",
          period: "Jun 2024 – Sep 2024",
          description: [
            "Designed and developed a full-featured Property Management System.",
            "Built a modern frontend with Next.js and a backend using Django.",
            "Integrated modules for rental applications, lease tracking, payment processing, and maintenance workflows.",
            "Focused on enhancing UX and streamlining property-owner/tenant interactions.",
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
      },
    },
    // Education
    education: {
      title: "Education & Certifications",
      educationLabel: "Education",
      certificationsLabel: "Certifications",
      degrees: [
        {
          degree: "Professional Diploma in Full-Stack Engineering",
          field: "Python & JavaScript",
          institution: "ASAC - Luminus Technical University College",
          location: "Amman, Jordan",
          period: "January 2024 - September 2024",
        },
        {
          degree: "Bachelor of Science in Civil Engineering",
          field: "",
          institution: "Jazan University",
          location: "Jazan, Saudi Arabia",
          period: "November 2022",
        },
      ],
      certifications: [
        {
          title: "AI Applications in Energy Efficiency and Renewable Energy",
          institution: "National University College of Technology",
          date: "June 2023",
          hours: "100 Hours",
        },
        {
          title: "E-Commerce Training Course",
          institution: "Miami Academy for Business Solution",
          date: "April 2023 - May 2023",
          hours: "40 Hours",
        },
        {
          title: "Work Readiness and Idea to Business",
          institution: "Education for Employment - Jordan",
          date: "April 2023 - May 2023",
          hours: "",
        },
        {
          title: "Training Diploma in Youth Leadership",
          institution: "Canada Global Centre",
          date: "September 2017 - August 2019",
          hours: "300 Hours",
        },
      ],
    },
    // Contact
    contact: {
      title: "Get In Touch",
      description:
        "I'm currently open to new opportunities and collaborations. Whether you have a question, want to discuss a project, or just want to say hi, feel free to reach out!",
      info: {
        title: "Contact Information",
        email: "Email",
        phone: "Phone",
        location: "Location",
        connect: "Connect with me",
      },
      cta: {
        title: "Let's Work Together",
        description: "Interested in collaborating or have a project in mind? I'd love to hear from you.",
        button: "Send Email",
      },
      vision: {
        title: "Professional Vision",
        text: "Driven by a passion for both engineering and AI, my focus is on bridging the gap between traditional civil engineering methodologies and modern digital transformation. I aim to deliver intelligent, data-driven solutions that enhance efficiency, optimize performance, and improve productivity across the entire infrastructure lifecycle — from planning and design to execution and maintenance — enabling organizations to adopt smarter and more optimized operational systems.",
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
      placeholder: "Ask anything about Abdullah's experience...",
      greeting: "Hello! I am Abdullah Omar's AI Assistant. How can I help you today?",
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
        "What are Abdullah's core AI skills?",
        "Tell me about his work at UBitc Group.",
        "What is his educational background?",
        "How can I contact Abdullah?",
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
      skills: "المهارات",
      education: "التعليم",
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
        phonePlaceholder: "مثال: +962 79 123 4567",
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
      specialization: "علوم البيانات والذكاء الاصطناعي",
      description:
        "أقوم ببناء أنظمة متكاملة باستخدام React/Next.js و Django/FastAPI، مع دمج حلول الذكاء الاصطناعي المتقدمة لدفع التحول الرقمي وأتمتة العمليات بكفاءة.",
      location: "عمّان، الأردن",
      getInTouch: "تواصل معي",
      viewExperience: "عرض الخبرات",
      viewServices: "خدماتي",
    },
    // About
    about: {
      title: "نبذة عني",
      paragraph1:
        "أنا مهندس برمجيات Full-Stack متخصص في علوم البيانات والذكاء الاصطناعي مع خلفية في الهندسة المدنية. هذا المزيج الفريد يمكنني من معالجة المشكلات بدقة تحليلية وابتكار إبداعي.",
      paragraph2:
        "لدي خبرة في بناء أنظمة متكاملة باستخدام React/Next.js و Django/FastAPI، حيث أدمج حلول الذكاء الاصطناعي المتقدمة بما في ذلك وكلاء الذكاء الاصطناعي، تنسيق نماذج اللغة الكبيرة، أتمتة سير العمل، الذكاء الاصطناعي التوليدي، والرؤية الحاسوبية.",
      paragraph3:
        "ماهر في جمع البيانات، تنظيفها، تحليلها، والنمذجة التنبؤية باستخدام Python و SQL وتقنيات تعلم الآلة والتعلم العميق لاستخراج الرؤى وبناء حلول ذكية مبنية على البيانات.",
      highlights: {
        fullStack: {
          title: "تطوير Full-Stack",
          description: "React/Next.js & Django/FastAPI",
        },
        ai: {
          title: "الذكاء الاصطناعي وتعلم الآلة",
          description: "LLMs, RAG, الرؤية الحاسوبية",
        },
        data: {
          title: "علوم البيانات",
          description: "Python, SQL, النمذجة التنبؤية",
        },
        automation: {
          title: "أتمتة سير العمل",
          description: "n8n, ComfyUI, وكلاء AI",
        },
      },
    },
    // Experience
    experience: {
      title: "الخبرات",
      jobs: [
        {
          title: "مهندس برمجيات",
          company: "UBitc Group",
          location: "الأردن",
          period: "ديسمبر 2024 – الحالي",
          description: [
            "تصميم وتطوير تطبيقات متعددة مدعومة بالذكاء الاصطناعي، مع تنسيق سير عمل ذكي وآلي باستخدام Python و ComfyUI و n8n.",
            "تحسين نظام أفاتار ذكي يدعم المحادثة الصوتية متعددة اللغات في الوقت الفعلي، مع مزامنة دقيقة لحركة الشفاه وحركة العين الطبيعية.",
            "تصميم وتطوير منصة Next.js + Django لإدارة طلبات العملاء من الأفاتار، مع تتبع الطلبات وإدارة المنتجات والمتاجر.",
            "بناء روبوت وكيل ذكي باستخدام LangGraph يتكامل بسلاسة مع نظام إدارة المنتجات، لتمكين الطلب عبر المحادثة الصوتية.",
            "بناء نظام ذكي للتعرف على المنتجات باستخدام نماذج الرؤية الحاسوبية ومسح الباركود لأتمتة التعرف على المنتجات.",
          ],
        },
        {
          title: "تطوير Full-Stack",
          company: "ASAC - مدرسة عبدالعزيز الغرير",
          location: "الأردن",
          period: "يونيو 2024 – سبتمبر 2024",
          description: [
            "تصميم وتطوير نظام متكامل لإدارة العقارات.",
            "بناء واجهة أمامية حديثة باستخدام Next.js وخلفية باستخدام Django.",
            "دمج وحدات لطلبات الإيجار، تتبع العقود، معالجة المدفوعات، وسير عمل الصيانة.",
            "التركيز على تحسين تجربة المستخدم وتسهيل التفاعل بين المالكين والمستأجرين.",
          ],
        },
      ],
    },
    // Skills
    skills: {
      title: "المهارات",
      categories: {
        languages: "لغات البرمجة",
        aiMl: "الذكاء الاصطناعي وتعلم الآلة",
        backend: "الخلفية وقواعد البيانات",
        frontend: "الواجهة الأمامية",
        cloud: "السحابة و DevOps",
        automation: "أتمتة سير العمل",
      },
    },
    // Education
    education: {
      title: "التعليم والشهادات",
      educationLabel: "التعليم",
      certificationsLabel: "الشهادات",
      degrees: [
        {
          degree: "دبلوم مهني في هندسة البرمجيات Full-Stack",
          field: "Python & JavaScript",
          institution: "ASAC - كلية لومينوس الجامعية التقنية",
          location: "عمّان، الأردن",
          period: "يناير 2024 - سبتمبر 2024",
        },
        {
          degree: "بكالوريوس علوم في الهندسة المدنية",
          field: "",
          institution: "جامعة جازان",
          location: "جازان، السعودية",
          period: "نوفمبر 2022",
        },
      ],
      certifications: [
        {
          title: "تطبيقات الذكاء الاصطناعي في كفاءة الطاقة والطاقة المتجددة",
          institution: "الكلية الوطنية الجامعية للتقنية",
          date: "يونيو 2023",
          hours: "100 ساعة",
        },
        {
          title: "دورة تدريبية في التجارة الإلكترونية",
          institution: "أكاديمية ميامي لحلول الأعمال",
          date: "أبريل 2023 - مايو 2023",
          hours: "40 ساعة",
        },
        {
          title: "الجاهزية للعمل ومن الفكرة إلى العمل",
          institution: "التعليم من أجل التوظيف - الأردن",
          date: "أبريل 2023 - مايو 2023",
          hours: "",
        },
        {
          title: "دبلوم تدريبي في القيادة الشبابية",
          institution: "مركز كندا العالمي",
          date: "سبتمبر 2017 - أغسطس 2019",
          hours: "300 ساعة",
        },
      ],
    },
    // Contact
    contact: {
      title: "تواصل معي",
      description:
        "أنا حالياً منفتح على فرص وتعاونات جديدة. سواء كان لديك سؤال، أو تريد مناقشة مشروع، أو مجرد إلقاء التحية، لا تتردد في التواصل!",
      info: {
        title: "معلومات التواصل",
        email: "البريد الإلكتروني",
        phone: "الهاتف",
        location: "الموقع",
        connect: "تواصل معي على",
      },
      cta: {
        title: "لنعمل معاً",
        description: "مهتم بالتعاون أو لديك مشروع في ذهنك؟ أحب أن أسمع منك.",
        button: "أرسل بريداً إلكترونياً",
      },
      vision: {
        title: "الرؤية المهنية",
        text: "مدفوعاً بشغف للهندسة والذكاء الاصطناعي، أركز على سد الفجوة بين منهجيات الهندسة المدنية التقليدية والتحول الرقمي الحديث. أهدف إلى تقديم حلول ذكية مبنية على البيانات تعزز الكفاءة، وتحسن الأداء، وتزيد الإنتاجية عبر دورة حياة البنية التحتية بأكملها — من التخطيط والتصميم إلى التنفيذ والصيانة — مما يمكّن المؤسسات من تبني أنظمة تشغيلية أذكى وأكثر تحسيناً.",
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
      placeholder: "اسأل أي سؤال عن خبرات ومهارات عبدالله...",
      greeting: "مرحباً! أنا المساعد الذكي للمهندس عبدالله عمر. كيف يمكنني مساعدتك اليوم؟",
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
        "ما هي أبرز مهارات عبدالله في الذكاء الاصطناعي؟",
        "حدثني عن دوره وخبرته في UBitc Group.",
        "ما هي خلفيته الأكاديمية وتعليمه؟",
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
