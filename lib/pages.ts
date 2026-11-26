export const PAGES = [
  {
    id: "home",
    label: "Home",
    nav: "home",
    caption: "Meet Arun Teja Reddy Kallam, Software and AI Engineer.",
  },
  { id: "about", label: "About", nav: "about", caption: "Who he is and how he works." },
  {
    id: "shopify",
    label: "Shopify AI Support Agent",
    nav: "projects",
    caption: "Watch what changes when the rule moves from the prompt into code.",
  },
  {
    id: "oversold",
    label: "Oversold",
    nav: "projects",
    caption: "Two shoppers try to buy the last item at the same moment.",
  },
  {
    id: "shortfall",
    label: "Shortfall",
    nav: "projects",
    caption: "How a test earns credit, and how the AI agent did against a simple test grid.",
  },
  {
    id: "more-projects",
    label: "More projects",
    nav: "projects",
    caption: "More of his work, including OpenAutodata from sunhacks.",
  },
  {
    id: "experience",
    label: "Experience",
    nav: "experience",
    caption: "What he built at BYLD Commerce and Food Forest AI.",
  },
  {
    id: "education",
    label: "Education",
    nav: "education",
    caption: "His degree at Arizona State and the courses behind it.",
  },
  { id: "skills", label: "Skills", nav: "skills", caption: "Every skill, connected to where he used it." },
  { id: "github", label: "GitHub", nav: "github", caption: "His latest work, live from GitHub." },
  { id: "contact", label: "Contact", nav: "contact", caption: "Liked what you saw? Send Arun a message." },
] as const;

export type PageId = (typeof PAGES)[number]["id"];
export type NavId = (typeof PAGES)[number]["nav"];

export const NAV: { id: NavId; label: string; target: PageId }[] = [
  { id: "about", label: "About", target: "about" },
  { id: "projects", label: "Projects", target: "shopify" },
  { id: "experience", label: "Experience", target: "experience" },
  { id: "education", label: "Education", target: "education" },
  { id: "skills", label: "Skills", target: "skills" },
  { id: "github", label: "GitHub", target: "github" },
  { id: "contact", label: "Contact", target: "contact" },
];

export function navFor(page: PageId): NavId {
  return PAGES.find((p) => p.id === page)?.nav ?? "home";
}

export function pageLabel(page: PageId): string {
  return PAGES.find((p) => p.id === page)?.label ?? "";
}
