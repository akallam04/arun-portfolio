import Image from "next/image";

const nav = [
  { label: "Profile", href: "#profile" },
  { label: "Education", href: "#education" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const skills = {
  Languages: ["JavaScript", "Python", "Java", "SQL", "HTML", "CSS"],
  Web: ["React", "Next.js", "Node.js", "Express.js", "REST APIs", "JWT Auth"],
  Data: ["Tableau", "Excel", "Pandas (basic)", "NumPy (basic)"],
  Tools: ["Git", "GitHub", "VS Code"],
};

const projects = [
  {
    title: "Full-Stack Auth App",
    description: "Built secure login/signup and protected routes with JWT-based auth.",
    tags: ["Next.js", "React", "JWT"],
    github: "https://github.com/akallam04",
    live: "",
  },
  {
    title: "Data Dashboard",
    description: "Analyzed and visualized data to surface trends and KPIs for decision-making.",
    tags: ["Python", "Pandas", "Tableau"],
    github: "https://github.com/akallam04",
    live: "",
  },
  {
    title: "API + Database Project",
    description: "Designed REST APIs and integrated a SQL database for CRUD workflows.",
    tags: ["Node.js", "Express", "SQL"],
    github: "https://github.com/akallam04",
    live: "",
  },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Background />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <a href="#profile" className="text-sm font-semibold tracking-tight">
            Arun<span className="text-zinc-400">.dev</span>
          </a>

          <nav className="hidden items-center gap-6 md:flex">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="text-sm text-zinc-300 hover:text-zinc-50"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 hover:bg-white/10"
            >
              Contact
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-12">
        <section id="profile" className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Open to internships
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                Arun Teja Reddy Kallam
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-zinc-300">
                CS student at ASU building clean web apps and data-driven products. Focused on
                shipping polished UI, reliable APIs, and measurable impact.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <PrimaryButton href="mailto:akallam04@gmail.com" label="Email" />
              <GhostButton href="https://www.linkedin.com/in/akallam3/" label="LinkedIn" />
              <GhostButton href="https://github.com/akallam04" label="GitHub" />
              <GhostButton href="/resume.pdf" label="Resume" />
            </div>

            <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 sm:grid-cols-3">
              <Stat label="Location" value="Tempe, AZ" />
              <Stat label="Focus" value="Web + Data" />
              <Stat label="Degree" value="B.S. CS (ASU)" />
            </div>
          </div>

          <div className="flex items-start justify-center md:justify-end">
            <div className="relative h-44 w-44 overflow-hidden rounded-full border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] md:h-56 md:w-56">
              <Image
                src="/avatar.jpg"
                alt="Arun Teja Reddy Kallam"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        <Section id="education" title="Education" subtitle="Academic background">
          <Card>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <div className="text-sm font-semibold">
                Arizona State University <span className="text-zinc-400">· Tempe, AZ</span>
              </div>
              <div className="text-xs text-zinc-400">Aug 2023 — May 2027</div>
            </div>
            <div className="mt-2 text-sm text-zinc-300">
              B.S. Computer Science · GPA: 4.0 · Dean’s List
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Tag>Data Structures</Tag>
              <Tag>Software Engineering</Tag>
              <Tag>Operating Systems</Tag>
              <Tag>HCI</Tag>
              <Tag>Data Visualization</Tag>
              <Tag>Probability &amp; Stats</Tag>
            </div>
          </Card>
        </Section>

        <Section id="experience" title="Experience" subtitle="Relevant work">
          <div className="grid gap-4">
            <ExperienceItem
              role="Junior Data Analyst"
              org="(Your Company)"
              dates="2025 — Present"
              bullets={[
                "Add 2–3 impact bullets with metrics (time saved, accuracy, dollars, users).",
                "Mention tools: SQL, Tableau, Excel, Python/Pandas if used.",
                "Describe stakeholders and outcomes (dashboards, reporting, automation).",
              ]}
            />
            <ExperienceItem
              role="Web Development Intern"
              org="Prodigy Infotech"
              dates="2024"
              bullets={[
                "Built responsive UI components and improved UX flows across key screens.",
                "Integrated APIs and implemented auth/validation for reliable user actions.",
                "Used Git workflow to ship features with clear commits and reviews.",
              ]}
            />
          </div>
        </Section>

        <Section id="projects" title="Projects" subtitle="Selected work">
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((p) => (
              <Card key={p.title}>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="text-base font-semibold">{p.title}</div>
                    <div className="text-sm text-zinc-300">{p.description}</div>
                  </div>
                  <div className="flex gap-2">
                    <SmallButton href={p.github} label="GitHub" />
                    {p.live ? <SmallButton href={p.live} label="Live" /> : null}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {Object.entries(skills).map(([k, items]) => (
              <Card key={k}>
                <div className="text-sm font-semibold">{k}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {items.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="contact" title="Contact" subtitle="Let’s talk">
          <Card>
            <div className="text-sm text-zinc-300">
              Email:{" "}
              <a className="underline decoration-white/20 underline-offset-4" href="mailto:akallam04@gmail.com">
                akallam04@gmail.com
              </a>{" "}
              · LinkedIn is the fastest way to reach me.
            </div>
          </Card>
        </Section>

        <footer className="mt-14 border-t border-white/10 pt-6 text-xs text-zinc-500">
          © {new Date().getFullYear()} Arun Teja Reddy Kallam
        </footer>
      </main>
    </div>
  );
}

function Background() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(1200px_circle_at_30%_-10%,rgba(99,102,241,0.18),transparent_55%),radial-gradient(900px_circle_at_80%_0%,rgba(16,185,129,0.14),transparent_50%),radial-gradient(900px_circle_at_50%_100%,rgba(236,72,153,0.10),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-transparent via-zinc-950/30 to-zinc-950" />
    </>
  );
}

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-14 scroll-mt-20">
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {subtitle ? <div className="mt-1 text-sm text-zinc-400">{subtitle}</div> : null}
      </div>
      {children}
    </section>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]">
      {children}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200">
      {children}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-zinc-400">{label}</div>
      <div className="text-sm font-medium text-zinc-100">{value}</div>
    </div>
  );
}

function PrimaryButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
    >
      {label}
    </a>
  );
}

function GhostButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-white/10"
    >
      {label}
    </a>
  );
}

function SmallButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-100 hover:bg-white/10"
    >
      {label}
    </a>
  );
}

function ExperienceItem({
  role,
  org,
  dates,
  bullets,
}: {
  role: string;
  org: string;
  dates: string;
  bullets: string[];
}) {
  return (
    <Card>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <div className="text-sm font-semibold">
          {role} <span className="text-zinc-400">· {org}</span>
        </div>
        <div className="text-xs text-zinc-400">{dates}</div>
      </div>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-300">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </Card>
  );
}