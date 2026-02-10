"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type SectionKey = "profile" | "education" | "skills" | "experience" | "projects" | "contact";

const nav: { key: SectionKey; label: string }[] = [
  { key: "profile", label: "Profile" },
  { key: "education", label: "Education" },
  { key: "skills", label: "Skills" },
  { key: "experience", label: "Experience" },
  { key: "projects", label: "Projects" },
  { key: "contact", label: "Contact" },
];

const LINKS = {
  email: "mailto:akallam04@gmail.com",
  emailText: "akallam04@gmail.com",
  phoneText: "(480) 937-6420",
  linkedin: "https://linkedin.com/in/akallam3",
  github: "https://github.com/akallam04",
  resume: "/resume.pdf",
};

const PROFILE = {
  name: "Arun Teja Reddy Kallam",
  headline:
    "CS student at ASU building clean web apps and data-driven products. Focused on shipping polished UI, reliable APIs, and measurable impact.",
  status: "Open to internships",
  openTo: "SDE • SWE • Data Analyst • Full-Stack",
  location: "Tempe, AZ",
  degree: "B.S. Computer Science (ASU)",
  gpa: "4.0 (Dean’s List)",
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

const SKILLS = {
  Languages: ["JavaScript", "Python", "SQL", "Java", "HTML", "CSS"],
  Web: ["React", "Next.js", "Node.js", "Express.js", "REST APIs", "JWT Auth"],
  Data: ["Tableau", "Excel", "Google Sheets", "Pandas", "NumPy (basic)", "KPI Analysis"],
  Databases: ["MySQL", "MongoDB"],
  Tools: ["Git", "GitHub", "VS Code", "IntelliJ"],
};

const EXPERIENCE = [
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
    tags: ["Data Quality", "Python", "Sheets/Excel", "Enrichment"],
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
    tags: ["Frontend", "JavaScript", "Responsive UI", "GitHub"],
  },
];

const PROJECTS = [
  {
    title: "Goalsetter — Full-Stack MERN App",
    subtitle: "Auth + CRUD + production-ready UX patterns",
    stack: ["React", "Node.js/Express", "MongoDB", "JWT Auth", "REST APIs"],
    impact: ["Protected routes + JWT sessions", "Validation + error states", "Clean UI with consistent components"],
    bullets: [
      "Built a full-stack goals tracking app with JWT-based authentication, protected routes, and responsive React UI.",
      "Developed REST APIs with validation, error handling, and MongoDB persistence.",
      "Improved UX with loading/error states and filters; documented setup and usage clearly.",
    ],
    links: [{ label: "GitHub", href: LINKS.github }],
  },
  {
    title: "Sales Insights — Analytics Dashboard",
    subtitle: "KPI-driven analysis + interactive visualization",
    stack: ["MySQL", "Excel", "Tableau"],
    impact: ["Revenue trends & segmentation", "Top customers/products analysis", "Interactive dashboard filters"],
    bullets: [
      "Analyzed sales data using MySQL to compute KPIs (revenue trends, top customers/products, regional performance).",
      "Built an interactive Tableau dashboard with drilldowns and filters to visualize drivers over time.",
      "Documented assumptions and query logic for reproducible stakeholder-ready insights.",
    ],
    links: [{ label: "GitHub", href: LINKS.github }],
  },
];

function useClipboard() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1200);
    } catch {
      setCopiedKey(null);
    }
  };

  return { copy, copiedKey };
}

export default function Page() {
  const [active, setActive] = useState<SectionKey>("profile");
  const { copy, copiedKey } = useClipboard();

  const ids = useMemo(() => nav.map((n) => n.key), []);

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
  }, [ids]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Background />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-5 py-4">
          <nav className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <button
              onClick={() => scrollTo("profile")}
              className="cursor-pointer rounded-xl px-4 py-2 text-base font-semibold tracking-tight md:text-lg transition hover:bg-white/5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
              title="Go to Profile"
            >
              {PROFILE.name}
            </button>

            <div className="flex flex-1 items-center justify-end gap-2 md:gap-3">
              {nav.map((n) => (
                <button
                  key={n.key}
                  onClick={() => scrollTo(n.key)}
                  className="cursor-pointer rounded-xl px-4 py-2 text-base font-medium md:text-lg text-zinc-300 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
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
        {/* PROFILE */}
        <SectionShell id="profile">
          <div className="grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col items-center md:items-start">
              <div className="relative h-80 w-80 overflow-hidden rounded-full border border-white/15 bg-white/8 shadow-[0_20px_80px_-40px_rgba(255,255,255,0.25)] md:h-[360px] md:w-[360px]">
                <Image src="/avatar.jpg" alt="Arun" fill className="object-cover" priority />
              </div>

              <div className="mt-7 text-5xl font-semibold tracking-tight text-zinc-100 text-center md:text-left">
                {PROFILE.name}
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-2">
                <Pill>
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  {PROFILE.status}
                </Pill>
                <PillMuted>{PROFILE.openTo}</PillMuted>
              </div>
            </div>

            <div className="space-y-7">
              <div className="space-y-3">
                <div className="text-sm font-semibold tracking-wide text-zinc-200/80">Summary</div>
                <p className="text-xl leading-relaxed text-zinc-100/90">{PROFILE.headline}</p>
              </div>

              <div className="grid gap-4 rounded-2xl border border-white/15 bg-white/8 p-6 sm:grid-cols-3">
                <Stat label="Location" value={PROFILE.location} />
                <Stat label="Degree" value={PROFILE.degree} />
                <Stat label="GPA" value={PROFILE.gpa} />
              </div>

              <div className="flex flex-wrap gap-3">
                <HoverButton href={LINKS.email} label="Email" />
                <HoverButton href={LINKS.linkedin} label="LinkedIn" newTab />
                <HoverButton href={LINKS.github} label="GitHub" newTab />
                <HoverButton href={LINKS.resume} label="Resume" newTab />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <MiniCard title="What I’m good at" items={["Clean UI with strong hierarchy", "Reliable APIs + auth flows", "Data workflows + KPI analysis"]} />
                <MiniCard title="What I’m looking for" items={["Internships in SDE/SWE", "Data analyst roles", "Full-stack web development teams"]} />
              </div>
            </div>
          </div>
        </SectionShell>

        {/* EDUCATION */}
        <SectionShell id="education">
          <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <SectionTitle
                title="Education"
                subtitle="Academic background + strengths"
              />

              <Card>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-xl font-semibold text-zinc-100">
                      Arizona State University <span className="text-zinc-300">· Tempe, AZ</span>
                    </div>
                    <div className="mt-2 text-base text-zinc-100/90">
                      B.S. in Computer Science · <span className="text-zinc-200">GPA: 4.0</span> · Dean’s List
                    </div>
                  </div>
                  <div className="text-sm text-zinc-300 sm:text-right">Aug 2023 – May 2027</div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <Metric label="Focus" value="Web + Data" />
                  <Metric label="Strength" value="Systems + UI" />
                  <Metric label="Output" value="Projects + Internships" />
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between gap-4">
                  <div className="text-lg font-semibold text-zinc-100">Relevant Coursework</div>
                  <div className="text-sm text-zinc-300">{COURSEWORK.length} courses</div>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {COURSEWORK.map((c) => (
                    <Tag key={c}>{c}</Tag>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-5">
              <Card>
                <div className="text-lg font-semibold text-zinc-100">Academic Highlights</div>
                <div className="mt-4 space-y-3">
                  <Highlight
                    title="Top-tier GPA"
                    body="4.0 GPA with Dean’s List recognition — consistent performance across core CS courses."
                  />
                  <Highlight
                    title="Strong foundation"
                    body="Solid grasp of DS&A, OS, PL, Discrete Math, and Probability/Statistics."
                  />
                  <Highlight
                    title="HCI + Data viz"
                    body="Able to design usable interfaces and communicate insights with clean dashboards."
                  />
                </div>
              </Card>

              <Card>
                <div className="text-lg font-semibold text-zinc-100">Quick Links</div>
                <div className="mt-4 grid gap-3">
                  <a
                    href={LINKS.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="cursor-pointer rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-base text-zinc-200 transition hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
                  >
                    View Resume (PDF)
                  </a>
                  <a
                    href={LINKS.github}
                    target="_blank"
                    rel="noreferrer"
                    className="cursor-pointer rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-base text-zinc-200 transition hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
                  >
                    Explore GitHub
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </SectionShell>

        {/* SKILLS */}
        <SectionShell id="skills">
          <SectionTitle title="Skills" subtitle="Technical stack (organized by domain)" />
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(SKILLS).map(([k, items]) => (
              <Card key={k}>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-zinc-100">{k}</div>
                  <div className="text-sm text-zinc-300">{items.length}</div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {items.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Callout title="Frontend" body="Build clean, responsive UI with React/Next.js and strong UX fundamentals." />
            <Callout title="Backend" body="Design REST APIs, auth flows (JWT), and reliable server-side logic." />
            <Callout title="Data" body="Clean datasets, validate quality, compute KPIs, and present insights clearly." />
          </div>
        </SectionShell>

        {/* EXPERIENCE */}
        <SectionShell id="experience">
          <SectionTitle title="Experience" subtitle="Relevant roles and outcomes" />
          <div className="grid gap-4">
            {EXPERIENCE.map((e) => (
              <Card key={e.role + e.org}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-xl font-semibold text-zinc-100">
                      {e.role} <span className="text-zinc-300">· {e.org}</span>
                    </div>
                    <div className="mt-1 text-sm text-zinc-300">{e.location}</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {e.tags.map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-zinc-300 sm:text-right">{e.dates}</div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
                  <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <div className="text-sm font-semibold text-zinc-100">Focus</div>
                    <div className="mt-2 text-base text-zinc-200">
                      {e.role.includes("Data")
                        ? "Data cleaning, enrichment, and QA automation to deliver ingestion-ready datasets."
                        : "Frontend development with responsive UI, task-driven delivery, and iteration via feedback."}
                    </div>
                  </div>

                  <ul className="list-disc space-y-2 pl-5 text-base text-zinc-200">
                    {e.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </SectionShell>

        {/* PROJECTS */}
        <SectionShell id="projects">
          <SectionTitle title="Projects" subtitle="Selected work with impact + stack" />
          <div className="grid gap-4 md:grid-cols-2">
            {PROJECTS.map((p) => (
              <Card key={p.title}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xl font-semibold text-zinc-100">{p.title}</div>
                    <div className="mt-1 text-sm text-zinc-300">{p.subtitle}</div>
                  </div>
                  <div className="flex gap-2">
                    {p.links.map((l) => (
                      <a
                        key={l.label}
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="cursor-pointer rounded-lg border border-white/15 bg-white/8 px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {p.stack.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>

                <div className="mt-5 grid gap-3 rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="text-sm font-semibold text-zinc-100">Impact</div>
                  <div className="grid gap-2">
                    {p.impact.map((x) => (
                      <div key={x} className="flex items-start gap-2 text-base text-zinc-200">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/50" />
                        <span>{x}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <ul className="mt-5 list-disc space-y-2 pl-5 text-base text-zinc-200">
                  {p.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          <div className="mt-6">
            <Card>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-lg font-semibold text-zinc-100">Want more?</div>
                  <div className="mt-1 text-base text-zinc-200">
                    Explore additional repos and project notes on GitHub.
                  </div>
                </div>
                <a
                  href={LINKS.github}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer rounded-xl border border-white/15 bg-white/8 px-5 py-3 text-base font-medium text-zinc-200 transition hover:bg-white hover:text-zinc-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
                >
                  Open GitHub
                </a>
              </div>
            </Card>
          </div>
        </SectionShell>

        {/* CONTACT */}
        <SectionShell id="contact">
          <div className="grid gap-6 md:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-5">
              <SectionTitle title="Contact" subtitle="Professional, fast ways to reach me" />

              <Card>
                <div className="grid gap-4 sm:grid-cols-2">
                  <ContactCard
                    title="Email"
                    value={LINKS.emailText}
                    actionLabel={copiedKey === "email" ? "Copied" : "Copy"}
                    onAction={() => copy("email", LINKS.emailText)}
                    href={LINKS.email}
                  />
                  <ContactCard
                    title="Phone"
                    value={LINKS.phoneText}
                    actionLabel={copiedKey === "phone" ? "Copied" : "Copy"}
                    onAction={() => copy("phone", LINKS.phoneText)}
                  />
                  <ContactCard title="LinkedIn" value="linkedin.com/in/akallam3" href={LINKS.linkedin} newTab />
                  <ContactCard title="GitHub" value="github.com/akallam04" href={LINKS.github} newTab />
                </div>
              </Card>

              <Card>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-lg font-semibold text-zinc-100">Availability</div>
                    <div className="mt-1 text-base text-zinc-200">
                      Open to internship interviews and technical screens. Quick response via email.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <HoverButton href={LINKS.resume} label="View Resume" newTab />
                    <HoverButton href={LINKS.linkedin} label="Message on LinkedIn" newTab />
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-5">
              <Card>
                <div className="text-lg font-semibold text-zinc-100">Why hire me?</div>
                <div className="mt-4 grid gap-3">
                  <WhyPoint title="Polished UI + clean code" body="I care about layout, readability, and shipping professional interfaces." />
                  <WhyPoint title="Reliable backend fundamentals" body="I build stable APIs, auth flows, and predictable data handling." />
                  <WhyPoint title="Data mindset" body="I’m comfortable turning messy data into usable structure and insight." />
                </div>
              </Card>

              <Card>
                <div className="text-lg font-semibold text-zinc-100">Quick Actions</div>
                <div className="mt-4 grid gap-3">
                  <ActionRow
                    label="Copy email"
                    value={LINKS.emailText}
                    button={copiedKey === "email2" ? "Copied" : "Copy"}
                    onClick={() => copy("email2", LINKS.emailText)}
                  />
                  <ActionRow
                    label="Copy LinkedIn"
                    value="linkedin.com/in/akallam3"
                    button={copiedKey === "li" ? "Copied" : "Copy"}
                    onClick={() => copy("li", "https://linkedin.com/in/akallam3")}
                  />
                  <ActionRow
                    label="Copy GitHub"
                    value="github.com/akallam04"
                    button={copiedKey === "gh" ? "Copied" : "Copy"}
                    onClick={() => copy("gh", "https://github.com/akallam04")}
                  />
                </div>
              </Card>
            </div>
          </div>
        </SectionShell>
      </main>
    </div>
  );
}

function SectionShell({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="snap-start min-h-[calc(100vh-73px)] flex items-center">
      <div className="mx-auto max-w-6xl w-full px-5 py-10 h-[90%] flex flex-col justify-center">
        {children}
      </div>
    </section>
  );
}

function Background() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(1200px_circle_at_20%_-10%,rgba(99,102,241,0.24),transparent_55%),radial-gradient(900px_circle_at_85%_0%,rgba(16,185,129,0.18),transparent_52%),radial-gradient(900px_circle_at_50%_105%,rgba(236,72,153,0.13),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(900px_circle_at_50%_100%,rgba(255,255,255,0.06),transparent_60%)]" />
    </>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-2">
      <h2 className="text-4xl font-semibold tracking-tight text-zinc-100">{title}</h2>
      {subtitle ? <div className="mt-1 text-sm text-zinc-300">{subtitle}</div> : null}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/8 p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.09)_inset]">
      {children}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/15 bg-white/8 px-3 py-2 text-sm text-zinc-100">
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
      className="cursor-pointer rounded-xl border border-white/15 bg-white/8 px-5 py-3 text-base font-medium text-zinc-200 transition hover:bg-white hover:text-zinc-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
    >
      {label}
    </a>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-zinc-100">
      {children}
    </div>
  );
}

function PillMuted({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center rounded-full border border-white/10 bg-black/25 px-4 py-2 text-sm text-zinc-200">
      {children}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="text-xs font-semibold tracking-wide text-zinc-300">{label}</div>
      <div className="mt-2 text-lg font-semibold text-zinc-100">{value}</div>
    </div>
  );
}

function Highlight({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="text-base font-semibold text-zinc-100">{title}</div>
      <div className="mt-1 text-sm text-zinc-200">{body}</div>
    </div>
  );
}

function MiniCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/8 p-5">
      <div className="text-base font-semibold text-zinc-100">{title}</div>
      <div className="mt-3 grid gap-2">
        {items.map((i) => (
          <div key={i} className="flex items-start gap-2 text-base text-zinc-200">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/50" />
            <span>{i}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Callout({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/8 p-6">
      <div className="text-lg font-semibold text-zinc-100">{title}</div>
      <div className="mt-2 text-base text-zinc-200">{body}</div>
    </div>
  );
}

function ContactCard({
  title,
  value,
  href,
  newTab,
  actionLabel,
  onAction,
}: {
  title: string;
  value: string;
  href?: string;
  newTab?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/8 p-5">
      <div className="text-sm font-semibold tracking-wide text-zinc-300">{title}</div>
      <div className="mt-2 flex items-start justify-between gap-3">
        {href ? (
          <a
            href={href}
            target={newTab ? "_blank" : undefined}
            rel={newTab ? "noreferrer" : undefined}
            className="cursor-pointer text-base font-semibold text-zinc-100 hover:text-white underline decoration-white/20 underline-offset-4 transition"
          >
            {value}
          </a>
        ) : (
          <div className="text-base font-semibold text-zinc-100">{value}</div>
        )}

        {onAction ? (
          <button
            onClick={onAction}
            className="cursor-pointer rounded-xl border border-white/15 bg-black/25 px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
          >
            {actionLabel ?? "Copy"}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function WhyPoint({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="text-base font-semibold text-zinc-100">{title}</div>
      <div className="mt-1 text-sm text-zinc-200">{body}</div>
    </div>
  );
}

function ActionRow({
  label,
  value,
  button,
  onClick,
}: {
  label: string;
  value: string;
  button: string;
  onClick: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 p-4">
      <div>
        <div className="text-xs font-semibold tracking-wide text-zinc-300">{label}</div>
        <div className="mt-1 text-base font-semibold text-zinc-100">{value}</div>
      </div>
      <button
        onClick={onClick}
        className="cursor-pointer rounded-xl border border-white/15 bg-white/8 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white hover:text-zinc-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
      >
        {button}
      </button>
    </div>
  );
}