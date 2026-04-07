"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

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
      className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/38 transition hover:bg-white/[0.08] hover:text-white/65"
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
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
        threshold: [0.25, 0.5],
        rootMargin: `-${NAV_H}px 0px -40% 0px`,
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
              "radial-gradient(ellipse 900px 600px at 10% 15%, rgba(59,130,246,0.24) 0%, transparent 60%), radial-gradient(ellipse 700px 500px at 90% 8%, rgba(16,185,129,0.16) 0%, transparent 55%), radial-gradient(ellipse 1000px 700px at 55% 98%, rgba(168,85,247,0.18) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Nav */}
      <header
        className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.06] bg-black/55 backdrop-blur-2xl"
        style={{ height: NAV_H }}
      >
        <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-8">
          <button
            onClick={() => scrollTo("home")}
            className="text-sm font-bold tracking-widest text-white/55 transition hover:text-white"
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

      <main style={{ paddingTop: NAV_H }}>
        {/* ─── HOME ─────────────────────────────────────────── */}
        <section
          data-key="home"
          ref={(el) => { elByKeyRef.current.home = el; }}
          className="flex min-h-[calc(100vh-60px)] items-center"
          style={{ scrollMarginTop: NAV_H }}
        >
          <div className="mx-auto w-full max-w-6xl px-8 py-12">
            <div className="grid items-center gap-12 lg:grid-cols-2">

              {/* LEFT — photo + name stacked */}
              <div className="flex flex-col gap-5">
                <div className="relative h-96 w-80 overflow-hidden rounded-3xl border border-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/avatar.jpg"
                    alt="Arun Teja Reddy Kallam"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="leading-none">
                  <div className="text-[clamp(40px,5.5vw,68px)] font-bold tracking-tight text-white">
                    Arun Teja Reddy
                  </div>
                  <div className="text-[clamp(40px,5.5vw,68px)] font-bold tracking-tight text-white/70">
                    Kallam
                  </div>
                </div>
              </div>

              {/* RIGHT — info */}
              <div className="flex flex-col justify-center gap-8">
                <div className="group inline-flex w-fit cursor-default items-center gap-2.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-2 text-sm text-emerald-400 transition-all duration-300 hover:border-emerald-400/40 hover:bg-emerald-500/[0.13] hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]">
                  <IconDot />
                  Open to internships — SDE · SWE · Data · Full-Stack · AI
                </div>

                <div>
                  <p className="text-2xl leading-relaxed text-white/65 font-light">
                    CS student at ASU building
                  </p>
                  <p className="text-2xl leading-relaxed font-semibold text-white">
                    full-stack apps, reliable APIs,
                  </p>
                  <p className="text-2xl leading-relaxed font-semibold text-white">
                    and data-driven products.
                  </p>
                </div>

                <div>
                  <div className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
                    Core Stack
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["React", "Next.js", "Node.js", "Python", "FastAPI", "SQL", "MongoDB"].map((t) => (
                      <span key={t} className="rounded-lg border border-white/[0.09] bg-white/[0.04] px-3 py-1.5 text-sm text-white/60">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <a
                    href="mailto:akallam04@gmail.com"
                    className="rounded-xl border border-white/25 px-6 py-2.5 text-sm font-semibold text-white/85 transition hover:bg-white hover:text-black hover:border-white active:scale-[0.97]"
                  >
                    Email me
                  </a>
                  {[
                    { label: "Resume", href: "/resume.pdf", ext: true },
                    { label: "GitHub", href: "https://github.com/akallam04", ext: true },
                    { label: "LinkedIn", href: "https://linkedin.com/in/akallam3", ext: true },
                  ].map((btn) => (
                    <a
                      key={btn.label}
                      href={btn.href}
                      target={btn.ext ? "_blank" : undefined}
                      rel={btn.ext ? "noreferrer" : undefined}
                      className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-2.5 text-sm text-white/55 transition hover:bg-white/[0.09] hover:text-white hover:border-white/20"
                    >
                      {btn.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── EDUCATION ────────────────────────────────────── */}
        <section
          data-key="education"
          ref={(el) => { elByKeyRef.current.education = el; }}
          className="flex min-h-[calc(100vh-60px)] items-center"
          style={{ scrollMarginTop: NAV_H }}
        >
          <div className="mx-auto w-full max-w-6xl px-8 py-12">
            <div className="mb-8 flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/20">01</span>
              <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">Education</h2>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
              {/* Main card */}
              <Card className="p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-white/35">Arizona State University · Tempe, AZ</div>
                    <div className="mt-2 text-3xl font-bold text-white">B.S. in Computer Science</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-xs text-white/28">Aug 2023 — May 2027</div>
                  </div>
                </div>

                <div className="mt-7 border-t border-white/[0.06] pt-6">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
                      Relevant Coursework
                    </span>
                    <div className="h-px flex-1 bg-white/[0.08]" />
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
                    ].map((c) => <Chip key={c}>{c}</Chip>)}
                  </div>
                </div>
              </Card>

              {/* Right column */}
              <div className="flex flex-col gap-4">
                {/* Academic stats */}
                <Card className="p-6">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25 mb-4">
                    Academic Highlights
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "GPA", value: "4.0 / 4.0", color: "text-emerald-400" },
                      { label: "Standing", value: "Dean's List" },
                      { label: "Graduating", value: "May 2027" },
                    ].map((stat) => (
                      <div key={stat.label} className="flex items-center justify-between border-b border-white/[0.05] pb-3 last:border-0 last:pb-0">
                        <span className="text-sm text-white/40">{stat.label}</span>
                        <span className={`text-sm font-semibold ${stat.color ?? "text-white/75"}`}>{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Focus areas */}
                <Card className="flex-1 p-6">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25 mb-4">
                    Focus Areas
                  </div>
                  <div className="space-y-3">
                    {[
                      { icon: "⬡", label: "Full-Stack Development", desc: "Web apps end-to-end, APIs, and databases" },
                      { icon: "⬡", label: "Data & Analytics", desc: "Visualization, pipelines, and insight delivery" },
                      { icon: "⬡", label: "AI / LLM Engineering", desc: "Prompt design, structured outputs, validation" },
                    ].map((area) => (
                      <div key={area.label} className="flex gap-3">
                        <span className="mt-0.5 text-xs text-white/20">{area.icon}</span>
                        <div>
                          <div className="text-sm font-semibold text-white/75">{area.label}</div>
                          <div className="text-xs text-white/38 leading-relaxed">{area.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SKILLS ───────────────────────────────────────── */}
        <section
          data-key="skills"
          ref={(el) => { elByKeyRef.current.skills = el; }}
          className="flex min-h-[calc(100vh-60px)] items-center"
          style={{ scrollMarginTop: NAV_H }}
        >
          <div className="mx-auto w-full max-w-6xl px-8 py-12">
            <div className="mb-8 flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/20">02</span>
              <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">Skills</h2>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  label: "Languages",
                  accent: "rgba(59,130,246,0.09)",
                  items: ["JavaScript", "TypeScript", "Python", "SQL", "Java", "HTML", "CSS"],
                },
                {
                  label: "Web & Frameworks",
                  accent: "rgba(16,185,129,0.08)",
                  items: ["React", "Next.js", "Node.js", "Express.js", "FastAPI", "Redux Toolkit", "Recharts", "REST APIs", "JWT Auth"],
                },
                {
                  label: "AI / LLM",
                  accent: "rgba(168,85,247,0.09)",
                  items: ["OpenAI API", "Anthropic API", "Prompt Engineering", "LLM Output Validation", "Pydantic", "Few-shot Prompting"],
                },
                {
                  label: "Data & Analytics",
                  accent: "rgba(245,158,11,0.08)",
                  items: ["Tableau", "Power BI", "Excel", "Google Sheets", "Pandas", "NumPy", "KPI Analysis"],
                },
                {
                  label: "Databases",
                  accent: "rgba(239,68,68,0.08)",
                  items: ["MySQL", "MongoDB Atlas"],
                },
                {
                  label: "Tools & DevOps",
                  accent: "rgba(20,184,166,0.08)",
                  items: ["Git", "GitHub", "Docker", "Vercel", "Render", "Postman", "VS Code", "IntelliJ"],
                },
              ].map((group) => (
                <div
                  key={group.label}
                  className="rounded-2xl border border-white/[0.08] p-5 backdrop-blur-xl"
                  style={{ background: group.accent }}
                >
                  <div className="mb-3 text-base font-bold text-white/80">{group.label}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => <Chip key={item}>{item}</Chip>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── EXPERIENCE ───────────────────────────────────── */}
        <section
          data-key="experience"
          ref={(el) => { elByKeyRef.current.experience = el; }}
          className="flex min-h-[calc(100vh-60px)] items-center"
          style={{ scrollMarginTop: NAV_H }}
        >
          <div className="mx-auto w-full max-w-6xl px-8 py-12">
            <div className="mb-8 flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/20">03</span>
              <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">Experience</h2>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {[
                {
                  idx: "01",
                  role: "Junior Data Analyst",
                  company: "Food Forest AI",
                  location: "Remote",
                  period: "Jun 2025 — Jul 2025",
                  tags: ["Python", "Data Quality", "Excel / Sheets", "QA Automation"],
                  accent: "rgba(59,130,246,0.07)",
                  dot: "bg-blue-400/60",
                  bullets: [
                    "Cleaned and validated datasets for 500+ company profiles using Excel/Google Sheets and Python, ensuring accuracy across business, contact, and geographic fields.",
                    "Extracted and standardized capabilities, certifications, and product data from websites, directories, and LinkedIn to deliver structured enrichment datasets.",
                    "Automated Python QA checks to flag missing values, anomalies, and formatting issues — reducing manual review and producing ingestion-ready datasets.",
                  ],
                },
                {
                  idx: "02",
                  role: "Web Development Intern",
                  company: "Prodigy InfoTech",
                  location: "Remote",
                  period: "Sep 2024 — Oct 2024",
                  tags: ["HTML / CSS / JS", "Responsive UI", "GitHub"],
                  accent: "rgba(16,185,129,0.07)",
                  dot: "bg-emerald-400/60",
                  bullets: [
                    "Built responsive web pages with interactive UI components across multiple mini-projects using HTML, CSS, and JavaScript.",
                    "Completed structured development tasks on deadline; iterated based on feedback and used GitHub for version control.",
                    "Gained hands-on front-end experience with component structuring and team-based code quality standards.",
                  ],
                },
              ].map((exp) => (
                <div
                  key={exp.company}
                  className="flex flex-col rounded-2xl border border-white/[0.08] p-7 backdrop-blur-xl"
                  style={{ background: exp.accent }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-widest text-white/22">{exp.idx}</div>
                      <div className="mt-1 text-xl font-bold text-white">{exp.role}</div>
                      <div className="mt-0.5 text-base text-white/45">{exp.company} · {exp.location}</div>
                    </div>
                    <div className="shrink-0 text-sm text-white/30">{exp.period}</div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {exp.tags.map((t) => <Chip key={t}>{t}</Chip>)}
                  </div>
                  <ul className="mt-5 space-y-3">
                    {exp.bullets.map((b, i) => (
                      <li key={i} className="flex gap-3 text-base leading-relaxed text-white/70">
                        <span className={`mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full ${exp.dot}`} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PROJECTS ─────────────────────────────────────── */}
        <section
          data-key="projects"
          ref={(el) => { elByKeyRef.current.projects = el; }}
          className="flex min-h-[calc(100vh-60px)] items-center"
          style={{ scrollMarginTop: NAV_H }}
        >
          <div className="mx-auto w-full max-w-6xl px-8 py-8">
            <div className="mb-6 flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/20">04</span>
              <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">Projects</h2>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
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
                  github: "https://github.com/akallam04/intern-task-2026",
                  accent: "rgba(168,85,247,0.07)",
                  dot: "bg-purple-400/55",
                },
                {
                  num: "02",
                  name: "Goalsetter+",
                  desc: "Production-deployed MERN goal-tracking app with AI-powered SMART goal suggestions, analytics dashboards, subtask tracking, and natural language due date parsing.",
                  tags: ["React", "Node.js", "Express", "MongoDB", "Redux Toolkit", "JWT", "Recharts", "Anthropic API", "Vercel", "Render"],
                  bullets: [
                    "Claude Haiku integration generating 3 SMART goals from a description — one-click add to goals list",
                    "Recharts analytics dashboard: goal completion trends and category breakdowns with customizable periods",
                    "chrono-node NLP date parsing, subtask tracking, sharing, and rate-limited REST API deployed on Render",
                  ],
                  github: "https://github.com/akallam04/goalsetter-plus",
                  accent: "rgba(59,130,246,0.07)",
                  dot: "bg-blue-400/55",
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
                  accent: "rgba(16,185,129,0.07)",
                  dot: "bg-emerald-400/55",
                },
              ].map((proj) => (
                <div
                  key={proj.name}
                  className="flex flex-col rounded-2xl border border-white/[0.08] p-5 backdrop-blur-xl"
                  style={{ background: proj.accent }}
                >
                  <div className="flex-1">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-widest text-white/22">{proj.num}</span>
                        <span className="text-base font-bold text-white/90">{proj.name}</span>
                      </div>
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 rounded-lg border border-white/[0.10] px-2.5 py-1 text-xs text-white/35 transition hover:border-white/20 hover:text-white/65"
                      >
                        GitHub →
                      </a>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/48">{proj.desc}</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {proj.tags.map((t) => <Chip key={t}>{t}</Chip>)}
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {proj.bullets.map((h, i) => (
                        <li key={i} className="flex gap-3 text-sm leading-relaxed text-white/46">
                          <span className={cn("mt-[9px] h-1 w-1 shrink-0 rounded-full", proj.dot)} />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CONTACT ──────────────────────────────────────── */}
        <section
          data-key="contact"
          ref={(el) => { elByKeyRef.current.contact = el; }}
          className="flex min-h-[calc(100vh-60px)] items-center"
          style={{ scrollMarginTop: NAV_H }}
        >
          <div className="mx-auto w-full max-w-6xl px-8 py-12">
            <div className="mb-10 flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/20">05</span>
              <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">Contact</h2>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>

            <div className="grid gap-12 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="mb-8 text-xl text-white/40">
                  Let&apos;s connect — I respond quickly.
                </p>

                <div className="space-y-0">
                  {[
                    { label: "Email", value: "akallam04@gmail.com", href: "mailto:akallam04@gmail.com", copy: "akallam04@gmail.com" },
                    { label: "Phone", value: "(480) 937-6420", href: "tel:4809376420", copy: "(480) 937-6420" },
                    { label: "LinkedIn", value: "linkedin.com/in/akallam3", href: "https://linkedin.com/in/akallam3" },
                    { label: "GitHub", value: "github.com/akallam04", href: "https://github.com/akallam04" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between border-b border-white/[0.06] py-5"
                    >
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">
                          {item.label}
                        </div>
                        <a
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                          className="mt-1 block text-2xl font-semibold text-white/72 transition hover:text-white"
                        >
                          {item.value}
                        </a>
                      </div>
                      {item.copy && <CopyButton value={item.copy} />}
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
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
                    className="rounded-xl border border-white/12 bg-white/[0.05] px-7 py-3 text-sm text-white/68 transition hover:bg-white/10 hover:text-white"
                  >
                    Download resume
                  </a>
                </div>
              </div>

              {/* Side quote */}
              <div className="hidden lg:flex lg:w-64 lg:flex-col lg:justify-center">
                <Card className="p-6">
                  <div className="text-3xl text-white/12 leading-none mb-3">&ldquo;</div>
                  <p className="text-base leading-relaxed text-white/45">
                    Building clean products that work reliably and look great doing it.
                  </p>
                  <div className="mt-4 text-sm font-semibold text-white/30">— Arun</div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
