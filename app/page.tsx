"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type SectionKey = "profile" | "education" | "experience" | "projects" | "contact";

const nav: { key: SectionKey; label: string }[] = [
  { key: "profile", label: "Profile" },
  { key: "education", label: "Education" },
  { key: "experience", label: "Experience" },
  { key: "projects", label: "Projects" },
  { key: "contact", label: "Contact" },
];

const links = {
  linkedin: "https://linkedin.com/in/akallam3",
  github: "https://github.com/akallam04",
  email: "mailto:akallam04@gmail.com",
  resume: "/resume.pdf",
};

const skills = {
  Languages: ["JavaScript", "Python", "SQL", "Java", "HTML", "CSS"],
  Web: ["React", "Node.js", "Express.js", "REST APIs", "JWT Auth"],
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
      "Developed RESTful APIs to create/read/update/delete goals with server-side validation, error handling, and MongoDB persistence.",
      "Extended the project with UI/UX improvements (loading/error states) and features like filtering/sorting, with clear GitHub documentation.",
    ],
    github: "https://github.com/akallam04",
  },
  {
    title: "Sales Insights — Business Analytics Dashboard",
    stack: ["MySQL", "Excel", "Tableau"],
    bullets: [
      "Analyzed sales data using MySQL to compute KPIs (revenue trends, top customers/products, regional performance) and answer business questions.",
      "Built an interactive Tableau dashboard with filters and drilldowns to visualize performance drivers and trends over time.",
      "Documented data assumptions, query logic, and insights to ensure the analysis is reproducible and stakeholder-ready.",
    ],
    github: "https://github.com/akallam04",
  },
];

export default function Page() {
  const [active, setActive] = useState<SectionKey>("profile");

  const activeLabel = useMemo(() => nav.find((n) => n.key === active)?.label ?? "", [active]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Background />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-5 py-4">
          <nav className="flex items-center justify-between gap-6">
            {nav.map((n) => (
              <button
                key={n.key}
                onClick={() => setActive(n.key)}
                className={[
                  "text-base font-medium tracking-tight md:text-lg",
                  active === n.key ? "text-zinc-50" : "text-zinc-300 hover:text-zinc-50",
                ].join(" ")}
              >
                {n.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-10">
        <div className="mb-8">
          <div className="text-sm text-zinc-400">
            Viewing: <span className="text-zinc-100">{activeLabel}</span>
          </div>
        </div>

        {active === "profile" ? <Profile /> : null}
        {active === "education" ? <Education /> : null}
        {active === "experience" ? <Experience /> : null}
        {active === "projects" ? <Projects /> : null}
        {active === "contact" ? <Contact /> : null}

        <footer className="mt-14 border-t border-white/10 pt-6 text-xs text-zinc-500">
          © {new Date().getFullYear()} Arun Teja Reddy Kallam
        </footer>
      </main>
    </div>
  );
}

function Profile() {
  return (
    <section className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          Open to internships (Software / Data / Product)
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Arun Teja Reddy Kallam
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-zinc-300">
            CS student at ASU building clean web apps and data-driven products. Focused on shipping
            polished UI, reliable APIs, and measurable impact.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <PrimaryButton href={links.email} label="Email" />
          <GhostButton href={links.linkedin} label="LinkedIn" />
          <GhostButton href={links.github} label="GitHub" />
          <GhostButton href={links.resume} label="Resume" download />
        </div>

        <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 sm:grid-cols-3">
          <Stat label="Location" value="Tempe, AZ" />
          <Stat label="Degree" value="B.S. CS (ASU)" />
          <Stat label="GPA" value="4.0 (Dean’s List)" />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-lg font-semibold">Technical Skills</div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {Object.entries(skills).map(([k, items]) => (
              <div key={k}>
                <div className="text-sm font-semibold text-zinc-200">{k}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {items.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-start justify-center md:justify-end">
        <div className="relative h-48 w-48 overflow-hidden rounded-full border border-white/10 bg-white/5 md:h-64 md:w-64">
          <Image src="/avatar.jpg" alt="Arun Teja Reddy Kallam" fill className="object-cover" priority />
        </div>
      </div>
    </section>
  );
}

function Education() {
  return (
    <section className="space-y-5">
      <h2 className="text-3xl font-semibold tracking-tight">Education</h2>
      <Card>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <div className="text-lg font-semibold">
            Arizona State University <span className="text-zinc-400">· Tempe, AZ</span>
          </div>
          <div className="text-sm text-zinc-400">Aug 2023 – May 2027</div>
        </div>
        <div className="mt-2 text-base text-zinc-300">
          B.S. in Computer Science · GPA: 4.0 · Dean’s List
        </div>

        <div className="mt-5 text-sm font-semibold text-zinc-200">Relevant Coursework</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {coursework.map((c) => (
            <Tag key={c}>{c}</Tag>
          ))}
        </div>
      </Card>
    </section>
  );
}

function Experience() {
  return (
    <section className="space-y-5">
      <h2 className="text-3xl font-semibold tracking-tight">Experience</h2>
      <div className="grid gap-4">
        {experience.map((e) => (
          <Card key={e.role + e.org}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <div className="text-lg font-semibold">
                {e.role} <span className="text-zinc-400">· {e.org} ({e.location})</span>
              </div>
              <div className="text-sm text-zinc-400">{e.dates}</div>
            </div>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-base text-zinc-300">
              {e.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section className="space-y-5">
      <h2 className="text-3xl font-semibold tracking-tight">Projects</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((p) => (
          <Card key={p.title}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold">{p.title}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {p.stack.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </div>
              <SmallButton href={p.github} label="GitHub" />
            </div>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-base text-zinc-300">
              {p.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="space-y-5">
      <h2 className="text-3xl font-semibold tracking-tight">Contact</h2>
      <Card>
        <div className="space-y-3 text-lg text-zinc-300">
          <div>
            Email:{" "}
            <a className="underline decoration-white/20 underline-offset-4" href={links.email}>
              akallam04@gmail.com
            </a>
          </div>
          <div>Phone: (480) 937-6420</div>
          <div>
            LinkedIn:{" "}
            <a
              className="underline decoration-white/20 underline-offset-4"
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
              className="underline decoration-white/20 underline-offset-4"
              href={links.github}
              target="_blank"
              rel="noreferrer"
            >
              github.com/akallam04
            </a>
          </div>
        </div>
      </Card>
    </section>
  );
}

function Background() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(1200px_circle_at_20%_-10%,rgba(99,102,241,0.22),transparent_55%),radial-gradient(900px_circle_at_85%_0%,rgba(16,185,129,0.16),transparent_52%),radial-gradient(900px_circle_at_50%_105%,rgba(236,72,153,0.12),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-transparent via-zinc-950/25 to-zinc-950" />
    </>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset]">
      {children}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-200">
      {children}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="text-sm text-zinc-400">{label}</div>
      <div className="text-base font-medium text-zinc-100">{value}</div>
    </div>
  );
}

function PrimaryButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="rounded-xl bg-white px-5 py-3 text-base font-semibold text-zinc-950 hover:bg-zinc-200"
    >
      {label}
    </a>
  );
}

function GhostButton({
  href,
  label,
  download,
}: {
  href: string;
  label: string;
  download?: boolean;
}) {
  return (
    <a
      href={href}
      download={download ? true : undefined}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-base font-medium text-zinc-100 hover:bg-white/10"
    >
      {label}
    </a>
  );
}

function SmallButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 hover:bg-white/10"
    >
      {label}
    </a>
  );
}