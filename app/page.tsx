"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type SectionKey = "profile" | "education" | "skills" | "experience" | "projects" | "contact";

type SectionDef = {
  key: SectionKey;
  label: string;
};

const HEADER_H = 76;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function Page() {
  const sections: SectionDef[] = useMemo(
    () => [
      { key: "profile", label: "Profile" },
      { key: "education", label: "Education" },
      { key: "skills", label: "Skills" },
      { key: "experience", label: "Experience" },
      { key: "projects", label: "Projects" },
      { key: "contact", label: "Contact" },
    ],
    []
  );

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const sectionElsRef = useRef<Record<SectionKey, HTMLElement | null>>({
    profile: null,
    education: null,
    skills: null,
    experience: null,
    projects: null,
    contact: null,
  });

  const [active, setActive] = useState<SectionKey>("profile");

  const setSectionRef = (key: SectionKey) => (el: HTMLElement | null) => {
    sectionElsRef.current[key] = el;
  };

  const scrollToSection = (key: SectionKey) => {
    const el = sectionElsRef.current[key];
    const scroller = scrollerRef.current;
    if (!el || !scroller) return;

    const top = el.offsetTop - HEADER_H;
    scroller.scrollTo({ top, behavior: "smooth" });
  };

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const handler = () => {
      const y = scroller.scrollTop + HEADER_H + 8;
      let bestKey: SectionKey = "profile";
      let bestDist = Number.POSITIVE_INFINITY;

      (Object.keys(sectionElsRef.current) as SectionKey[]).forEach((k) => {
        const el = sectionElsRef.current[k];
        if (!el) return;
        const d = Math.abs(el.offsetTop - y);
        if (d < bestDist) {
          bestDist = d;
          bestKey = k;
        }
      });

      setActive(bestKey);
    };

    handler();
    scroller.addEventListener("scroll", handler, { passive: true });
    return () => scroller.removeEventListener("scroll", handler);
  }, []);

  const linkClass =
    "cursor-pointer select-none px-4 py-2 rounded-xl text-[15px] md:text-[16px] " +
    "text-white/80 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 transition";

  const pillButton =
    "cursor-pointer inline-flex items-center justify-center px-5 py-2.5 rounded-xl " +
    "border border-white/15 bg-white/[0.06] text-white/85 hover:bg-white/15 hover:text-white " +
    "transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30";

  const primaryPill =
    "cursor-pointer inline-flex items-center justify-center px-5 py-2.5 rounded-xl " +
    "border border-white/15 bg-white/[0.08] text-white/90 hover:bg-white/18 hover:text-white " +
    "transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30";

  const chip =
    "inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] " +
    "px-3 py-1 text-[12px] md:text-[13px] text-white/80";

  const card =
    "rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]";

  return (
    <div className="relative min-h-screen text-white">
      {/* Background (premium gradient, like your earlier screenshots) */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1100px 700px at 18% 18%, rgba(90,110,255,0.28), transparent 60%)," +
            "radial-gradient(1000px 700px at 82% 20%, rgba(30,210,160,0.22), transparent 60%)," +
            "radial-gradient(1200px 850px at 50% 92%, rgba(210,60,255,0.18), transparent 65%)," +
            "linear-gradient(180deg, rgba(0,0,0,0.92), rgba(0,0,0,0.96))",
          filter: "saturate(115%)",
        }}
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.06),transparent_55%)]" />

      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/10"
        style={{ height: HEADER_H }}
      >
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 md:px-6">
          <div className="text-[15px] md:text-[16px] font-semibold tracking-wide text-white/90">
            Arun Teja Reddy Kallam
          </div>

          <nav className="hidden md:flex items-center gap-2">
            {sections.map((s) => (
              <button
                key={s.key}
                onClick={() => scrollToSection(s.key)}
                className={linkClass + (active === s.key ? " text-white" : "")}
                type="button"
              >
                {s.label}
              </button>
            ))}
          </nav>

          <div className="md:hidden">
            <select
              className="cursor-pointer rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-white/90 outline-none"
              value={active}
              onChange={(e) => {
                const k = e.target.value as SectionKey;
                setActive(k);
                scrollToSection(k);
              }}
            >
              {sections.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Scroller (snap + fixed header offset) */}
      <div
        ref={scrollerRef}
        className="h-screen overflow-y-auto scroll-smooth"
        style={{
          paddingTop: HEADER_H,
          scrollSnapType: "y mandatory",
        }}
      >
        {/* Shared section wrapper:
            - exact viewport height
            - centered content
            - never overflows past one page
        */}
        <Section
          refCb={setSectionRef("profile")}
          title="Profile"
          subtitle="A quick, recruiter-friendly snapshot."
        >
          <div className="grid h-full w-full grid-cols-1 items-center gap-8 lg:grid-cols-2">
            {/* Left: photo + name */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-white/10 blur-2xl" />
                <img
                  src="/profile.jpg"
                  alt="Arun Teja Reddy Kallam"
                  className="relative h-[240px] w-[240px] md:h-[280px] md:w-[280px] rounded-full object-cover border border-white/20 shadow-[0_25px_70px_rgba(0,0,0,0.55)]"
                />
              </div>

              <h1 className="mt-7 text-4xl md:text-5xl font-semibold tracking-tight text-white">
                Arun Teja Reddy <br className="hidden sm:block" /> Kallam
              </h1>
            </div>

            {/* Right: info */}
            <div className="flex flex-col items-start gap-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[13px] md:text-[14px] text-white/85">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Open to internships (SDE, SWE, Data Analyst, Full-Stack)
              </div>

              <p className="text-[16px] md:text-[18px] leading-relaxed text-white/80 max-w-xl">
                CS student at ASU building clean web apps and data-driven products. Focused on
                shipping polished UI, reliable APIs, and measurable impact.
              </p>

              <div className="flex flex-wrap gap-3">
                <a className={primaryPill} href="mailto:akallam04@gmail.com" target="_blank" rel="noreferrer">
                  Email
                </a>
                <a
                  className={pillButton}
                  href="https://www.linkedin.com/in/akallam3"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
                <a className={pillButton} href="https://github.com/akallam04" target="_blank" rel="noreferrer">
                  GitHub
                </a>
                <a className={pillButton} href="/resume.pdf" target="_blank" rel="noreferrer">
                  Resume
                </a>
              </div>

              <div className={"w-full " + card}>
                <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3">
                  <Stat label="Location" value="Tempe, AZ" />
                  <Stat label="Degree" value="B.S. CS (ASU)" />
                  <Stat label="GPA" value="4.0 (Dean’s List)" />
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section
          refCb={setSectionRef("education")}
          title="Education"
          subtitle="Academic background + strengths."
        >
          {/* Fit within one page: use 2-col layout; right column is compact; coursework wraps */}
          <div className="grid h-full w-full grid-cols-1 gap-6 xl:grid-cols-2">
            <div className={"h-full " + card + " p-6 md:p-7 overflow-hidden"}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xl md:text-2xl font-semibold text-white/95">
                    Arizona State University • Tempe, AZ
                  </div>
                  <div className="mt-2 text-white/75">
                    B.S. in Computer Science • GPA: 4.0 • Dean’s List
                  </div>
                </div>
                <div className="text-sm text-white/60 whitespace-nowrap">Aug 2023 — May 2027</div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <Mini label="Focus" value="Web + Data" />
                <Mini label="Strength" value="Systems + UI" />
                <Mini label="Output" value="Projects + Internships" />
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-lg font-semibold text-white/90">Relevant Coursework</div>
                <div className="text-sm text-white/55">10 courses</div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {[
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
                ].map((c) => (
                  <span key={c} className={chip}>
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid h-full grid-rows-[1fr_auto] gap-6">
              <div className={card + " p-6 md:p-7 overflow-hidden"}>
                <div className="text-lg md:text-xl font-semibold text-white/90">Academic Highlights</div>
                <div className="mt-4 grid gap-3">
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
              </div>

              <div className={card + " p-6 md:p-7"}>
                <div className="text-lg font-semibold text-white/90">Quick links</div>
                <div className="mt-4 flex flex-col gap-3">
                  <a className={pillButton} href="/resume.pdf" target="_blank" rel="noreferrer">
                    View Resume (PDF)
                  </a>
                  <a className={pillButton} href="https://github.com/akallam04" target="_blank" rel="noreferrer">
                    Explore GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section
          refCb={setSectionRef("skills")}
          title="Skills"
          subtitle="Technical stack + what I build."
        >
          {/* Compact layout so header stays visible; everything fits */}
          <div className="grid h-full w-full grid-cols-1 gap-5 xl:grid-cols-2">
            <SkillCard title="Languages" count="6" items={["JavaScript", "Python", "SQL", "Java", "HTML", "CSS"]} />
            <SkillCard title="Web" count="6" items={["React", "Next.js", "Node.js", "Express.js", "REST APIs", "JWT Auth"]} />
            <SkillCard title="Data" count="6" items={["Tableau", "Excel", "Google Sheets", "Pandas", "NumPy (basic)", "KPI Analysis"]} />
            <SkillCard title="Databases" count="2" items={["MySQL", "MongoDB"]} />
            <div className={card + " p-6 md:p-7 xl:col-span-2"}>
              <div className="text-lg font-semibold text-white/90">Tools</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Git", "GitHub", "VS Code", "IntelliJ"].map((t) => (
                  <span key={t} className={chip}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section
          refCb={setSectionRef("experience")}
          title="Experience"
          subtitle="Internships + measurable work."
        >
          {/* Side-by-side on desktop, stacked on mobile; centered vertically */}
          <div className="grid h-full w-full grid-cols-1 gap-6 xl:grid-cols-2">
            <ExperienceCard
              role="Junior Data Analyst"
              company="Food Forest AI"
              meta="Remote • Jun 2025 — Jul 2025"
              tags={["Data Quality", "Python", "Sheets/Excel", "Enrichment"]}
              bullets={[
                "Cleaned and validated datasets for 500+ company profiles using Excel/Google Sheets and Python, ensuring accuracy across business, contact, and geographic fields.",
                "Extracted and standardized capabilities, certifications, and product data from websites, directories, and LinkedIn to deliver structured enrichment.",
                "Automated Python QA checks to flag missing values, anomalies, and formatting issues—reducing manual review and producing ingestion-ready datasets.",
              ]}
            />
            <ExperienceCard
              role="Full-Stack Web Development Intern"
              company="Prodigy InfoTech"
              meta="Remote • Sep 2024 — Oct 2024"
              tags={["Frontend", "JavaScript", "Responsive UI", "GitHub"]}
              bullets={[
                "Built responsive web pages using HTML, CSS, and JavaScript, implementing interactive UI components and clean layouts.",
                "Completed structured development tasks aligned with deadlines and real-world requirements; iterated based on feedback.",
                "Used GitHub for version control, task submission, and incremental improvements.",
              ]}
            />
          </div>
        </Section>

        <Section
          refCb={setSectionRef("projects")}
          title="Projects"
          subtitle="Selected work with impact + stack."
        >
          <div className="grid h-full w-full grid-cols-1 gap-6 xl:grid-cols-2">
            <ProjectCard
              title="Goalsetter — Full-Stack MERN App"
              subtitle="Auth + CRUD + production-ready UX patterns"
              tags={["React", "Node.js/Express", "MongoDB", "JWT Auth", "REST APIs"]}
              bullets={[
                "Built a full-stack goals tracking app with JWT-based authentication, protected routes, and responsive React UI.",
                "Developed REST APIs with validation, error handling, and MongoDB persistence.",
                "Improved UX with loading/error states and filters; documented setup and usage clearly.",
              ]}
            />
            <ProjectCard
              title="Sales Insights — Analytics Dashboard"
              subtitle="KPI-driven analysis + interactive visualization"
              tags={["MySQL", "Excel", "Tableau"]}
              bullets={[
                "Analyzed sales data using MySQL to compute KPIs (revenue trends, top customers/products, regional performance).",
                "Built an interactive Tableau dashboard with drilldowns and filters to visualize drivers over time.",
                "Documented assumptions and query logic for reproducible stakeholder-ready insights.",
              ]}
            />
          </div>
        </Section>

        <Section
          refCb={setSectionRef("contact")}
          title="Contact"
          subtitle="Fast ways to reach me."
        >
          {/* Single set of contact info (no duplicates), fills space professionally */}
          <div className="grid h-full w-full grid-cols-1 gap-6 xl:grid-cols-2">
            <div className={card + " p-6 md:p-7"}>
              <div className="text-lg md:text-xl font-semibold text-white/90">Reach me</div>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <CopyRow label="Email" value="akallam04@gmail.com" />
                <CopyRow label="Phone" value="(480) 937-6420" />
                <LinkRow label="LinkedIn" value="linkedin.com/in/akallam3" href="https://www.linkedin.com/in/akallam3" />
                <LinkRow label="GitHub" value="github.com/akallam04" href="https://github.com/akallam04" />
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a className={primaryPill} href="mailto:akallam04@gmail.com" target="_blank" rel="noreferrer">
                  Email me
                </a>
                <a className={pillButton} href="/resume.pdf" target="_blank" rel="noreferrer">
                  Open resume
                </a>
              </div>
            </div>

            <div className={card + " p-6 md:p-7"}>
              <div className="text-lg md:text-xl font-semibold text-white/90">What I optimize for</div>
              <div className="mt-5 grid gap-3">
                <Highlight title="Polished UI + clean code" body="I care about layout, readability, and shipping professional interfaces." />
                <Highlight title="Reliable backend fundamentals" body="I build stable APIs, auth flows, and predictable data handling." />
                <Highlight title="Data mindset" body="I’m comfortable turning messy data into usable structure and insight." />
              </div>
            </div>
          </div>
        </Section>

        <div className="h-8" />
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
  refCb,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  refCb: (el: HTMLElement | null) => void;
}) {
  return (
    <section
      ref={refCb}
      className="mx-auto max-w-6xl px-4 md:px-6"
      style={{
        height: `calc(100vh - ${HEADER_H}px)`,
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
      }}
    >
      {/* The key: keep header visible + center content, and prevent overflow */}
      <div className="h-full py-10 md:py-12 flex flex-col">
        <div className="shrink-0">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">{title}</h2>
          <p className="mt-2 text-white/65">{subtitle}</p>
        </div>

        <div className="mt-8 flex-1 min-h-0">
          {/* min-h-0 is critical to prevent overflow glitches */}
          <div className="h-full min-h-0">{children}</div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[12px] tracking-widest uppercase text-white/45">{label}</div>
      <div className="mt-1 text-[16px] md:text-[17px] font-semibold text-white/92">{value}</div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
      <div className="text-[12px] tracking-widest uppercase text-white/45">{label}</div>
      <div className="mt-1 text-[15px] md:text-[16px] font-semibold text-white/92">{value}</div>
    </div>
  );
}

function Highlight({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
      <div className="font-semibold text-white/92">{title}</div>
      <div className="mt-2 text-white/70 text-[14px] leading-relaxed">{body}</div>
    </div>
  );
}

function SkillCard({ title, count, items }: { title: string; count: string; items: string[] }) {
  const chip =
    "inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[12px] md:text-[13px] text-white/80";
  const card =
    "rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]";
  return (
    <div className={card + " p-6 md:p-7 overflow-hidden"}>
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-white/90">{title}</div>
        <div className="text-sm text-white/55">{count}</div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((x) => (
          <span key={x} className={chip}>
            {x}
          </span>
        ))}
      </div>
    </div>
  );
}

function ExperienceCard({
  role,
  company,
  meta,
  tags,
  bullets,
}: {
  role: string;
  company: string;
  meta: string;
  tags: string[];
  bullets: string[];
}) {
  const card =
    "rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]";
  const chip =
    "inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[12px] md:text-[13px] text-white/80";
  return (
    <div className={card + " p-6 md:p-7 h-full overflow-hidden"}>
      <div className="text-xl md:text-2xl font-semibold text-white/95">
        {role} • {company}
      </div>
      <div className="mt-1 text-white/60 text-sm">{meta}</div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className={chip}>
            {t}
          </span>
        ))}
      </div>

      <ul className="mt-5 space-y-3 text-white/75 text-[14px] leading-relaxed">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/40 shrink-0" />
            <span className="min-w-0">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectCard({
  title,
  subtitle,
  tags,
  bullets,
}: {
  title: string;
  subtitle: string;
  tags: string[];
  bullets: string[];
}) {
  const card =
    "rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]";
  const chip =
    "inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[12px] md:text-[13px] text-white/80";
  return (
    <div className={card + " p-6 md:p-7 h-full overflow-hidden"}>
      <div className="text-xl md:text-2xl font-semibold text-white/95">{title}</div>
      <div className="mt-1 text-white/65">{subtitle}</div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className={chip}>
            {t}
          </span>
        ))}
      </div>

      <ul className="mt-5 space-y-3 text-white/75 text-[14px] leading-relaxed">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/40 shrink-0" />
            <span className="min-w-0">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const card =
    "rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]";
  const btn =
    "cursor-pointer rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2 text-[13px] text-white/80 hover:bg-white/15 hover:text-white transition";
  return (
    <div className={card + " p-4 flex items-center justify-between gap-3"}>
      <div className="min-w-0">
        <div className="text-[12px] tracking-widest uppercase text-white/45">{label}</div>
        <div className="mt-1 text-white/88 font-semibold truncate">{value}</div>
      </div>
      <button
        type="button"
        className={btn}
        onClick={() => navigator.clipboard.writeText(value)}
      >
        Copy
      </button>
    </div>
  );
}

function LinkRow({ label, value, href }: { label: string; value: string; href: string }) {
  const card =
    "rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]";
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={card + " p-4 block cursor-pointer hover:bg-white/[0.10] transition"}
    >
      <div className="text-[12px] tracking-widest uppercase text-white/45">{label}</div>
      <div className="mt-1 text-white/88 font-semibold truncate">{value}</div>
    </a>
  );
}