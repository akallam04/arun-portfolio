export const PROFILE = {
  name: "Arun Teja Reddy Kallam",
  firstName: "Arun",
  shortName: "Arun Teja Reddy",
  lastName: "Kallam",
  email: "akallam04@gmail.com",
  phone: "(480) 937-6420",
  phoneHref: "tel:4809376420",
  location: "Tempe, AZ",
  metro: "Greater Phoenix area",
  timeZone: "America/Phoenix",
  github: "https://github.com/akallam04",
  githubUser: "akallam04",
  linkedin: "https://linkedin.com/in/akallam3",
  resume: "/resume.pdf",
  site: "https://arunkallam.vercel.app",
  availability: "Open to Fall 2026 Co-ops",
  tagline:
    "CS student at ASU building AI-powered products, full-stack apps, and data-driven systems.",
} as const;

export const TYPED_ROLES = [
  "AI-powered products",
  "full-stack web apps",
  "reliable, tested APIs",
  "data dashboards",
];

export const CORE_STACK = [
  "Python",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "FastAPI",
  "Claude API",
  "MongoDB",
  "SQL",
];

export const HERO_STATS = [
  { value: 2, decimals: 0, suffix: "", label: "Internships" },
  { value: 4, decimals: 0, suffix: "", label: "Deployed apps" },
  { value: 94, decimals: 0, suffix: "K+", label: "Rows analyzed" },
  { value: 500, decimals: 0, suffix: "+", label: "Profiles validated" },
];

export type SectionKey =
  | "home"
  | "education"
  | "skills"
  | "experience"
  | "projects"
  | "contact";

export const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "education", label: "Education" },
  { key: "skills", label: "Skills" },
  { key: "experience", label: "Experience" },
  { key: "projects", label: "Projects" },
  { key: "contact", label: "Contact" },
];

export const COURSEWORK = [
  "Intro to Artificial Intelligence",
  "Data Structures & Algorithms",
  "Software Engineering",
  "Distributed Software Development",
  "Database Management",
  "Mobile App Development",
  "Operating Systems",
  "Object-Oriented Programming",
  "Principles of Programming Languages",
  "Information Assurance",
  "Human-Computer Interaction",
  "Foundations of Data Visualization",
  "Applied Linear Algebra",
  "Probability & Statistics",
];

export const FOCUS_AREAS = [
  {
    label: "AI / LLM Engineering",
    desc: "Claude & OpenAI APIs, prompt design, structured outputs",
  },
  {
    label: "Full-Stack Development",
    desc: "Web apps end-to-end, APIs, and databases",
  },
  {
    label: "Data & Analytics",
    desc: "Pipelines, dashboards, and insight delivery",
  },
];

export type SkillGroup = {
  label: string;
  axis: string;
  level: number; // 0-100, drives the radar chart
  color: string;
  items: string[];
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: "AI / LLM",
    axis: "AI / LLM",
    level: 85,
    color: "#c084fc",
    items: [
      "Claude API",
      "OpenAI API",
      "Prompt Engineering",
      "Structured Outputs",
      "Pydantic",
      "Few-shot Prompting",
    ],
  },
  {
    label: "Web & Frameworks",
    axis: "Web & APIs",
    level: 88,
    color: "#34d399",
    items: [
      "React",
      "Next.js",
      "Node.js",
      "Express.js",
      "FastAPI",
      "Redux Toolkit",
      "Tailwind CSS",
      "Recharts",
      "SQLAlchemy",
    ],
  },
  {
    label: "Languages",
    axis: "Languages",
    level: 90,
    color: "#60a5fa",
    items: ["Python", "JavaScript", "TypeScript", "Java", "SQL", "HTML", "CSS"],
  },
  {
    label: "Data & Analytics",
    axis: "Data",
    level: 84,
    color: "#fbbf24",
    items: ["Pandas", "Plotly", "Streamlit", "KPI Analysis", "Data Quality & QA"],
  },
  {
    label: "Databases",
    axis: "Databases",
    level: 78,
    color: "#f87171",
    items: ["MongoDB Atlas", "MySQL"],
  },
  {
    label: "Tools & Cloud",
    axis: "Tools",
    level: 75,
    color: "#2dd4bf",
    items: [
      "Git",
      "GitHub",
      "Docker",
      "Postman",
      "Vercel",
      "Render",
      "Railway",
      "Streamlit Cloud",
      "VS Code",
    ],
  },
];

export type Experience = {
  role: string;
  company: string;
  location: string;
  period: string;
  tags: string[];
  color: string;
  bullets: string[];
};

export const EXPERIENCE: Experience[] = [
  {
    role: "Junior Data Analyst",
    company: "Food Forest AI",
    location: "Philadelphia, PA",
    period: "Jun 2025 - Jul 2025",
    tags: ["Python", "Pandas", "Data Quality", "QA Automation"],
    color: "#60a5fa",
    bullets: [
      "Built Python and Pandas QA scripts to flag missing values, anomalies, and formatting errors across 500+ scraped supplier profiles, reducing manual review load and producing ingestion-ready datasets that improved search result quality.",
      "Standardized scraped capabilities, certifications, and product data into structured enrichment datasets powering Food Forest AI's B2B supply chain search engine.",
    ],
  },
  {
    role: "Full-Stack Web Development Intern",
    company: "Prodigy InfoTech",
    location: "Mumbai, India",
    period: "Sep 2024 - Oct 2024",
    tags: ["MERN", "JWT Auth", "bcrypt", "MongoDB", "React", "Express"],
    color: "#34d399",
    bullets: [
      "Shipped a MERN authentication portal with JWT sessions, bcrypt password hashing, rate-limited endpoints, and role-based access control on React routes and Express middleware.",
      "Built a full-stack Employee Management System with admin-only CRUD, server-side search/filter/sort, and a MongoDB aggregation pipeline dashboard surfacing real-time headcount, average salary, and department breakdowns.",
    ],
  },
];

export type Project = {
  name: string;
  featured?: boolean;
  desc: string;
  tags: string[];
  bullets: string[];
  github: string;
  live?: string;
  color: string;
  metrics?: { value: string; label: string }[];
};

export const PROJECTS: Project[] = [
  {
    name: "Goalsetter+",
    featured: true,
    desc: "Production-deployed MERN goal tracker with AI-powered SMART goal suggestions, analytics dashboards, sub-tasks, share links, and natural language due dates.",
    tags: [
      "React",
      "Node.js",
      "Express",
      "MongoDB Atlas",
      "Redux Toolkit",
      "Claude API",
      "Recharts",
      "JWT",
    ],
    bullets: [
      "Integrated the Claude Haiku API to generate three SMART goal suggestions from plain-English input, with rate limiting and one-click add to the goals list",
      "Full-stack goal tracker with JWT auth, sub-tasks, natural language date parsing, overdue detection, and revokable public share links",
      "Recharts analytics dashboard with goals-by-category and completions-over-time charts, computed client-side from Redux state to eliminate redundant API round-trips",
    ],
    github: "https://github.com/akallam04/goalsetter-plus",
    live: "https://goalsetter-plus.vercel.app",
    color: "#60a5fa",
    metrics: [
      { value: "AI", label: "SMART goal generator" },
      { value: "Full-stack", label: "MERN + Redux + JWT" },
      { value: "Live", label: "Vercel + Render" },
    ],
  },
  {
    name: "LLM Multilingual Feedback API",
    desc: "FastAPI service giving language learners structured feedback on their writing, validated end-to-end with Pydantic.",
    tags: ["Python", "FastAPI", "OpenAI API", "Pydantic", "Docker"],
    bullets: [
      "Analyzes learner sentences and returns structured JSON: corrected sentence, error list, CEFR difficulty estimate, and a correctness flag",
      "Selected GPT-4o-mini as a cost/latency tradeoff, with few-shot prompting for reliable output",
      "Pydantic validation layer normalizing imperfect model outputs; 10+ unit, schema, and integration tests covering non-Latin scripts",
    ],
    github: "https://github.com/akallam04/intern-task-2026",
    color: "#c084fc",
  },
  {
    name: "NBA Teams Dashboard",
    desc: "Editorial-style dashboard for all 30 NBA franchises: team pages, live search, and franchise stats with motion-rich UI.",
    tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS", "Framer Motion"],
    bullets: [
      "Next.js 16 App Router with async Server Components; self-hosted data layer (JSON snapshot + 30 PNG badges) after the public API became unreliable",
      "Non-blocking live search with React 19 useDeferredValue, per-team accent colors, skeleton loading states, and route-level error boundaries",
      "Flash-free dark/light theme toggle via a pre-paint inline script, plus an a11y pass: semantic landmarks, focus rings, ARIA live regions",
    ],
    github: "https://github.com/akallam04/nba-dashboard",
    live: "https://nba-teams-dashboard.vercel.app",
    color: "#f87171",
  },
  {
    name: "Sales Insights Dashboard",
    desc: "Interactive analytics dashboard over 94,073 AtliQ Hardware transactions, live on Streamlit Cloud and backed by a Railway-hosted MySQL database.",
    tags: ["Python", "MySQL", "SQLAlchemy", "Streamlit", "Plotly", "Pandas"],
    bullets: [
      "MySQL pipeline with a sales_cleaned view normalizing multi-currency data, joining 5 dimension tables, and resolving 7 data-quality issues",
      "10 KPI queries using window functions (LAG, SUM OVER PARTITION BY); surfaced one customer driving roughly 33% of INR 51.77 Cr revenue",
      "Year/market/zone filters with a CSV fallback layer for production resilience; deployed on Streamlit Cloud + Railway",
    ],
    github: "https://github.com/akallam04/sales-insights-dashboard",
    live: "https://sales-insights-dashboard.streamlit.app",
    color: "#34d399",
  },
];

// Snapshot used when the GitHub API is unreachable or rate-limited.
// Refreshed 2026-06: 8 public repos, 3 followers.
export const GITHUB_FALLBACK = {
  repos: 8,
  followers: 3,
  languages: [
    { name: "JavaScript", count: 3 },
    { name: "Python", count: 2 },
    { name: "TypeScript", count: 2 },
  ],
  latestRepo: "nba-dashboard",
  latestUrl: "https://github.com/akallam04/nba-dashboard",
};

export const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#663399",
  Java: "#b07219",
  "Jupyter Notebook": "#DA5B0B",
  Shell: "#89e051",
  Other: "#8b949e",
};

export const CONTACT_ITEMS = [
  {
    label: "Email",
    value: PROFILE.email,
    href: `mailto:${PROFILE.email}`,
    copy: PROFILE.email,
  },
  {
    label: "Phone",
    value: PROFILE.phone,
    href: PROFILE.phoneHref,
    copy: PROFILE.phone,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/akallam3",
    href: PROFILE.linkedin,
  },
  {
    label: "GitHub",
    value: "github.com/akallam04",
    href: PROFILE.github,
  },
];
