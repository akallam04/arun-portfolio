"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type SectionKey = "profile" | "education" | "skills" | "experience" | "projects" | "contact";

const nav: { key: SectionKey; label: string }[] = [
  { key: "profile", label: "Profile" },
  { key: "education", label: "Education" },
  { key: "skills", label: "Skills" },
  { key: "experience", label: "Experience" },
  { key: "projects", label: "Projects" },
  { key: "contact", label: "Contact" },
];

const links = {
  email: "mailto:akallam04@gmail.com",
  linkedin: "https://linkedin.com/in/akallam3",
  github: "https://github.com/akallam04",
  resume: "/resume.pdf",
};

const skills = {
  Languages: ["JavaScript", "Python", "SQL", "Java", "HTML", "CSS"],
  Web: ["React", "Next.js", "Node.js", "Express.js", "REST APIs", "JWT Auth"],
  Data: ["Tableau", "Excel", "Google Sheets", "Pandas", "NumPy (basic)", "KPI Analysis"],
  Databases: ["MySQL", "MongoDB"],
  Tools: ["Git", "GitHub", "VS Code", "IntelliJ"],
};

const coursework = [
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

const experience = [
  {
    role: "Junior Data Analyst",
    org: "Food Forest AI",
    location: "Remote",
    dates: "Jun 2025 – Jul 2025",
    bullets: [
      "Cleaned and validated datasets for 500+ company profiles using Excel/Google Sheets and Python, ensuring accuracy across business, contact, and geographic fields.",
      "Extracted and standardized capabilities, certifications, and product data from websites, directories, and LinkedIn to deliver structured enrichment.",
      "Automated Python QA checks to flag missing values, anomalies, and formatting issues—reducing manual review and producing ingestion-ready datasets that improved search/discovery for supply-chain users.",
    ],
  },
  {
    role: "Full-Stack Web Development Intern",
    org: "Prodigy InfoTech",
    location: "Remote",
    dates: "Sep 2024 – Oct 2024",
    bullets: [
      "Built responsive web pages using HTML, CSS, and JavaScript, implementing interactive UI components and clean layouts.",
      "Completed structured development tasks aligned with deadlines and real-world requirements; iterated based on feedback.",
      "Used GitHub for version control, task submissions, and incremental improvements across multiple mini-projects.",
    ],
  },
];

const projects = [
  {
    title: "Goalsetter — Full-Stack MERN App",
    stack: ["React", "Node.js/Express", "MongoDB", "JWT Auth", "REST APIs"],
    bullets: [
      "Built a full-stack goals tracking application with JWT-based authentication, protected routes, and a responsive React UI.",
      "Developed RESTful APIs to create/read/update/delete goals with validation, error handling, and MongoDB persistence.",
      "Improved UX with loading/error states and filtering/sorting; documented setup clearly in the repo.",
    ],
    github: "https://github.com/akallam04",
  },
  {
    title: "Sales Insights — Business Analytics Dashboard",
    stack: ["MySQL", "Excel", "Tableau"],
    bullets: [
      "Analyzed sales data using MySQL to compute KPIs (revenue trends, top customers/products, regional performance).",
      "Built an interactive Tableau dashboard with filters and drilldowns to visualize performance drivers over time.",
      "Documented assumptions and query logic for reproducible stakeholder-ready insights.",
    ],
    github: "https://github.com/akallam04",
  },
];

export default function Page() {
  const [active, setActive] = useState<SectionKey>("profile");

  const scrollTo = (key: SectionKey) => {
    const container = document.querySelector("main");
    const el = document.getElementById(key);
    if (container && el) {
      (container as HTMLElement).scrollTo({
        top: (el as HTMLElement).offsetTop,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const container = document.querySelector("main");
    if (!container) return;

    const ids = nav.map((n) => n.key);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        const id = visible?.target?.id as SectionKey | undefined;
        if (id && ids.includes(id)) setActive(id);
      },
      { root: container, threshold: [0.35, 0.55, 0.75] }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Background />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-5 py-4">
          <nav className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <button
              onClick={() => scrollTo("profile")}
              className="cursor-pointer rounded-xl px-4 py-2 text-base font-semibold tracking-tight md:text-lg hover:bg-white/5 hover:text-white transition"
              title="Go to Profile"
            >
              Arun Teja Reddy Kallam
            </button>

            <div className="flex flex-1 items-center justify-end gap-2 md:gap-3">
              {nav.map((n) => (
                <button
                  key={n.key}
                  onClick={() => scrollTo(n.key)}
                  className={[
                    "cursor-pointer rounded-xl px-4 py-2 text-base font-medium md:text-lg transition",
                    "text-zinc-300 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                  title={`Go to ${n.label}`}
                >
                  {n.label}
                </button>
              ))}
            </div>
          </nav>

          <div className="mt-2 text-xs text-zinc-500">
            Viewing: <span className="text-zinc-300">{active}</span>
          </div>
        </div>
      </header>

      <main className="h-[calc(100vh-73px)] overflow-y-auto snap-y snap-mandatory">
        <SectionShell id="profile">
          <div className="grid items-center gap-10 md:grid-cols-[0.85fr_1.15fr]">
            <div className="flex flex-col items-center md:items-start">
              <div className="relative h-72 w-72 overflow-hidden rounded-full border border-white/15 bg-white/8 md:h-88 md:w-88">
                <Image src="/avatar.jpg" alt="Arun" fill className="object-cover" priority />
              </div>
              <div className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl text-center md:text-left text-zinc-100">
                Arun Teja Reddy Kallam
              </div>
            </div>

            <div className="space-y-6">
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-zinc-100">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Open to internships (SDE, SWE, Data Analyst, Full-Stack Web Development)
              </div>

              <p className="text-lg leading-relaxed text-zinc-200">
                CS student at ASU building clean web apps and data-driven products. Focused on shipping
                polished UI, reliable APIs, and measurable impact.
              </p>

              <div className="flex flex-wrap gap-3">
                <HoverButton href={links.email} label="Email" />
                <HoverButton href={links.linkedin} label="LinkedIn" newTab />
                <HoverButton href={links.github} label="GitHub" newTab />
                <HoverButton href={links.resume} label="Resume" newTab />
              </div>

              <div className="grid gap-4 rounded-2xl border border-white/15 bg-white/8 p-6 sm:grid-cols-3">
                <Stat label="Location" value="Tempe, AZ" />
                <Stat label="Degree" value="B.S. CS (ASU)" />
                <Stat label="GPA" value="4.0 (Dean’s List)" />
              </div>
            </div>
          </div>
        </SectionShell>

        <SectionShell id="education">
          <SectionTitle title="Education" subtitle="Academic background" />
          <Card>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <div className="text-lg font-semibold text-zinc-100">
                Arizona State University <span className="text-zinc-300">· Tempe, AZ</span>
              </div>
              <div className="text-sm text-zinc-300">Aug 2023 – May 2027</div>
            </div>
            <div className="mt-2 text-base text-zinc-200">
              B.S. in Computer Science · GPA: 4.0 · Dean’s List
            </div>

            <div className="mt-5 text-sm font-semibold text-zinc-100">Relevant Coursework</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {coursework.map((c) => (
                <Tag key={c}>{c}</Tag>
              ))}
            </div>
          </Card>
        </SectionShell>

        <SectionShell id="skills">
          <SectionTitle title="Skills" subtitle="Technical stack" />
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(skills).map(([k, items]) => (
              <Card key={k}>
                <div className="text-lg font-semibold text-zinc-100">{k}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {items.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </SectionShell>

        <SectionShell id="experience">
          <SectionTitle title="Experience" subtitle="Relevant work" />
          <div className="grid gap-4">
            {experience.map((e) => (
              <Card key={e.role + e.org}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                  <div className="text-lg font-semibold text-zinc-100">
                    {e.role} <span className="text-zinc-300">· {e.org} ({e.location})</span>
                  </div>
                  <div className="text-sm text-zinc-300">{e.dates}</div>
                </div>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-base text-zinc-200">
                  {e.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </SectionShell>

        <SectionShell id="projects">
          <SectionTitle title="Projects" subtitle="Selected work" />
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((p) => (
              <Card key={p.title}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold text-zinc-100">{p.title}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {p.stack.map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </div>
                  </div>

                  <a
                    href={p.github}
                    target="_blank"
                    rel="noreferrer"
                    className="cursor-pointer rounded-lg border border-white/15 bg-white/8 px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/15 hover:text-white"
                  >
                    GitHub
                  </a>
                </div>

                <ul className="mt-4 list-disc space-y-2 pl-5 text-base text-zinc-200">
                  {p.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </SectionShell>

        <SectionShell id="contact">
          <SectionTitle title="Contact" subtitle="Reach me quickly" />
          <Card>
            <div className="space-y-3 text-lg text-zinc-200">
              <div>
                Email:{" "}
                <a className="cursor-pointer underline decoration-white/25 underline-offset-4 hover:text-white" href={links.email}>
                  akallam04@gmail.com
                </a>
              </div>
              <div>Phone: (480) 937-6420</div>
              <div>
                LinkedIn:{" "}
                <a
                  className="cursor-pointer underline decoration-white/25 underline-offset-4 hover:text-white"
                  href={links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  linkedin.com/in/akallam3
                </a>
              </div>
              <div>
                GitHub:{" "}
                <a
                  className="cursor-pointer underline decoration-white/25 underline-offset-4 hover:text-white"
                  href={links.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  github.com/akallam04
                </a>
              </div>
            </div>
          </Card>
        </SectionShell>
      </main>
    </div>
  );
}

function SectionShell({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="snap-start min-h-[calc(100vh-73px)] flex items-center">
      <div className="mx-auto max-w-6xl w-full px-5 py-12 h-[90%] flex flex-col justify-center">
        {children}
      </div>
    </section>
  );
}

function Background() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(1200px_circle_at_20%_-10%,rgba(99,102,241,0.22),transparent_55%),radial-gradient(900px_circle_at_85%_0%,rgba(16,185,129,0.16),transparent_52%),radial-gradient(900px_circle_at_50%_105%,rgba(236,72,153,0.12),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(800px_circle_at_50%_100%,rgba(255,255,255,0.06),transparent_60%)]" />
    </>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-3xl font-semibold tracking-tight text-zinc-100">{title}</h2>
      {subtitle ? <div className="mt-1 text-sm text-zinc-300">{subtitle}</div> : null}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/8 p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset]">
      {children}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-sm text-zinc-100">
      {children}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="text-sm text-zinc-300">{label}</div>
      <div className="text-base font-semibold text-zinc-50">{value}</div>
    </div>
  );
}

function HoverButton({ href, label, newTab }: { href: string; label: string; newTab?: boolean }) {
  const openNew = newTab || href.startsWith("http") || href.endsWith(".pdf");
  return (
    <a
      href={href}
      target={openNew ? "_blank" : undefined}
      rel={openNew ? "noreferrer" : undefined}
      className="cursor-pointer rounded-xl border border-white/15 bg-white/8 px-5 py-3 text-base font-medium text-zinc-200 transition hover:bg-white hover:text-zinc-950"
    >
      {label}
    </a>
  );
}