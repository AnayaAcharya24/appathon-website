export interface CategoryInfo {
  id: string
  title: string
  short: string
  description: string
  eligibility: string
  requirements: string[]
  examples: string[]
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'app-dev',
    title: 'Application Development',
    short: 'Build apps that solve real problems.',
    description:
      'Design and build a working web, mobile or desktop application that solves a real problem for real users. Judges look for a working product, not just slides — usability, code quality and a clear user need matter most.',
    eligibility:
      'Open to all enrolled undergraduate and postgraduate students. Individual or team entries (up to 4 members). The application must be built by the team during the competition period or substantially improved for it.',
    requirements: [
      'A working demo — live link, APK / build, or a recorded walkthrough.',
      'Source code link (private repo access for judges, if requested).',
      'A 2-page summary: problem, users, features, tech stack.',
      'Team details and the role of each member.',
    ],
    examples: ['Campus utilities', 'Health & wellbeing apps', 'Productivity tools', 'Accessibility apps'],
  },
  {
    id: 'business-innovation',
    title: 'Business Innovation',
    short: 'Turn an idea into a viable business.',
    description:
      'Pitch a new business model, service or process innovation. This category is for entrepreneurial thinking: a sharp problem, a customer, a revenue model and a plan to reach them — with a prototype or MVP where possible.',
    eligibility:
      'Open to all enrolled students, any discipline. Individual or team entries (up to 4 members). Business ideas must be original and not already operating as a registered company.',
    requirements: [
      'A business-model summary (problem, customer, value, revenue, costs).',
      'Market / user research — even 10 real interviews count.',
      'A pitch deck (max 10 slides) and, if available, an MVP or landing page.',
      'Go-to-market plan for the first 90 days.',
    ],
    examples: ['Student services', 'Sustainability ventures', 'Fintech ideas', 'Campus businesses'],
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Solutions',
    short: 'Sell smarter, ship better, serve customers.',
    description:
      'Build or improve an online store, marketplace, or commerce tool — storefront, payments, logistics, discovery or seller tools. Judges reward real transactions, clear unit economics and a smooth buying experience.',
    eligibility:
      'Open to all enrolled students. Individual or team entries (up to 4 members). Stores may use existing platforms (Shopify, WooCommerce, custom) — the innovation must be yours.',
    requirements: [
      'A live store or working prototype with at least a demo checkout.',
      'Product catalogue, pricing and a fulfilment / delivery plan.',
      'How you acquire customers and what it costs.',
      'Trust, returns and payment handling explained.',
    ],
    examples: ['Campus marketplaces', 'D2C brands', 'Seller tools', 'Social commerce'],
  },
  {
    id: 'emerging-tech',
    title: 'Emerging Technology',
    short: 'AI, IoT, AR/VR, blockchain — applied, not just demoed.',
    description:
      'Apply an emerging technology — AI/ML, IoT, AR/VR, blockchain, robotics or edge computing — to a concrete problem. A clever model alone is not enough: show what changes for the user when the technology works.',
    eligibility:
      'Open to all enrolled students. Individual or team entries (up to 4 members). Teams must be able to explain how the technology works and where it can fail.',
    requirements: [
      'A working prototype or validated experiment, with data / results.',
      'A clear explanation of the technology and why it fits this problem.',
      'Limitations, risks and responsible-use notes (privacy, bias, safety).',
      'Demo video (max 3 minutes) showing the system in action.',
    ],
    examples: ['AI study tools', 'IoT campus systems', 'AR learning', 'ML forecasting'],
  },
]

export const CATEGORY_TITLES = CATEGORIES.map((c) => c.title)

export interface Faq {
  q: string
  a: string
}

export const FAQS: Faq[] = [
  {
    q: 'Who can participate in AppThon?',
    a: 'Any enrolled undergraduate or postgraduate student from a recognised college or university can participate, individually or as a team of up to 4 members. Team members may be from different departments, and — unless the rules for your edition say otherwise — from different colleges. Check the Rules page for the edition-specific rule.',
  },
  {
    q: 'Is there a registration fee?',
    a: 'No fee has been announced for this edition. The registration fee field on this site says “To be announced” until the organising institution confirms it. If a fee is introduced, it will be published here and in an announcement before registrations close — never charged silently.',
  },
  {
    q: 'How do I register?',
    a: 'Fill in the Registration form with your details, team details (if any) and project details. You will receive a unique registration ID (for example APP-2026-1001). Keep it safe — you need it, together with your registered email, to submit your project and to check your status.',
  },
  {
    q: 'Can I register more than once?',
    a: 'No. One registration per email address and mobile number. If you try to register again with the same email or phone, the form will show your existing registration ID instead of creating a duplicate. Contact the coordinators if you need to correct a mistake.',
  },
  {
    q: 'What do I submit, and by when?',
    a: 'After registering, use the Project Submission page: verify with your registration ID and email, then upload supporting documents, add your demo / video links and a short description. The submission deadline is published on the Schedule page — it currently reads “To be announced” until confirmed.',
  },
  {
    q: 'How are projects evaluated?',
    a: 'Judges score each project on innovation, technical execution, impact and presentation. Shortlisted teams present in the final round. The full criteria and weightage are on the Rules & Guidelines page.',
  },
  {
    q: 'Do all participants get certificates?',
    a: 'Participation certificates are planned for all participants who complete a valid submission, and winners receive prizes and special recognition. Exact prizes are “To be announced” until the organisers confirm them — this site does not invent prize amounts.',
  },
  {
    q: 'Can I change my project after registering?',
    a: 'Yes, before the submission deadline: re-submit through the Project Submission page with the same registration ID — the latest submission replaces the earlier one. After the deadline, changes need coordinator approval.',
  },
  {
    q: 'Who do I contact for help?',
    a: 'Use the Contact page. Faculty and student coordinator details are published there once confirmed; until then, use the official email shown on that page. For a lost registration ID, use the “Find my registration” help on the Submission page.',
  },
  {
    q: 'Is my data safe?',
    a: 'Your details are used only for running the competition — registration, verification, judging and certificates. We never sell participant data. See the Privacy note on the Registration page and the security section in the README / Supabase setup guide.',
  },
]

export const EVALUATION_CRITERIA = [
  { name: 'Innovation & originality', weight: '30%', detail: 'Is the idea new, and does it solve the problem in a fresh way?' },
  { name: 'Technical execution', weight: '30%', detail: 'Does it work? Code quality, reliability and completeness of the demo.' },
  { name: 'Impact & feasibility', weight: '25%', detail: 'Who benefits, how many, and can it realistically be built and sustained?' },
  { name: 'Presentation & clarity', weight: '15%', detail: 'Can the team explain the problem, the solution and the next steps clearly?' },
]
