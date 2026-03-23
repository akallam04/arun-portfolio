"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-0.5 text-[11.5px] leading-5 text-white/70">
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
        "rounded-2xl border border-white/[0.08] bg-white/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.25)] backdrop-blur-xl",
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
      className="text-xs text-white/40 hover:text-white/70 transition"
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
      <div className="h-px flex-1 bg-white/[0.07]" />
    </div>
  );
}

const NAV_H = 60;

export default function Page() {
  const sections = useMemo(
    () => [
      { key: "home" as SectionKey, label: "Home" },
      { key: "education" as SectionKey, label: "Education" },
      { key: "skills" as SectionKey, label: "Skills" },
      { key: "experience" as SectionKey, label: "Experience" },
      { key: "projects" as SectionKey, label: "Projects" },
      { key: "contact" as SectionKey, label: "Contact" },
    ],
    []
  );

  const elByKeyRef = useRef<Record<SectionKey, HTMLElement | null>>({
    home: null,
    education: null,
    skills: null,
    experience: null,
    projects: null,
    contact: null,
  });

  const [active, setActive] = useState<SectionKey>("home");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0)
          );
        const top = vis[0]?.target?.getAttribute("data-key") as
          | SectionKey
          | undefined;
        if (top) setActive(top);
      },
      {
        root: null,
        threshold: [0.2, 0.4, 0.6],
        rootMargin: `-${NAV_H + 8}px 0px -30% 0px`,
      }
    );

    sections.forEach((s) => {
      const el = elByKeyRef.current[s.key];
      if (el) obs.observe(el);
    });

    return () => obs.disconnect();
  }, [sections]);

  const scrollTo = (key: SectionKey) => {
    const el = elByKeyRef.current[key];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[#05070c]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 800px 550px at 10% 15%, rgba(59,130,246,0.22) 0%, transparent 60%), radial-gradient(ellipse 700px 500px at 90% 8%, rgba(16,185,129,0.15) 0%, transparent 55%), radial-gradient(ellipse 900px 650px at 55% 98%, rgba(168,85,247,0.18) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Nav */}
      <header
        className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/50 backdrop-blur-2xl"
        style={{ height: NAV_H }}
      >
        <div className="mx-auto flex h-full w-full max-w-5xl items-center justify-between px-6">
          <button
            onClick={() => scrollTo("home")}
            className="text-sm font-bold text-white/80 hover:text-white transition tracking-tight"
          >
            AK
          </button>

          <nav className="flex items-center gap-0.5">
            {sections.map((s) => {
              const isActive = active === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => scrollTo(s.key)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm transition",
                    isActive
                      ? "bg-white/[0.09] text-white"
                      : "text-white/45 hover:text-white/80 hover:bg-white/[0.04]"
                  )}
                >
                  {s.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6">
        {/* ─── HERO ──────────────────────────────────── */}
        <section
          data-key="home"
          ref={(el) => {
            elByKeyRef.current.home = el;
          }}
          className="flex min-h-[calc(100vh-60px)] flex-col justify-center py-20"
          style={{ scrollMarginTop: NAV_H + 12 }}
        >
          <div className="grid gap-10 lg:grid-cols-[1fr_260px] lg:items-center">
            <div className="space-y-7">
              {/* Status badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] px-3.5 py-1.5 text-xs text-emerald-400/90">
                <IconDot />
                Open to internships — SDE · SWE · Data · Full-Stack
              </div>

              {/* Name + tagline */}
              <div>
                <h1 className="text-5xl font-bold tracking-tight text-white md:text-[68px] md:leading-[1.05]">
                  Arun Teja
                  <br />
                  Reddy Kallam
                </h1>
                <p className="mt-4 max-w-lg text-lg text-white/50 leading-relaxed">
                  CS student at ASU building full-stack web apps, reliable APIs,
                  and data-driven products.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href="mailto:akallam04@gmail.com"
                  className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-[0.98]"
                >
                  Email me
                </a>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-white/12 bg-white/[0.06] px-5 py-2.5 text-sm text-white/80 transition hover:bg-white/[0.10] hover:text-white"
                >
                  Resume
                </a>
                <a
                  href="https://github.com/akallam04"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-white/12 bg-white/[0.06] px-5 py-2.5 text-sm text-white/80 transition hover:bg-white/[0.10] hover:text-white"
                >
                  GitHub
                </a>
                <a
                  href="https://linkedin.com/in/akallam3"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-white/12 bg-white/[0.06] px-5 py-2.5 text-sm text-white/80 transition hover:bg-white/[0.10] hover:text-white"
                >
                  LinkedIn
                </a>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-sm text-white/40">
                <span>Tempe, AZ</span>
                <span className="text-white/15">·</span>
                <span>B.S. Computer Science · ASU</span>
                <span className="text-white/15">·</span>
                <span className="text-emerald-400/80">GPA 4.0 · Dean&apos;s List</span>
                <span className="text-white/15">·</span>
                <span>May 2027</span>
              </div>
            </div>

            {/* Avatar */}
            <div className="hidden lg:flex lg:justify-end">
              <div className="relative h-56 w-56 overflow-hidden rounded-3xl border border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.55)]">
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
        </section>

        <div className="space-y-20 pb-24">
          {/* ─── EDUCATION ─────────────────────────────── */}
          <section
            data-key="education"
            ref={(el) => {
              elByKeyRef.current.education = el;
            }}
            style={{ scrollMarginTop: NAV_H + 12 }}
          >
            <SectionHeader title="Education" />

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
              <Card className="p-6">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-[13px] text-white/45 font-medium">
                      Arizona State University · Tempe, AZ
                    </div>
                    <div className="mt-1 text-lg font-semibold text-white">
                      B.S. in Computer Science
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
                      <span className="font-semibold text-emerald-400">GPA 4.0</span>
                      <span className="text-white/20">·</span>
                      <span className="text-white/50">Dean&apos;s List</span>
                    </div>
                  </div>
                  <div className="mt-2 shrink-0 text-sm text-white/35 sm:mt-0 sm:text-right">
                    Aug 2023 — May 2027
                  </div>
                </div>

                <div className="mt-5 border-t border-white/[0.06] pt-5">
                  <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-white/35">
                    Relevant Coursework
                  </div>
                  <div className="flex flex-wrap gap-1.5">
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

              <div className="space-y-3">
                {[
                  {
                    title: "Top-tier GPA",
                    tag: "4.0 / 4.0",
                    desc: "Dean's List — consistent performance across all core CS courses.",
                  },
                  {
                    title: "CS Foundations",
                    desc: "DS&A, Operating Systems, Programming Languages, Discrete Math.",
                  },
                  {
                    title: "HCI + Visualization",
                    desc: "Designing usable interfaces and communicating data insights clearly.",
                  },
                ].map((item) => (
                  <Card key={item.title} className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-semibold text-white/85">
                        {item.title}
                      </div>
                      {item.tag && (
                        <span className="text-xs font-semibold text-emerald-400">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-sm text-white/50 leading-relaxed">
                      {item.desc}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* ─── SKILLS ────────────────────────────────── */}
          <section
            data-key="skills"
            ref={(el) => {
              elByKeyRef.current.skills = el;
            }}
            style={{ scrollMarginTop: NAV_H + 12 }}
          >
            <SectionHeader title="Skills" />

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  label: "Languages",
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
                  items: ["MySQL", "MongoDB Atlas"],
                },
                {
                  label: "Tools & DevOps",
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
                <Card key={group.label} className="p-5">
                  <div className="mb-3 text-sm font-semibold text-white/80">
                    {group.label}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <Chip key={item}>{item}</Chip>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* ─── EXPERIENCE ────────────────────────────── */}
          <section
            data-key="experience"
            ref={(el) => {
              elByKeyRef.current.experience = el;
            }}
            style={{ scrollMarginTop: NAV_H + 12 }}
          >
            <SectionHeader title="Experience" />

            <div className="mt-6 space-y-4">
              {[
                {
                  role: "Junior Data Analyst",
                  company: "Food Forest AI",
                  location: "Remote",
                  period: "Jun 2025 — Jul 2025",
                  tags: ["Python", "Data Quality", "Excel / Sheets", "QA Automation"],
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
              ].map((exp) => (
                <Card key={exp.company} className="p-6">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-base font-semibold text-white">
                        {exp.role}
                      </div>
                      <div className="mt-0.5 text-sm text-white/45">
                        {exp.company} · {exp.location}
                      </div>
                    </div>
                    <div className="mt-1 shrink-0 text-sm text-white/35 sm:mt-0">
                      {exp.period}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {exp.tags.map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>

                  <ul className="mt-4 space-y-2">
                    {exp.bullets.map((b, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-sm leading-relaxed text-white/55"
                      >
                        <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-white/25" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </section>

          {/* ─── PROJECTS ──────────────────────────────── */}
          <section
            data-key="projects"
            ref={(el) => {
              elByKeyRef.current.projects = el;
            }}
            style={{ scrollMarginTop: NAV_H + 12 }}
          >
            <SectionHeader title="Projects" />

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {[
                {
                  name: "LLM Multilingual Feedback API",
                  desc: "FastAPI service that analyzes learner sentences and returns structured feedback: corrected sentence, error list, CEFR difficulty, and a correctness flag.",
                  tags: ["Python", "FastAPI", "OpenAI API", "Pydantic", "Docker"],
                  bullets: [
                    "Few-shot prompting with GPT-4o-mini for reliable structured JSON output",
                    "Pydantic post-processing layer normalizing LLM outputs",
                    "10+ unit, schema, and integration tests covering non-Latin scripts and edge cases",
                  ],
                  github: "https://github.com/akallam04",
                },
                {
                  name: "Goalsetter+",
                  desc: "Full-stack MERN goal-tracking app with JWT auth, protected routes, and a React UI featuring filtering, search, sorting, and overdue detection.",
                  tags: ["React", "Node.js", "Express", "MongoDB", "Redux Toolkit", "JWT"],
                  bullets: [
                    "REST API with express-validator and MongoDB Atlas persistence",
                    "Stats endpoint: total / active / completed / overdue counts",
                    "Redux Toolkit global state + Axios with loading & error states",
                  ],
                  github: "https://github.com/akallam04",
                },
                {
                  name: "Sales Insights Dashboard",
                  desc: "Business analytics dashboard built with MySQL and Tableau for stakeholder-facing KPI visualization and trend analysis.",
                  tags: ["MySQL", "Excel", "Tableau"],
                  bullets: [
                    "SQL queries for revenue trends, top customers & products",
                    "Regional performance analysis across business segments",
                    "Interactive Tableau dashboard with filters and drill-downs",
                  ],
                  github: "https://github.com/akallam04",
                },
              ].map((proj) => (
                <Card key={proj.name} className="flex flex-col p-6">
                  <div className="flex-1">
                    <div className="font-semibold text-white/90">{proj.name}</div>
                    <p className="mt-2 text-sm leading-relaxed text-white/50">
                      {proj.desc}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {proj.tags.map((t) => (
                        <Chip key={t}>{t}</Chip>
                      ))}
                    </div>
                    <ul className="mt-4 space-y-2">
                      {proj.bullets.map((h, i) => (
                        <li
                          key={i}
                          className="flex gap-2.5 text-sm leading-relaxed text-white/50"
                        >
                          <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-blue-400/50" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-5 border-t border-white/[0.06] pt-4">
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-white/35 transition hover:text-white/70"
                    >
                      View on GitHub →
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* ─── CONTACT ───────────────────────────────── */}
          <section
            data-key="contact"
            ref={(el) => {
              elByKeyRef.current.contact = el;
            }}
            className="pb-6"
            style={{ scrollMarginTop: NAV_H + 12 }}
          >
            <SectionHeader title="Contact" />

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <Card className="p-6">
                <div className="mb-5 text-sm font-semibold text-white/80">
                  Get in touch
                </div>
                <div className="space-y-4">
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
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <div className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
                          {item.label}
                        </div>
                        <a
                          href={item.href}
                          target={
                            item.href.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            item.href.startsWith("http")
                              ? "noreferrer"
                              : undefined
                          }
                          className="mt-0.5 block truncate text-sm font-medium text-white/75 transition hover:text-white"
                        >
                          {item.value}
                        </a>
                      </div>
                      {item.copy && <CopyButton value={item.copy} />}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <a
                    href="mailto:akallam04@gmail.com"
                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-[0.98]"
                  >
                    Send email
                  </a>
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-white/12 bg-white/[0.05] px-4 py-2 text-sm text-white/75 transition hover:bg-white/[0.09] hover:text-white"
                  >
                    Download resume
                  </a>
                </div>
              </Card>

              <Card className="p-6">
                <div className="mb-5 text-sm font-semibold text-white/80">
                  What I optimize for
                </div>
                <div className="space-y-5">
                  {[
                    {
                      title: "Polished UI + clean code",
                      desc: "I care about layout, readability, and shipping professional interfaces.",
                    },
                    {
                      title: "Reliable backend fundamentals",
                      desc: "Stable APIs, auth flows, and predictable data handling.",
                    },
                    {
                      title: "Data mindset",
                      desc: "Comfortable turning messy data into usable structure and insight.",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="border-l-2 border-white/[0.08] pl-4"
                    >
                      <div className="text-sm font-medium text-white/80">
                        {item.title}
                      </div>
                      <div className="mt-0.5 text-sm text-white/45">
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
