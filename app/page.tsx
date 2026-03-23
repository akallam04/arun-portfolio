"use client";

import React, { useState } from "react";
import Image from "next/image";

type SectionKey =
  | "home"
  | "education"
  | "skills"
  | "experience"
  | "projects"
  | "contact";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-sm text-white/65">
      {children}
    </span>
  );
}

function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl",
        className
      )}
    >
      {children}
    </div>
  );
}

function IconDot() {
  return (
    <span className="relative inline-flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/50" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
    </span>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        } catch {}
      }}
      className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/40 transition hover:bg-white/[0.08] hover:text-white/70"
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

const SECTIONS: { key: SectionKey; label: string; num: string }[] = [
  { key: "home", label: "Home", num: "00" },
  { key: "education", label: "Education", num: "01" },
  { key: "skills", label: "Skills", num: "02" },
  { key: "experience", label: "Experience", num: "03" },
  { key: "projects", label: "Projects", num: "04" },
  { key: "contact", label: "Contact", num: "05" },
];

const BG: Record<SectionKey, string> = {
  home: "radial-gradient(ellipse 900px 600px at 8% 15%, rgba(59,130,246,0.28) 0%, transparent 60%), radial-gradient(ellipse 700px 500px at 92% 8%, rgba(16,185,129,0.18) 0%, transparent 55%), radial-gradient(ellipse 1000px 700px at 55% 100%, rgba(168,85,247,0.20) 0%, transparent 60%)",
  education:
    "radial-gradient(ellipse 800px 600px at 5% 25%, rgba(99,102,241,0.28) 0%, transparent 60%), radial-gradient(ellipse 700px 500px at 85% 85%, rgba(16,185,129,0.14) 0%, transparent 55%)",
  skills:
    "radial-gradient(ellipse 1000px 650px at 50% 0%, rgba(59,130,246,0.22) 0%, transparent 60%), radial-gradient(ellipse 700px 500px at 5% 95%, rgba(168,85,247,0.18) 0%, transparent 55%)",
  experience:
    "radial-gradient(ellipse 800px 550px at 92% 18%, rgba(245,158,11,0.14) 0%, transparent 60%), radial-gradient(ellipse 800px 600px at 5% 80%, rgba(59,130,246,0.20) 0%, transparent 55%)",
  projects:
    "radial-gradient(ellipse 900px 650px at 15% 10%, rgba(168,85,247,0.24) 0%, transparent 60%), radial-gradient(ellipse 700px 500px at 85% 90%, rgba(59,130,246,0.18) 0%, transparent 55%)",
  contact:
    "radial-gradient(ellipse 900px 700px at 50% 50%, rgba(16,185,129,0.16) 0%, transparent 60%), radial-gradient(ellipse 600px 400px at 8% 8%, rgba(59,130,246,0.14) 0%, transparent 55%)",
};

const NAV_H = 60;

export default function Page() {
  const [active, setActive] = useState<SectionKey>("home");
  const [key, setKey] = useState(0);

  const navigate = (s: SectionKey) => {
    setActive(s);
    setKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen overflow-hidden text-white">
      {/* Animated background per section */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[#05070c] transition-all duration-700">
        <div
          key={active}
          className="absolute inset-0 section-bg"
          style={{ background: BG[active] }}
        />
      </div>

      {/* Nav */}
      <header
        className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.06] bg-black/55 backdrop-blur-2xl"
        style={{ height: NAV_H }}
      >
        <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-8">
          <button
            onClick={() => navigate("home")}
            className="text-sm font-bold tracking-widest text-white/60 transition hover:text-white"
          >
            AK
          </button>

          <nav className="flex items-center gap-0.5">
            {SECTIONS.map((s) => {
              const isActive = active === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => navigate(s.key)}
                  className={cn(
                    "rounded-lg px-3.5 py-1.5 text-sm transition-all",
                    isActive
                      ? "bg-white/[0.10] font-medium text-white"
                      : "text-white/38 hover:bg-white/[0.05] hover:text-white/75"
                  )}
                >
                  {s.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Sections */}
      <main
        key={key}
        className="section-enter pt-[60px]"
        style={{ minHeight: "100vh" }}
      >
        {/* ─── HOME ──────────────────────────── */}
        {active === "home" && (
          <div className="mx-auto flex min-h-[calc(100vh-60px)] max-w-6xl flex-col justify-center px-8 py-20">
            <div className="grid gap-14 lg:grid-cols-[1fr_300px] lg:items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-2 text-sm text-emerald-400">
                  <IconDot />
                  Open to internships — SDE · SWE · Data · Full-Stack
                </div>

                <div>
                  <h1 className="text-[clamp(52px,7vw,88px)] font-bold leading-[1.0] tracking-tight text-white">
                    Arun Teja
                    <br />
                    Reddy Kallam
                  </h1>
                  <p className="mt-5 max-w-xl text-xl leading-relaxed text-white/45">
                    CS student at ASU building full-stack web apps, reliable
                    APIs, and data-driven products.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="mailto:akallam04@gmail.com"
                    className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-[0.97]"
                  >
                    Email me
                  </a>
                  {[
                    { label: "Resume", href: "/resume.pdf", external: true },
                    {
                      label: "GitHub",
                      href: "https://github.com/akallam04",
                      external: true,
                    },
                    {
                      label: "LinkedIn",
                      href: "https://linkedin.com/in/akallam3",
                      external: true,
                    },
                  ].map((btn) => (
                    <a
                      key={btn.label}
                      href={btn.href}
                      target={btn.external ? "_blank" : undefined}
                      rel={btn.external ? "noreferrer" : undefined}
                      className="rounded-xl border border-white/12 bg-white/[0.06] px-6 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
                    >
                      {btn.label}
                    </a>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-white/32">
                  <span>Tempe, AZ</span>
                  <span className="text-white/12">·</span>
                  <span>B.S. Computer Science · ASU</span>
                  <span className="text-white/12">·</span>
                  <span className="font-medium text-emerald-400/75">
                    GPA 4.0 · Dean&apos;s List
                  </span>
                  <span className="text-white/12">·</span>
                  <span>May 2027</span>
                </div>
              </div>

              <div className="hidden lg:flex lg:justify-end">
                <div className="relative h-72 w-72 overflow-hidden rounded-[28px] border border-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.65)]">
                  <Image
                    src="/avatar.jpg"
                    alt="Arun Teja Reddy Kallam"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── EDUCATION ──────────────────────── */}
        {active === "education" && (
          <div className="mx-auto min-h-[calc(100vh-60px)] max-w-6xl px-8 py-16">
            <div className="mb-10">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/22">
                01
              </div>
              <h2 className="mt-2 text-[clamp(36px,5vw,60px)] font-bold tracking-tight text-white">
                Education
              </h2>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
              <Card className="p-8">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-sm font-medium text-white/38">
                      Arizona State University · Tempe, AZ
                    </div>
                    <div className="mt-2 text-2xl font-bold text-white">
                      B.S. in Computer Science
                    </div>
                    <div className="mt-2 flex items-center gap-2.5">
                      <span className="text-base font-bold text-emerald-400">
                        GPA 4.0
                      </span>
                      <span className="text-white/18">·</span>
                      <span className="text-base text-white/50">
                        Dean&apos;s List
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 text-sm text-white/28">
                    Aug 2023 — May 2027
                  </div>
                </div>

                <div className="mt-7 border-t border-white/[0.06] pt-7">
                  <div className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white/28">
                    Relevant Coursework
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
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
                    ].map((c) => (
                      <Chip key={c}>{c}</Chip>
                    ))}
                  </div>
                </div>
              </Card>

              <div className="space-y-4">
                {[
                  {
                    title: "Top-tier GPA",
                    tag: "4.0 / 4.0",
                    desc: "Dean's List recognition — consistent performance across all core CS courses.",
                  },
                  {
                    title: "CS Foundations",
                    desc: "DS&A, Operating Systems, Programming Languages, Discrete Math, and Probability/Statistics.",
                  },
                  {
                    title: "HCI + Visualization",
                    desc: "Comfortable designing usable interfaces and communicating insights through clean dashboards.",
                  },
                ].map((item) => (
                  <Card key={item.title} className="p-6">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-base font-bold text-white/85">
                        {item.title}
                      </div>
                      {item.tag && (
                        <span className="shrink-0 text-sm font-bold text-emerald-400">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-base leading-relaxed text-white/48">
                      {item.desc}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── SKILLS ─────────────────────────── */}
        {active === "skills" && (
          <div className="mx-auto min-h-[calc(100vh-60px)] max-w-6xl px-8 py-16">
            <div className="mb-10">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/22">
                02
              </div>
              <h2 className="mt-2 text-[clamp(36px,5vw,60px)] font-bold tracking-tight text-white">
                Skills
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  label: "Languages",
                  accent: "rgba(59,130,246,0.12)",
                  items: [
                    "JavaScript",
                    "TypeScript",
                    "Python",
                    "SQL",
                    "Java",
                    "HTML",
                    "CSS",
                  ],
                },
                {
                  label: "Web & Frameworks",
                  accent: "rgba(16,185,129,0.10)",
                  items: [
                    "React",
                    "Next.js",
                    "Node.js",
                    "Express.js",
                    "FastAPI",
                    "Redux Toolkit",
                    "REST APIs",
                    "JWT Auth",
                  ],
                },
                {
                  label: "AI / LLM",
                  accent: "rgba(168,85,247,0.10)",
                  items: [
                    "OpenAI API",
                    "Prompt Engineering",
                    "LLM Output Validation",
                    "Pydantic",
                    "Few-shot Prompting",
                  ],
                },
                {
                  label: "Data & Analytics",
                  accent: "rgba(245,158,11,0.10)",
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
                  accent: "rgba(239,68,68,0.10)",
                  items: ["MySQL", "MongoDB Atlas"],
                },
                {
                  label: "Tools & DevOps",
                  accent: "rgba(20,184,166,0.10)",
                  items: [
                    "Git",
                    "GitHub",
                    "Docker",
                    "Vercel",
                    "Postman",
                    "VS Code",
                    "IntelliJ",
                  ],
                },
              ].map((group) => (
                <div
                  key={group.label}
                  className="rounded-2xl border border-white/[0.08] p-6 backdrop-blur-xl"
                  style={{ background: group.accent }}
                >
                  <div className="mb-4 text-base font-bold text-white/80">
                    {group.label}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <Chip key={item}>{item}</Chip>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── EXPERIENCE ─────────────────────── */}
        {active === "experience" && (
          <div className="mx-auto min-h-[calc(100vh-60px)] max-w-6xl px-8 py-16">
            <div className="mb-10">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/22">
                03
              </div>
              <h2 className="mt-2 text-[clamp(36px,5vw,60px)] font-bold tracking-tight text-white">
                Experience
              </h2>
            </div>

            <div className="space-y-5">
              {[
                {
                  role: "Junior Data Analyst",
                  company: "Food Forest AI",
                  location: "Remote",
                  period: "Jun 2025 — Jul 2025",
                  tags: [
                    "Python",
                    "Data Quality",
                    "Excel / Sheets",
                    "QA Automation",
                  ],
                  bullets: [
                    "Cleaned and validated datasets for 500+ company profiles using Excel/Google Sheets and Python, ensuring accuracy across business, contact, and geographic fields.",
                    "Extracted and standardized capabilities, certifications, and product data from websites, directories, and LinkedIn to deliver structured enrichment datasets.",
                    "Automated Python QA checks to flag missing values, anomalies, and formatting issues — reducing manual review and producing ingestion-ready datasets.",
                  ],
                },
                {
                  role: "Full-Stack Web Development Intern",
                  company: "Prodigy InfoTech",
                  location: "Remote",
                  period: "Sep 2024 — Oct 2024",
                  tags: ["HTML / CSS / JS", "Responsive UI", "GitHub"],
                  bullets: [
                    "Built responsive web pages with interactive UI components across multiple mini-projects using HTML, CSS, and JavaScript.",
                    "Completed structured development tasks aligned with deadlines; iterated based on feedback and used GitHub for version control.",
                    "Gained hands-on front-end experience with component structuring and team-based code quality standards.",
                  ],
                },
              ].map((exp, idx) => (
                <Card key={exp.company} className="p-8">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-widest text-white/25">
                        0{idx + 1}
                      </div>
                      <div className="mt-1 text-2xl font-bold text-white">
                        {exp.role}
                      </div>
                      <div className="mt-1 text-base text-white/45">
                        {exp.company} · {exp.location}
                      </div>
                    </div>
                    <div className="shrink-0 text-sm text-white/28">
                      {exp.period}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {exp.tags.map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>
                  <ul className="mt-5 space-y-3">
                    {exp.bullets.map((b, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-base leading-relaxed text-white/55"
                      >
                        <span className="mt-[11px] h-1 w-1 shrink-0 rounded-full bg-white/22" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ─── PROJECTS ───────────────────────── */}
        {active === "projects" && (
          <div className="mx-auto min-h-[calc(100vh-60px)] max-w-6xl px-8 py-16">
            <div className="mb-10">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/22">
                04
              </div>
              <h2 className="mt-2 text-[clamp(36px,5vw,60px)] font-bold tracking-tight text-white">
                Projects
              </h2>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {[
                {
                  num: "01",
                  name: "LLM Multilingual Feedback API",
                  desc: "FastAPI service analyzing learner sentences and returning structured feedback — corrected sentence, error list, CEFR difficulty, and a correctness flag.",
                  tags: ["Python", "FastAPI", "OpenAI API", "Pydantic", "Docker"],
                  bullets: [
                    "Few-shot prompting with GPT-4o-mini for reliable structured JSON output",
                    "Pydantic post-processing layer normalizing LLM outputs",
                    "10+ unit, schema & integration tests covering non-Latin scripts",
                  ],
                  github: "https://github.com/akallam04",
                  accent: "rgba(168,85,247,0.08)",
                  dot: "bg-purple-400/60",
                },
                {
                  num: "02",
                  name: "Goalsetter+",
                  desc: "Full-stack MERN goal-tracking app with JWT auth, protected routes, and a React UI featuring filtering, search, sorting, and overdue detection.",
                  tags: [
                    "React",
                    "Node.js",
                    "Express",
                    "MongoDB",
                    "Redux Toolkit",
                    "JWT",
                  ],
                  bullets: [
                    "REST API with express-validator and MongoDB Atlas persistence",
                    "Stats endpoint: total / active / completed / overdue counts",
                    "Redux Toolkit global state + Axios with loading & error states",
                  ],
                  github: "https://github.com/akallam04",
                  accent: "rgba(59,130,246,0.08)",
                  dot: "bg-blue-400/60",
                },
                {
                  num: "03",
                  name: "Sales Insights Dashboard",
                  desc: "Business analytics dashboard built with MySQL and Tableau for stakeholder-facing KPI visualization and trend analysis.",
                  tags: ["MySQL", "Excel", "Tableau"],
                  bullets: [
                    "SQL queries for revenue trends, top customers & products",
                    "Regional performance analysis across business segments",
                    "Interactive Tableau dashboard with filters and drill-downs",
                  ],
                  github: "https://github.com/akallam04",
                  accent: "rgba(16,185,129,0.08)",
                  dot: "bg-emerald-400/60",
                },
              ].map((proj) => (
                <div
                  key={proj.name}
                  className="flex flex-col rounded-2xl border border-white/[0.08] p-7 backdrop-blur-xl"
                  style={{ background: proj.accent }}
                >
                  <div className="flex-1">
                    <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/22">
                      {proj.num}
                    </div>
                    <div className="text-xl font-bold text-white/90">
                      {proj.name}
                    </div>
                    <p className="mt-2.5 text-base leading-relaxed text-white/48">
                      {proj.desc}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {proj.tags.map((t) => (
                        <Chip key={t}>{t}</Chip>
                      ))}
                    </div>
                    <ul className="mt-5 space-y-2.5">
                      {proj.bullets.map((h, i) => (
                        <li
                          key={i}
                          className="flex gap-3 text-base leading-relaxed text-white/48"
                        >
                          <span
                            className={cn(
                              "mt-[11px] h-1 w-1 shrink-0 rounded-full",
                              proj.dot
                            )}
                          />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-6 border-t border-white/[0.06] pt-5">
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-white/30 transition hover:text-white/65"
                    >
                      View on GitHub →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── CONTACT ────────────────────────── */}
        {active === "contact" && (
          <div className="mx-auto flex min-h-[calc(100vh-60px)] max-w-6xl flex-col justify-center px-8 py-20">
            <div className="mb-12">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/22">
                05
              </div>
              <h2 className="mt-2 text-[clamp(36px,5vw,60px)] font-bold tracking-tight text-white">
                Contact
              </h2>
              <p className="mt-3 text-xl text-white/38">
                Let&apos;s connect — I respond quickly.
              </p>
            </div>

            <div className="max-w-2xl space-y-0">
              {[
                {
                  label: "Email",
                  value: "akallam04@gmail.com",
                  href: "mailto:akallam04@gmail.com",
                  copy: "akallam04@gmail.com",
                },
                {
                  label: "Phone",
                  value: "(480) 937-6420",
                  href: "tel:4809376420",
                  copy: "(480) 937-6420",
                },
                {
                  label: "LinkedIn",
                  value: "linkedin.com/in/akallam3",
                  href: "https://linkedin.com/in/akallam3",
                },
                {
                  label: "GitHub",
                  value: "github.com/akallam04",
                  href: "https://github.com/akallam04",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between border-b border-white/[0.06] py-6"
                >
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.15em] text-white/25">
                      {item.label}
                    </div>
                    <a
                      href={item.href}
                      target={
                        item.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        item.href.startsWith("http") ? "noreferrer" : undefined
                      }
                      className="mt-1.5 block text-2xl font-semibold text-white/75 transition hover:text-white"
                    >
                      {item.value}
                    </a>
                  </div>
                  {item.copy && <CopyButton value={item.copy} />}
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="mailto:akallam04@gmail.com"
                className="rounded-xl bg-white px-7 py-3 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-[0.97]"
              >
                Send email
              </a>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/12 bg-white/[0.06] px-7 py-3 text-sm text-white/70 transition hover:bg-white/[0.10] hover:text-white"
              >
                Download resume
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
