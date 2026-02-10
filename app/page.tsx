"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type SectionKey =
  | "profile"
  | "education"
  | "skills"
  | "experience"
  | "projects"
  | "contact";

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: "profile", label: "Profile" },
  { key: "education", label: "Education" },
  { key: "skills", label: "Skills" },
  { key: "experience", label: "Experience" },
  { key: "projects", label: "Projects" },
  { key: "contact", label: "Contact" },
];

const PROFILE = {
  name: "Arun Teja Reddy Kallam",
  tagline:
    "CS student at ASU building clean web apps and data-driven products. Focused on shipping polished UI, reliable APIs, and measurable impact.",
  status:
    "Open to internships (SDE, SWE, Data Analyst, Full-Stack Web Development)",
  location: "Tempe, AZ",
  degree: "B.S. CS (ASU)",
  gpa: "4.0 (Dean’s List)",
  email: "akallam04@gmail.com",
  phone: "(480) 937-6420",
  linkedin: "https://www.linkedin.com/in/akallam3",
  github: "https://github.com/akallam04",
  resumePath: "/resume.pdf",
  photoPath: "/profile.jpg",
};

const COURSEWORK = [
  "Data Structures & Algorithms",
  "Object-Oriented Programming",
  "Software Engineering",
  "Operating Systems",
  "Principles of Programming Languages",
  "Intro to Human-Computer Interaction",
  "Foundations of Data Visualization",
  "Discrete Mathematics",
  "Probability & Statistics",
  "Computer Organization & Assembly",
];

const SKILL_GROUPS: { title: string; items: string[] }[] = [
  { title: "Languages", items: ["JavaScript", "Python", "SQL", "Java", "HTML", "CSS"] },
  { title: "Web", items: ["React", "Next.js", "Node.js", "Express.js", "REST APIs", "JWT Auth"] },
  { title: "Data", items: ["Tableau", "Excel", "Google Sheets", "Pandas", "NumPy (basic)", "KPI Analysis"] },
  { title: "Databases", items: ["MySQL", "MongoDB"] },
  { title: "Tools", items: ["Git", "GitHub", "VS Code", "IntelliJ"] },
];

const EXPERIENCE = [
  {
    title: "Junior Data Analyst",
    company: "Food Forest AI",
    meta: "Remote • Jun 2025 — Jul 2025",
    tags: ["Data Quality", "Python", "Sheets/Excel", "Enrichment"],
    bullets: [
      "Cleaned and validated datasets for 500+ company profiles using Excel/Google Sheets and Python, ensuring accuracy across business, contact, and geographic fields.",
      "Extracted and standardized capabilities, certifications, and product data from websites, directories, and LinkedIn to deliver structured enrichment.",
      "Automated Python QA checks to flag missing values, anomalies, and formatting issues—reducing manual review and producing ingestion-ready datasets that improved search/discovery for supply-chain users.",
    ],
  },
  {
    title: "Full-Stack Web Development Intern",
    company: "Prodigy InfoTech",
    meta: "Remote • Sep 2024 — Oct 2024",
    tags: ["Frontend", "JavaScript", "Responsive UI", "GitHub"],
    bullets: [
      "Built responsive web pages using HTML, CSS, and JavaScript, implementing interactive UI components and clean layouts.",
      "Completed structured development tasks aligned with deadlines and real-world requirements; iterated based on feedback.",
      "Used GitHub for version control, task submission, and incremental improvements.",
    ],
  },
];

const PROJECTS = [
  {
    name: "Goalsetter — Full-Stack MERN App",
    subtitle: "Auth + CRUD + production-ready UX patterns",
    stack: ["React", "Node.js/Express", "MongoDB", "JWT Auth", "REST APIs"],
    bullets: [
      "Built a full-stack goals tracking app with JWT-based authentication, protected routes, and responsive React UI.",
      "Developed REST APIs with validation, error handling, and MongoDB persistence.",
      "Improved UX with loading/error states and filters; documented setup and usage clearly.",
    ],
  },
  {
    name: "Sales Insights — Analytics Dashboard",
    subtitle: "KPI-driven analysis + interactive visualization",
    stack: ["MySQL", "Excel", "Tableau"],
    bullets: [
      "Analyzed sales data using MySQL to compute KPIs (revenue trends, top customers/products, regional performance).",
      "Built an interactive Tableau dashboard with drilldowns and filters to visualize drivers over time.",
      "Documented assumptions and query logic for reproducible stakeholder-ready insights.",
    ],
  },
];

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white/85">
      {children}
    </span>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/12 bg-white/6 shadow-[0_8px_30px_rgba(0,0,0,0.35)]",
        "backdrop-blur-xl",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function SectionShell({
  id,
  setRef,
  title,
  subtitle,
  children,
}: {
  id: SectionKey;
  setRef: (key: SectionKey) => (el: HTMLElement | null) => void;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      ref={setRef(id)}
      style={{ scrollMarginTop: 110 }}
      className="min-h-screen w-full"
    >
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-28 md:px-6">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            {title}
          </h2>
          <p className="mt-2 text-base text-white/70">{subtitle}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

export default function Page() {
  const [viewing, setViewing] = useState<SectionKey>("profile");

  const sectionRefs = useRef<Record<SectionKey, HTMLElement | null>>({
    profile: null,
    education: null,
    skills: null,
    experience: null,
    projects: null,
    contact: null,
  });

  const setRef = (key: SectionKey) => (el: HTMLElement | null) => {
    sectionRefs.current[key] = el;
  };

  const scrollTo = (key: SectionKey) => {
    const el = sectionRefs.current[key];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const entries: { key: SectionKey; el: HTMLElement }[] = [];
    for (const s of SECTIONS) {
      const el = sectionRefs.current[s.key];
      if (el) entries.push({ key: s.key, el });
    }
    if (!entries.length) return;

    const io = new IntersectionObserver(
      (obs) => {
        const visible = obs
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (!visible) return;
        const found = entries.find((x) => x.el === visible.target);
        if (found) setViewing(found.key);
      },
      { root: null, threshold: [0.2, 0.35, 0.5, 0.65] }
    );

    for (const x of entries) io.observe(x.el);
    return () => io.disconnect();
  }, []);

  const navItems = useMemo(() => SECTIONS, []);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-black text-white">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(900px 600px at 18% 30%, rgba(120,70,255,0.22), transparent 60%)," +
            "radial-gradient(900px 600px at 78% 22%, rgba(0,255,170,0.12), transparent 60%)," +
            "radial-gradient(900px 600px at 55% 85%, rgba(255,120,80,0.10), transparent 60%)," +
            "linear-gradient(180deg, rgba(10,10,12,1) 0%, rgba(0,0,0,1) 100%)",
        }}
      />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/35 backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] max-w-6xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold tracking-wide text-white/90 md:text-base">
              {PROFILE.name}
            </span>
            <span className="hidden text-xs text-white/50 md:inline">
              Viewing: {viewing}
            </span>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((it) => (
              <button
                key={it.key}
                onClick={() => scrollTo(it.key)}
                className={[
                  "cursor-pointer select-none rounded-full px-4 py-2 text-sm font-medium text-white/80",
                  "hover:bg-white/10 hover:text-white hover:ring-1 hover:ring-white/20",
                  "focus:outline-none focus:ring-2 focus:ring-white/30",
                ].join(" ")}
                type="button"
                title={it.label}
              >
                {it.label}
              </button>
            ))}
          </nav>

          <div className="md:hidden">
            <select
              value={viewing}
              onChange={(e) => scrollTo(e.target.value as SectionKey)}
              className="cursor-pointer rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white/85 outline-none"
            >
              {navItems.map((it) => (
                <option key={it.key} value={it.key}>
                  {it.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* PROFILE */}
      <SectionShell
        id="profile"
        setRef={setRef}
        title="Profile"
        subtitle="A quick, recruiter-friendly snapshot."
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-start">
          <div className="md:col-span-5">
            <div className="flex flex-col items-start">
              <div className="relative">
                <img
                  src={PROFILE.photoPath}
                  alt={`${PROFILE.name} profile`}
                  className="h-[250px] w-[250px] rounded-full object-cover ring-2 ring-white/20 md:h-[320px] md:w-[320px]"
                />
                <div className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_80px_rgba(0,0,0,0.35)]" />
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                {PROFILE.name}
              </h1>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/7 px-4 py-2 text-sm text-white/85">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>{PROFILE.status}</span>
            </div>

            <p className="text-lg leading-relaxed text-white/80 md:text-xl">
              {PROFILE.tagline}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`mailto:${PROFILE.email}`}
                className="cursor-pointer rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/85 hover:bg-white/12 hover:text-white hover:ring-1 hover:ring-white/20"
              >
                Email
              </a>
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noreferrer"
                className="cursor-pointer rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/85 hover:bg-white/12 hover:text-white hover:ring-1 hover:ring-white/20"
              >
                LinkedIn
              </a>
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noreferrer"
                className="cursor-pointer rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/85 hover:bg-white/12 hover:text-white hover:ring-1 hover:ring-white/20"
              >
                GitHub
              </a>
              <a
                href={PROFILE.resumePath}
                target="_blank"
                rel="noreferrer"
                className="cursor-pointer rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/85 hover:bg-white/12 hover:text-white hover:ring-1 hover:ring-white/20"
              >
                Resume
              </a>
            </div>

            <Card className="mt-6 p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <div className="text-xs uppercase tracking-wide text-white/55">
                    Location
                  </div>
                  <div className="mt-1 text-base font-semibold text-white/90">
                    {PROFILE.location}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-white/55">
                    Degree
                  </div>
                  <div className="mt-1 text-base font-semibold text-white/90">
                    {PROFILE.degree}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-white/55">
                    GPA
                  </div>
                  <div className="mt-1 text-base font-semibold text-white/90">
                    {PROFILE.gpa}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </SectionShell>

      {/* EDUCATION */}
      <SectionShell
        id="education"
        setRef={setRef}
        title="Education"
        subtitle="Academic background + strengths."
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-7 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xl font-semibold text-white">
                  Arizona State University • Tempe, AZ
                </div>
                <div className="mt-1 text-white/80">
                  B.S. in Computer Science • GPA: 4.0 • Dean’s List
                </div>
              </div>
              <div className="text-sm text-white/60">Aug 2023 — May 2027</div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Card className="p-4">
                <div className="text-xs uppercase tracking-wide text-white/55">
                  Focus
                </div>
                <div className="mt-1 text-lg font-semibold text-white/90">
                  Web + Data
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-xs uppercase tracking-wide text-white/55">
                  Strength
                </div>
                <div className="mt-1 text-lg font-semibold text-white/90">
                  Systems + UI
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-xs uppercase tracking-wide text-white/55">
                  Output
                </div>
                <div className="mt-1 text-lg font-semibold text-white/90">
                  Projects + Internships
                </div>
              </Card>
            </div>
          </Card>

          <Card className="lg:col-span-5 p-6">
            <div className="text-lg font-semibold text-white">
              Academic Highlights
            </div>
            <div className="mt-4 space-y-3">
              <Card className="p-4">
                <div className="font-semibold text-white/95">Top-tier GPA</div>
                <div className="mt-1 text-sm text-white/75">
                  4.0 GPA with Dean’s List recognition — consistent performance
                  across core CS courses.
                </div>
              </Card>
              <Card className="p-4">
                <div className="font-semibold text-white/95">Strong foundation</div>
                <div className="mt-1 text-sm text-white/75">
                  Solid grasp of DS&A, OS, PL, Discrete Math, and
                  Probability/Statistics.
                </div>
              </Card>
              <Card className="p-4">
                <div className="font-semibold text-white/95">HCI + Data viz</div>
                <div className="mt-1 text-sm text-white/75">
                  Able to design usable interfaces and communicate insights with
                  clean dashboards.
                </div>
              </Card>
            </div>

            <div className="mt-5">
              <div className="text-sm font-semibold text-white/85">Quick links</div>
              <div className="mt-3 flex flex-col gap-3">
                <a
                  className="cursor-pointer rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/85 hover:bg-white/12 hover:text-white hover:ring-1 hover:ring-white/20"
                  href={PROFILE.resumePath}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Resume (PDF)
                </a>
                <a
                  className="cursor-pointer rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/85 hover:bg-white/12 hover:text-white hover:ring-1 hover:ring-white/20"
                  href={PROFILE.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  Explore GitHub
                </a>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-12 p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="text-lg font-semibold text-white">
                Relevant Coursework
              </div>
              <div className="text-sm text-white/60">{COURSEWORK.length} courses</div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {COURSEWORK.map((c) => (
                <Chip key={c}>{c}</Chip>
              ))}
            </div>
          </Card>
        </div>
      </SectionShell>

      {/* SKILLS */}
      <SectionShell
        id="skills"
        setRef={setRef}
        title="Skills"
        subtitle="Technical stack + what I build."
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {SKILL_GROUPS.map((g) => (
              <Card key={g.title} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-white">{g.title}</div>
                  <div className="text-sm text-white/60">{g.items.length}</div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {g.items.map((x) => (
                    <Chip key={x}>{x}</Chip>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="p-6">
              <div className="text-lg font-semibold text-white">Frontend</div>
              <p className="mt-2 text-sm text-white/75">
                Build clean, responsive UI with React/Next.js and strong UX
                fundamentals.
              </p>
            </Card>
            <Card className="p-6">
              <div className="text-lg font-semibold text-white">Backend</div>
              <p className="mt-2 text-sm text-white/75">
                Design REST APIs, auth flows (JWT), and reliable server-side logic.
              </p>
            </Card>
            <Card className="p-6">
              <div className="text-lg font-semibold text-white">Data</div>
              <p className="mt-2 text-sm text-white/75">
                Clean datasets, validate quality, compute KPIs, and present insights
                clearly.
              </p>
            </Card>
          </div>
        </div>
      </SectionShell>

      {/* EXPERIENCE */}
      <SectionShell
        id="experience"
        setRef={setRef}
        title="Experience"
        subtitle="Internships + measurable work."
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {EXPERIENCE.map((x) => (
            <Card key={x.title} className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xl font-semibold text-white">
                    {x.title} • {x.company}
                  </div>
                  <div className="mt-1 text-sm text-white/60">{x.meta}</div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {x.tags.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>

              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-white/80">
                {x.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/60" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </SectionShell>

      {/* PROJECTS */}
      <SectionShell
        id="projects"
        setRef={setRef}
        title="Projects"
        subtitle="Selected work with impact + stack."
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {PROJECTS.map((p) => (
            <Card key={p.name} className="p-6">
              <div className="text-xl font-semibold text-white">{p.name}</div>
              <div className="mt-1 text-sm text-white/65">{p.subtitle}</div>

              <div className="mt-4 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </div>

              <div className="mt-5">
                <div className="text-sm font-semibold text-white/85">Impact</div>
                <ul className="mt-3 space-y-3 text-sm leading-relaxed text-white/80">
                  {p.bullets.map((b, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/60" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </SectionShell>

      {/* CONTACT */}
      <SectionShell
        id="contact"
        setRef={setRef}
        title="Contact"
        subtitle="Fast ways to reach me."
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-7 p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Card className="p-5">
                <div className="text-xs uppercase tracking-wide text-white/55">
                  Email
                </div>
                <a
                  className="mt-2 block text-base font-semibold text-white/90 hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/60"
                  href={`mailto:${PROFILE.email}`}
                >
                  {PROFILE.email}
                </a>
              </Card>
              <Card className="p-5">
                <div className="text-xs uppercase tracking-wide text-white/55">
                  Phone
                </div>
                <a
                  className="mt-2 block text-base font-semibold text-white/90 hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/60"
                  href={`tel:${PROFILE.phone.replace(/[^\d+]/g, "")}`}
                >
                  {PROFILE.phone}
                </a>
              </Card>
              <Card className="p-5">
                <div className="text-xs uppercase tracking-wide text-white/55">
                  LinkedIn
                </div>
                <a
                  className="mt-2 block break-all text-base font-semibold text-white/90 hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/60"
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  linkedin.com/in/akallam3
                </a>
              </Card>
              <Card className="p-5">
                <div className="text-xs uppercase tracking-wide text-white/55">
                  GitHub
                </div>
                <a
                  className="mt-2 block break-all text-base font-semibold text-white/90 hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/60"
                  href={PROFILE.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  github.com/akallam04
                </a>
              </Card>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={PROFILE.resumePath}
                target="_blank"
                rel="noreferrer"
                className="cursor-pointer rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/85 hover:bg-white/12 hover:text-white hover:ring-1 hover:ring-white/20"
              >
                View Resume (PDF)
              </a>
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noreferrer"
                className="cursor-pointer rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/85 hover:bg-white/12 hover:text-white hover:ring-1 hover:ring-white/20"
              >
                Message on LinkedIn
              </a>
            </div>
          </Card>

          <Card className="lg:col-span-5 p-6">
            <div className="text-lg font-semibold text-white">
              What you can expect
            </div>
            <div className="mt-4 space-y-3">
              <Card className="p-4">
                <div className="font-semibold text-white/95">
                  Polished UI + clean code
                </div>
                <div className="mt-1 text-sm text-white/75">
                  I care about layout, readability, and shipping professional interfaces.
                </div>
              </Card>
              <Card className="p-4">
                <div className="font-semibold text-white/95">
                  Reliable backend fundamentals
                </div>
                <div className="mt-1 text-sm text-white/75">
                  I build stable APIs, auth flows, and predictable data handling.
                </div>
              </Card>
              <Card className="p-4">
                <div className="font-semibold text-white/95">Data mindset</div>
                <div className="mt-1 text-sm text-white/75">
                  I’m comfortable turning messy data into usable structure and insight.
                </div>
              </Card>
            </div>
          </Card>
        </div>
      </SectionShell>
    </main>
  );
}