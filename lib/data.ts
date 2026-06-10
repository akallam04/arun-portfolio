export const PROFILE = {
  name: "Arun Teja Reddy Kallam",
  firstName: "Arun",
  shortName: "Arun Teja Reddy",
  lastName: "Kallam",
  email: "akallam04@gmail.com",
  phone: "(480) 937-6420",
  phoneHref: "tel:4809376420",
  location: "Tempe, AZ",
  timeZone: "America/Phoenix",
  github: "https://github.com/akallam04",
  githubUser: "akallam04",
  linkedin: "https://linkedin.com/in/akallam3",
  resume: "/resume.pdf",
  site: "https://arunkallam.vercel.app",
  availability: "Open to Summer 2026 Internships",
  tagline:
    "CS student at ASU building full-stack apps, reliable APIs, and data-driven products.",
} as const;

export const TYPED_ROLES = [
  "full-stack web apps",
  "data dashboards",
  "AI-powered features",
  "reliable, tested APIs",
];

export const CORE_STACK = [
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "FastAPI",
  "SQL",
  "MongoDB",
];

export const HERO_STATS = [
  { value: 4.0, decimals: 1, suffix: "", label: "GPA at ASU" },
  { value: 4, decimals: 0, suffix: "", label: "Deployed apps" },
  { value: 94, decimals: 0, suffix: "K+", label: "Rows analyzed" },
  { value: 500, decimals: 0, suffix: "+", label: "Datasets cleaned" },
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
  "Data Structures & Algorithms",
  "Object-Oriented Programming",
  "Software Engineering",
  "Operating Systems",
  "Principles of Programming Languages",
  "Human-Computer Interaction",
  "Foundations of Data Visualization",
  "Discrete Mathematics",
  "Probability & Statistics",
  "Computer Organization & Assembly",
];

export const FOCUS_AREAS = [
  {
    label: "Full-Stack Development",
    desc: "Web apps end-to-end, APIs, and databases",
  },
  {
    label: "Data & Analytics",
    desc: "Visualization, pipelines, and insight delivery",
  },
  {
    label: "AI / LLM Engineering",
    desc: "Prompt design, structured outputs, validation",
  },
];

export type SkillGroup = {
  label: string;
  axis: string;
  level: number; // 0–100, drives the radar chart
  color: string;
  items: string[];
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: "Languages",
    axis: "Languages",
    level: 90,
    color: "#60a5fa",
    items: ["JavaScript", "TypeScript", "Python", "SQL", "Java", "HTML", "CSS"],
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
      "Streamlit",
      "Plotly",
      "SQLAlchemy",
      "Redux Toolkit",
      "Recharts",
      "REST APIs",
      "JWT Auth",
    ],
  },
  {
    label: "AI / LLM",
    axis: "AI / LLM",
    level: 80,
    color: "#c084fc",
    items: [
      "Claude API",
      "OpenAI API",
      "Prompt Engineering",
      "LLM Output Validation",
      "Pydantic",
      "Few-shot Prompting",
    ],
  },
  {
    label: "Data & Analytics",
    axis: "Data",
    level: 86,
    color: "#fbbf24",
    items: [
      "Tableau",
      "Power BI",
      "Excel",
      "Google Sheets",
      "Pandas",
      "NumPy",
      "KPI Analysis",
    ],
  },
  {
    label: "Databases",
    axis: "Databases",
    level: 78,
    color: "#f87171",
    items: ["MySQL", "MongoDB Atlas"],
  },
  {
    label: "Tools & DevOps",
    axis: "DevOps",
    level: 74,
    color: "#2dd4bf",
    items: [
      "Git",
      "GitHub",
      "Docker",
      "Vercel",
      "Render",
      "Streamlit Cloud",
      "Railway",
      "Postman",
      "VS Code",
      "IntelliJ",
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
    location: "Remote",
    period: "Jun 2025 — Jul 2025",
    tags: ["Python", "Pandas", "Data Quality", "QA Automation"],
    color: "#60a5fa",
    bullets: [
      "Cleaned and validated 500+ food & beverage company profiles powering Food Forest AI's B2B supply chain search engine, standardizing scraped capabilities, certifications, and product data into structured enrichment datasets.",
      "Built Python (Pandas) QA scripts to flag missing values, anomalies, and formatting errors across scraped supplier data, reducing manual review load and producing ingestion-ready datasets that improved search result quality for end users.",
    ],
  },
  {
    role: "Full-Stack Web Development Intern",
    company: "Prodigy InfoTech",
    location: "Remote",
    period: "Sep 2024 — Oct 2024",
    tags: ["MERN", "JWT Auth", "bcrypt", "MongoDB", "React", "Express"],
    color: "#34d399",
    bullets: [
      "Shipped a MERN authentication portal with JWT sessions, bcrypt hashing, rate-limited endpoints, and role-based access control on React routes and Express middleware, with admin self-protection against self-demotion and deletion.",
      "Built a full-stack Employee Management System with admin-only CRUD, server-side search/filter/sort, and a MongoDB aggregation pipeline dashboard surfacing headcount, average salary, and department breakdowns in real time.",
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
    desc: "Production-deployed MERN goal-tracking app with AI-powered SMART goal suggestions, analytics dashboards, subtask tracking, and natural language due date parsing.",
    tags: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Redux Toolkit",
      "JWT",
      "Recharts",
      "Anthropic API",
      "Vercel",
      "Render",
    ],
    bullets: [
      "Claude Haiku integration generating 3 SMART goals from a description — one-click add to goals list",
      "Recharts analytics dashboard: goal completion trends and category breakdowns with customizable periods",
      "chrono-node NLP date parsing, subtask tracking, sharing, and rate-limited REST API deployed on Render",
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
    name: "NBA Teams Dashboard",
    desc: "Editorial-style data dashboard covering all 30 NBA franchises — conference standings, team pages, and franchise stats with motion-rich UI.",
    tags: ["Next.js 16", "TypeScript", "Tailwind CSS", "Framer Motion"],
    bullets: [
      "All 30 franchises with team identity theming and editorial layout",
      "App Router architecture with typed data models end-to-end",
      "Deployed on Vercel with motion-driven page transitions",
    ],
    github: "https://github.com/akallam04/nba-dashboard",
    live: "https://nba-teams-dashboard.vercel.app",
    color: "#f87171",
  },
  {
    name: "LLM Multilingual Feedback API",
    desc: "FastAPI service analyzing learner sentences and returning structured feedback — corrected sentence, error list, CEFR difficulty, and a correctness flag.",
    tags: ["Python", "FastAPI", "OpenAI API", "Pydantic", "Docker"],
    bullets: [
      "Few-shot prompting with GPT-4o-mini for reliable structured JSON output",
      "Pydantic post-processing layer normalizing LLM outputs",
      "10+ unit, schema & integration tests covering non-Latin scripts",
    ],
    github: "https://github.com/akallam04/intern-task-2026",
    color: "#c084fc",
  },
  {
    name: "Sales Insights Dashboard",
    desc: "Interactive analytics dashboard over 94,073 AtliQ Hardware transactions — live on Streamlit Cloud, backed by a Railway-hosted MySQL database.",
    tags: ["Python", "MySQL", "SQLAlchemy", "Streamlit", "Plotly"],
    bullets: [
      "MySQL pipeline with a sales_cleaned view normalizing multi-currency data, joining 5 tables, resolving 7 data-quality issues",
      "10 KPI queries using window functions (LAG, SUM OVER PARTITION BY); surfaced one customer driving ~33% of INR 51.77 Cr revenue",
      "Year/market/zone filters with CSV fallback layer; deployed on Streamlit Cloud + Railway",
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
