export const AGENT_SOURCES = {
  "about-page": { label: "About page", href: "#about" },
  "shopify-page": { label: "Shopify agent page", href: "#shopify" },
  "oversold-page": { label: "Oversold page", href: "#oversold" },
  "shortfall-page": { label: "Shortfall page", href: "#shortfall" },
  "more-projects-page": { label: "More projects page", href: "#more-projects" },
  "experience-page": { label: "Experience page", href: "#experience" },
  "education-page": { label: "Education page", href: "#education" },
  "skills-page": { label: "Skills page", href: "#skills" },
  "contact-page": { label: "Contact page", href: "#contact" },
  "openautodata-repo": {
    label: "OpenAutodata repo",
    href: "https://github.com/ritvikreddygangula/Open-AutoData",
  },
  "shopify-readme": {
    label: "Shopify agent README",
    href: "https://github.com/akallam04/shopify-support-agent#the-headline",
  },
  "shortfall-results": {
    label: "Shortfall results",
    href: "https://github.com/akallam04/shortfall/blob/main/RESULTS.md",
  },
  "oversold-results": {
    label: "Oversold results",
    href: "https://github.com/akallam04/oversold/blob/main/results/README.md",
  },
} as const;

export type AgentSourceId = keyof typeof AGENT_SOURCES;

export const AGENT_SOURCE_IDS = Object.keys(AGENT_SOURCES) as AgentSourceId[];

export const SUGGESTED_QUESTIONS = [
  "What did Oversold reproduce?",
  "Why did a simple test grid beat the AI agent in Shortfall?",
  "What does the Shopify agent guarantee?",
  "What did Arun build at sunhacks?",
  "Is Arun open to full-time roles?",
];

export const AGENT_LIMITS = {
  questionChars: 300,
  history: 6,
  perVisit: 8,
} as const;

export type AgentMessage = { role: "user" | "assistant"; content: string };

export type AgentReply = {
  answer: string;
  sources: AgentSourceId[];
  checked: boolean;
};
