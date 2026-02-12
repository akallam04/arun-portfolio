"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

type SectionKey =
  | "profile"
  | "education"
  | "skills"
  | "experience"
  | "projects"
  | "contact";

type SectionDef = {
  key: SectionKey;
  label: string;
  title: string;
  subtitle: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/12 bg-white/[0.05] px-3 py-1 text-[12px] leading-none text-white/80">
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
        "rounded-2xl border border-white/12 bg-white/[0.06] shadow-[0_10px_35px_rgba(0,0,0,0.35)] backdrop-blur-xl",
        className
      )}
    >
      {children}
    </div>
  );
}

function IconDot() {
  return (
    <span className="relative inline-flex h-2.5 w-2.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/45" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
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
          window.setTimeout(() => setCopied(false), 1200);
        } catch {}
      }}
      className="rounded-xl border border-white/12 bg-white/[0.06] px-3 py-2 text-sm text-white/85 transition hover:bg-white/[0.10] hover:text-white"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function Page() {
  const NAV_H = 76;

  const sections: SectionDef[] = useMemo(
    () => [
      {
        key: "profile",
        label: "Profile",
        title: "Profile",
        subtitle: "A quick, recruiter-friendly snapshot.",
      },
      {
        key: "education",
        label: "Education",
        title: "Education",
        subtitle: "Academic background + strengths.",
      },
      {
        key: "skills",
        label: "Skills",
        title: "Skills",
        subtitle: "Technical stack + what I build.",
      },
      {
        key: "experience",
        label: "Experience",
        title: "Experience",
        subtitle: "Internships + measurable work.",
      },
      {
        key: "projects",
        label: "Projects",
        title: "Projects",
        subtitle: "Selected work with impact + stack.",
      },
      {
        key: "contact",
        label: "Contact",
        title: "Contact",
        subtitle: "Fast ways to reach me.",
      },
    ],
    []
  );

  const rootRef = useRef<HTMLDivElement | null>(null);

  const elByKeyRef = useRef<Record<SectionKey, HTMLElement | null>>({
    profile: null,
    education: null,
    skills: null,
    experience: null,
    projects: null,
    contact: null,
  });

  const [active, setActive] = useState<SectionKey>("profile");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0)
          );
        const top = vis[0]?.target?.getAttribute("data-key") as
          | SectionKey
          | undefined;
        if (top) setActive(top);
      },
      {
        root: null,
        threshold: [0.35, 0.5, 0.65],
        rootMargin: `-${NAV_H + 8}px 0px -35% 0px`,
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

  const hoverOnly =
    "border-transparent bg-transparent text-white/80 hover:border-white/16 hover:bg-white/[0.07] hover:text-white";

  const activeStyle =
    "border-white/22 bg-white/[0.04] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset]";

  return (
    <div ref={rootRef} className="relative min-h-screen text-white">
      {/* ✅ Background at z-0 so it shows ABOVE layout bg-apple */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(900px 700px at 12% 20%, rgba(59,130,246,0.38), transparent 60%)," +
              "radial-gradient(900px 700px at 88% 18%, rgba(16,185,129,0.32), transparent 62%)," +
              "radial-gradient(1100px 850px at 50% 92%, rgba(168,85,247,0.28), transparent 65%)," +
              "radial-gradient(900px 700px at 30% 70%, rgba(236,72,153,0.10), transparent 55%)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.60),rgba(0,0,0,0.82))]" />
      </div>

      {/* ✅ All content above background */}
      <div className="relative z-10">
        {/* Top Nav */}
        <header
          className="sticky top-0 z-50 border-b border-white/10 bg-black/35 backdrop-blur-xl"
          style={{ height: NAV_H }}
        >
          <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between gap-3 px-4">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white/90">
                Arun Teja Reddy Kallam
              </div>
              <div className="truncate text-xs text-white/55">
                Viewing: {active}
              </div>
            </div>

            <nav className="max-w-[70%] overflow-x-auto">
              <div className="flex items-center gap-2">
                {sections.map((s) => {
                  const isActive = active === s.key;
                  return (
                    <button
                      key={s.key}
                      onClick={() => scrollTo(s.key)}
                      className={cn(
                        "whitespace-nowrap rounded-xl border px-3 py-2 text-sm transition",
                        isActive ? activeStyle : hoverOnly
                      )}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4">
          <div className="space-y-12 py-10">
            {/* PROFILE */}
            <section
              data-key="profile"
              ref={(el) => {
                elByKeyRef.current.profile = el;
              }}
              className="scroll-mt-[90px]"
              style={{ scrollMarginTop: NAV_H + 18 }}
            >
              <div
                className="grid items-center gap-6 lg:grid-cols-2"
                style={{ minHeight: `calc(100vh - ${NAV_H}px - 40px)` }}
              >
                <div className="space-y-3">
                  <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">
                    Profile
                  </h1>

                  {/* ✅ removed: A quick, recruiter-friendly snapshot. */}

                  <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative h-[240px] w-[240px] overflow-hidden rounded-full border border-white/14 bg-white/[0.03] shadow-[0_10px_35px_rgba(0,0,0,0.45)] md:h-[280px] md:w-[280px]">
                      <Image
                        src="/avatar.jpg"
                        alt="Arun Teja Reddy Kallam"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="text-4xl font-semibold leading-tight md:text-5xl">
                        Arun Teja Reddy
                        <br />
                        Kallam
                      </div>
                      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-sm text-white/75">
                        <IconDot />
                        Open to internships (SDE, SWE, Data Analyst, Full-Stack)
                      </div>
                    </div>
                  </div>
                </div>

                <Card className="p-6">
                  <div className="space-y-4">
                    <p className="text-lg leading-relaxed text-white/80">
                      CS student at ASU building clean web apps and data-driven
                      products. Focused on shipping polished UI, reliable APIs,
                      and measurable impact.
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <a
                        href="mailto:akallam04@gmail.com"
                        className="rounded-xl border border-white/12 bg-white/[0.06] px-4 py-2 text-sm text-white/85 transition hover:bg-white/[0.10] hover:text-white"
                      >
                        Email
                      </a>
                      <a
                        href="https://linkedin.com/in/akallam3"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border border-white/12 bg-white/[0.06] px-4 py-2 text-sm text-white/85 transition hover:bg-white/[0.10] hover:text-white"
                      >
                        LinkedIn
                      </a>
                      <a
                        href="https://github.com/akallam04"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border border-white/12 bg-white/[0.06] px-4 py-2 text-sm text-white/85 transition hover:bg-white/[0.10] hover:text-white"
                      >
                        GitHub
                      </a>
                      <a
                        href="/resume.pdf"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border border-white/12 bg-white/[0.06] px-4 py-2 text-sm text-white/85 transition hover:bg-white/[0.10] hover:text-white"
                      >
                        Resume
                      </a>
                    </div>

                    <Card className="p-4">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <div className="text-xs tracking-wider text-white/50">
                            LOCATION
                          </div>
                          <div className="mt-1 font-semibold text-white/90">
                            Tempe, AZ
                          </div>
                        </div>
                        <div>
                          <div className="text-xs tracking-wider text-white/50">
                            DEGREE
                          </div>
                          <div className="mt-1 font-semibold text-white/90">
                            B.S. CS (ASU)
                          </div>
                        </div>
                        <div>
                          <div className="text-xs tracking-wider text-white/50">
                            GPA
                          </div>
                          <div className="mt-1 font-semibold text-white/90">
                            4.0 (Dean’s List)
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </Card>
              </div>
            </section>

            {/* EDUCATION */}
            <section
              data-key="education"
              ref={(el) => {
                elByKeyRef.current.education = el;
              }}
              className="scroll-mt-[90px]"
              style={{ scrollMarginTop: NAV_H + 18 }}
            >
              <div
                className="grid items-center gap-6 lg:grid-cols-2"
                style={{ minHeight: `calc(100vh - ${NAV_H}px - 40px)` }}
              >
                <div className="space-y-3">
                  <h2 className="text-5xl font-semibold tracking-tight md:text-6xl">
                    Education
                  </h2>
                  <p className="text-white/70">Academic background + strengths.</p>

                  <Card className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-xl font-semibold text-white/92">
                          Arizona State University • Tempe, AZ
                        </div>
                        <div className="mt-2 text-white/75">
                          B.S. in Computer Science • GPA: 4.0 • Dean’s List
                        </div>
                      </div>
                      <div className="shrink-0 text-sm text-white/60">
                        Aug 2023 — May 2027
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <Card className="p-4">
                        <div className="text-xs tracking-wider text-white/55">
                          FOCUS
                        </div>
                        <div className="mt-1 font-semibold text-white/92">
                          Web + Data
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="text-xs tracking-wider text-white/55">
                          STRENGTH
                        </div>
                        <div className="mt-1 font-semibold text-white/92">
                          Systems + UI
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="text-xs tracking-wider text-white/55">
                          OUTPUT
                        </div>
                        <div className="mt-1 font-semibold text-white/92">
                          Projects + Internships
                        </div>
                      </Card>
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-sm font-semibold text-white/90">
                          Relevant Coursework
                        </div>
                        <div className="text-xs text-white/55">10 courses</div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Chip>Data Structures & Algorithms</Chip>
                        <Chip>Object-Oriented Programming</Chip>
                        <Chip>Software Engineering</Chip>
                        <Chip>Operating Systems</Chip>
                        <Chip>Principles of Programming Languages</Chip>
                        <Chip>Intro to Human-Computer Interaction</Chip>
                        <Chip>Foundations of Data Visualization</Chip>
                        <Chip>Discrete Mathematics</Chip>
                        <Chip>Probability & Statistics</Chip>
                        <Chip>Computer Organization & Assembly</Chip>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="p-6">
                    <div className="text-xl font-semibold text-white/92">
                      Academic Highlights
                    </div>
                    <div className="mt-4 grid gap-3">
                      <Card className="p-4">
                        <div className="font-semibold text-white/90">
                          Top-tier GPA
                        </div>
                        <div className="mt-1 text-sm text-white/70">
                          4.0 GPA with Dean’s List recognition — consistent
                          performance across core CS courses.
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="font-semibold text-white/90">
                          Strong foundation
                        </div>
                        <div className="mt-1 text-sm text-white/70">
                          Solid grasp of DS&A, OS, PL, Discrete Math, and
                          Probability/Statistics.
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="font-semibold text-white/90">
                          HCI + Data viz
                        </div>
                        <div className="mt-1 text-sm text-white/70">
                          Able to design usable interfaces and communicate
                          insights with clean dashboards.
                        </div>
                      </Card>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="text-xl font-semibold text-white/92">
                      Quick links
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <a
                        href="/resume.pdf"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border border-white/12 bg-white/[0.06] px-4 py-3 text-center text-sm text-white/85 transition hover:bg-white/[0.10] hover:text-white"
                      >
                        View Resume (PDF)
                      </a>
                      <a
                        href="https://github.com/akallam04"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border border-white/12 bg-white/[0.06] px-4 py-3 text-center text-sm text-white/85 transition hover:bg-white/[0.10] hover:text-white"
                      >
                        Explore GitHub
                      </a>
                    </div>
                  </Card>
                </div>
              </div>
            </section>

            {/* SKILLS */}
            <section
              data-key="skills"
              ref={(el) => {
                elByKeyRef.current.skills = el;
              }}
              className="scroll-mt-[90px]"
              style={{ scrollMarginTop: NAV_H + 18 }}
            >
              <div
                className="grid items-center gap-6 lg:grid-cols-2"
                style={{ minHeight: `calc(100vh - ${NAV_H}px - 40px)` }}
              >
                <div className="space-y-3">
                  <h2 className="text-5xl font-semibold tracking-tight md:text-6xl">
                    Skills
                  </h2>
                  <p className="text-white/70">Technical stack + what I build.</p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Card className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="text-lg font-semibold text-white/92">
                          Languages
                        </div>
                        <div className="text-xs text-white/55">6</div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Chip>JavaScript</Chip>
                        <Chip>Python</Chip>
                        <Chip>SQL</Chip>
                        <Chip>Java</Chip>
                        <Chip>HTML</Chip>
                        <Chip>CSS</Chip>
                      </div>
                    </Card>

                    <Card className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="text-lg font-semibold text-white/92">
                          Web
                        </div>
                        <div className="text-xs text-white/55">6</div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Chip>React</Chip>
                        <Chip>Next.js</Chip>
                        <Chip>Node.js</Chip>
                        <Chip>Express.js</Chip>
                        <Chip>REST APIs</Chip>
                        <Chip>JWT Auth</Chip>
                      </div>
                    </Card>

                    <Card className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="text-lg font-semibold text-white/92">
                          Data
                        </div>
                        <div className="text-xs text-white/55">6</div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Chip>Tableau</Chip>
                        <Chip>Excel</Chip>
                        <Chip>Google Sheets</Chip>
                        <Chip>Pandas</Chip>
                        <Chip>NumPy (basic)</Chip>
                        <Chip>KPI Analysis</Chip>
                      </div>
                    </Card>

                    <Card className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="text-lg font-semibold text-white/92">
                          Databases
                        </div>
                        <div className="text-xs text-white/55">2</div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Chip>MySQL</Chip>
                        <Chip>MongoDB</Chip>
                      </div>
                    </Card>
                  </div>
                </div>

                <div className="space-y-6">
                  <Card className="p-6">
                    <div className="text-xl font-semibold text-white/92">
                      What I optimize for
                    </div>
                    <div className="mt-4 grid gap-3">
                      <Card className="p-4">
                        <div className="font-semibold text-white/90">
                          Frontend
                        </div>
                        <div className="mt-1 text-sm text-white/70">
                          Build clean, responsive UI with React/Next.js and
                          strong UX fundamentals.
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="font-semibold text-white/90">Backend</div>
                        <div className="mt-1 text-sm text-white/70">
                          Design REST APIs, auth flows (JWT), and reliable
                          server-side logic.
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="font-semibold text-white/90">Data</div>
                        <div className="mt-1 text-sm text-white/70">
                          Clean datasets, validate quality, compute KPIs, and
                          present insights clearly.
                        </div>
                      </Card>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="text-xl font-semibold text-white/92">
                      Tooling
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Chip>Git</Chip>
                      <Chip>GitHub</Chip>
                      <Chip>VS Code</Chip>
                      <Chip>IntelliJ</Chip>
                    </div>
                  </Card>
                </div>
              </div>
            </section>

            {/* EXPERIENCE */}
            <section
              data-key="experience"
              ref={(el) => {
                elByKeyRef.current.experience = el;
              }}
              className="scroll-mt-[90px]"
              style={{ scrollMarginTop: NAV_H + 18 }}
            >
              <div
                className="grid items-center gap-6"
                style={{ minHeight: `calc(100vh - ${NAV_H}px - 40px)` }}
              >
                <div className="space-y-3">
                  <h2 className="text-5xl font-semibold tracking-tight md:text-6xl">
                    Experience
                  </h2>
                  <p className="text-white/70">Internships + measurable work.</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <Card className="p-6">
                    <div className="min-w-0">
                      <div className="text-xl font-semibold text-white/92">
                        Junior Data Analyst • Food Forest AI
                      </div>
                      <div className="mt-1 text-sm text-white/60">
                        Remote • Jun 2025 — Jul 2025
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Chip>Data Quality</Chip>
                        <Chip>Python</Chip>
                        <Chip>Sheets/Excel</Chip>
                        <Chip>Enrichment</Chip>
                      </div>
                    </div>

                    <ul className="mt-5 space-y-3 text-sm leading-relaxed text-white/75">
                      <li className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/55" />
                        Cleaned and validated datasets for 500+ company profiles
                        using Excel/Google Sheets and Python, ensuring accuracy
                        across business, contact, and geographic fields.
                      </li>
                      <li className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/55" />
                        Extracted and standardized capabilities, certifications,
                        and product data from websites/directories to deliver
                        structured enrichment.
                      </li>
                      <li className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/55" />
                        Automated Python QA checks to flag missing values and
                        formatting issues—reducing manual review and improving
                        ingestion readiness.
                      </li>
                    </ul>
                  </Card>

                  <Card className="p-6">
                    <div className="min-w-0">
                      <div className="text-xl font-semibold text-white/92">
                        Full-Stack Web Development Intern • Prodigy InfoTech
                      </div>
                      <div className="mt-1 text-sm text-white/60">
                        Remote • Sep 2024 — Oct 2024
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Chip>Frontend</Chip>
                        <Chip>JavaScript</Chip>
                        <Chip>Responsive UI</Chip>
                        <Chip>GitHub</Chip>
                      </div>
                    </div>

                    <ul className="mt-5 space-y-3 text-sm leading-relaxed text-white/75">
                      <li className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/55" />
                        Built responsive web pages using HTML, CSS, and
                        JavaScript, implementing interactive components and
                        clean layouts.
                      </li>
                      <li className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/55" />
                        Completed structured development tasks aligned with
                        deadlines; iterated based on feedback.
                      </li>
                      <li className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/55" />
                        Used GitHub for version control, task submissions, and
                        incremental improvements.
                      </li>
                    </ul>
                  </Card>
                </div>
              </div>
            </section>

            {/* PROJECTS */}
            <section
              data-key="projects"
              ref={(el) => {
                elByKeyRef.current.projects = el;
              }}
              className="scroll-mt-[90px]"
              style={{ scrollMarginTop: NAV_H + 18 }}
            >
              <div
                className="grid items-center gap-6"
                style={{ minHeight: `calc(100vh - ${NAV_H}px - 40px)` }}
              >
                <div className="space-y-3">
                  <h2 className="text-5xl font-semibold tracking-tight md:text-6xl">
                    Projects
                  </h2>
                  <p className="text-white/70">
                    Selected work with impact + stack.
                  </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <Card className="p-6">
                    <div className="text-2xl font-semibold text-white/92">
                      Goalsetter — Full-Stack MERN App
                    </div>
                    <div className="mt-1 text-sm text-white/65">
                      Auth + CRUD + production-ready UX patterns
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Chip>React</Chip>
                      <Chip>Node.js/Express</Chip>
                      <Chip>MongoDB</Chip>
                      <Chip>JWT Auth</Chip>
                      <Chip>REST APIs</Chip>
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 text-sm font-semibold text-white/85">
                        Impact
                      </div>
                      <ul className="space-y-2 text-sm text-white/75">
                        <li className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/55" />
                          Protected routes + JWT sessions
                        </li>
                        <li className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/55" />
                          Validation + error states
                        </li>
                        <li className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/55" />
                          Clean UI with consistent components
                        </li>
                      </ul>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="text-2xl font-semibold text-white/92">
                      Sales Insights — Analytics Dashboard
                    </div>
                    <div className="mt-1 text-sm text-white/65">
                      KPI-driven analysis + interactive visualization
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Chip>MySQL</Chip>
                      <Chip>Excel</Chip>
                      <Chip>Tableau</Chip>
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 text-sm font-semibold text-white/85">
                        Impact
                      </div>
                      <ul className="space-y-2 text-sm text-white/75">
                        <li className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/55" />
                          Revenue trends & segmentation
                        </li>
                        <li className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/55" />
                          Top customers/products analysis
                        </li>
                        <li className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/55" />
                          Interactive dashboard filters
                        </li>
                      </ul>
                    </div>
                  </Card>
                </div>
              </div>
            </section>

            {/* CONTACT */}
            <section
              data-key="contact"
              ref={(el) => {
                elByKeyRef.current.contact = el;
              }}
              className="scroll-mt-[90px] pb-10"
              style={{ scrollMarginTop: NAV_H + 18 }}
            >
              <div
                className="grid items-center gap-6 lg:grid-cols-2"
                style={{ minHeight: `calc(100vh - ${NAV_H}px - 40px)` }}
              >
                <div className="space-y-3">
                  <h2 className="text-5xl font-semibold tracking-tight md:text-6xl">
                    Contact
                  </h2>
                  <p className="text-white/70">Fast ways to reach me.</p>

                  <Card className="p-6">
                    <div className="text-xl font-semibold text-white/92">
                      Reach me
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <Card className="p-4">
                        <div className="text-xs tracking-wider text-white/50">
                          EMAIL
                        </div>
                        <div className="mt-1 break-all font-semibold text-white/92">
                          akallam04@gmail.com
                        </div>
                        <div className="mt-3">
                          <CopyButton value="akallam04@gmail.com" />
                        </div>
                      </Card>

                      <Card className="p-4">
                        <div className="text-xs tracking-wider text-white/50">
                          PHONE
                        </div>
                        <div className="mt-1 font-semibold text-white/92">
                          (480) 937-6420
                        </div>
                        <div className="mt-3">
                          <CopyButton value="(480) 937-6420" />
                        </div>
                      </Card>

                      <Card className="p-4">
                        <div className="text-xs tracking-wider text-white/50">
                          LINKEDIN
                        </div>
                        <a
                          href="https://linkedin.com/in/akallam3"
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 block break-all font-semibold text-white/92 underline decoration-white/20 underline-offset-4 hover:decoration-white/50"
                        >
                          linkedin.com/in/akallam3
                        </a>
                      </Card>

                      <Card className="p-4">
                        <div className="text-xs tracking-wider text-white/50">
                          GITHUB
                        </div>
                        <a
                          href="https://github.com/akallam04"
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 block break-all font-semibold text-white/92 underline decoration-white/20 underline-offset-4 hover:decoration-white/50"
                        >
                          github.com/akallam04
                        </a>
                      </Card>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <a
                        href="mailto:akallam04@gmail.com"
                        className="rounded-xl border border-white/12 bg-white/[0.06] px-4 py-2 text-sm text-white/85 transition hover:bg-white/[0.10] hover:text-white"
                      >
                        Email me
                      </a>
                      <a
                        href="/resume.pdf"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border border-white/12 bg-white/[0.06] px-4 py-2 text-sm text-white/85 transition hover:bg-white/[0.10] hover:text-white"
                      >
                        Open resume
                      </a>
                    </div>
                  </Card>
                </div>

                <Card className="p-6">
                  <div className="text-xl font-semibold text-white/92">
                    What I optimize for
                  </div>
                  <div className="mt-4 grid gap-3">
                    <Card className="p-4">
                      <div className="font-semibold text-white/90">
                        Polished UI + clean code
                      </div>
                      <div className="mt-1 text-sm text-white/70">
                        I care about layout, readability, and shipping
                        professional interfaces.
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="font-semibold text-white/90">
                        Reliable backend fundamentals
                      </div>
                      <div className="mt-1 text-sm text-white/70">
                        I build stable APIs, auth flows, and predictable data
                        handling.
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="font-semibold text-white/90">
                        Data mindset
                      </div>
                      <div className="mt-1 text-sm text-white/70">
                        I’m comfortable turning messy data into usable structure
                        and insight.
                      </div>
                    </Card>
                  </div>
                </Card>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}