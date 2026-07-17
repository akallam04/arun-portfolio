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
  resume: "/resume.pdf?v=20260716",
  site: "https://arunkallam.vercel.app",
  availability: "Open to Fall 2026 Co-ops",
  tagline:
    "CS student at ASU building AI agents, fine-tuned LLMs, and full-stack products.",
} as const;

export const TYPED_ROLES = [
  "AI agents & LLM products",
  "fine-tuned LLMs",
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
  "LangGraph",
  "MongoDB",
  "SQL",
];

export const HERO_STATS = [
  { value: 3, decimals: 0, suffix: "", label: "Internships" },
  { value: 6, decimals: 0, suffix: "", label: "Projects shipped" },
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
  "Foundations of Machine Learning",
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
    desc: "LangGraph agents, RAG, QLoRA fine-tuning, eval harnesses",
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
    level: 90,
    color: "#c084fc",
    items: [
      "LangGraph",
      "MCP",
      "RAG",
      "NLP",
      "QLoRA",
      "Claude API",
      "OpenAI API",
      "PyTorch",
      "Hugging Face",
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
      "Streamlit",
    ],
  },
  {
    label: "Languages",
    axis: "Languages",
    level: 90,
    color: "#60a5fa",
    items: [
      "Python",
      "JavaScript",
      "TypeScript",
      "SQL",
      "GraphQL",
      "Java",
      "HTML",
      "CSS",
    ],
  },
  {
    label: "Data & Analytics",
    axis: "Data",
    level: 84,
    color: "#fbbf24",
    items: ["Pandas", "NumPy", "scikit-learn", "Tableau", "Power BI"],
  },
  {
    label: "Databases",
    axis: "Databases",
    level: 78,
    color: "#f87171",
    items: ["MongoDB Atlas", "MySQL", "ChromaDB (Vector)"],
  },
  {
    label: "Tools & Cloud",
    axis: "Tools",
    level: 76,
    color: "#2dd4bf",
    items: [
      "AWS Lambda",
      "API Gateway",
      "ECR",
      "Docker",
      "Git",
      "Vercel",
      "pytest",
      "Shopify",
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
    role: "Web Development Intern",
    company: "BYLD Commerce",
    location: "Lehi, UT",
    period: "Jun 2026 - Present",
    tags: ["JavaScript", "Squarespace", "Shopify", "Python", "Web Design"],
    color: "#c084fc",
    bullets: [
      "Redesigned and shipped the agency's marketing website end to end: a mobile-first, story-driven single-page site in vanilla JavaScript, injected into Squarespace to achieve a fully custom design on a no-code platform.",
      "Built a Python build pipeline that cut site updates from full manual rebuilds to minutes.",
      "Shipped front-end fixes, theme customizations, and UX improvements on client Shopify storefronts.",
    ],
  },
  {
    role: "Junior Data Analyst",
    company: "Food Forest AI",
    location: "Philadelphia, PA",
    period: "Jun 2025 - Jul 2025",
    tags: ["Python", "Pandas", "Data Quality", "QA Automation"],
    color: "#60a5fa",
    bullets: [
      "Cleaned and validated 500+ food & beverage company profiles, turning raw scraped data into structured enrichment datasets feeding the production B2B search engine.",
      "Automated data quality checks in Python (Pandas) to flag missing values, anomalies, and formatting errors, cutting manual review load and keeping the ingestion pipeline supplied with production-ready data.",
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

export type ProjectDomain = "ai" | "fullstack" | "data";

export const DOMAIN_LABELS: Record<ProjectDomain, string> = {
  ai: "AI / LLM",
  fullstack: "Full-Stack",
  data: "Data",
};

export type Project = {
  name: string;
  domains: ProjectDomain[];
  desc: string;
  tags: string[];
  bullets: string[];
  github: string;
  live?: string;
  liveLabel?: string;
  color: string;
  metrics: { value: string; label: string }[];
  /** Optional labeled bars, e.g. a benchmark comparison rendered on the card. */
  compare?: { label: string; value: number; highlight?: boolean }[];
  compareCaption?: string;
};

export const PROJECTS: Project[] = [
  {
    name: "AI Support Agent for E-commerce",
    domains: ["ai", "fullstack"],
    desc: "AI customer support agent for a Shopify store: a LangGraph state machine over the Anthropic API with RAG retrieval, tool calling, and layered safety, live on AWS Lambda + Vercel.",
    tags: [
      "Python",
      "LangGraph",
      "MCP",
      "Claude API",
      "RAG",
      "ChromaDB",
      "GraphQL",
      "AWS Lambda",
      "Vercel",
    ],
    bullets: [
      "53-case eval harness (deterministic graders plus a tool-grounded LLM judge), now the project's regression suite passing at 100%; its failure analysis drove architecture fixes and a measured model choice, 2.4x cheaper with no accuracy loss",
      "Layered safety: a pre-filter blocks prompt-injection attacks before any model call, tools are allowlisted, and a grounding check rejects any order claim not backed by Shopify data",
      "Custom MCP server exposing read-only Shopify Admin GraphQL tools with email-match authorization; plugs unchanged into any MCP host, including Claude Desktop",
    ],
    github: "https://github.com/akallam04/shopify-support-agent",
    live: "https://shopify-support-agent.vercel.app",
    color: "#2dd4bf",
    metrics: [
      { value: "100%", label: "53-case eval pass" },
      { value: "$0.18", label: "per 100 conversations" },
      { value: "3.8s", label: "p95 latency" },
    ],
  },
  {
    name: "CEFR QLoRA Benchmark",
    domains: ["ai", "data"],
    desc: "Does a QLoRA fine-tuned Llama 3 8B beat the GPT-4o-mini call my Feedback API makes? Yes, and the benchmark proves it with reproducible, honest evals.",
    tags: [
      "Python",
      "PyTorch",
      "QLoRA / PEFT",
      "TRL",
      "Llama 3 8B",
      "Hugging Face",
    ],
    bullets: [
      "4-bit QLoRA fine-tune (transformers, peft, trl) designed to answer with a single token, eliminating output-parsing failures and cutting inference to 0.19s",
      "Deterministic pipeline over 10k expert-labeled sentences: checksum manifests, leakage audits, and a single frozen test pass for reproducible, contamination-free evaluation",
      "Honest ablations documented as negative results; fine-tuned adapter published on Hugging Face with a full reproduction recipe",
    ],
    github: "https://github.com/akallam04/cefr-qlora-benchmark",
    live: "https://huggingface.co/akallam04/Llama-3-8B-cefr-qlora",
    liveLabel: "Model on HF",
    color: "#fbbf24",
    metrics: [
      { value: "24x", label: "lower cost per request" },
      { value: "3x", label: "lower latency" },
      { value: "99%", label: "within one CEFR level" },
    ],
    compare: [
      { label: "Llama 3 8B QLoRA", value: 62.7, highlight: true },
      { label: "GPT-4o-mini few-shot", value: 40.8 },
    ],
    compareCaption: "Exact accuracy, same 1,460-sentence held-out test set",
  },
  {
    name: "Goalsetter+",
    domains: ["ai", "fullstack"],
    desc: "Production-deployed MERN goal tracker with AI-powered SMART goal suggestions, a hand-built SVG analytics dashboard, sub-tasks, share links, and natural-language due dates.",
    tags: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB Atlas",
      "Redux Toolkit",
      "Claude API",
      "JWT",
    ],
    bullets: [
      "Claude API generates SMART goal suggestions from plain-English input, rate-limited server-side, with one-click add",
      "JWT auth, sub-tasks, natural-language due dates, overdue detection, and revocable public share links",
      "Analytics dashboard hand-built in SVG from Redux state (13-week heatmap, streak tracking), plus a one-click demo account; deployed on Vercel and Render",
    ],
    github: "https://github.com/akallam04/goalsetter-plus",
    live: "https://goalsetter-plus.vercel.app",
    color: "#60a5fa",
    metrics: [
      { value: "AI", label: "SMART goal generator" },
      { value: "13-wk", label: "SVG heatmap + streaks" },
      { value: "Live", label: "one-click demo account" },
    ],
  },
  {
    name: "LLM Multilingual Feedback API",
    domains: ["ai", "fullstack"],
    desc: "FastAPI service with a built-in web app giving language learners structured feedback: minimal corrections, categorized errors explained in their native language, and a CEFR difficulty estimate.",
    tags: [
      "Python",
      "FastAPI",
      "OpenAI API",
      "Claude API",
      "Pydantic",
      "Docker",
      "GitHub Actions",
    ],
    bullets: [
      "Pluggable LLM backends selected by environment variable: OpenAI, Anthropic, or a zero-config offline mode so the full system runs before any key is configured",
      "Raw model output is never trusted: every response passes a normalization and validation layer before it reaches the client",
      "Ships its own no-build web app: word-level correction diffs, categorized error cards with native-language explanations, shareable re-run links, and one-click examples",
    ],
    github: "https://github.com/akallam04/LLM-Multilingual-Feedback-API",
    color: "#c084fc",
    metrics: [
      { value: "3", label: "pluggable LLM providers" },
      { value: "7", label: "languages in the demo" },
      { value: "55", label: "tests green in CI" },
    ],
  },
  {
    name: "NBA Teams Dashboard",
    domains: ["fullstack"],
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
    metrics: [
      { value: "30", label: "franchises, full team pages" },
      { value: "React 19", label: "non-blocking live search" },
      { value: "A11y", label: "landmarks, focus, ARIA" },
    ],
  },
  {
    name: "Sales Insights Dashboard",
    domains: ["data"],
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
    metrics: [
      { value: "94K", label: "transactions modeled" },
      { value: "10", label: "KPI queries, window functions" },
      { value: "33%", label: "revenue risk surfaced" },
    ],
  },
];

// Snapshot used when the GitHub API is unreachable or rate-limited.
// Refreshed 2026-07: 10 public repos, 4 followers.
export const GITHUB_FALLBACK = {
  repos: 10,
  followers: 4,
  languages: [
    { name: "Python", count: 4 },
    { name: "JavaScript", count: 3 },
    { name: "TypeScript", count: 2 },
  ],
  latestRepo: "shopify-support-agent",
  latestUrl: "https://github.com/akallam04/shopify-support-agent",
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
