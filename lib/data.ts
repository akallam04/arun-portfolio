export const PROFILE = {
  name: "Arun Kallam",
  fullName: "Arun Teja Reddy Kallam",
  email: "akallam04@gmail.com",
  location: "Tempe, AZ",
  github: "https://github.com/akallam04",
  githubUser: "akallam04",
  linkedin: "https://linkedin.com/in/akallam3",
  resume: "/resume.pdf",
  site: "https://arunkallam.com",
  domain: "arunkallam.com",
  repo: "https://github.com/akallam04/arun-portfolio",
  availability: "Open to full-time Software and AI Engineer roles. Graduating in May 2027.",
} as const;

export const HOME = {
  hello: "Hi, I'm",
  first: "Arun",
  last: "Kallam",
  role: "Software and AI Engineer",
  lede: "I build AI agents and test whether they really work.",
  status: {
    title: "Class of 2027, Arizona State",
    text: "Looking for my first full-time team as a Software or AI Engineer. I'll bring the agents and the tests.",
    from: "Aug 2023",
    to: "May 2027",
  },
} as const;

/** School runs from mid-August 2023 to mid-May 2027. Month-level precision is all the site shows. */
export const SCHOOL = {
  start: Date.UTC(2023, 7, 15),
  end: Date.UTC(2027, 4, 15),
} as const;

export function schoolProgress(now: number) {
  return Math.min(1, Math.max(0, (now - SCHOOL.start) / (SCHOOL.end - SCHOOL.start)));
}

export type LinkIcon = "demo" | "code" | "doc" | "results" | "release" | "test";

export type ProjectLink = { label: string; href: string; icon: LinkIcon };

export type ProofCard = { label: string; value: string; text: string };

export type MainProjectId = "shopify" | "oversold" | "shortfall";

export type MainProject = {
  id: MainProjectId;
  repo: string;
  name: string;
  subtitle: string;
  built: string;
  hook: string;
  line?: string;
  links: ProjectLink[];
  stageLabel: string;
  stageSummary: string;
  cards: ProofCard[];
  tech: string[];
  extra?: string[];
  guarantees?: string[];
  credit?: string;
};

export const SHOPIFY: MainProject = {
  id: "shopify",
  repo: "shopify-support-agent",
  name: "Shopify AI Support Agent",
  subtitle: "Customer support AI agent for a Shopify store",
  built: "Built Jul to Oct 2026",
  hook: "It changes nothing until the customer clearly says yes.",
  links: [
    { label: "Live demo", href: "https://shopify-support-agent.vercel.app", icon: "demo" },
    { label: "Code", href: "https://github.com/akallam04/shopify-support-agent", icon: "code" },
    {
      label: "How it's tested",
      href: "https://github.com/akallam04/shopify-support-agent#the-headline",
      icon: "test",
    },
  ],
  stageLabel: "The eval, 200 simulated conversations per setting",
  stageSummary:
    "One dot per simulated conversation, 200 per setting. With the rule asked in the prompt, 42 of 200 conversations changed something the customer never agreed to. With the gate in code, 0 of 200 did. Resolved safely: 75.5% with the rule in the prompt, 95% with the gate in code. Then an eval-gated model switch: cost per resolved conversation went from $0.0132 on Claude Haiku 4.5 to $0.0007 on Claude Haiku 5.5. A second mode, Try the gate, is a simplified support chat where you pick the customer's reply.",
  cards: [
    {
      label: "With the gate in code",
      value: "0 of 200",
      text: "conversations changed something the customer never agreed to. With the rule only in the prompt: 42 of 200.",
    },
    {
      label: "Resolved safely",
      value: "95%",
      text: "with the gate in code, up from 75.5% with the rule only in the prompt.",
    },
    {
      label: "Cost per resolved conversation",
      value: "$0.0007",
      text: "on Claude Haiku 5.5, down from $0.0132 on Haiku 4.5, after an eval-gated switch with zero unsafe writes.",
    },
  ],
  tech: ["Python", "LangGraph", "FastAPI", "Claude API", "MCP", "ChromaDB", "AWS"],
  extra: ["600+ pytest and Playwright tests in CI"],
  guarantees: [
    "Nothing changes until you say yes",
    "Store policy is enforced in code",
    "Facts come from the store",
  ],
};

export const OVERSOLD: MainProject = {
  id: "oversold",
  repo: "oversold",
  name: "Oversold",
  subtitle: "Race-condition tester for e-commerce checkouts",
  built: "Built Oct to Nov 2026",
  hook: "Tests whether an online store can sell more than it has in stock.",
  links: [
    {
      label: "Walkthrough",
      href: "https://github.com/akallam04/oversold/blob/main/docs/walkthrough.md",
      icon: "doc",
    },
    { label: "Code", href: "https://github.com/akallam04/oversold", icon: "code" },
    {
      label: "Results",
      href: "https://github.com/akallam04/oversold/blob/main/results/README.md",
      icon: "results",
    },
    {
      label: "Release",
      href: "https://github.com/akallam04/oversold/releases/latest",
      icon: "release",
    },
  ],
  stageLabel: "Two oversell bugs, replayed from saved runs",
  stageSummary:
    "Two scenarios from saved runs. Last unit, two servers: a shop has 1 item left. Shopper A and Shopper B send Place order to two servers within 0.01 ms of each other, and both get Order confirmed at 127 ms, so the shared database ends with 2 orders for 1 item. As released, this happened in 30 of 30 runs on Medusa 2.19.0, 28 of 30 on 2.21.2 and 29 of 30 on 2.22.0. With community fix #17420, 0 of 30. Multi-line cart: a cart needing 8 units with 6 in stock was accepted in 30 of 30 runs on each release. With community fix #16961, 0 of 30.",
  cards: [
    {
      label: "Jepsen-style Go harness",
      value: "3,120",
      text: "recorded runs against local copies of Medusa, checking stock and order rules on every request and database row. CI rechecks every verdict.",
    },
    {
      label: "Reproduced two unfixed oversell bugs",
      value: "87 of 90",
      text: "runs sold the last unit twice on two servers with the default in-memory lock. A multi-line cart oversold in 30 of 30 on each of three releases.",
    },
    {
      label: "Verified two unmerged community fixes",
      value: "0 of 30",
      text: "for each fix on its own bug, built from the PR's source. Neither fixes both.",
    },
  ],
  tech: ["Go", "PostgreSQL", "Redis", "Docker"],
  credit:
    "The bugs were reported by other people on Medusa's issue tracker, and the fixes were proposed by other developers. Oversold reproduced the bugs and tested the fixes.",
};

export const SHORTFALL: MainProject = {
  id: "shortfall",
  repo: "shortfall",
  name: "Shortfall",
  subtitle: "LLM agent benchmark for e-commerce race bugs",
  built: "Built Oct to Nov 2026",
  hook: "Can a cheap AI agent find real checkout bugs, and can we trust what it says?",
  line: "A Claude agent reads MedusaJS checkout code and writes race-condition tests that Oversold runs. A bug counts only if its community fix clears the failure.",
  links: [
    {
      label: "Walkthrough",
      href: "https://github.com/akallam04/shortfall/blob/main/WALKTHROUGH.md",
      icon: "doc",
    },
    { label: "Code", href: "https://github.com/akallam04/shortfall", icon: "code" },
    {
      label: "Results",
      href: "https://github.com/akallam04/shortfall/blob/main/RESULTS.md",
      icon: "results",
    },
    {
      label: "Release",
      href: "https://github.com/akallam04/shortfall/releases/latest",
      icon: "release",
    },
  ],
  stageLabel: "How a test earns credit",
  stageSummary:
    "The credit check: the agent's test runs on the shop as released, where the rule is broken, and on the shop with the community's fix, where the rule held. Only a test that does both counts as reproduced. Trials that reproduced all 3 bug scenarios: test grid with no AI, 10 of 10. Claude Haiku 5.5, 3 of 10. Haiku when it couldn't stop early, 7 of 10. Claude Sonnet 5.5, 9 of 10. The follow-ups were set in advance, and neither gap passed the planned test.",
  cards: [
    {
      label: "Each race scenario",
      value: "7 of 10",
      text: "With no bug report, Claude Haiku 5.5 reproduced each race scenario in 7 of 10 trials, for under 2 US cents a trial.",
    },
    {
      label: "All 3 bug scenarios",
      value: "10 of 10",
      text: "trials for a simple test grid with no AI. Claude Haiku 5.5 did it in 3 of 10.",
    },
    {
      label: "All public",
      value: "16,994 runs",
      text: "CI rebuilds every result from them.",
    },
  ],
  tech: ["Python", "Claude API", "Docker"],
  extra: ["Prompt caching", "Retries", "Crash-safe resume", "Hard $20 cap"],
};

export const MAIN_PROJECTS: MainProject[] = [SHOPIFY, OVERSOLD, SHORTFALL];

export type MoreProject = {
  id: string;
  repo: string;
  name: string;
  line: string;
  tech: string[];
  code: string;
  live?: { label: string; href: string };
  wide?: boolean;
};

export const OPENAUTODATA = {
  id: "openautodata",
  repo: "ritvikreddygangula/Open-AutoData",
  name: "OpenAutodata",
  badge: "Built at sunhacks, Oct 2026",
  event: "Hacktoberfest Hack Day Tempe x sunhacks",
  tagline: "Fine-tuning data that has to earn its place.",
  line: "An open-weight take on Meta FAIR's AutoData loop. It keeps a question only if a small model struggles and a large model solves it.",
  kept: "Kept questions: small model 27.8, large model 84.2 (judge score out of 100)",
  small: 27.8,
  large: 84.2,
  team: "Built with a team of four.",
  part: "My part: Snowflake data lead, agent design, code reviews",
  tech: ["Python", "LangGraph", "Snowflake", "OpenRouter"],
  code: "https://github.com/ritvikreddygangula/Open-AutoData",
  live: { label: "Live demo", href: "https://open-auto-data.vercel.app" },
  steps: ["Challenger", "Verifier", "Small model", "Large model", "Judge", "Gate"],
} as const;

export const MORE_PROJECTS: MoreProject[] = [
  {
    id: "cefr",
    repo: "cefr-qlora-benchmark",
    name: "CEFR QLoRA Benchmark",
    line: "Does a QLoRA fine-tuned Llama 3 8B beat the GPT-4o-mini call my Feedback API makes?",
    tech: ["PyTorch", "QLoRA", "Hugging Face"],
    code: "https://github.com/akallam04/cefr-qlora-benchmark",
    live: { label: "Model", href: "https://huggingface.co/akallam04/Llama-3-8B-cefr-qlora" },
    wide: true,
  },
  {
    id: "goalsetter",
    repo: "goalsetter-plus",
    name: "Goalsetter+",
    line: "Goal tracker with AI-powered SMART goal suggestions and a hand-built SVG analytics dashboard.",
    tech: ["React", "Node.js", "MongoDB Atlas"],
    code: "https://github.com/akallam04/goalsetter-plus",
    live: { label: "Live", href: "https://goalsetter-plus.vercel.app" },
  },
  {
    id: "feedback-api",
    repo: "LLM-Multilingual-Feedback-API",
    name: "LLM Multilingual Feedback API",
    line: "FastAPI service giving language learners corrections, with errors explained in their native language.",
    tech: ["Python", "FastAPI", "Docker"],
    code: "https://github.com/akallam04/LLM-Multilingual-Feedback-API",
  },
  {
    id: "nba",
    repo: "nba-dashboard",
    name: "NBA Teams Dashboard",
    line: "Editorial-style dashboard for all 30 NBA franchises, with team pages and live search.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    code: "https://github.com/akallam04/nba-dashboard",
    live: { label: "Live", href: "https://nba-teams-dashboard.vercel.app" },
  },
  {
    id: "sales",
    repo: "sales-insights-dashboard",
    name: "Sales Insights Dashboard",
    line: "Interactive analytics dashboard over 94,073 AtliQ Hardware transactions, backed by MySQL.",
    tech: ["Python", "MySQL", "Streamlit"],
    code: "https://github.com/akallam04/sales-insights-dashboard",
    live: { label: "Live", href: "https://sales-insights-dashboard.streamlit.app" },
  },
];

export type Job = {
  id: "byld" | "foodforest" | "prodigy";
  role: string;
  company: string;
  place: string;
  dates: string;
  start: string;
  /** Resume bullets. Text between ** marks is bold, as on the resume. */
  lines: string[];
};

export const EXPERIENCE: Job[] = [
  {
    id: "byld",
    role: "Web Development Intern",
    company: "BYLD Commerce",
    place: "Lehi, UT",
    dates: "Jun 2026 to Aug 2026",
    start: "Jun 2026",
    lines: [
      "Developed a Python build and diffing pipeline that turns one HTML/CSS/JavaScript codebase into **14 Squarespace-ready artifacts** (header/footer injections, custom CSS, 11 section blocks), cutting site updates to minutes.",
      "Architected a framework-free JavaScript front end with a deterministic SVG state machine and scroll-driven UI states.",
      "Shipped it to production on Squarespace, debugging **4 platform-level conflicts** (CSS cascade overrides, fixed-position overlays, anchor navigation, header-class collisions), and customized client Shopify storefront themes.",
    ],
  },
  {
    id: "foodforest",
    role: "Junior Data Analyst",
    company: "Food Forest AI",
    place: "Philadelphia, PA",
    dates: "Jun 2025 to Jul 2025",
    start: "Jun 2025",
    lines: [
      "Built web-scraping and ETL pipelines that collect and normalize company data for an **AI-powered B2B search engine**.",
      "Applied LLM-based extraction and classification to enrich and tag incomplete company profiles, then deduplicated the records and loaded them into **MySQL** for search ingestion.",
      "Automated Pandas data validation checks across **500+ company profiles** to catch missing fields, anomalies and formatting errors before records reached the AI search engine, cutting manual review.",
    ],
  },
  {
    id: "prodigy",
    role: "Full-Stack Web Development Intern",
    company: "Prodigy InfoTech",
    place: "Mumbai, India",
    dates: "Sep 2024 to Oct 2024",
    start: "Sep 2024",
    lines: [
      "Shipped a MERN authentication portal with JWT sessions, bcrypt hashing and role-based access.",
      "Built an Employee Management System with admin-only CRUD and a MongoDB aggregation dashboard.",
    ],
  },
];

export const BYLD_TILES = ["Header", "Footer", "Custom CSS"] as const;
export const BYLD_SECTIONS = 11;
export const FOOD_FOREST_STEPS = ["Scrape", "Normalize", "LLM enrich", "Validate", "Dedupe", "MySQL"] as const;

export function plainLine(line: string) {
  return line.replace(/\*\*/g, "");
}

export type SkillTarget =
  | "shopify"
  | "oversold"
  | "shortfall"
  | "openautodata"
  | "cefr"
  | "goalsetter"
  | "feedback-api"
  | "nba"
  | "sales"
  | "byld"
  | "foodforest";

export type SkillTargetInfo = {
  id: SkillTarget;
  name: string;
  kind: "project" | "work";
  href: string;
  note: string;
};

export const SKILL_TARGETS: SkillTargetInfo[] = [
  { id: "shopify", name: "Shopify AI Support Agent", kind: "project", href: "#shopify", note: SHOPIFY.subtitle + "." },
  { id: "oversold", name: "Oversold", kind: "project", href: "#oversold", note: OVERSOLD.subtitle + "." },
  { id: "shortfall", name: "Shortfall", kind: "project", href: "#shortfall", note: SHORTFALL.subtitle + "." },
  {
    id: "openautodata",
    name: "OpenAutodata",
    kind: "project",
    href: "#openautodata",
    note: "Fine-tuning data that has to earn its place. Built at sunhacks.",
  },
  {
    id: "cefr",
    name: "CEFR QLoRA Benchmark",
    kind: "project",
    href: "#cefr",
    note: "Does a QLoRA fine-tuned Llama 3 8B beat GPT-4o-mini?",
  },
  { id: "goalsetter", name: "Goalsetter+", kind: "project", href: "#goalsetter", note: "Goal tracker with AI-powered SMART goal suggestions." },
  {
    id: "feedback-api",
    name: "LLM Multilingual Feedback API",
    kind: "project",
    href: "#feedback-api",
    note: "FastAPI service that explains a learner's errors in their native language.",
  },
  { id: "nba", name: "NBA Teams Dashboard", kind: "project", href: "#nba", note: "Dashboard for all 30 NBA franchises, with live search." },
  { id: "sales", name: "Sales Insights Dashboard", kind: "project", href: "#sales", note: "Analytics dashboard over 94,073 transactions, backed by MySQL." },
  { id: "byld", name: "BYLD Commerce", kind: "work", href: "#experience", note: "Web Development Intern, Jun 2026 to Aug 2026." },
  { id: "foodforest", name: "Food Forest AI", kind: "work", href: "#experience", note: "Junior Data Analyst, Jun 2025 to Jul 2025." },
];

export type Skill = { name: string; targets: SkillTarget[] };

/** Groups and skills exactly as the resume lists them. Links only where the resume, a project's tags or its README show the skill. */
export const SKILL_GROUPS: { name: string; skills: Skill[] }[] = [
  {
    name: "Languages",
    skills: [
      { name: "Python", targets: ["shopify", "shortfall", "openautodata", "cefr", "feedback-api", "sales", "byld"] },
      { name: "Go", targets: ["oversold"] },
      { name: "Java", targets: [] },
      { name: "C/C++", targets: [] },
      { name: "JavaScript", targets: ["shopify", "goalsetter", "byld"] },
      { name: "TypeScript", targets: ["nba"] },
      { name: "SQL", targets: ["openautodata", "sales"] },
      { name: "HTML/CSS", targets: ["nba", "byld"] },
    ],
  },
  {
    name: "AI/LLM",
    skills: [
      { name: "LLM agents", targets: ["shopify", "shortfall", "openautodata"] },
      { name: "tool calling", targets: ["shopify"] },
      { name: "LangGraph", targets: ["shopify", "openautodata"] },
      { name: "MCP", targets: ["shopify"] },
      { name: "RAG", targets: ["shopify"] },
      { name: "ChromaDB", targets: ["shopify"] },
      { name: "LLM evals", targets: ["shopify", "shortfall", "cefr", "feedback-api"] },
      { name: "guardrails", targets: ["shopify"] },
      { name: "Claude API", targets: ["shopify", "shortfall", "goalsetter", "feedback-api"] },
      { name: "Claude Code", targets: [] },
    ],
  },
  {
    name: "Backend & Cloud",
    skills: [
      { name: "FastAPI", targets: ["shopify", "feedback-api"] },
      { name: "REST APIs", targets: ["feedback-api"] },
      { name: "AWS (Lambda, ECR, EventBridge)", targets: ["shopify"] },
      { name: "Docker", targets: ["shopify", "oversold", "shortfall", "feedback-api"] },
      { name: "Vercel", targets: ["shopify", "openautodata", "goalsetter", "nba"] },
      { name: "PostgreSQL", targets: ["oversold", "shortfall"] },
      { name: "Redis", targets: ["oversold", "shortfall"] },
    ],
  },
  {
    name: "Testing & DevOps",
    skills: [
      { name: "pytest", targets: ["shopify", "openautodata"] },
      { name: "Playwright (E2E)", targets: ["shopify", "nba"] },
      { name: "concurrency testing", targets: ["oversold", "shortfall"] },
      { name: "GitHub Actions CI", targets: ["shopify", "oversold", "shortfall", "feedback-api", "nba"] },
      { name: "Git", targets: [] },
    ],
  },
  {
    name: "Data",
    skills: [
      { name: "Pandas", targets: ["sales", "foodforest"] },
      { name: "MySQL", targets: ["sales", "foodforest"] },
      { name: "web scraping", targets: ["foodforest"] },
      { name: "ETL pipelines", targets: ["foodforest"] },
      { name: "data validation", targets: ["foodforest"] },
      { name: "LLM enrichment", targets: ["foodforest"] },
    ],
  },
];

export const ABOUT = {
  card: {
    monogram: "AK",
    name: "Arun Teja Reddy Kallam",
    goesBy: "Goes by Arun",
    place: "Tempe, Arizona",
  },
  body: "I study Computer Science at Arizona State University. I like building AI agents, and I like proving they work even more: simulated customers, saved runs, and checks that run in CI.",
  ways: [
    {
      icon: "gate",
      title: "Rules live in code",
      text: "If a rule matters, I enforce it in code, not just in a prompt. My Shopify agent changes nothing without a clear yes.",
      link: { label: "See the Shopify agent", href: "#shopify" },
    },
    {
      icon: "stamp",
      title: "Credit where it's due",
      text: "Oversold reproduced bugs other people reported, and it says so up front.",
      link: { label: "See Oversold", href: "#oversold" },
    },
    {
      icon: "balance",
      title: "Baselines first",
      text: "I test AI against simple baselines and publish every run, even when the baseline wins, like in Shortfall.",
      link: { label: "See Shortfall", href: "#shortfall" },
    },
  ],
} as const;

export const EDUCATION = {
  school: "Arizona State University",
  degree: "B.S. in Computer Science",
  place: "Tempe, Arizona",
  dates: "Aug 2023 to May 2027",
  gpa: "4.0",
  honors: "Dean's List",
  graduation: "May 2027",
} as const;

export type Course = { name: string };

/** Resume coursework plus the older site's list. */
export const COURSEWORK: { name: string; courses: Course[] }[] = [
  {
    name: "AI and ML",
    courses: [
      { name: "Intro to AI" },
      { name: "Foundations of Machine Learning" },
      { name: "Probability & Statistics" },
      { name: "Applied Linear Algebra" },
    ],
  },
  {
    name: "Systems and data",
    courses: [
      { name: "Operating Systems" },
      { name: "Database Management" },
      { name: "Information Assurance" },
      { name: "Foundations of Data Visualization" },
    ],
  },
  {
    name: "Software",
    courses: [
      { name: "Data Structures & Algorithms" },
      { name: "Software Engineering" },
      { name: "Object-Oriented Programming" },
      { name: "Principles of Programming Languages" },
      { name: "Principles of Mobile Application Development" },
      { name: "Human-Computer Interaction" },
    ],
  },
];

export const BEYOND_CLASS = {
  title: "Beyond class",
  text: "Hacktoberfest Hack Day Tempe x sunhacks, Oct 2026. Built OpenAutodata with a team of four. I led the Snowflake data work.",
} as const;


export const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Go: "#00ADD8",
  HTML: "#e34c26",
  CSS: "#663399",
  Java: "#b07219",
  "Jupyter Notebook": "#DA5B0B",
  Shell: "#89e051",
  Other: "#8b949e",
};
